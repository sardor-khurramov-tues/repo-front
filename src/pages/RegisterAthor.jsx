// src/pages/RegisterAuthor.jsx (assuming you put it in a pages directory)

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAuthor } from "../services/api/UserService";

export default function RegisterAuthor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    hemisId: "",
    firstName: "",
    lastName: "",
    middleName: "",
    orcid: "",
    ror: "",
    departmentId: "", // Will be a string for input, converted to Long/number on submit
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Simple client-side validation for required fields
    const requiredFields = ["email", "firstName", "lastName"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in the required field: ${field}`);
        return;
      }
    }

    setLoading(true);
    // Prepare the data for the API call
    const payload = {
      ...formData,
      // Ensure departmentId is converted to a number (Long on backend)
      departmentId: Number.parseInt(formData.departmentId, 10),
      // Optional fields converting empty strings to null for cleanup
      hemisId: formData.hemisId || null,
      middleName: formData.middleName || null,
      orcid: formData.orcid || null,
      ror: formData.ror || null,
    };

    // Use for...of to iterate over keys and delete null properties (Fixing SonarQube S7728)
    for (const key of Object.keys(payload)) {
      if (payload[key] === null) {
        delete payload[key];
      }
    }

    try {
      await registerAuthor(payload);
      setSuccess("Registration successful! You can now log in.");
      // Optionally clear the form after success
      setFormData({
        email: "", hemisId: "", firstName: "", lastName: "", middleName: "",
        orcid: "", ror: "", departmentId: ""
      });
      // Optionally navigate to login after a delay
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Registration failed:", err);
      // Attempt to get a more specific error message from the API response
      const apiErrorMessage = err.response?.data?.message || "An unexpected error occurred during registration.";
      setError(apiErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Author Registration
        </h2>

        {success && (
          <div className="mb-4 rounded-md bg-green-100 px-4 py-2 text-sm text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleRegistration} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* First Name (Required, max 63) */}
            <div>
              <label htmlFor="firstName" className={labelClass}>First Name <span className="text-red-500">*</span></label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
                maxLength={63}
                className={inputClass}
                placeholder="John"
              />
            </div>

            {/* Last Name (Required, max 63) */}
            <div>
              <label htmlFor="lastName" className={labelClass}>Last Name <span className="text-red-500">*</span></label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
                maxLength={63}
                className={inputClass}
                placeholder="Doe"
              />
            </div>

            {/* Middle Name (Optional, max 63) */}
            <div>
              <label htmlFor="middleName" className={labelClass}>Middle Name</label>
              <input
                id="middleName"
                name="middleName"
                type="text"
                value={formData.middleName}
                onChange={handleChange}
                maxLength={63}
                className={inputClass}
                placeholder="Smith (Optional)"
              />
            </div>

            {/* Email (Required, Email format, max 127) */}
            <div>
              <label htmlFor="email" className={labelClass}>Email <span className="text-red-500">*</span></label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                maxLength={127}
                className={inputClass}
                placeholder="you@university.com"
              />
            </div>

            {/* Department ID (Optional, Number/Long) */}
            <div>
              <label htmlFor="departmentId" className={labelClass}>Department ID</label>
              <input
                id="departmentId"
                name="departmentId"
                type="number"
                value={formData.departmentId}
                onChange={handleChange}
                min="1" // Assuming IDs start from 1
                className={inputClass}
                placeholder="e.g., 42"
              />
            </div>

            {/* HEMIS ID (Optional, max 31) */}
            <div>
              <label htmlFor="hemisId" className={labelClass}>HEMIS ID</label>
              <input
                id="hemisId"
                name="hemisId"
                type="text"
                value={formData.hemisId}
                onChange={handleChange}
                maxLength={31}
                className={inputClass}
                placeholder="e.g., U1812345 (Optional)"
              />
            </div>

            {/* ORCID (Optional, Pattern: 0000-0000-0000-0000) */}
            <div>
              <label htmlFor="orcid" className={labelClass}>ORCID</label>
              <input
                id="orcid"
                name="orcid"
                type="text"
                value={formData.orcid}
                onChange={handleChange}
                maxLength={19}
                pattern="\d{4}-\d{4}-\d{4}-\d{3}[0-9X]" // Basic client-side ORCID check
                className={inputClass}
                placeholder="0000-0000-0000-0000 (Optional)"
              />
            </div>

            {/* ROR (Optional, Pattern: 0a-hj-km-np-tv-z0-9{6}00) */}
            <div>
              <label htmlFor="ror" className={labelClass}>ROR ID</label>
              <input
                id="ror"
                name="ror"
                type="text"
                value={formData.ror}
                onChange={handleChange}
                maxLength={9}
                // ROR pattern is complex, rely on backend or add a more robust check later.
                // For now, simple text input.
                className={inputClass}
                placeholder="08pqpwd24 (Optional)"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign In
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}