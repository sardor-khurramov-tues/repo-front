import { useState, useEffect } from "react";
import {
  getDepartmentsByAdmin,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/api/DepartmentService";
import DashboardLayout from "../components/dashboards/DashboardLayout";
import DepartmentForm from "../components/dashboards/department/DepartmentForm";
import DepartmentTable from "../components/dashboards/department/DepartmentTable";
import { INITIAL_DEPARTMENT_FORM_DATA, DEPARTMENT_TYPES } from "../configs/constants";

export default function AdminDepartmentDashboard() {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState(INITIAL_DEPARTMENT_FORM_DATA);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.nameUz || !formData.nameEn || !formData.nameRu || !formData.depType) {
      setMessage("❌ All name fields and Department Type are required.");
      return;
    }

    try {
      if (editingId) {
        await updateDepartment(editingId, formData);
        setMessage("✅ Department updated successfully.");
      } else {
        await createDepartment(formData);
        setMessage("✅ Department created successfully.");
      }
      setFormData(INITIAL_DEPARTMENT_FORM_DATA);
      setEditingId(null);
      fetchDepartments();
    } catch (error) {
      console.error("Error:", error);
      setMessage(`❌ Error: ${editingId ? "Updating" : "Creating"} department failed.`);
    }
  };

  const handleEdit = (dept) => {
    setEditingId(dept.id);
    setFormData({
      depType: dept.depType || DEPARTMENT_TYPES.FACULTY,
      nameUz: dept.nameUz,
      nameEn: dept.nameEn,
      nameRu: dept.nameRu,
      isBlocked: dept.isBlocked,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(INITIAL_DEPARTMENT_FORM_DATA);
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
        setMessage("✅ Department deleted successfully.");
        fetchDepartments();
      } catch (error) {
        console.error("Error:", error);
        setMessage("❌ Failed to delete department.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-blue-600">Loading...</p>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Department Management Dashboard"
      icon="🏛️"
      message={message}
    >
      <DepartmentForm
        formData={formData}
        editingId={editingId}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
      />

      <DepartmentTable
        departments={departments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  );
}
