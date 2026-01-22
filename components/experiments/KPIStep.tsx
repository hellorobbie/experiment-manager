interface KPIStepProps {
  formData: {
    primaryKPI: string;
    secondaryKPIs: string[];
  };
  updateFormData: (updates: { primaryKPI?: string; secondaryKPIs?: string[] }) => void;
}

const KPI_OPTIONS = [
  {
    id: "conversion_rate",
    name: "Conversion Rate",
    description: "Percentage of users who complete a desired action",
    category: "Engagement",
  },
  {
    id: "signup_rate",
    name: "Sign-up Rate",
    description: "Percentage of visitors who create an account",
    category: "Engagement",
  },
  {
    id: "click_through_rate",
    name: "Click-Through Rate (CTR)",
    description: "Percentage of users who click on a specific element",
    category: "Engagement",
  },
  {
    id: "revenue_per_user",
    name: "Revenue Per User",
    description: "Average revenue generated per user",
    category: "Revenue",
  },
  {
    id: "average_order_value",
    name: "Average Order Value (AOV)",
    description: "Average amount spent per transaction",
    category: "Revenue",
  },
  {
    id: "time_on_page",
    name: "Time on Page",
    description: "Average time users spend on a page",
    category: "Engagement",
  },
  {
    id: "bounce_rate",
    name: "Bounce Rate",
    description: "Percentage of users who leave without interaction",
    category: "Engagement",
  },
  {
    id: "retention_rate",
    name: "Retention Rate",
    description: "Percentage of users who return after first visit",
    category: "Retention",
  },
];

export default function KPIStep({ formData, updateFormData }: KPIStepProps) {
  const { primaryKPI, secondaryKPIs } = formData;

  const categories = Array.from(new Set(KPI_OPTIONS.map((kpi) => kpi.category)));

  const handleKPIToggle = (kpiId: string) => {
    const isPrimary = primaryKPI === kpiId;
    const isSecondary = secondaryKPIs.includes(kpiId);
    const totalSelected = (primaryKPI ? 1 : 0) + secondaryKPIs.length;

    if (isPrimary) {
      // Deselecting primary KPI - just clear it, don't touch secondaries
      updateFormData({ primaryKPI: "" });
    } else if (isSecondary) {
      // Deselecting a secondary KPI
      updateFormData({ secondaryKPIs: secondaryKPIs.filter((id) => id !== kpiId) });
    } else {
      // Selecting a new KPI
      if (totalSelected >= 6) return; // Max 6 total

      if (!primaryKPI) {
        // No primary yet, make this the primary
        updateFormData({ primaryKPI: kpiId });
      } else {
        // Add as secondary
        updateFormData({ secondaryKPIs: [...secondaryKPIs, kpiId] });
      }
    }
  };

  const isPrimaryKPI = (kpiId: string) => primaryKPI === kpiId;
  const isSecondaryKPI = (kpiId: string) => secondaryKPIs.includes(kpiId);
  const isSelected = (kpiId: string) => isPrimaryKPI(kpiId) || isSecondaryKPI(kpiId);
  const totalSelected = (primaryKPI ? 1 : 0) + secondaryKPIs.length;
  const canAddMore = totalSelected < 6;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Experiment KPIs</h2>
        <p className="text-sm text-gray-400 mb-6">
          Select up to 6 KPIs to track. The first KPI selected will be your primary KPI (highlighted in blue),
          and additional selections will be secondary KPIs (highlighted in orange).
        </p>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-400">Primary KPI (1st selected)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-400">Secondary KPIs (up to 5)</span>
          </div>
          <div className="ml-auto">
            <span className="text-gray-400">{totalSelected}/6 selected</span>
          </div>
        </div>
      </div>

      {categories.map((category) => (
        <div key={category}>
          <h3 className="text-sm font-medium text-gray-400 mb-3">{category}</h3>
          <div className="grid grid-cols-1 gap-3">
            {KPI_OPTIONS.filter((kpi) => kpi.category === category).map((kpi) => {
              const isPrimary = isPrimaryKPI(kpi.id);
              const isSecondary = isSecondaryKPI(kpi.id);
              const selected = isSelected(kpi.id);
              const disabled = !selected && !canAddMore;

              return (
                <button
                  key={kpi.id}
                  onClick={() => handleKPIToggle(kpi.id)}
                  disabled={disabled}
                  className={`p-4 rounded-md border-2 text-left transition-all ${
                    isPrimary
                      ? "border-blue-500 bg-blue-900/30"
                      : isSecondary
                      ? "border-orange-500 bg-orange-900/20"
                      : disabled
                      ? "border-gray-700 bg-gray-800/50 opacity-50 cursor-not-allowed"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            isPrimary
                              ? "text-blue-300"
                              : isSecondary
                              ? "text-orange-300"
                              : "text-gray-200"
                          }`}
                        >
                          {kpi.name}
                        </span>
                        {selected && (
                          <span className={isPrimary ? "text-blue-400" : "text-orange-400"}>
                            ✓
                          </span>
                        )}
                        {isPrimary && (
                          <span className="text-xs px-2 py-0.5 bg-blue-900/30 text-blue-400 border border-blue-800 rounded">
                            Primary
                          </span>
                        )}
                        {isSecondary && (
                          <span className="text-xs px-2 py-0.5 bg-orange-900/30 text-orange-400 border border-orange-800 rounded">
                            Secondary
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          selected ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {kpi.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Summary */}
      {primaryKPI ? (
        <div className="p-4 rounded-md bg-green-900/20 border border-green-800">
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-green-400">
                ✓ Primary KPI: {KPI_OPTIONS.find((k) => k.id === primaryKPI)?.name}
              </span>
            </div>
            {secondaryKPIs.length > 0 && (
              <div>
                <span className="text-xs text-gray-400">Secondary KPIs: </span>
                <span className="text-xs text-gray-300">
                  {secondaryKPIs.map((id) => KPI_OPTIONS.find((k) => k.id === id)?.name).join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-md bg-yellow-900/20 border border-yellow-800">
          <span className="text-sm font-medium text-yellow-400">
            ⚠ Please select a primary KPI to continue
          </span>
        </div>
      )}

      {totalSelected === 6 && (
        <div className="p-4 rounded-md bg-blue-900/20 border border-blue-800">
          <span className="text-xs text-blue-300">
            Maximum of 6 KPIs reached. Deselect a KPI to add a different one.
          </span>
        </div>
      )}
    </div>
  );
}
