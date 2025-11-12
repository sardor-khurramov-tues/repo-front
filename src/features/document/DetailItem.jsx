import PropTypes from 'prop-types';

export default function DetailItem({ label, value }) {
  return (
    <div className="p-4 border-b last:border-b-0">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-base text-gray-900 break-words">
        {value || <span className="text-gray-400 italic">N/A</span>}
      </p>
    </div>
  );
}

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};
