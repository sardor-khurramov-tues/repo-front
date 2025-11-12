import { formatContributorName } from './utils';
import PropTypes from 'prop-types';

export default function ContributorItem({
    contributor,
    onRemove,
    isRemoving,
    isSelf,
}) {
    return (
        <div className="p-3 bg-gray-50 rounded-md shadow-sm flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-900">
                    {formatContributorName(contributor.appUser)}
                </span>
                <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                    {contributor.docRole}
                </span>
            </div>

            <button
                onClick={() => onRemove(contributor.id)}
                disabled={isRemoving || isSelf}
                className={`ml-4 px-3 py-1 text-xs font-medium rounded-md transition ${isRemoving || isSelf
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600 text-white shadow-sm'
                    }`}
                title={isSelf ? 'Cannot remove the document submitter.' : 'Remove Contributor'}
            >
                Remove
            </button>
        </div>
    );
}

ContributorItem.propTypes = {
    contributor: PropTypes.shape({
        id: PropTypes.number.isRequired,
        appUser: PropTypes.shape({
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
        }).isRequired,
        docRole: PropTypes.string.isRequired,
    }).isRequired,
    onRemove: PropTypes.func.isRequired,
    isRemoving: PropTypes.bool,
    isSelf: PropTypes.bool,
};
