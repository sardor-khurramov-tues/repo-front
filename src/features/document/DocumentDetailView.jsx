import React from 'react';
import PropTypes from 'prop-types';

// Helper to format contributor name
const formatContributorName = (user) => {
    if (!user) return 'Unknown User';
    return `${user.firstName || ''} ${user.lastName || ''} (${user.username})`;
};

// Helper to render a detail item
const DetailItem = ({ label, value }) => (
    <div className="p-4 border-b last:border-b-0">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-base text-gray-900 break-words">{value || <span className="text-gray-400 italic">N/A</span>}</p>
    </div>
);

DetailItem.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};


// The main view component that receives all data and handlers as props
export default function DocumentDetailView({ id, documentData, isDeleting, deleteError, handleDelete, handleRemoveContributor, isRemovingContributor }) {
    
    // Check if the current user is the submitter (to prevent self-removal)
    const isContributorSelf = (contributor) => contributor.appUser.id === documentData.submitter.id;
    
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">

                {/* Header Section */}
                <div className="p-6 bg-indigo-600 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{documentData.title || 'Untitled Document'}</h1>
                    <p className="text-indigo-200 text-sm">Document ID: <span className="font-semibold">{id}</span> | Type: <span className="font-semibold">{documentData.docType}</span></p>
                </div>

                {/* Actions and Status */}
                <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="space-y-1">
                        <p className={`text-sm font-medium ${documentData.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>
                            Status: **{documentData.isPublished ? 'Published' : 'Draft / Unpublished'}**
                        </p>
                        <p className="text-sm text-gray-500">
                            Submitted on: {new Date(documentData.createdAt).toLocaleDateString()}
                            {documentData.approvalDate && ` | Approved on: ${new Date(documentData.approvalDate).toLocaleDateString()}`}
                        </p>
                    </div>

                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm transition duration-150 ease-in-out ${isDeleting
                                ? 'bg-red-400 text-white cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                            }`}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Document'}
                    </button>
                </div>

                {deleteError && (
                    <div className="p-4 bg-red-100 text-red-700 text-sm font-medium">
                        **Deletion Failed:** {deleteError}
                    </div>
                )}
                {isRemovingContributor && (
                    <div className="p-4 bg-blue-100 text-blue-700 text-sm font-medium">
                        **Removing Contributor...** Please wait.
                    </div>
                )}


                {/* Main Details Grid */}
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Primary Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg divide-y md:divide-y-0 md:divide-x">
                        <DetailItem label="Document Key" value={documentData.docKey} />
                        <DetailItem label="Document Type" value={documentData.docType} />
                        <DetailItem label="Series Title" value={documentData.seriesTitle} />
                        <DetailItem label="Publication Date" value={documentData.pubDate ? new Date(documentData.pubDate).toLocaleDateString() : null} />
                        <DetailItem label="Department/Conference" value={documentData.department?.nameUz || 'N/A'} />
                        <DetailItem label="Submitter" value={formatContributorName(documentData.submitter)} />
                    </div>

                    <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4 border-b pb-2">Identifiers & Pages</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border rounded-lg divide-x divide-y md:divide-y-0">
                        <DetailItem label="ISSN" value={documentData.issn} />
                        <DetailItem label="ISBN" value={documentData.isbn} />
                        <DetailItem label="Volume" value={documentData.volume} />
                        <DetailItem label="Pages" value={documentData.firstPage && documentData.lastPage ? `${documentData.firstPage} - ${documentData.lastPage}` : null} />
                    </div>

                    {/* Contributors Section */}
                    <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4 border-b pb-2">Contributors</h2>
                    <div className="space-y-2">
                        {documentData.contributorSet && documentData.contributorSet.length > 0 ? (
                            documentData.contributorSet.map((contributor) => (
                                <div key={contributor.id} className="p-3 bg-gray-50 rounded-md shadow-sm flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <span className="font-medium text-gray-900">
                                            {formatContributorName(contributor.appUser)}
                                        </span>
                                        <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                                            {contributor.docRole}
                                        </span>
                                    </div>
                                    
                                    {/* Remove Button (NEW) */}
                                    <button
                                        onClick={() => handleRemoveContributor(contributor.id)}
                                        disabled={isRemovingContributor || isContributorSelf(contributor)}
                                        className={`ml-4 px-3 py-1 text-xs font-medium rounded-md transition duration-150 ease-in-out ${
                                            isRemovingContributor || isContributorSelf(contributor) 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-red-500 hover:bg-red-600 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                        }`}
                                        title={isContributorSelf(contributor) ? "Cannot remove the document submitter." : "Remove Contributor"}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No additional contributors listed.</p>
                        )}
                    </div>

                    {/* Abstract Section */}
                    <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4 border-b pb-2">Abstract</h2>
                    <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
                        <p className="text-gray-700 whitespace-pre-wrap">{documentData.docAbstract || 'No abstract provided.'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

DocumentDetailView.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    documentData: PropTypes.object.isRequired,
    isDeleting: PropTypes.bool.isRequired,
    deleteError: PropTypes.string,
    handleDelete: PropTypes.func.isRequired,
    handleRemoveContributor: PropTypes.func.isRequired, // New propType
    isRemovingContributor: PropTypes.bool.isRequired, // New propType
};
