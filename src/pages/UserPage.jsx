import { useState, useEffect } from "react";
import { updateUserInStorage, updateUserDetails, updateUserPassword } from "../services/api/UserService";

// Regular expressions for new fields based on DTO
const ORCID_REGEX = /^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/;
const ROR_REGEX = /^0[a-hj-km-np-tv-z0-9]{6}\d{2}$/;

export default function UserPage() {
  // Initialize user state from localStorage; uses optional chaining for safe access
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Initialize form data with new orcid and ror fields
  const [formData, setFormData] = useState({
    hemisId: user?.hemisId || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    middleName: user?.middleName || "",
    orcid: user?.orcid || "",
    ror: user?.ror || "",
    // Use an empty string "" if departmentId is null or 0, for the input field
    departmentId: user?.departmentId === null ? "" : user?.departmentId || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // Effect to fetch and update user data on mount
  useEffect(() => {
    const fetchAndUpdateUser = async () => {
      setLoading(true);
      try {
        const updatedUser = await updateUserInStorage();
        if (updatedUser) {
          setUser(updatedUser);
          setFormData({
            hemisId: updatedUser.hemisId || "",
            firstName: updatedUser.firstName || "",
            lastName: updatedUser.lastName || "",
            middleName: updatedUser.middleName || "",
            orcid: updatedUser.orcid || "",
            ror: updatedUser.ror || "",
            departmentId: updatedUser.departmentId === null ? "" : updatedUser.departmentId || "",
          });
        }
      } catch (error) {
        console.log(error);
        // Error handling inside updateUserInStorage already redirects/logs
      } finally {
        setLoading(false);
      }
    };

    fetchAndUpdateUser();
  }, []);

  const handleDetailsChange = (e) => {
    // Note: For departmentId (type="number"), e.target.value is always a string, 
    // including the empty string when the input is cleared.
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // -----------------------
  // VALIDATION AND SUBMISSION
  // -----------------------

  const validateFormData = (formData) => {
    // Required fields
    if (!formData.firstName.trim() || formData.firstName.length > 63) {
      return "❌ First name is required and must be at most 63 characters.";
    }
    if (!formData.lastName.trim() || formData.lastName.length > 63) {
      return "❌ Last name is required and must be at most 63 characters.";
    }

    // Optional fields length checks
    if (formData.hemisId && formData.hemisId.length > 31) {
      return "❌ Hemis ID must be at most 31 characters.";
    }
    if (formData.middleName && formData.middleName.length > 63) {
      return "❌ Middle name must be at most 63 characters.";
    }

    // --- ORCID validation: Flattened to remove nesting penalty ---
    if (formData.orcid && (!ORCID_REGEX.test(formData.orcid) || formData.orcid.length > 19)) {
      return "❌ ORCID must be in the format XXXX-XXXX-XXXX-XXXX (X can be 0-9 or X for the last digit) and at most 19 characters.";
    }
    // -----------------------------------------------------------------

    // --- ROR validation: Flattened and combined to remove nesting penalty ---
    if (formData.ror) {
      if (!ROR_REGEX.test(formData.ror)) {
        return "❌ ROR must be in the format 0xxxxxxXX (alphanumeric, 9 characters total).";
      }
      // This check was previously nested, but can remain flat here, or be combined above
      if (formData.ror.length > 9) {
        return "❌ ROR must be at most 9 characters.";
      }
    }
    // -------------------------------------------------------------------------

    // Department ID validation
    const departmentIdValue = formData.departmentId;
    if (departmentIdValue !== "" && (Number.isNaN(Number(departmentIdValue)) || Number(departmentIdValue) < 0)) {
      return "❌ Department ID must be a valid positive number.";
    }

    return null; // All checks passed
  };
  /**
   * Main handler function.
   * Cognitive Complexity: 4 (reduced from 20)
   */
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // --- Validation (Moved to helper) ---
    const validationError = validateFormData(formData);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    // --- Data Preparation: Convert empty strings to null ---
    const dataToSend = {
      firstName: formData.firstName,
      lastName: formData.lastName,

      // Optional fields: Use the nullish coalescing operator for conciseness (if the trimmed value is falsy/empty, use null)
      hemisId: formData.hemisId.trim() || null,
      middleName: formData.middleName.trim() || null,
      orcid: formData.orcid.trim() || null,
      ror: formData.ror.trim() || null,

      // Department ID: Convert "" to null, otherwise convert to Number
      departmentId: formData.departmentId === "" ? null : Number(formData.departmentId),
    };

    // --- API Call ---
    try {
      const updatedUser = await updateUserDetails(dataToSend);
      setUser(updatedUser);
      setMessage("✅ User details updated successfully.");
    } catch (error) {
      console.log(error);
      setMessage("❌ Failed to update user details. Please check your input and try again.");
    }
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setMessage("❌ Both old and new passwords are required.");
      return;
    }

    try {
      await updateUserPassword(passwordData);
      setMessage("✅ Password updated successfully.");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      console.log(error);
      setMessage("❌ Failed to update password. Check your current password.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-blue-600">Loading user data...</div>
      </div>
    );
  }

  // -----------------------
  // RENDER WITH TAILWIND CSS
  // -----------------------

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const buttonClass = "w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition duration-200 ease-in-out";

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-2">User Profile Management</h1>

        {/* Message Alert */}
        {message && (
          <p className={`p-3 rounded-lg text-sm font-medium mb-6 ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Update Details Form */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-5">Update Details</h2>
            <form onSubmit={handleDetailsSubmit} className="space-y-4">

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className={labelClass}>First Name *</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleDetailsChange}
                    className={inputClass}
                    required
                    maxLength="63"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClass}>Last Name *</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleDetailsChange}
                    className={inputClass}
                    required
                    maxLength="63"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="middleName" className={labelClass}>Middle Name (Optional)</label>
                <input
                  id="middleName"
                  type="text"
                  name="middleName"
                  placeholder="Middle Name"
                  value={formData.middleName}
                  onChange={handleDetailsChange}
                  className={inputClass}
                  maxLength="63"
                />
              </div>

              {/* Identifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hemisId" className={labelClass}>Hemis ID (Optional)</label>
                  <input
                    id="hemisId"
                    type="text"
                    name="hemisId"
                    placeholder="Hemis ID"
                    value={formData.hemisId}
                    onChange={handleDetailsChange}
                    className={inputClass}
                    maxLength="31"
                  />
                </div>
                <div>
                  <label htmlFor="departmentId" className={labelClass}>Department ID (Optional)</label>
                  <input
                    id="departmentId"
                    type="number"
                    name="departmentId"
                    placeholder="Department ID"
                    value={formData.departmentId}
                    onChange={handleDetailsChange}
                    className={inputClass}
                    min="0"
                  />
                </div>
              </div>

              {/* New Fields: ORCID and ROR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="orcid" className={labelClass}>ORCID (XXXX-XXXX-XXXX-XXXX) (Optional)</label>
                  <input
                    id="orcid"
                    type="text"
                    name="orcid"
                    placeholder="ORCID"
                    value={formData.orcid}
                    onChange={handleDetailsChange}
                    className={inputClass}
                    pattern={ORCID_REGEX.source}
                    title="Format: XXXX-XXXX-XXXX-XXXX"
                    maxLength="19"
                  />
                </div>
                <div>
                  <label htmlFor="ror" className={labelClass}>ROR (0xxxxxxXX) (Optional)</label>
                  <input
                    id="ror"
                    type="text"
                    name="ror"
                    placeholder="ROR"
                    value={formData.ror}
                    onChange={handleDetailsChange}
                    className={inputClass}
                    pattern={ROR_REGEX.source}
                    title="Format: 0xxxxxxXX (9 chars total)"
                    maxLength="9"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`${buttonClass} bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50`}
              >
                Save Details
              </button>
            </form>
          </section>
          {/* ----------------------- */}
          {/* Update Password Form */}
          {/* ----------------------- */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-5">Update Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="oldPassword" className={labelClass}>Old Password</label>
                <input
                  id="oldPassword"
                  type="password"
                  name="oldPassword"
                  placeholder="Old Password"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className={labelClass}>New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={inputClass}
                  required
                />
              </div>

              <button
                type="submit"
                className={`${buttonClass} bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50`}
              >
                Change Password
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
