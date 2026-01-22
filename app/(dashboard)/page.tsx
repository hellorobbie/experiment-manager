import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  // Get experiment counts by status
  const [draftCount, liveCount, pausedCount, endedCount, totalCount] =
    await Promise.all([
      prisma.experiment.count({ where: { status: "DRAFT" } }),
      prisma.experiment.count({ where: { status: "LIVE" } }),
      prisma.experiment.count({ where: { status: "PAUSED" } }),
      prisma.experiment.count({ where: { status: "ENDED" } }),
      prisma.experiment.count(),
    ]);

  // Get recent experiments
  const recentExperiments = await prisma.experiment.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
      variants: true,
    },
  });

  // Get recent activity
  const recentActivity = await prisma.auditLog.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      experiment: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const stats = [
    {
      label: "Total Experiments",
      value: totalCount,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-800",
    },
    {
      label: "Live",
      value: liveCount,
      color: "text-green-400",
      bgColor: "bg-green-900/20",
      borderColor: "border-green-800",
    },
    {
      label: "Draft",
      value: draftCount,
      color: "text-gray-400",
      bgColor: "bg-gray-800",
      borderColor: "border-gray-700",
    },
    {
      label: "Paused",
      value: pausedCount,
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/20",
      borderColor: "border-yellow-800",
    },
    {
      label: "Ended",
      value: endedCount,
      color: "text-red-400",
      bgColor: "bg-red-900/20",
      borderColor: "border-red-800",
    },
  ];

  const actionLabels: Record<string, string> = {
    created: "created",
    updated: "updated",
    went_live: "went live",
    resumed: "resumed",
    paused: "paused",
    ended: "ended",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Overview of your experiment management activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bgColor} border ${stat.borderColor} rounded-lg p-6`}
          >
            <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Experiments */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-100">
              Recent Experiments
            </h2>
            <Link
              href="/experiments"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View all →
            </Link>
          </div>

          {recentExperiments.length === 0 ? (
            <p className="text-gray-500 text-sm">No experiments yet</p>
          ) : (
            <div className="space-y-3">
              {recentExperiments.map((experiment) => (
                <Link
                  key={experiment.id}
                  href={`/experiments/${experiment.id}`}
                  className="block p-3 bg-gray-800/50 border border-gray-700 rounded-md hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-gray-100 text-sm">
                      {experiment.name}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
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
                  <p className="text-xs text-gray-500">
                    {experiment.variants.length} variants •{" "}
                    {experiment.owner.name || experiment.owner.email}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Recent Activity
          </h2>

          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-sm">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((log) => (
                <div
                  key={log.id}
                  className="pb-3 border-b border-gray-800 last:border-0 last:pb-0"
                >
                  <p className="text-sm text-gray-200">
                    <span className="font-medium">
                      {log.user.name || log.user.email}
                    </span>{" "}
                    <span className="text-gray-400">
                      {actionLabels[log.action] || log.action}
                    </span>{" "}
                    <Link
                      href={`/experiments/${log.experiment.id}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {log.experiment.name}
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/experiments/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            Create New Experiment
          </Link>
          <Link
            href="/experiments?status=LIVE"
            className="px-4 py-2 bg-gray-800 text-gray-100 rounded-md hover:bg-gray-700 border border-gray-700 font-medium transition-colors"
          >
            View Live Experiments
          </Link>
          <Link
            href="/experiments?status=DRAFT"
            className="px-4 py-2 bg-gray-800 text-gray-100 rounded-md hover:bg-gray-700 border border-gray-700 font-medium transition-colors"
          >
            View Draft Experiments
          </Link>
        </div>
      </div>
    </div>
  );
}
