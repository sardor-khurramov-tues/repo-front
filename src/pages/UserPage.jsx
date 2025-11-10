import { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import MessageComp from '../components/commons/MessageComp';
import {
  updateUserInStorage,
  updateUserDetails,
  updateUserPassword
} from "../services/api/UserService";
import { getPublicFacultyNonBlocked } from "../services/api/PublicService"; // Imported service
import { ORCID_REGEX, ROR_REGEX } from "../configs/constants";

// Function to initialize user state from localStorage
const getInitialUserState = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

// --- Custom Hook for User Data Logic (Best Practice) ---
const useUserData = () => {
  const [user, setUser] = useState(getInitialUserState);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  
  // NEW STATE: Departments data
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [departmentsError, setDepartmentsError] = useState(null);


  const [formData, setFormData] = useState(() => {
    const initialUser = getInitialUserState();
    return {
      hemisId: initialUser?.hemisId || "",
      firstName: initialUser?.firstName || "",
      lastName: initialUser?.lastName || "",
      middleName: initialUser?.middleName || "",
      orcid: initialUser?.orcid || "",
      ror: initialUser?.ror || "",
      // Use an empty string "" if departmentId is null for the input/select field
      departmentId: initialUser?.departmentId === null ? "" : initialUser?.departmentId || "",
    };
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // Helper function to update form state based on a new user object
  const syncFormData = (updatedUser) => {
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
  };

  // Effect 1: Fetch and update user data on mount
  useEffect(() => {
    const fetchAndUpdateUser = async () => {
      setLoading(true);
      try {
        const updatedUser = await updateUserInStorage();
        syncFormData(updatedUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndUpdateUser();
  }, []);

  // Effect 2: Fetch Department data on mount
  useEffect(() => {
    const fetchDepartments = async () => {
        try {
            setDepartmentsLoading(true);
            const data = await getPublicFacultyNonBlocked();
            setDepartments(data);
            setDepartmentsError(null);
        } catch (err) {
            console.error("Failed to fetch departments:", err);
            setDepartmentsError("Could not load departments for selection.");
        } finally {
            setDepartmentsLoading(false);
        }
    };

    fetchDepartments();
  }, []); // Run once on mount

  // Handlers for input changes
  const handleDetailsChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  // Validation Logic (Kept outside component/hook render cycle)
  const validateFormData = (data) => {
    // Name validations remain the same
    if (!data.firstName.trim() || data.firstName.length > 63) {
      return "❌ First name is required and must be at most 63 characters.";
    }
    if (!data.lastName.trim() || data.lastName.length > 63) {
      return "❌ Last name is required and must be at most 63 characters.";
    }

    if (data.hemisId && data.hemisId.length > 31) {
      return "❌ Hemis ID must be at most 31 characters.";
    }
    if (data.middleName && data.middleName.length > 63) {
      return "❌ Middle name must be at most 63 characters.";
    }

    if (data.orcid && (!ORCID_REGEX.test(data.orcid) || data.orcid.length > 19)) {
      return "❌ ORCID must be in the format XXXX-XXXX-XXXX-XXXX (X can be 0-9 or X for the last digit) and at most 19 characters.";
    }

    if (data.ror) {
      if (!ROR_REGEX.test(data.ror) || data.ror.length > 9) {
        return "❌ ROR must be in the format 0xxxxxxXX (alphanumeric, 9 characters total).";
      }
    }

    // Department ID validation is simplified since it comes from a select menu
    const departmentIdValue = data.departmentId;
    if (departmentIdValue !== "") {
        if (Number.isNaN(Number(departmentIdValue)) || Number(departmentIdValue) < 1) {
            return "❌ Selected Department ID must be a valid positive number.";
        }
    }

    return null; // All checks passed
  };

  // Submission Handlers
  const handleDetailsSubmit = useCallback(async (e) => {
    e.preventDefault();
    setMessage("");

    const validationError = validateFormData(formData);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    // Data Preparation: Convert empty strings to null
    const dataToSend = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      hemisId: formData.hemisId.trim() || null,
      middleName: formData.middleName.trim() || null,
      orcid: formData.orcid.trim() || null,
      ror: formData.ror.trim() || null,
      // Convert "" from select to null, otherwise convert to Number
      departmentId: formData.departmentId === "" ? null : Number(formData.departmentId),
    };

    try {
      const updatedUser = await updateUserDetails(dataToSend);
      syncFormData(updatedUser); // Update state/form data with fresh user info
      setMessage("✅ User details updated successfully.");
    } catch (error) {
      console.error("Update details failed:", error);
      const apiErrorMessage = error.response?.data?.message || "❌ Failed to update user details. Please check your input and try again.";
      setMessage(apiErrorMessage);
    }
  }, [formData]);

  const handlePasswordSubmit = useCallback(async (e) => {
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
      console.error("Update password failed:", error);
      const apiErrorMessage = error.response?.data?.message || "❌ Failed to update password. Check your current password.";
      setMessage(apiErrorMessage);
    }
  }, [passwordData]);

  return {
    user,
    loading,
    message,
    formData,
    passwordData,
    departments, // Expose departments data
    departmentsLoading, // Expose loading state
    departmentsError, // Expose error state
    handleDetailsChange,
    handlePasswordChange,
    handleDetailsSubmit,
    handlePasswordSubmit,
  };
};

// --- Sub-components for Form Presentation (Best Practice) ---

/**
 * @param {object} props
 * @param {object} props.formData
 * @param {function} props.handleDetailsChange
 * @param {function} props.handleDetailsSubmit
 * @param {Array<object>} props.departments
 * @param {boolean} props.departmentsLoading
 * @param {string | null} props.departmentsError
 */
function DetailsForm({
    formData,
    handleDetailsChange,
    handleDetailsSubmit,
    departments,
    departmentsLoading,
    departmentsError,
}) {
  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const buttonClass = "w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition duration-200 ease-in-out bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50";

  // Field configuration for cleaner JSX/DRY principle
  const fields = [
    { id: "firstName", label: "First Name *", type: "text", name: "firstName", maxLength: "63", required: true, placeholder: "First Name" },
    { id: "lastName", label: "Last Name *", type: "text", name: "lastName", maxLength: "63", required: true, placeholder: "Last Name" },
    { id: "middleName", label: "Middle Name (Optional)", type: "text", name: "middleName", maxLength: "63", placeholder: "Middle Name", fullWidth: true },
    { id: "hemisId", label: "Hemis ID (Optional)", type: "text", name: "hemisId", maxLength: "31", placeholder: "Hemis ID" },
    { id: "departmentId", label: "Department (Optional)", type: "select", name: "departmentId", placeholder: "Select Department" }, // Type changed to 'select'
    { id: "orcid", label: "ORCID (XXXX-XXXX-XXXX-XXXX) (Optional)", type: "text", name: "orcid", maxLength: "19", pattern: ORCID_REGEX.source, title: "Format: XXXX-XXXX-XXXX-XXXX", placeholder: "ORCID" },
    { id: "ror", label: "ROR (0xxxxxxXX) (Optional)", type: "text", name: "ror", maxLength: "9", pattern: ROR_REGEX.source, title: "Format: 0xxxxxxXX (9 chars total)", placeholder: "ROR" },
  ];

  const fieldGroups = [
    {
      key: "name-fields", // Stable string key
      fields: [fields[0], fields[1]]
    },
    {
      key: "id-fields", // Stable string key
      // Replaced departmentId input with its select component
      fields: [fields[3], fields[4]] 
    },
    {
      key: "identifier-fields", // Stable string key
      fields: [fields[5], fields[6]]
    }
  ];

  const middleNameField = fields[2];

  // Helper function to render input or select
  const renderField = (field) => {
    if (field.type === 'select') {
        return (
            <select
                id={field.id}
                name={field.name}
                value={formData[field.name]}
                onChange={handleDetailsChange}
                className={inputClass}
                disabled={departmentsLoading || departmentsError}
            >
                <option value="">
                    {departmentsLoading ? "Loading departments..." : departmentsError ? "Error loading departments" : "Select your department (Optional)"}
                </option>
                {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                        {/* Use English name primarily */}
                        {department.nameEn || department.nameUz || `ID: ${department.id}`}
                    </option>
                ))}
            </select>
        );
    }
    
    // Default: render regular input
    return (
        <input
            id={field.id}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleDetailsChange}
            className={inputClass}
            {...(field.required && { required: true })}
            {...(field.maxLength && { maxLength: field.maxLength })}
            {...(field.min && { min: field.min })}
            {...(field.pattern && { pattern: field.pattern })}
            {...(field.title && { title: field.title })}
        />
    );
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-800 mb-5">Update Details</h2>
      
      {/* Show department fetch error if it exists */}
      {departmentsError && (
          <div className="mb-4 text-sm text-red-700 p-3 bg-red-100 border border-red-200 rounded-lg">
            ⚠️ {departmentsError}
          </div>
      )}

      <form onSubmit={handleDetailsSubmit} className="space-y-4">

        {/* Grouped Fields */}
        {fieldGroups.map((group) => (
          <div key={group.key} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {group.fields.map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className={labelClass}>{field.label}</label>
                {renderField(field)}
              </div>
            ))}
          </div>
        ))}

        {/* Middle Name (Full Width) */}
        <div>
          <label htmlFor={middleNameField.id} className={labelClass}>{middleNameField.label}</label>
          <input
            id={middleNameField.id}
            type={middleNameField.type}
            name={middleNameField.name}
            placeholder={middleNameField.placeholder}
            value={formData[middleNameField.name]}
            onChange={handleDetailsChange}
            className={inputClass}
            maxLength={middleNameField.maxLength}
          />
        </div>

        <button 
          type="submit" 
          className={buttonClass}
          disabled={departmentsLoading} // Disable button if departments are still loading
        >
          Save Details
        </button>
      </form>
    </section>
  );
}

/**
 * @param {object} props
 * @param {object} props.passwordData
 * @param {function} props.handlePasswordChange
 * @param {function} props.handlePasswordSubmit
 */
function PasswordForm({ passwordData, handlePasswordChange, handlePasswordSubmit }) {
  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const buttonClass = "w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition duration-200 ease-in-out bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50";

  return (
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

        <button type="submit" className={buttonClass}>
          Change Password
        </button>
      </form>
    </section>
  );
}

// --- Main Component (Container) ---
export default function UserPage() {
  const {
    loading,
    message,
    formData,
    passwordData,
    departments, // Passed down
    departmentsLoading, // Passed down
    departmentsError, // Passed down
    handleDetailsChange,
    handlePasswordChange,
    handleDetailsSubmit,
    handlePasswordSubmit,
  } = useUserData();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-blue-600">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-2">User Profile Management</h1>

        {/* Use the MessageComp */}
        <MessageComp message={message} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <DetailsForm
            formData={formData}
            handleDetailsChange={handleDetailsChange}
            handleDetailsSubmit={handleDetailsSubmit}
            departments={departments} // Pass departments data
            departmentsLoading={departmentsLoading} // Pass loading status
            departmentsError={departmentsError} // Pass error status
          />
          <PasswordForm
            passwordData={passwordData}
            handlePasswordChange={handlePasswordChange}
            handlePasswordSubmit={handlePasswordSubmit}
          />
        </div>
      </div>
    </div>
  );
}

// --- Prop Types Updates ---

DetailsForm.propTypes = {
  formData: PropTypes.object.isRequired,
  handleDetailsChange: PropTypes.func.isRequired,
  handleDetailsSubmit: PropTypes.func.isRequired,
  departments: PropTypes.array.isRequired, // Added
  departmentsLoading: PropTypes.bool.isRequired, // Added
  departmentsError: PropTypes.string, // Added
};

PasswordForm.propTypes = {
  passwordData: PropTypes.object.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  handlePasswordSubmit: PropTypes.func.isRequired,
};
