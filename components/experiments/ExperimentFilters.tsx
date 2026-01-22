"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function ExperimentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "all";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "updated-desc";

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      return params.toString();
    },
    [searchParams]
  );

  const handleStatusChange = (status: string) => {
    const query = createQueryString({ status: status === "all" ? "" : status });
    router.push(`/experiments?${query}`);
  };

  const handleSearchChange = (search: string) => {
    const query = createQueryString({ search });
    router.push(`/experiments?${query}`);
  };

  const handleSortChange = (sort: string) => {
    const query = createQueryString({ sort });
    router.push(`/experiments?${query}`);
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search experiments..."
          defaultValue={currentSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Status Filter */}
      <div className="w-full sm:w-48">
        <select
          value={currentStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="LIVE">Live</option>
          <option value="PAUSED">Paused</option>
          <option value="ENDED">Ended</option>
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="w-full sm:w-48">
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="updated-desc">Latest Updated</option>
          <option value="updated-asc">Oldest Updated</option>
          <option value="created-desc">Latest Created</option>
          <option value="created-asc">Oldest Created</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="status-asc">Status (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
