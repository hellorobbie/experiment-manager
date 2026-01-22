// Type definitions for the application

export type ExperimentStatus = "DRAFT" | "LIVE" | "PAUSED" | "ENDED";

export const EXPERIMENT_STATUSES: ExperimentStatus[] = [
  "DRAFT",
  "LIVE",
  "PAUSED",
  "ENDED",
];
