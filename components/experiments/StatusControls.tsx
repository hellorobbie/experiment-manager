"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StatusControlsProps {
  experimentId: string;
  currentStatus: string;
}

interface StatusButton {
  label: string;
  status: string;
  color: string;
  hoverColor: string;
  description: string;
}

const STATUS_ACTIONS: Record<string, StatusButton[]> = {
  DRAFT: [
    {
      label: "Go Live",
      status: "LIVE",
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      description: "Make this experiment live and start collecting data",
    },
  ],
  LIVE: [
    {
      label: "Pause",
      status: "PAUSED",
      color: "bg-yellow-600",
      hoverColor: "hover:bg-yellow-700",
      description: "Temporarily pause this experiment",
    },
    {
      label: "End",
      status: "ENDED",
      color: "bg-red-600",
      hoverColor: "hover:bg-red-700",
      description: "Permanently end this experiment",
    },
  ],
  PAUSED: [
    {
      label: "Resume",
      status: "LIVE",
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      description: "Resume this experiment",
    },
    {
      label: "End",
      status: "ENDED",
      color: "bg-red-600",
      hoverColor: "hover:bg-red-700",
      description: "Permanently end this experiment",
    },
  ],
  ENDED: [],
};

export default function StatusControls({
  experimentId,
  currentStatus,
}: StatusControlsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const availableActions = STATUS_ACTIONS[currentStatus] || [];

  if (availableActions.length === 0) {
    return null;
  }

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    setError("");
    setValidationErrors([]);

    try {
      const response = await fetch(`/api/experiments/${experimentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.validationErrors) {
          setValidationErrors(data.validationErrors);
          setError(data.error || "Validation failed");
        } else {
          setError(data.error || "Failed to update status");
        }
        setIsLoading(false);
        return;
      }

      // Success - refresh the page to show updated status
      router.refresh();
      setIsLoading(false);
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">Actions</h2>

      {/* Error Messages */}
      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-800 text-red-400 p-3 rounded-md">
          <p className="font-medium mb-2">{error}</p>
          {validationErrors.length > 0 && (
            <ul className="list-disc list-inside text-sm space-y-1">
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {availableActions.map((action) => (
          <div key={action.status}>
            <button
              onClick={() => handleStatusChange(action.status)}
              disabled={isLoading}
              className={`w-full px-4 py-2 ${action.color} text-white rounded-md ${action.hoverColor} disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium`}
            >
              {isLoading ? "Updating..." : action.label}
            </button>
            <p className="text-xs text-gray-500 mt-1 ml-1">
              {action.description}
            </p>
          </div>
        ))}
      </div>

      {/* Info text for DRAFT experiments */}
      {currentStatus === "DRAFT" && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-md">
          <p className="text-sm text-blue-400">
            Before going live, ensure your experiment meets all validation
            requirements:
          </p>
          <ul className="list-disc list-inside text-xs text-blue-400/80 mt-2 space-y-1">
            <li>Traffic allocation sums to 100%</li>
            <li>At least 2 variants defined</li>
            <li>Primary KPI selected</li>
            <li>At least one targeting rule set</li>
          </ul>
        </div>
      )}
    </div>
  );
}
