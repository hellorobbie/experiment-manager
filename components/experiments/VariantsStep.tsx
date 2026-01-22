interface Variant {
  name: string;
  description: string;
  trafficPercentage: number;
  isControl: boolean;
}

interface VariantsStepProps {
  formData: {
    variants: Variant[];
  };
  updateFormData: (updates: { variants: Variant[] }) => void;
}

export default function VariantsStep({ formData, updateFormData }: VariantsStepProps) {
  const { variants } = formData;

  const totalTraffic = variants.reduce((sum, v) => sum + v.trafficPercentage, 0);
  const isValid = totalTraffic === 100;

  const updateVariant = (index: number, updates: Partial<Variant>) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], ...updates };
    updateFormData({ variants: newVariants });
  };

  const addVariant = () => {
    const newVariants = [
      ...variants,
      {
        name: `Variant ${variants.length + 1}`,
        description: "",
        trafficPercentage: 0,
        isControl: false,
      },
    ];
    updateFormData({ variants: newVariants });
  };

  const removeVariant = (index: number) => {
    if (variants.length > 2) {
      const newVariants = variants.filter((_, i) => i !== index);
      updateFormData({ variants: newVariants });
    }
  };

  const distributeEvenly = () => {
    const perVariant = Math.floor(100 / variants.length);
    const remainder = 100 - perVariant * variants.length;

    const newVariants = variants.map((v, i) => ({
      ...v,
      trafficPercentage: i === 0 ? perVariant + remainder : perVariant,
    }));
    updateFormData({ variants: newVariants });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-100">Variants & Traffic Allocation</h2>
          <button
            onClick={distributeEvenly}
            className="text-sm px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-700 transition-colors"
          >
            Distribute Evenly
          </button>
        </div>
        <p className="text-sm text-gray-400 mb-6">
          Define your test variations and allocate traffic. Traffic must sum to exactly 100%.
        </p>
      </div>

      {/* Traffic Summary */}
      <div
        className={`p-4 rounded-md border ${
          isValid
            ? "bg-green-900/20 border-green-800"
            : "bg-yellow-900/20 border-yellow-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">Total Traffic Allocation:</span>
          <span
            className={`text-lg font-bold ${
              isValid ? "text-green-400" : "text-yellow-400"
            }`}
          >
            {totalTraffic}%
          </span>
        </div>
        {!isValid && (
          <p className="text-xs text-yellow-400 mt-2">
            {totalTraffic < 100
              ? `Add ${100 - totalTraffic}% more to reach 100%`
              : `Reduce by ${totalTraffic - 100}% to reach 100%`}
          </p>
        )}
      </div>

      {/* Variants List */}
      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="p-4 bg-gray-800/50 border border-gray-700 rounded-md space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Variant Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, { name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                      placeholder="e.g., Control, Treatment A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Traffic % <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={variant.trafficPercentage}
                      onChange={(e) =>
                        updateVariant(index, {
                          trafficPercentage: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={variant.description}
                    onChange={(e) => updateVariant(index, { description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                    placeholder="Brief description of this variant"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`control-${index}`}
                    checked={variant.isControl}
                    onChange={(e) => {
                      // Uncheck all other controls first
                      const newVariants = variants.map((v, i) => ({
                        ...v,
                        isControl: i === index ? e.target.checked : false,
                      }));
                      updateFormData({ variants: newVariants });
                    }}
                    className="w-4 h-4 bg-gray-900 border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor={`control-${index}`} className="ml-2 text-sm text-gray-300">
                    Mark as control (baseline)
                  </label>
                </div>
              </div>

              {variants.length > 2 && (
                <button
                  onClick={() => removeVariant(index)}
                  className="ml-4 text-red-400 hover:text-red-300 text-sm"
                  title="Remove variant"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Variant Button */}
      <button
        onClick={addVariant}
        className="w-full py-2 border-2 border-dashed border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300 rounded-md transition-colors"
      >
        + Add Variant
      </button>

      <div className="pt-4 border-t border-gray-800">
        <p className="text-sm text-gray-400">
          <span className="text-red-400">*</span> At least 2 variants required. Traffic must sum to 100%.
        </p>
      </div>
    </div>
  );
}
