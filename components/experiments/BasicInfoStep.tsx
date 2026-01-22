interface BasicInfoStepProps {
  formData: {
    name: string;
    description: string;
    hypothesis: string;
  };
  updateFormData: (updates: Partial<BasicInfoStepProps["formData"]>) => void;
}

export default function BasicInfoStep({ formData, updateFormData }: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Basic Information</h2>
        <p className="text-sm text-gray-400 mb-6">
          Start by giving your experiment a clear name and describing what you're testing.
        </p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Experiment Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
          placeholder="e.g., Homepage Hero Image Test"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          A descriptive name that clearly identifies this experiment
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
          placeholder="e.g., Testing the impact of a new hero image on sign-up conversion"
        />
        <p className="mt-1 text-xs text-gray-500">
          What are you testing? (optional but recommended)
        </p>
      </div>

      <div>
        <label htmlFor="hypothesis" className="block text-sm font-medium text-gray-300 mb-2">
          Hypothesis
        </label>
        <textarea
          id="hypothesis"
          value={formData.hypothesis}
          onChange={(e) => updateFormData({ hypothesis: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
          placeholder="e.g., A more vibrant hero image will increase sign-up conversion by showing product value more clearly"
        />
        <p className="mt-1 text-xs text-gray-500">
          Why do you expect this change to improve the metric? (optional)
        </p>
      </div>

      <div className="pt-4 border-t border-gray-800">
        <p className="text-sm text-gray-400">
          <span className="text-red-400">*</span> Required fields
        </p>
      </div>
    </div>
  );
}
