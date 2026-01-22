import { z } from "zod";

// Experiment validation schemas
export const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  description: z.string().optional(),
  trafficPercentage: z.number().min(0).max(100),
  isControl: z.boolean().default(false),
});

export const targetingRuleSchema = z.object({
  device: z.array(z.string()).optional(),
  country: z.array(z.string()).optional(),
  channel: z.array(z.string()).optional(),
  userType: z.array(z.string()).optional(),
  language: z.array(z.string()).optional(),
});

export const experimentSchema = z.object({
  name: z.string().min(1, "Experiment name is required"),
  description: z.string().optional(),
  hypothesis: z.string().optional(),
  primaryKPI: z.string().optional(),
  secondaryKPIs: z.array(z.string()).max(5, "Maximum 5 secondary KPIs allowed").optional().default([]),
  targeting: targetingRuleSchema.default({}),
  variants: z.array(variantSchema).min(2, "At least 2 variants required"),
});

// Validation function for go-live checks
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateGoLive(experiment: {
  variants: { trafficPercentage: number }[];
  primaryKPI: string | null;
  targeting: unknown;
}): ValidationResult {
  const errors: string[] = [];

  // Check traffic allocation sums to 100
  const totalTraffic = experiment.variants.reduce(
    (sum, v) => sum + v.trafficPercentage,
    0
  );
  if (totalTraffic !== 100) {
    errors.push(`Traffic allocation must sum to 100% (currently ${totalTraffic}%)`);
  }

  // Check variant count
  if (experiment.variants.length < 2) {
    errors.push("Experiment must have at least 2 variants");
  }

  // Check primary KPI is set
  if (!experiment.primaryKPI) {
    errors.push("Primary KPI must be selected");
  }

  // Check targeting rules exist
  const targeting = experiment.targeting as Record<string, unknown>;
  const hasTargeting = Object.keys(targeting).some(
    (key) => Array.isArray(targeting[key]) && targeting[key].length > 0
  );

  if (!hasTargeting) {
    errors.push("At least one targeting rule must be defined");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Auth validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
