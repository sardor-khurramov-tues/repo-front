import { useState } from 'react';
import { formatContributorName } from './utils';
import { DOC_ROLE_LIST } from '@/configs/constants';
import PropTypes from 'prop-types';

export default function ContributorAddForm({
    authorSearch,
    handleSearchAuthor,
    handleAddContributor,
    isAddingContributor,
    existingContributors,
}) {
    const [searchKey, setSearchKey] = useState('');
    const [selectedRole, setSelectedRole] = useState(DOC_ROLE_LIST[0]);

    const handleSearch = () => {
        if (searchKey.trim().length >= 3) handleSearchAuthor(searchKey.trim());
    };

    const isAlreadyContributor = (id) =>
        existingContributors.some((c) => c.appUser.id === id);

    return (
        <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
            <h3 className="text-lg font-semibold text-indigo-700 mb-3">Add New Contributor</h3>

            <div className="flex space-x-3 mb-3">
                <input
                    type="text"
                    placeholder="Search authors..."
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-md"
                    disabled={isAddingContributor || authorSearch.loading}
                />
                <button
                    onClick={handleSearch}
                    disabled={searchKey.trim().length < 3 || authorSearch.loading}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${searchKey.trim().length < 3 || authorSearch.loading
                            ? 'bg-indigo-300 text-white cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                >
                    {authorSearch.loading ? 'Loading...' : 'Search'}
                </button>
            </div>

            {/* Role Selector */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 mt-4">
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Assign Role
                    </label>
                    <select
                        id="role"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md bg-white"
                        disabled={isAddingContributor}
                    >
                        {DOC_ROLE_LIST.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-grow border rounded-lg p-3 bg-white min-h-[100px] shadow-inner">
                    {authorSearch.error && <p className="text-red-500">{authorSearch.error}</p>}

                    {authorSearch.results.length > 0 ? (
                        authorSearch.results.map((author) => (
                            <div
                                key={author.id}
                                className="p-2 bg-gray-50 rounded-md flex justify-between items-center border border-gray-200 mb-1"
                            >
                                <span className="text-sm font-medium">{formatContributorName(author)}</span>
                                <button
                                    onClick={() => handleAddContributor(author.id, selectedRole)}
                                    disabled={isAddingContributor || isAlreadyContributor(author.id)}
                                    className={`px-3 py-1 text-xs font-medium rounded-md ${isAddingContributor || isAlreadyContributor(author.id)
                                            ? 'bg-gray-300 text-gray-500'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                        }`}
                                >
                                    {isAlreadyContributor(author.id) ? 'Added' : 'Add'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 italic text-sm mt-2">
                            Enter at least 3 characters and click Search to find authors.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

ContributorAddForm.propTypes = {
    authorSearch: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        results: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                firstName: PropTypes.string.isRequired,
                lastName: PropTypes.string.isRequired,
            })
        ).isRequired,
        error: PropTypes.string,
    }).isRequired,
    handleSearchAuthor: PropTypes.func.isRequired,
    handleAddContributor: PropTypes.func.isRequired,
    isAddingContributor: PropTypes.bool.isRequired,
    existingContributors: PropTypes.arrayOf(
        PropTypes.shape({
            appUser: PropTypes.shape({
                id: PropTypes.number.isRequired,
            }).isRequired,
        })
    ).isRequired,
};
