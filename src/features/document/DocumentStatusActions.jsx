import PropTypes from 'prop-types';

export default function DocumentStatusActions({
    isPublished,
    isDeleting,
    deleteError,
    handleDelete,
    isRemovingContributor,
    isAddingContributor,
}) {
    return (
        <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <p
                    className={`text-sm font-medium ${isPublished ? 'text-green-600' : 'text-yellow-600'
                        }`}
                >
                    Status: <strong>{isPublished ? 'Published' : 'Draft / Unpublished'}</strong>
                </p>

                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm transition ${isDeleting
                            ? 'bg-red-400 text-white cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                        }`}
                >
                    {isDeleting ? 'Deleting...' : 'Delete Document'}
                </button>
            </div>

            {deleteError && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 text-sm font-medium">
                    <strong>Deletion Failed:</strong> {deleteError}
                </div>
            )}

            {(isRemovingContributor || isAddingContributor) && (
                <div className="mt-4 p-4 bg-blue-100 text-blue-700 text-sm font-medium">
                    <strong>{isRemovingContributor ? 'Removing Contributor...' : 'Adding Contributor...'}</strong> Please wait.
                </div>
            )}
        </div>
    );
}

DocumentStatusActions.propTypes = {
    isPublished: PropTypes.bool.isRequired,
    isDeleting: PropTypes.bool.isRequired,
    deleteError: PropTypes.string,
    handleDelete: PropTypes.func.isRequired,
    isRemovingContributor: PropTypes.bool.isRequired,
    isAddingContributor: PropTypes.bool.isRequired,
};
