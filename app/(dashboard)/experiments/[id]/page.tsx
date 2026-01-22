import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExperimentDetailPage({ params }: Params) {
  const { id } = await params;
  const experiment = await prisma.experiment.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
      variants: true,
      auditLogs: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!experiment) {
    notFound();
  }

  const targeting = JSON.parse(experiment.targeting);
  const secondaryKPIs = JSON.parse(experiment.secondaryKPIs || "[]");

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/experiments"
          className="text-sm text-gray-400 hover:text-gray-200 mb-4 inline-block"
        >
          ← Back to Experiments
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">{experiment.name}</h1>
            {experiment.description && (
              <p className="text-gray-400">{experiment.description}</p>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              experiment.status === "DRAFT"
                ? "bg-gray-800 text-gray-300"
                : experiment.status === "LIVE"
                ? "bg-green-900/30 text-green-400 border border-green-800"
                : experiment.status === "PAUSED"
                ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800"
                : "bg-red-900/30 text-red-400 border border-red-800"
            }`}
          >
            {experiment.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hypothesis */}
          {experiment.hypothesis && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-gray-400 mb-2">Hypothesis</h2>
              <p className="text-gray-200">{experiment.hypothesis}</p>
            </div>
          )}

          {/* Variants */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Variants</h2>
            <div className="space-y-3">
              {experiment.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="p-4 bg-gray-800/50 border border-gray-700 rounded-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-100">{variant.name}</span>
                      {variant.isControl && (
                        <span className="text-xs px-2 py-0.5 bg-blue-900/30 text-blue-400 border border-blue-800 rounded">
                          Control
                        </span>
                      )}
                    </div>
                    <span className="text-blue-400 font-semibold">
                      {variant.trafficPercentage}%
                    </span>
                  </div>
                  {variant.description && (
                    <p className="text-sm text-gray-400">{variant.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Activity Log</h2>
            <div className="space-y-3">
              {experiment.auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 text-sm pb-3 border-b border-gray-800 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="text-gray-200">
                      <span className="font-medium">{log.user.name || log.user.email}</span>{" "}
                      <span className="text-gray-400">{log.action}</span> the experiment
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Details</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Owner</dt>
                <dd className="text-gray-200 mt-1">
                  {experiment.owner.name || experiment.owner.email}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Primary KPI</dt>
                <dd className="text-gray-200 mt-1">{experiment.primaryKPI || "None"}</dd>
              </div>
              {secondaryKPIs.length > 0 && (
                <div>
                  <dt className="text-gray-500">Secondary KPIs</dt>
                  <dd className="flex flex-wrap gap-2 mt-1">
                    {secondaryKPIs.map((kpi: string) => (
                      <span
                        key={kpi}
                        className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700"
                      >
                        {kpi}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-200 mt-1">
                  {new Date(experiment.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="text-gray-200 mt-1">
                  {new Date(experiment.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Targeting */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Targeting</h2>
            <div className="space-y-3 text-sm">
              {targeting.device?.length > 0 && (
                <div>
                  <dt className="text-gray-500 mb-2">Device</dt>
                  <dd className="flex flex-wrap gap-2">
                    {targeting.device.map((d: string) => (
                      <span
                        key={d}
                        className="px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700"
                      >
                        {d}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {targeting.country?.length > 0 && (
                <div>
                  <dt className="text-gray-500 mb-2">Country</dt>
                  <dd className="flex flex-wrap gap-2">
                    {targeting.country.map((c: string) => (
                      <span
                        key={c}
                        className="px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700"
                      >
                        {c}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {targeting.channel?.length > 0 && (
                <div>
                  <dt className="text-gray-500 mb-2">Channel</dt>
                  <dd className="flex flex-wrap gap-2">
                    {targeting.channel.map((ch: string) => (
                      <span
                        key={ch}
                        className="px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700"
                      >
                        {ch}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {targeting.userType?.length > 0 && (
                <div>
                  <dt className="text-gray-500 mb-2">User Type</dt>
                  <dd className="flex flex-wrap gap-2">
                    {targeting.userType.map((ut: string) => (
                      <span
                        key={ut}
                        className="px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700"
                      >
                        {ut}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {targeting.language?.length > 0 && (
                <div>
                  <dt className="text-gray-500 mb-2">Language</dt>
                  <dd className="flex flex-wrap gap-2">
                    {targeting.language.map((lang: string) => (
                      <span
                        key={lang}
                        className="px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700"
                      >
                        {lang}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
