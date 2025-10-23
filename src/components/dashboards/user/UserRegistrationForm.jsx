import React from 'react';
import PropTypes from 'prop-types';

export default function UserRegistrationForm({ formData, handleInputChange, handleRegisterSubmit, departments }) {
    return (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                ➕ Register New Staff User
            </h2>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Username */}
                    <input
                        type="text"
                        name="username"
                        placeholder="Username (max 127, no space)"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        maxLength={127}
                        pattern="^\S*$"
                        title="Username cannot contain spaces"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {/* Password */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password (min 8, max 64, no space)"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={8}
                        maxLength={64}
                        pattern="^\S*$"
                        title="Password must be between 8 and 64 characters and cannot contain spaces"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {/* First Name */}
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name (required)"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        maxLength={63}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {/* Last Name */}
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name (required)"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        maxLength={63}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {/* Middle Name */}
                    <input
                        type="text"
                        name="middleName"
                        placeholder="Middle Name (optional)"
                        value={formData.middleName}
                        onChange={handleInputChange}
                        maxLength={63}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {/* Department Dropdown */}
                    <div>
                        <label htmlFor="departmentId" className="sr-only">Department</label>
                        <select
                            id="departmentId"
                            name="departmentId"
                            value={formData.departmentId || ''}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="" disabled>Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.nameUz} (ID: {dept.id})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 text-white font-medium rounded-lg shadow-md transition duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 focus:ring-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                        Register Staff User
                    </button>
                </div>
            </form>
        </div>
    );
}

UserRegistrationForm.propTypes = {
    formData: PropTypes.shape({
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        middleName: PropTypes.string,
        departmentId: PropTypes.number,
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleRegisterSubmit: PropTypes.func.isRequired,
    departments: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            nameUz: PropTypes.string.isRequired,
            nameEn: PropTypes.string.isRequired,
            nameRu: PropTypes.string.isRequired,
        })
    ).isRequired,
};
