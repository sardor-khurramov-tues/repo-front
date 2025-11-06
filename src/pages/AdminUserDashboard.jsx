import React, { useState, useEffect, useCallback } from "react";
import {
  searchUsers,
  registerStaff,
  blockUser,
  deleteUser,
  resetPassword,
} from "../services/api/AdminUserService";
import { getPublicDepartmentNonBlocked } from "../services/api/PublicService";

import DashboardLayout from "../components/dashboards/DashboardLayout";
import UserRegistrationForm from "../components/dashboards/user/UserRegistrationForm";
import UsersTable from "../components/dashboards/user/UsersTable";
import PasswordResetModal from "../components/dashboards/user/PasswordResetModal";

import { INITIAL_USER_FORM_DATA, LIST_LIMIT, USER_ROLE_FILTER_LIST, USER_ROLE_FILTER_OPTIONS} from "../configs/constants";

export default function AdminUserDashboard() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState(INITIAL_USER_FORM_DATA);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState(USER_ROLE_FILTER_OPTIONS.ALL);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  // Function to fetch users based on current search state
  const fetchUsers = useCallback(async (key, role, page) => {
    try {
      setLoading(true);
      const roleToSearch = role === USER_ROLE_FILTER_OPTIONS.ALL ? undefined : role;
      const data = await searchUsers(key, roleToSearch, LIST_LIMIT, page);
      setUsers(data.clientList || []);
      setTotalCount(data.totalCount);
      setPageCount(data.pageCount);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setMessage("❌ Failed to fetch users.");
      setUsers([]);
      setTotalCount(0);
      setPageCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. Initial Load: Fetch Departments & Initial Users
  useEffect(() => {
    const loadData = async () => {
      try {
        const deptData = await getPublicDepartmentNonBlocked();
        setDepartments(deptData);
        if (deptData.length > 0) {
          setFormData((prev) => ({ ...prev, departmentId: deptData[0].id }));
        }
        await fetchUsers(searchKey, userRoleFilter, currentPage);
      } catch (error) {
        console.error("Initial load failed:", error);
        setMessage("❌ Failed to load initial data (Users or Departments).");
        setLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  // 2. Fetch users whenever the search key or page changes
  useEffect(() => {
    fetchUsers(searchKey, userRoleFilter, currentPage);
  }, [searchKey, userRoleFilter, currentPage, fetchUsers]);

  // --- Form Handlers ---

  const handleRoleFilterChange = (role) => {
    setUserRoleFilter(role);
    setCurrentPage(0); // Reset to first page on new role filter
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "departmentId" ? Number(value) : value,
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !formData.username ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName ||
      formData.departmentId === null
    ) {
      setMessage("❌ Username, Password, First Name, Last Name, and Department are required.");
      return;
    }

    try {
      await registerStaff(formData);
      setMessage("✅ Staff user registered successfully.");
      setFormData(prev => ({ ...INITIAL_USER_FORM_DATA, departmentId: departments[0]?.id || null }));
      fetchUsers(searchKey, currentPage);
    } catch (error) {
      console.error("Error registering user:", error);
      const errorMessage = error.response?.data?.message || "Registration failed.";
      setMessage(`❌ Error: ${errorMessage}`);
    }
  };

  // --- User Action Handlers ---

  const handleDelete = async (id, username) => {
    if (globalThis.confirm(`Are you sure you want to delete user: ${username} (ID: ${id})?`)) {
      try {
        await deleteUser(id);
        setMessage(`✅ User ${username} deleted successfully.`);
        fetchUsers(searchKey, currentPage);
      } catch (error) {
        console.error("Error deleting user:", error);
        setMessage("❌ Failed to delete user.");
      }
    }
  };

  const handleToggleBlock = async (user) => {
    const newBlockStatus = !user.isBlocked;
    const action = newBlockStatus ? "block" : "unblock";
    if (globalThis.confirm(`Are you sure you want to ${action} user: ${user.username}?`)) {
      try {
        await blockUser(user.id, newBlockStatus);
        setMessage(`✅ User ${user.username} successfully ${action}ed.`);
        fetchUsers(searchKey, currentPage);
      } catch (error) {
        console.error(`Error ${action}ing user:`, error);
        setMessage(`❌ Failed to ${action} user.`);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageCount) {
      setCurrentPage(newPage);
    }
  };

  // --- Password Reset Handlers ---

  const openPasswordModal = (user) => {
    setUserToReset(user);
    setNewPassword("");
    // Clear any previous error before opening the modal
    if (message.startsWith("❌")) setMessage("");
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setUserToReset(null);
    setNewPassword("");
    setShowPasswordModal(false);
    // Clear the message after closing the modal, regardless of success/fail
    setMessage("");
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!newPassword || newPassword.length < 8 || newPassword.length > 64 || /\s/.test(newPassword)) {
      setMessage("❌ Password must be between 8 and 64 characters and contain no spaces.");
      return;
    }

    try {
      await resetPassword(userToReset.id, newPassword);
      // Set success message on the main dashboard after API call
      setMessage(`✅ Password for ${userToReset.username} successfully reset.`);
      closePasswordModal();
    } catch (error) {
      console.error("Error resetting password:", error);
      // Set error message to be displayed *in the modal*
      setMessage("❌ Failed to reset password.");
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-blue-600">Loading...</p>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="User Management Dashboard"
      icon="👤"
      message={message}
    >
      <UserRegistrationForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleRegisterSubmit={handleRegisterSubmit}
        departments={departments}
      />

      <UsersTable
        users={users}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        userRoleFilter={userRoleFilter}
        setUserRoleFilter={handleRoleFilterChange}
        userRoles={USER_ROLE_FILTER_LIST}
        setCurrentPage={setCurrentPage}
        totalCount={totalCount}
        currentPage={currentPage}
        pageCount={pageCount}
        handlePageChange={handlePageChange}
        handleToggleBlock={handleToggleBlock}
        openPasswordModal={openPasswordModal}
        handleDelete={handleDelete}
      />

      {showPasswordModal && (
        <PasswordResetModal
          userToReset={userToReset}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          closePasswordModal={closePasswordModal}
          handlePasswordReset={handlePasswordReset}
          message={message}
        />
      )}
    </DashboardLayout>
  );
}
