import React from 'react';
import PropTypes from 'prop-types';

export default function UsersTable({
    users, searchKey, setSearchKey, setCurrentPage,
    userRoleFilter, setUserRoleFilter, userRoles,
    totalCount, currentPage, pageCount, handlePageChange,
    handleToggleBlock, openPasswordModal, handleDelete,
}) {
    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
            <div className="p-6 border-b flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-2xl font-semibold text-gray-700">
                    👥 Users List ({totalCount} Total)
                </h2>
                <div className="flex space-x-4"> {/* Container for search and filter */}
                    {/* User Role Filter Dropdown */}
                    <select
                        value={userRoleFilter}
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="ALL">Filter by Role (ALL)</option>
                        {userRoles.filter(role => role !== "ALL").map(role => (
                             <option key={role} value={role}>Role: {role}</option>
                        ))}
                    </select>

                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search by key..."
                        value={searchKey}
                        onChange={(e) => {
                            setSearchKey(e.target.value);
                            setCurrentPage(0); // Reset to first page on new search
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            {users.length === 0 ? (
                <p className="p-6 text-gray-500">No users found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* Table Head */}
                        <thead className="bg-gray-100">
                            <tr>
                                {["ID", "Username", "Role", "Name", "Status", "Actions"].map(header => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.userRole === "ADMIN" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
                                            {user.userRole}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.lastName} {user.firstName} {user.middleName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                                            {user.isBlocked ? "Blocked" : "Active"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleToggleBlock(user)}
                                            className={`text-sm font-medium transition duration-150 ease-in-out ${user.isBlocked ? "text-green-600 hover:text-green-900" : "text-yellow-600 hover:text-yellow-900"}`}
                                        >
                                            {user.isBlocked ? "Unblock" : "Block"}
                                        </button>
                                        <button
                                            onClick={() => openPasswordModal(user)}
                                            className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out font-medium"
                                        >
                                            Reset Pass
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id, user.username)}
                                            className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            {pageCount > 1 && (
                <div className="p-4 flex justify-between items-center border-t bg-gray-50">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg shadow-sm hover:bg-gray-400 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-700">
                        Page {currentPage + 1} of {pageCount} ({totalCount} users)
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= pageCount - 1}
                        className="px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg shadow-sm hover:bg-gray-400 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

UsersTable.propTypes = {
    users: PropTypes.array.isRequired,
    searchKey: PropTypes.string.isRequired,
    setSearchKey: PropTypes.func.isRequired,
    userRoleFilter: PropTypes.string.isRequired,
    setUserRoleFilter: PropTypes.func.isRequired,
    userRoles: PropTypes.array.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    totalCount: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    handleToggleBlock: PropTypes.func.isRequired,
    openPasswordModal: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
};
