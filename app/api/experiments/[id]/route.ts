import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateGoLive } from "@/lib/validations";
import { createAuditLog, AuditAction } from "@/lib/audit";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status: newStatus } = body;

    // Fetch current experiment
    const experiment = await prisma.experiment.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!experiment) {
      return NextResponse.json(
        { error: "Experiment not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (experiment.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to update this experiment" },
        { status: 403 }
      );
    }

    const currentStatus = experiment.status;

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      DRAFT: ["LIVE"],
      LIVE: ["PAUSED", "ENDED"],
      PAUSED: ["LIVE", "ENDED"],
      ENDED: [], // Cannot transition from ENDED
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status transition from ${currentStatus} to ${newStatus}`,
        },
        { status: 400 }
      );
    }

    // If transitioning to LIVE, run go-live validation
    if (newStatus === "LIVE") {
      const targeting = JSON.parse(experiment.targeting);
      const validationResult = validateGoLive({
        variants: experiment.variants,
        primaryKPI: experiment.primaryKPI,
        targeting,
      });

      if (!validationResult.valid) {
        return NextResponse.json(
          {
            error: "Experiment cannot go live",
            validationErrors: validationResult.errors,
          },
          { status: 400 }
        );
      }
    }

    // Update experiment status
    const updatedExperiment = await prisma.experiment.update({
      where: { id },
      data: { status: newStatus },
      include: { variants: true },
    });

    // Create audit log with specific action
    const actionMap: Record<string, "went_live" | "resumed" | "paused" | "ended"> = {
      LIVE: currentStatus === "PAUSED" ? "resumed" : "went_live",
      PAUSED: "paused",
      ENDED: "ended",
    };

    await createAuditLog({
      action: (actionMap[newStatus] || "updated") as AuditAction,
      experimentId: id,
      userId: session.user.id,
      changes: {
        status: { from: currentStatus, to: newStatus },
      },
    });

    return NextResponse.json(updatedExperiment);
  } catch (error) {
    console.error("Error updating experiment:", error);
    return NextResponse.json(
      { error: "Failed to update experiment" },
      { status: 500 }
    );
  }
}
