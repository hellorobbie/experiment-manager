import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { experimentSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();

    const validation = experimentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Create experiment with variants in a transaction
    const experiment = await prisma.experiment.create({
      data: {
        name: data.name,
        description: data.description || null,
        hypothesis: data.hypothesis || null,
        ownerId: session.user.id,
        status: "DRAFT",
        primaryKPI: data.primaryKPI || null,
        secondaryKPIs: JSON.stringify(data.secondaryKPIs || []),
        targeting: JSON.stringify(data.targeting),
        variants: {
          create: data.variants.map((variant) => ({
            name: variant.name,
            description: variant.description || null,
            trafficPercentage: variant.trafficPercentage,
            isControl: variant.isControl,
          })),
        },
      },
      include: {
        variants: true,
      },
    });

    // Create audit log
    await createAuditLog({
      action: "created",
      experimentId: experiment.id,
      userId: session.user.id,
      changes: {},
    });

    return NextResponse.json(experiment, { status: 201 });
  } catch (error) {
    console.error("Error creating experiment:", error);
    return NextResponse.json(
      { error: "Failed to create experiment" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const experiments = await prisma.experiment.findMany({
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        variants: true,
        _count: {
          select: {
            auditLogs: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(experiments);
  } catch (error) {
    console.error("Error fetching experiments:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiments" },
      { status: 500 }
    );
  }
}
