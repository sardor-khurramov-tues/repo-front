import PropTypes from 'prop-types';

export default function DocumentHeader({ title, id, docType }) {
  return (
    <div className="p-6 bg-indigo-600 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
        {title || 'Untitled Document'}
      </h1>
      <p className="text-indigo-200 text-sm">
        Document ID: <span className="font-semibold">{id}</span> | Type:{' '}
        <span className="font-semibold">{docType}</span>
      </p>
    </div>
  );
}

DocumentHeader.propTypes = {
  title: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  docType: PropTypes.string.isRequired,
};
