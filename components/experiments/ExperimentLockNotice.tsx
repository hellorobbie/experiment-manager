"use client";

interface ExperimentLockNoticeProps {
  status: string;
}

export default function ExperimentLockNotice({
  status,
}: ExperimentLockNoticeProps) {
  if (status === "DRAFT") {
    return null;
  }

  const getMessage = () => {
    switch (status) {
      case "LIVE":
        return "This experiment is currently live and cannot be edited. You can pause or end it using the actions panel.";
      case "PAUSED":
        return "This experiment is paused and cannot be edited. You can resume it or end it using the actions panel.";
      case "ENDED":
        return "This experiment has ended and is locked. No further changes are allowed.";
      default:
        return "This experiment cannot be edited.";
    }
  };

  return (
    <div className="mb-6 bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <div>
          <h3 className="text-sm font-semibold text-yellow-500 mb-1">
            Experiment Locked
          </h3>
          <p className="text-sm text-yellow-400/80">{getMessage()}</p>
        </div>
      </div>
    </div>
  );
}
