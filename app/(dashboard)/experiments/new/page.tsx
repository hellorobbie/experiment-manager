"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Step components (we'll create these next)
import BasicInfoStep from "@/components/experiments/BasicInfoStep";
import VariantsStep from "@/components/experiments/VariantsStep";
import TargetingStep from "@/components/experiments/TargetingStep";
import KPIStep from "@/components/experiments/KPIStep";
import ReviewStep from "@/components/experiments/ReviewStep";

interface Variant {
  name: string;
  description: string;
  trafficPercentage: number;
  isControl: boolean;
}

interface TargetingRules {
  device: string[];
  country: string[];
  channel: string[];
  userType: string[];
  language: string[];
}

interface ExperimentFormData {
  name: string;
  description: string;
  hypothesis: string;
  variants: Variant[];
  targeting: TargetingRules;
  primaryKPI: string;
  secondaryKPIs: string[];
}

const STEPS = [
  { id: 1, name: "Basic Info", description: "Name and hypothesis" },
  { id: 2, name: "Variants", description: "Define test variations" },
  { id: 3, name: "Targeting", description: "Set audience rules" },
  { id: 4, name: "Primary KPI", description: "Choose success metric" },
  { id: 5, name: "Review", description: "Confirm and create" },
];

export default function NewExperimentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<ExperimentFormData>({
    name: "",
    description: "",
    hypothesis: "",
    variants: [
      { name: "Control", description: "", trafficPercentage: 50, isControl: true },
      { name: "Treatment", description: "", trafficPercentage: 50, isControl: false },
    ],
    targeting: {
      device: [],
      country: [],
      channel: [],
      userType: [],
      language: ["EN"],
    },
    primaryKPI: "",
    secondaryKPIs: [],
  });

  const updateFormData = (updates: Partial<ExperimentFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        const totalTraffic = formData.variants.reduce((sum, v) => sum + v.trafficPercentage, 0);
        return formData.variants.length >= 2 && totalTraffic === 100;
      case 3:
        const { device, country, channel, userType, language } = formData.targeting;
        return device.length > 0 || country.length > 0 || channel.length > 0 || userType.length > 0 || language.length > 0;
      case 4:
        return formData.primaryKPI.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/experiments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create experiment");
      }

      const experiment = await response.json();
      router.push(`/experiments/${experiment.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <VariantsStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <TargetingStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <KPIStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/experiments" className="text-sm text-gray-400 hover:text-gray-200 mb-4 inline-block">
          ← Back to Experiments
        </Link>
        <h1 className="text-3xl font-bold text-gray-100">Create New Experiment</h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors ${
                    currentStep === step.id
                      ? "bg-blue-600 text-white"
                      : currentStep > step.id
                      ? "bg-green-600 text-white"
                      : "bg-gray-800 text-gray-400 border border-gray-700"
                  }`}
                >
                  {currentStep > step.id ? "✓" : step.id}
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium ${currentStep >= step.id ? "text-gray-100" : "text-gray-500"}`}>
                    {step.name}
                  </div>
                  <div className="text-xs text-gray-500 hidden sm:block">{step.description}</div>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    currentStep > step.id ? "bg-green-600" : "bg-gray-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-6">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-6 py-2 text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>

        <div className="text-sm text-gray-500">
          Step {currentStep} of {STEPS.length}
        </div>

        {currentStep < STEPS.length ? (
          <button
            onClick={handleNext}
            disabled={!canGoNext()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? "Creating..." : "Create Experiment"}
          </button>
        )}
      </div>
    </div>
  );
}
