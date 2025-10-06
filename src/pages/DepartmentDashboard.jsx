import { useState, useEffect } from "react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/DepartmentService";

const initialFormData = {
  nameUz: "",
  nameEn: "",
  nameRu: "",
  isBlocked: false,
};

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
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
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
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.nameUz || !formData.nameEn || !formData.nameRu) {
      setMessage("❌ All name fields are required.");
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
      setMessage(`❌ Error: ${editingId ? "Updating" : "Creating"} department failed.`);
    }
  };

  const handleEdit = (department) => {
    setEditingId(department.id);
    setFormData({
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
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
        setMessage("✅ Department deleted successfully.");
        fetchDepartments(); // Refresh the list
      } catch (error) {
        setMessage("❌ Failed to delete department.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Department Management</h1>
      
      {message && <p>{message}</p>}

      <h2>{editingId ? "Edit Department" : "Add New Department"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nameUz"
          placeholder="Name (Uzbek)"
          value={formData.nameUz}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="nameEn"
          placeholder="Name (English)"
          value={formData.nameEn}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="nameRu"
          placeholder="Name (Russian)"
          value={formData.nameRu}
          onChange={handleInputChange}
        />
        <label>
          Is Blocked:
          <input
            type="checkbox"
            name="isBlocked"
            checked={formData.isBlocked}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">{editingId ? "Update" : "Create"}</button>
        {editingId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
      </form>

      <h2>Departments List</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name (Uz)</th>
            <th>Name (En)</th>
            <th>Name (Ru)</th>
            <th>Blocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id}>
              <td>{dept.id}</td>
              <td>{dept.nameUz}</td>
              <td>{dept.nameEn}</td>
              <td>{dept.nameRu}</td>
              <td>{String(dept.isBlocked)}</td>
              <td>
                <button onClick={() => handleEdit(dept)}>Edit</button>
                <button onClick={() => handleDelete(dept.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
