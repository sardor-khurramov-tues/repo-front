import { useState } from "react";
import { DOC_TYPE_LIST } from "../configs/constants";
import DocForm from "../components/forms/DocForms";

export default function DocumentSubmissionPage() {
  const [activeType, setActiveType] = useState(DOC_TYPE_LIST[0]);

  const handleTypeChange = (event) => {
    setActiveType(event.target.value);
  };

  // Helper function to format the option text
  const formatType = (type) =>
    type.replaceAll("_", " ").split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

  return (
    // Updated container styling: similar to login card (max-w-xl is slightly wider), deep shadow, smooth rounding
    <div className="flex min-h-screen items-start pt-16 justify-center bg-gray-50">
      <div className="w-full max-w-4xl mx-auto bg-white p-10 shadow-2xl rounded-xl">

        {/* Page Title - Modernized, centered font weight and color */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">
          📝 Document Submission Portal
        </h2>

        {/* Document Type Dropdown Selection */}
        <div className="mb-8">
          <label htmlFor="docTypeSelect" className="block text-sm font-medium text-gray-700 mb-2">
            Select Document Type
          </label>

          <select
            id="docTypeSelect"
            value={activeType}
            onChange={handleTypeChange}
            className="
                        mt-1 block w-full py-3 px-4 bg-white text-gray-800 border-2 border-gray-300 
                        rounded-lg shadow-sm appearance-none transition duration-150 ease-in-out
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base
                        cursor-pointer
                    "
          >
            {/* Default/Placeholder option - Removed 'disabled' since activeType is initialized */}
            {/* <option value="" disabled>Choose a document type...</option> */}

            {DOC_TYPE_LIST.map((type) => (
              <option key={type} value={type}>
                {formatType(type)}
              </option>
            ))}
          </select>
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Document Form */}
        {/* Added a dynamic title for context */}
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Submission Form: {formatType(activeType)}
        </h3>

        <DocForm docType={activeType} />
      </div>
    </div>
  );
}
