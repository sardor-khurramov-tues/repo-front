import { useState, useEffect } from "react";
import { updateUserInStorage, updateUserDetails, updateUserPassword } from "../services/UserService";

export default function UserPage() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    hemisId: user?.hemisId || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    middleName: user?.middleName || "",
    departmentId: user?.departmentId || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAndUpdateUser = async () => {
      setLoading(true);
      const updatedUser = await updateUserInStorage();
      if (updatedUser) {
        setUser(updatedUser);
        setFormData({
          hemisId: updatedUser.hemisId || "",
          firstName: updatedUser.firstName || "",
          lastName: updatedUser.lastName || "",
          middleName: updatedUser.middleName || "",
          departmentId: updatedUser.departmentId || "",
        });
      }
      setLoading(false);
    };

    fetchAndUpdateUser();
  }, []);

  const handleDetailsChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.firstName.trim()) {
      setMessage("❌ First name is required.");
      return;
    }
    if (formData.firstName.length > 63) {
      setMessage("❌ First name must be at most 63 characters.");
      return;
    }

    if (!formData.lastName.trim()) {
      setMessage("❌ Last name is required.");
      return;
    }
    if (formData.lastName.length > 63) {
      setMessage("❌ Last name must be at most 63 characters.");
      return;
    }

    if (formData.hemisId && formData.hemisId.length > 31) {
      setMessage("❌ Hemis ID must be at most 31 characters.");
      return;
    }

    if (formData.middleName && formData.middleName.length > 63) {
      setMessage("❌ Middle name must be at most 63 characters.");
      return;
    }

    if (formData.departmentId && isNaN(formData.departmentId)) {
      setMessage("❌ Department ID must be a number.");
      return;
    }

    try {
      const updatedUser = await updateUserDetails(formData);
      setUser(updatedUser);
      setMessage("✅ User details updated successfully.");
    } catch {
      setMessage("❌ Failed to update user details.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserPassword(passwordData);
      setMessage("✅ Password updated successfully.");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch {
      setMessage("❌ Failed to update password.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Info</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <h2>Update Details</h2>
      <form onSubmit={handleDetailsSubmit}>
        <input
          type="text"
          name="hemisId"
          placeholder="Hemis ID"
          value={formData.hemisId}
          onChange={handleDetailsChange}
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleDetailsChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleDetailsChange}
        />
        <input
          type="text"
          name="middleName"
          placeholder="Middle Name"
          value={formData.middleName}
          onChange={handleDetailsChange}
        />
        <input
          type="number"
          name="departmentId"
          placeholder="Department ID"
          value={formData.departmentId}
          onChange={handleDetailsChange}
        />
        <button type="submit">Update Details</button>
      </form>

      <h2>Update Password</h2>
      <form onSubmit={handlePasswordSubmit}>
        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={passwordData.oldPassword}
          onChange={handlePasswordChange}
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
        />
        <button type="submit">Update Password</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
