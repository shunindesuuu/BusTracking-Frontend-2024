import React from "react";

interface Section {
  sectionName: string;
  apiKey: string;
  channelId: string;
  fieldNumber: string;
}

interface DynamicSectionFormProps {
  index: number;
  section: Section;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof Section) => void;
  onRemoveSection: (index: number) => void;
}

const DynamicSectionForm: React.FC<DynamicSectionFormProps> = ({
  index,
  section,
  onInputChange,
  onRemoveSection,
}) => {
  return (
    <div className="border rounded-md p-4 mb-4 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Section {index + 1}</h3>
        <button
          type="button"
          onClick={() => onRemoveSection(index)}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Remove
        </button>
      </div>

      {/* Grid Layout for Inputs */}
      <div className="grid grid-cols-2 gap-4">
        {/* Section Name */}
        <div>
          <label htmlFor={`sectionName-${index}`} className="block font-medium mb-1">
            Section Name
          </label>
          <input
            id={`sectionName-${index}`}
            type="text"
            value={section.sectionName}
            onChange={(e) => onInputChange(e, index, "sectionName")}
            placeholder="e.g., Ecoland"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* API Key */}
        <div>
          <label htmlFor={`apiKey-${index}`} className="block font-medium mb-1">
            API Key
          </label>
          <input
            id={`apiKey-${index}`}
            type="text"
            value={section.apiKey}
            onChange={(e) => onInputChange(e, index, "apiKey")}
            placeholder="e.g., XYZ123"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Channel ID */}
        <div>
          <label htmlFor={`channelId-${index}`} className="block font-medium mb-1">
            Channel ID
          </label>
          <input
            id={`channelId-${index}`}
            type="text"
            value={section.channelId}
            onChange={(e) => onInputChange(e, index, "channelId")}
            placeholder="e.g., 2629303"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Channel Field Number */}
        <div>
          <label htmlFor={`fieldNumber-${index}`} className="block font-medium mb-1">
            Channel Field Number
          </label>
          <input
            id={`fieldNumber-${index}`}
            type="text"
            value={section.fieldNumber}
            onChange={(e) => onInputChange(e, index, "fieldNumber")}
            placeholder="e.g., 4"
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default DynamicSectionForm;
