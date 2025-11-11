import PropTypes from 'prop-types';
import { DEPARTMENT_TYPE_LIST } from '@/configs/constants';

export default function DepartmentForm({ formData, editingId, onChange, onSubmit, onCancel }) {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onChange((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    return (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                {editingId ? "✍️ Edit Department" : "➕ Add New Department"}
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="depType" className="block text-sm font-medium text-gray-700">
                            Department Type
                        </label>
                        <select
                            id="depType"
                            name="depType"
                            value={formData.depType}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            {DEPARTMENT_TYPE_LIST.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {["Uz", "En", "Ru"].map((lang) => (
                        <input
                            key={`name${lang}`}
                            type="text"
                            name={`name${lang}`}
                            placeholder={`Name (${lang})`}
                            value={formData[`name${lang}`]}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isBlocked"
                            name="isBlocked"
                            checked={formData.isBlocked}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isBlocked" className="ml-2 text-sm font-medium text-gray-700">
                            Is Blocked
                        </label>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            className={`px-4 py-2 text-white font-medium rounded-lg shadow-md transition duration-150 ease-in-out ${editingId
                                    ? "bg-yellow-500 hover:bg-yellow-600"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {editingId ? "Update Department" : "Create Department"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg shadow-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}

DepartmentForm.propTypes = {
    formData: PropTypes.shape({
        depType: PropTypes.string.isRequired,
        nameUz: PropTypes.string.isRequired,
        nameEn: PropTypes.string.isRequired,
        nameRu: PropTypes.string.isRequired,
        isBlocked: PropTypes.bool.isRequired,
    }).isRequired,
    editingId: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};
