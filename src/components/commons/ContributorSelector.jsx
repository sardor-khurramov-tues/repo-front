import React from 'react';
import PropTypes from 'prop-types';

export default function ContributorSelector({ contributors, selected, onSelect }) {
  if (!contributors || contributors.length === 0) return <p>No results</p>;

  return (
    <ul>
      {contributors.slice(0, 12).map((c) => (
        <li key={c.id}>
          <label>
            <input
              type="radio"
              name="contributor"
              value={c.id}
              checked={selected?.id === c.id}
              onChange={() => onSelect(c)}
            />
            {c.firstName} {c.lastName} ({c.username})
          </label>
        </li>
      ))}
    </ul>
  );
}

ContributorSelector.propTypes = {
  contributors: PropTypes.array.isRequired,
  selected: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
};
