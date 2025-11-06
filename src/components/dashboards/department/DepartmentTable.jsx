import PropTypes from 'prop-types';

export default function DepartmentTable({ departments, onEdit, onDelete }) {
    if (!departments.length) {
        return <p className="p-6 text-gray-500 bg-white rounded-lg shadow">No departments found.</p>;
    }

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700 p-6 border-b">📄 Departments List</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            {["ID", "Type", "Name (Uz)", "Name (En)", "Name (Ru)", "Status", "Actions"].map(
                                (h) => (
                                    <th
                                        key={h}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {h}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {departments.map((dept) => (
                            <tr key={dept.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{dept.id}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dept.depType === "FACULTY"
                                            ? "bg-indigo-100 text-indigo-800"
                                            : "bg-teal-100 text-teal-800"
                                            }`}
                                    >
                                        {dept.depType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{dept.nameUz}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{dept.nameEn}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{dept.nameRu}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dept.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                            }`}
                                    >
                                        {dept.isBlocked ? "Blocked" : "Active"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => onEdit(dept)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(dept.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

DepartmentTable.propTypes = {
    departments: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            depType: PropTypes.string.isRequired,
            nameUz: PropTypes.string.isRequired,
            nameEn: PropTypes.string.isRequired,
            nameRu: PropTypes.string.isRequired,
            isBlocked: PropTypes.bool.isRequired,
        })
    ).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};
