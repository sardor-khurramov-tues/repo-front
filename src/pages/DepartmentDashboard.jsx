import { useState, useEffect } from "react";
import {
  getDepartmentsByAdmin,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/api/DepartmentService";

// The API now expects a depType
const initialFormData = {
  depType: "FACULTY", // Set a default value
  nameUz: "",
  nameEn: "",
  nameRu: "",
  isBlocked: false,
};

// Available department types based on your API
const DEPARTMENT_TYPES = ["FACULTY", "CONFERENCE"];

export default function DepartmentDashboard() {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null); // null for create mode, id for edit mode
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Function to fetch all departments and update state
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartmentsByAdmin();
      setDepartments(data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      setMessage("❌ Failed to fetch departments.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments on initial component load
  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Handle checkbox for boolean, otherwise use value
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validate required fields
    if (!formData.nameUz || !formData.nameEn || !formData.nameRu || !formData.depType) {
      setMessage("❌ All name fields and Department Type are required.");
      return;
    }

    try {
      if (editingId) {
        // Update existing department
        await updateDepartment(editingId, formData);
        setMessage("✅ Department updated successfully.");
      } else {
        // Create new department
        await createDepartment(formData);
        setMessage("✅ Department created successfully.");
      }
      setFormData(initialFormData); // Reset form
      setEditingId(null); // Exit edit mode
      fetchDepartments(); // Refresh the list
    } catch (error) {
      console.error("Error:", error);
      setMessage(`❌ Error: ${editingId ? "Updating" : "Creating"} department failed.`);
    }
  };

  const handleEdit = (department) => {
    setEditingId(department.id);
    // Ensure all fields, including depType, are loaded for editing
    setFormData({
      depType: department.depType || "FACULTY", // Use existing or default
      nameUz: department.nameUz,
      nameEn: department.nameEn,
      nameRu: department.nameRu,
      isBlocked: department.isBlocked,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (globalThis.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
        setMessage("✅ Department deleted successfully.");
        fetchDepartments(); // Refresh the list
      } catch (error) {
        console.error("Error:", error);
        setMessage("❌ Failed to delete department.");
      }
    }
  };

  // --- Tailwind Styles ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-blue-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        🏛️ Department Management Dashboard
      </h1>

      {/* Message Area */}
      {message && (
        <p
          className={`p-3 mb-4 rounded-lg font-medium ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message}
        </p>
      )}
      
      {/* Department Form Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {editingId ? "✍️ Edit Department" : "➕ Add New Department"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Department Type Select */}
            <div>
              <label htmlFor="depType" className="block text-sm font-medium text-gray-700">
                Department Type
              </label>
              <select
                id="depType"
                name="depType"
                value={formData.depType}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {DEPARTMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Name Fields */}
            {["Uz", "En", "Ru"].map((lang) => (
              <input
                key={`name${lang}`}
                type="text"
                name={`name${lang}`}
                placeholder={`Name (${lang})`}
                value={formData[`name${lang}`]}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            ))}
          </div>

          {/* Checkbox and Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            {/* Is Blocked Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isBlockedCheckbox"
                name="isBlocked"
                checked={formData.isBlocked}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isBlockedCheckbox" className="ml-2 block text-sm font-medium text-gray-700">
                Is Blocked
              </label>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="submit"
                className={`px-4 py-2 text-white font-medium rounded-lg shadow-md transition duration-150 ease-in-out ${
                  editingId
                    ? "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                {editingId ? "Update Department" : "Create Department"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg shadow-md hover:bg-gray-400 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Departments List Section */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 p-6 border-b">
          📄 Departments List
        </h2>
        
        {departments.length === 0 ? (
          <p className="p-6 text-gray-500">No departments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name (Uz)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name (En)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name (Ru)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dept.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            dept.depType === "FACULTY" 
                                ? "bg-indigo-100 text-indigo-800"
                                : "bg-teal-100 text-teal-800"
                        }`}>
                            {dept.depType}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {dept.nameUz}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {dept.nameEn}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {dept.nameRu}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          dept.isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {dept.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(dept)}
                        className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
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
      </div>
    </div>
  );
}
