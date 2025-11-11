import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DOC_ROLE_LIST } from '@/configs/constants';

// Helper to format contributor name
const formatContributorName = (user) => {
    if (!user) return 'Unknown User';
    // Prioritize first/last name, fallback to username
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    return name ? `${name} (${user.username})` : user.username;
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
export default function DocumentDetailView({ 
    id, 
    documentData, 
    isDeleting, 
    deleteError, 
    handleDelete, 
    handleRemoveContributor, 
    isRemovingContributor,
    authorSearch,
    handleSearchAuthor, 
    handleAddContributor,
    isAddingContributor
}) {
    // Local state for the search input and selected role
    const [searchKey, setSearchKey] = useState(''); // Initialize empty for the new input
    const [selectedRole, setSelectedRole] = useState(DOC_ROLE_LIST[0]);
    
    // Check if the current user is the submitter
    const isContributorSelf = (contributor) => contributor.appUser.id === documentData.submitter.id;
    // Check if the author is already a contributor (by appUserId)
    const isAuthorAlreadyContributor = (authorId) => 
        documentData.contributorSet.some(c => c.appUser.id === authorId);

    // Handler for the search button click
    const handleSearchClick = () => {
        // Only trigger search if key has content
        if (searchKey.trim().length >= 3) {
            handleSearchAuthor(searchKey.trim());
        } else {
            // Optional: Provide visual feedback instead of an alert
            // alert("Please enter at least 3 characters to search.");
            console.warn("Search key too short.");
        }
    };
    
    // Handler for adding a selected author
    const onAddContributor = (appUserId) => {
        handleAddContributor(appUserId, selectedRole);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">

                {/* Header Section */}
                <div className="p-6 bg-indigo-600 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{documentData.title || 'Untitled Document'}</h1>
                    <p className="text-indigo-200 text-sm">Document ID: <span className="font-semibold">{id}</span> | Type: <span className="font-semibold">{documentData.docType}</span></p>
                </div>

                {/* Status and Action Alerts */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                        <p className={`text-sm font-medium ${documentData.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>
                            Status: **{documentData.isPublished ? 'Published' : 'Draft / Unpublished'}**
                        </p>
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
                        <div className="mt-4 p-4 bg-red-100 text-red-700 text-sm font-medium">
                            **Deletion Failed:** {deleteError}
                        </div>
                    )}
                    {(isRemovingContributor || isAddingContributor) && (
                        <div className="mt-4 p-4 bg-blue-100 text-blue-700 text-sm font-medium">
                            **{isRemovingContributor ? 'Removing Contributor...' : 'Adding Contributor...'}** Please wait.
                        </div>
                    )}
                </div>


                {/* Contributors Section */}
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Contributors</h2>
                    <div className="space-y-2 mb-6">
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
                                    
                                    {/* Remove Button */}
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

                    {/* Add Contributor Form with Search Button */}
                    <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
                        <h3 className="text-lg font-semibold text-indigo-700 mb-3">Add New Contributor</h3>
                        
                        {/* Search Bar and Button */}
                        <div className="flex space-x-3 mb-3">
                            {/* Search Input */}
                            <input
                                type="text"
                                placeholder="Enter key (name, email, etc.) to search authors..."
                                value={searchKey}
                                onChange={(e) => setSearchKey(e.target.value)} // Update local state only
                                className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={isAddingContributor || authorSearch.loading}
                            />
                            {/* Search Button */}
                            <button
                                onClick={handleSearchClick}
                                disabled={searchKey.trim().length < 3 || authorSearch.loading || isAddingContributor}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out ${
                                    searchKey.trim().length < 3 || authorSearch.loading || isAddingContributor
                                        ? 'bg-indigo-300 text-white cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                }`}
                            >
                                {authorSearch.loading ? (
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : 'Search'}
                            </button>
                        </div>
                        
                        {/* Role Selector and Results Section */}
                        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mt-4">
                            {/* Role Selector */}
                            <div className="flex-shrink-0">
                                <label htmlFor="contributor-role" className="block text-sm font-medium text-gray-700">Assign Role</label>
                                <select
                                    id="contributor-role"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm bg-white block w-full"
                                    disabled={isAddingContributor}
                                >
                                    {DOC_ROLE_LIST.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Search Results */}
                            <div className="flex-grow border rounded-lg p-3 bg-white min-h-[100px] shadow-inner">
                                {authorSearch.error && <p className="text-red-500">{authorSearch.error}</p>}
                                
                                {authorSearch.results.length > 0 ? (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-700">Found {authorSearch.results.length} Authors:</p>
                                        {authorSearch.results.map(author => (
                                            <div key={author.id} className="p-2 bg-gray-50 rounded-md flex justify-between items-center border border-gray-200">
                                                <span className="text-sm font-medium">{formatContributorName(author)}</span>
                                                <button
                                                    onClick={() => onAddContributor(author.id)}
                                                    disabled={isAddingContributor || isAuthorAlreadyContributor(author.id)}
                                                    className={`px-3 py-1 text-xs font-medium rounded-md transition duration-150 ease-in-out ${
                                                        isAddingContributor || isAuthorAlreadyContributor(author.id) 
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                                                    }`}
                                                    title={isAuthorAlreadyContributor(author.id) ? "Already a contributor" : `Add as ${selectedRole}`}
                                                >
                                                    {isAuthorAlreadyContributor(author.id) ? 'Added' : 'Add'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (searchKey.trim().length >= 3 && !authorSearch.loading && !authorSearch.error && authorSearch.key) ? (
                                    <p className="text-gray-500 italic text-sm mt-2">No authors found matching "**{authorSearch.key}**".</p>
                                ) : (
                                    <p className="text-gray-400 italic text-sm mt-2">Enter at least 3 characters and click **Search** to find authors.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Details Grid */}
                <div className="p-6 pt-0">
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
    handleRemoveContributor: PropTypes.func.isRequired, 
    isRemovingContributor: PropTypes.bool.isRequired,
    // NEW PROPTYPES
    authorSearch: PropTypes.shape({
        key: PropTypes.string.isRequired,
        results: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
        error: PropTypes.string,
    }).isRequired,
    handleSearchAuthor: PropTypes.func.isRequired,
    handleAddContributor: PropTypes.func.isRequired,
    isAddingContributor: PropTypes.bool.isRequired,
};
