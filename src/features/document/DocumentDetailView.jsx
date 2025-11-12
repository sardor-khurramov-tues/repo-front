import DocumentHeader from './DocumentHeader';
import DocumentStatusActions from './DocumentStatusActions';
import ContributorList from './ContributorList';
import ContributorAddForm from './ContributorAddForm';
import DetailItem from './DetailItem';
import { formatContributorName } from './utils';
import PropTypes from 'prop-types';

export default function DocumentDetailView(props) {
    const {
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
        isAddingContributor,
    } = props;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                <DocumentHeader title={documentData.title} id={id} docType={documentData.docType} />

                <DocumentStatusActions
                    isPublished={documentData.isPublished}
                    isDeleting={isDeleting}
                    deleteError={deleteError}
                    handleDelete={handleDelete}
                    isRemovingContributor={isRemovingContributor}
                    isAddingContributor={isAddingContributor}
                />

                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Contributors</h2>
                    <ContributorList
                        contributors={documentData.contributorSet}
                        onRemove={handleRemoveContributor}
                        isRemoving={isRemovingContributor}
                        documentSubmitterId={documentData.submitter.id}
                    />

                    <ContributorAddForm
                        authorSearch={authorSearch}
                        handleSearchAuthor={handleSearchAuthor}
                        handleAddContributor={handleAddContributor}
                        isAddingContributor={isAddingContributor}
                        existingContributors={documentData.contributorSet}
                    />
                </div>

                <div className="p-6 pt-0">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                        Primary Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg divide-y md:divide-y-0 md:divide-x">
                        <DetailItem label="Document Key" value={documentData.docKey} />
                        <DetailItem label="Document Type" value={documentData.docType} />
                        <DetailItem label="Series Title" value={documentData.seriesTitle} />
                        <DetailItem
                            label="Publication Date"
                            value={
                                documentData.pubDate
                                    ? new Date(documentData.pubDate).toLocaleDateString()
                                    : null
                            }
                        />
                        <DetailItem
                            label="Department/Conference"
                            value={documentData.department?.nameUz || 'N/A'}
                        />
                        <DetailItem
                            label="Submitter"
                            value={formatContributorName(documentData.submitter)}
                        />
                    </div>

                    <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4 border-b pb-2">
                        Identifiers & Pages
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border rounded-lg divide-x divide-y md:divide-y-0">
                        <DetailItem label="ISSN" value={documentData.issn} />
                        <DetailItem label="ISBN" value={documentData.isbn} />
                        <DetailItem label="Volume" value={documentData.volume} />
                        <DetailItem
                            label="Pages"
                            value={
                                documentData.firstPage && documentData.lastPage
                                    ? `${documentData.firstPage} - ${documentData.lastPage}`
                                    : null
                            }
                        />
                    </div>

                    <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4 border-b pb-2">Abstract</h2>
                    <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {documentData.docAbstract || 'No abstract provided.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

DocumentDetailView.propTypes = {
    id: PropTypes.string.isRequired,
    documentData: PropTypes.object.isRequired,
    isDeleting: PropTypes.bool,
    deleteError: PropTypes.string,
    handleDelete: PropTypes.func.isRequired,
    handleRemoveContributor: PropTypes.func.isRequired,
    isRemovingContributor: PropTypes.bool,
    authorSearch: PropTypes.object.isRequired,
    handleSearchAuthor: PropTypes.func.isRequired,
    handleAddContributor: PropTypes.func.isRequired,
    isAddingContributor: PropTypes.bool,
};
