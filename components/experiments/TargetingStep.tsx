interface TargetingRules {
  device: string[];
  country: string[];
  channel: string[];
  userType: string[];
  language: string[];
}

interface TargetingStepProps {
  formData: {
    targeting: TargetingRules;
  };
  updateFormData: (updates: { targeting: TargetingRules }) => void;
}

const DEVICE_OPTIONS = ["desktop", "mobile", "tablet"];
const COUNTRY_OPTIONS = ["US", "CA", "UK", "AU", "DE", "FR", "JP", "IN"];
const CHANNEL_OPTIONS = ["organic", "paid", "email", "social", "direct"];
const USER_TYPE_OPTIONS = ["non-logged-in", "logged-in", "premium-member"];
const LANGUAGE_OPTIONS = ["EN", "FR"];

export default function TargetingStep({ formData, updateFormData }: TargetingStepProps) {
  const { targeting } = formData;

  const toggleOption = (category: keyof TargetingRules, value: string) => {
    const currentValues = targeting[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    updateFormData({
      targeting: {
        ...targeting,
        [category]: newValues,
      },
    });
  };

  const hasAnySelection =
    targeting.device.length > 0 ||
    targeting.country.length > 0 ||
    targeting.channel.length > 0 ||
    targeting.userType.length > 0 ||
    targeting.language.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Targeting Rules</h2>
        <p className="text-sm text-gray-400 mb-6">
          Define who will see this experiment. Select at least one option from any category.
        </p>
      </div>

      {/* Device Targeting */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Device Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {DEVICE_OPTIONS.map((device) => (
            <button
              key={device}
              onClick={() => toggleOption("device", device)}
              className={`px-4 py-3 rounded-md border-2 transition-all ${
                targeting.device.includes(device)
                  ? "border-blue-500 bg-blue-900/30 text-blue-300"
                  : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="capitalize">{device}</span>
                {targeting.device.includes(device) && (
                  <span className="ml-2 text-blue-400">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Selected: {targeting.device.length > 0 ? targeting.device.join(", ") : "None"}
        </p>
      </div>

      {/* Country Targeting */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Country
        </label>
        <div className="grid grid-cols-4 gap-3">
          {COUNTRY_OPTIONS.map((country) => (
            <button
              key={country}
              onClick={() => toggleOption("country", country)}
              className={`px-4 py-3 rounded-md border-2 transition-all ${
                targeting.country.includes(country)
                  ? "border-blue-500 bg-blue-900/30 text-blue-300"
                  : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-center">
                <span>{country}</span>
                {targeting.country.includes(country) && (
                  <span className="ml-2 text-blue-400">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Selected: {targeting.country.length > 0 ? targeting.country.join(", ") : "None"}
        </p>
      </div>

      {/* Channel Targeting */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Traffic Channel
        </label>
        <div className="grid grid-cols-3 gap-3">
          {CHANNEL_OPTIONS.map((channel) => (
            <button
              key={channel}
              onClick={() => toggleOption("channel", channel)}
              className={`px-4 py-3 rounded-md border-2 transition-all ${
                targeting.channel.includes(channel)
                  ? "border-blue-500 bg-blue-900/30 text-blue-300"
                  : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="capitalize">{channel}</span>
                {targeting.channel.includes(channel) && (
                  <span className="ml-2 text-blue-400">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Selected: {targeting.channel.length > 0 ? targeting.channel.join(", ") : "None"}
        </p>
      </div>

      {/* User Type Targeting */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          User Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {USER_TYPE_OPTIONS.map((userType) => (
            <button
              key={userType}
              onClick={() => toggleOption("userType", userType)}
              className={`px-4 py-3 rounded-md border-2 transition-all ${
                targeting.userType.includes(userType)
                  ? "border-blue-500 bg-blue-900/30 text-blue-300"
                  : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="capitalize">{userType}</span>
                {targeting.userType.includes(userType) && (
                  <span className="ml-2 text-blue-400">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Selected: {targeting.userType.length > 0 ? targeting.userType.join(", ") : "None"}
        </p>
      </div>

      {/* Language Targeting */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Language
        </label>
        <div className="grid grid-cols-3 gap-3">
          {LANGUAGE_OPTIONS.map((language) => (
            <button
              key={language}
              onClick={() => {
                if (language !== "EN") {
                  toggleOption("language", language);
                }
              }}
              disabled={language === "EN"}
              className={`px-4 py-3 rounded-md border-2 transition-all ${
                language === "EN" || targeting.language.includes(language)
                  ? "border-blue-500 bg-blue-900/30 text-blue-300"
                  : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600"
              } ${language === "EN" ? "cursor-not-allowed opacity-75" : ""}`}
            >
              <div className="flex items-center justify-center">
                <span>{language}</span>
                {(language === "EN" || targeting.language.includes(language)) && (
                  <span className="ml-2 text-blue-400">✓</span>
                )}
                {language === "EN" && (
                  <span className="ml-2 text-xs text-gray-400">(Default)</span>
                )}
              </div>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Selected: EN (always), {targeting.language.filter((l) => l !== "EN").join(", ") || "None"}
        </p>
      </div>

      {/* Summary */}
      <div
        className={`p-4 rounded-md border ${
          hasAnySelection
            ? "bg-green-900/20 border-green-800"
            : "bg-yellow-900/20 border-yellow-800"
        }`}
      >
        <div className="flex items-start">
          <span className={`text-sm font-medium ${hasAnySelection ? "text-green-400" : "text-yellow-400"}`}>
            {hasAnySelection ? "✓ Targeting rules defined" : "⚠ No targeting rules selected"}
          </span>
        </div>
        {!hasAnySelection && (
          <p className="text-xs text-yellow-400 mt-2">
            Select at least one option from any category to continue
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-gray-800">
        <p className="text-sm text-gray-400">
          <span className="text-red-400">*</span> At least one targeting rule required
        </p>
      </div>
    </div>
  );
}
