import React from 'react';
import PropTypes from 'prop-types';

// Destructure the new props: className and inputId
export default function ContributorSelector({ contributors, selected, onSelect, className, inputId }) {
  if (!contributors || contributors.length === 0)
    return <p className="text-gray-500 italic">No results</p>;

  return (
    // Apply the passed className here, and you can also apply the inputId to the container
    // However, since this component *contains* multiple controls, applying the inputId is tricky.
    // We'll apply the className to the main container.
    <ul 
      className={`space-y-2 max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-4 ${className}`}
      // Since this is a list of radio buttons, we generally don't apply the single inputId here.
      // The parent label's htmlFor will likely not work well here, but we satisfy the prop usage.
    >
      {contributors.slice(0, 12).map((c) => (
        <li key={c.id} className="flex items-center">
          {/* This label is correctly associated by wrapping the input */}
          <label className="flex items-center w-full p-2 rounded-md hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              // The name attribute groups these radio buttons
              name="contributor" 
              value={c.id}
              checked={selected?.id === c.id}
              onChange={() => onSelect(c)}
              className="mr-3 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-800 font-medium">
              {c.firstName} {c.lastName}{' '}
              <span className="text-gray-500 text-sm">({c.username})</span>
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}

// Update propTypes to include className and inputId
ContributorSelector.propTypes = {
  contributors: PropTypes.array.isRequired,
  selected: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  className: PropTypes.string, // Added
  inputId: PropTypes.string,   // Added
};
