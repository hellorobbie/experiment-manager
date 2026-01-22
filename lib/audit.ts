import { prisma } from "./prisma";

export type AuditAction =
  | "created"
  | "updated"
  | "went_live"
  | "paused"
  | "resumed"
  | "ended"
  | "deleted";

interface CreateAuditLogParams {
  action: AuditAction;
  experimentId: string;
  userId: string;
  changes?: Record<string, unknown>;
}

export async function createAuditLog({
  action,
  experimentId,
  userId,
  changes,
}: CreateAuditLogParams) {
  return await prisma.auditLog.create({
    data: {
      action,
      experimentId,
      userId,
      changes: JSON.stringify(changes || {}),
    },
  });
}

// Helper to create a diff between old and new objects
export function createDiff(
  oldObj: Record<string, unknown>,
  newObj: Record<string, unknown>
): Record<string, unknown> {
  const diff: Record<string, unknown> = {};

  // Find changed/added fields
  for (const key in newObj) {
    if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
      diff[key] = {
        from: oldObj[key],
        to: newObj[key],
      };
    }
  }

  // Find removed fields
  for (const key in oldObj) {
    if (!(key in newObj)) {
      diff[key] = {
        from: oldObj[key],
        to: undefined,
      };
    }
  }

  return diff;
}
