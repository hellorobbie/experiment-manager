import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ExperimentStatus } from "@/lib/types";
import ExperimentFilters from "@/components/experiments/ExperimentFilters";
import { Prisma } from "@prisma/client";

function StatusBadge({ status }: { status: ExperimentStatus }) {
  const styles = {
    DRAFT: "bg-gray-800 text-gray-300 border border-gray-700",
    LIVE: "bg-green-900/30 text-green-400 border border-green-800",
    PAUSED: "bg-yellow-900/30 text-yellow-400 border border-yellow-800",
    ENDED: "bg-red-900/30 text-red-400 border border-red-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

interface ExperimentsPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function ExperimentsPage({
  searchParams,
}: ExperimentsPageProps) {
  const params = await searchParams;
  const { status, search, sort = "updated-desc" } = params;

  // Build filter conditions
  const where: Prisma.ExperimentWhereInput = {};

  if (status && status !== "all") {
    where.status = status as ExperimentStatus;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  // Build orderBy
  let orderBy: Prisma.ExperimentOrderByWithRelationInput = {
    updatedAt: "desc",
  };

  const [sortField, sortOrder] = sort.split("-");
  if (sortField === "updated") {
    orderBy = { updatedAt: sortOrder as "asc" | "desc" };
  } else if (sortField === "created") {
    orderBy = { createdAt: sortOrder as "asc" | "desc" };
  } else if (sortField === "name") {
    orderBy = { name: sortOrder as "asc" | "desc" };
  } else if (sortField === "status") {
    orderBy = { status: sortOrder as "asc" | "desc" };
  }

  const experiments = await prisma.experiment.findMany({
    where,
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
    orderBy,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Experiments</h1>
        <Link
          href="/experiments/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
        >
          Create Experiment
        </Link>
      </div>

      <ExperimentFilters />

      {experiments.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow p-12 text-center">
          <h3 className="text-lg font-medium text-gray-100 mb-2">
            {search || status ? "No experiments match your filters" : "No experiments yet"}
          </h3>
          <p className="text-gray-400 mb-6">
            {search || status
              ? "Try adjusting your search or filters"
              : "Get started by creating your first experiment"}
          </p>
          {!search && !status && (
            <Link
              href="/experiments/new"
              className="inline-flex px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              Create Experiment
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="mb-3 text-sm text-gray-400">
            Showing {experiments.length} experiment{experiments.length !== 1 ? "s" : ""}
          </div>
          <div className="bg-gray-900 border border-gray-800 shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Variants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {experiments.map((experiment) => (
                <tr key={experiment.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/experiments/${experiment.id}`}>
                      <div className="text-sm font-medium text-gray-100 hover:text-blue-400 transition-colors">
                        {experiment.name}
                      </div>
                      {experiment.description && (
                        <div className="text-sm text-gray-400">
                          {experiment.description.substring(0, 60)}
                          {experiment.description.length > 60 ? "..." : ""}
                        </div>
                      )}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={experiment.status as ExperimentStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {experiment.owner.name || experiment.owner.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {experiment.variants.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(experiment.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
