import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/integrations/experiments
 *
 * Service-to-service endpoint for external systems to fetch LIVE experiments.
 * Authenticated via API key in the x-api-key header.
 */
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  const expectedKey = process.env.INTEGRATION_API_KEY;

  if (!expectedKey || apiKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const experiments = await prisma.experiment.findMany({
      where: {
        status: "LIVE",
      },
      include: {
        variants: {
          select: {
            id: true,
            name: true,
            trafficPercentage: true,
            isControl: true,
          },
        },
      },
      orderBy: { goLiveAt: "desc" },
    });

    const result = experiments.map((exp) => ({
      id: exp.id,
      name: exp.name,
      status: exp.status,
      hypothesis: exp.hypothesis,
      primaryKPI: exp.primaryKPI,
      targeting: JSON.parse(exp.targeting || "{}"),
      variants: exp.variants,
      goLiveAt: exp.goLiveAt,
    }));

    return NextResponse.json({
      experiments: result,
      count: result.length,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in integrations endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
