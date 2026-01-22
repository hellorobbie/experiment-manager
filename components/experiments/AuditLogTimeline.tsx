"use client";

import { useState } from "react";

interface AuditLog {
  id: string;
  action: string;
  changes: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface AuditLogTimelineProps {
  logs: AuditLog[];
}

const ACTION_COLORS: Record<string, string> = {
  created: "bg-blue-500",
  updated: "bg-yellow-500",
  went_live: "bg-green-500",
  resumed: "bg-green-500",
  paused: "bg-orange-500",
  ended: "bg-red-500",
};

const ACTION_LABELS: Record<string, string> = {
  created: "Created",
  updated: "Updated",
  went_live: "Went Live",
  resumed: "Resumed",
  paused: "Paused",
  ended: "Ended",
};

export default function AuditLogTimeline({ logs }: AuditLogTimelineProps) {
  const [filter, setFilter] = useState<string>("all");
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  const filteredLogs =
    filter === "all" ? logs : logs.filter((log) => log.action === filter);

  const toggleExpanded = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const formatChanges = (changes: string | null) => {
    if (!changes || changes === "{}") return null;
    try {
      return JSON.parse(changes);
    } catch {
      return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-100">Activity History</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Actions</option>
          {uniqueActions.map((action) => (
            <option key={action} value={action}>
              {ACTION_LABELS[action] || action}
            </option>
          ))}
        </select>
      </div>

      {filteredLogs.length === 0 ? (
        <p className="text-gray-500 text-sm">No activity to show</p>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log, index) => {
            const changes = formatChanges(log.changes);
            const hasChanges = changes && Object.keys(changes).length > 0;
            const isExpanded = expandedLogs.has(log.id);

            return (
              <div key={log.id} className="relative">
                {/* Timeline line */}
                {index !== filteredLogs.length - 1 && (
                  <div
                    className="absolute left-2 top-8 w-0.5 h-full bg-gray-800"
                    style={{ height: "calc(100% + 1rem)" }}
                  />
                )}

                <div className="flex gap-4">
                  {/* Action dot */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        ACTION_COLORS[log.action] || "bg-gray-500"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-100">
                          {ACTION_LABELS[log.action] || log.action}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          by {log.user.name || log.user.email} •{" "}
                          {formatDate(log.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Changes section */}
                    {hasChanges && (
                      <div className="mt-3">
                        <button
                          onClick={() => toggleExpanded(log.id)}
                          className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                        >
                          {isExpanded ? "Hide changes" : "View changes"}
                        </button>

                        {isExpanded && (
                          <div className="mt-2 bg-gray-800/50 border border-gray-700 rounded-md p-3">
                            {Object.entries(changes).map(([key, value]) => (
                              <div key={key} className="text-xs mb-2 last:mb-0">
                                <span className="font-medium text-gray-400">
                                  {key}:
                                </span>
                                <div className="mt-1 space-y-1">
                                  {typeof value === "object" &&
                                  value !== null &&
                                  "from" in value &&
                                  "to" in value ? (
                                    <>
                                      <div className="flex items-center gap-2">
                                        <span className="text-red-400">
                                          From:
                                        </span>
                                        <code className="bg-gray-900 px-2 py-0.5 rounded text-gray-300">
                                          {String(
                                            (value as { from: unknown }).from
                                          )}
                                        </code>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-green-400">
                                          To:
                                        </span>
                                        <code className="bg-gray-900 px-2 py-0.5 rounded text-gray-300">
                                          {String(
                                            (value as { to: unknown }).to
                                          )}
                                        </code>
                                      </div>
                                    </>
                                  ) : (
                                    <code className="bg-gray-900 px-2 py-0.5 rounded text-gray-300 block">
                                      {JSON.stringify(value)}
                                    </code>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
