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

interface ReviewStepProps {
  formData: {
    name: string;
    description: string;
    hypothesis: string;
    variants: Variant[];
    targeting: TargetingRules;
    primaryKPI: string;
    secondaryKPIs: string[];
  };
}

const KPI_NAMES: Record<string, string> = {
  conversion_rate: "Conversion Rate",
  signup_rate: "Sign-up Rate",
  click_through_rate: "Click-Through Rate (CTR)",
  revenue_per_user: "Revenue Per User",
  average_order_value: "Average Order Value (AOV)",
  time_on_page: "Time on Page",
  bounce_rate: "Bounce Rate",
  retention_rate: "Retention Rate",
};

export default function ReviewStep({ formData }: ReviewStepProps) {
  const { name, description, hypothesis, variants, targeting, primaryKPI, secondaryKPIs } = formData;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Review & Confirm</h2>
        <p className="text-sm text-gray-400 mb-6">
          Review your experiment configuration before creating it. You can edit later, but live experiments have restrictions.
        </p>
      </div>

      {/* Basic Info */}
      <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-md">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Basic Information</h3>
        <div className="space-y-2">
          <div>
            <span className="text-xs text-gray-500">Name:</span>
            <p className="text-sm text-gray-200">{name}</p>
          </div>
          {description && (
            <div>
              <span className="text-xs text-gray-500">Description:</span>
              <p className="text-sm text-gray-200">{description}</p>
            </div>
          )}
          {hypothesis && (
            <div>
              <span className="text-xs text-gray-500">Hypothesis:</span>
              <p className="text-sm text-gray-200">{hypothesis}</p>
            </div>
          )}
        </div>
      </div>

      {/* Variants */}
      <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-md">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Variants & Traffic</h3>
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-900/50 rounded border border-gray-700"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-200">{variant.name}</span>
                  {variant.isControl && (
                    <span className="text-xs px-2 py-0.5 bg-blue-900/30 text-blue-400 border border-blue-800 rounded">
                      Control
                    </span>
                  )}
                </div>
                {variant.description && (
                  <p className="text-xs text-gray-500 mt-1">{variant.description}</p>
                )}
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-blue-400">
                  {variant.trafficPercentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Traffic:</span>
            <span className="font-semibold text-green-400">100%</span>
          </div>
        </div>
      </div>

      {/* Targeting */}
      <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-md">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Targeting Rules</h3>
        <div className="space-y-2">
          {targeting.device.length > 0 && (
            <div>
              <span className="text-xs text-gray-500">Device:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {targeting.device.map((device) => (
                  <span
                    key={device}
                    className="text-xs px-2 py-1 bg-gray-900 text-gray-300 border border-gray-700 rounded"
                  >
                    {device}
                  </span>
                ))}
              </div>
            </div>
          )}
          {targeting.country.length > 0 && (
            <div>
              <span className="text-xs text-gray-500">Country:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {targeting.country.map((country) => (
                  <span
                    key={country}
                    className="text-xs px-2 py-1 bg-gray-900 text-gray-300 border border-gray-700 rounded"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>
          )}
          {targeting.channel.length > 0 && (
            <div>
              <span className="text-xs text-gray-500">Channel:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {targeting.channel.map((channel) => (
                  <span
                    key={channel}
                    className="text-xs px-2 py-1 bg-gray-900 text-gray-300 border border-gray-700 rounded"
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          )}
          {targeting.userType.length > 0 && (
            <div>
              <span className="text-xs text-gray-500">User Type:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {targeting.userType.map((userType) => (
                  <span
                    key={userType}
                    className="text-xs px-2 py-1 bg-gray-900 text-gray-300 border border-gray-700 rounded"
                  >
                    {userType}
                  </span>
                ))}
              </div>
            </div>
          )}
          {targeting.language.length > 0 && (
            <div>
              <span className="text-xs text-gray-500">Language:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {targeting.language.map((language) => (
                  <span
                    key={language}
                    className="text-xs px-2 py-1 bg-gray-900 text-gray-300 border border-gray-700 rounded"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-md">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Experiment KPIs</h3>
        <div className="space-y-3">
          <div>
            <span className="text-xs text-gray-500">Primary KPI:</span>
            <p className="text-sm text-gray-200 mt-1">{KPI_NAMES[primaryKPI] || primaryKPI}</p>
          </div>
          {secondaryKPIs.length > 0 && (
            <div>
              <span className="text-xs text-gray-500">Secondary KPIs:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {secondaryKPIs.map((kpiId) => (
                  <span
                    key={kpiId}
                    className="text-xs px-2 py-1 bg-gray-900 text-gray-300 border border-gray-700 rounded"
                  >
                    {KPI_NAMES[kpiId] || kpiId}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-md">
        <p className="text-sm text-blue-300">
          💡 <strong>Ready to create?</strong> This experiment will be saved as a draft. You can make changes before going live.
        </p>
      </div>
    </div>
  );
}
