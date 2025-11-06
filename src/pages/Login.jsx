import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authenticate } from "../services/api/AuthService";
import { PATHS, USER_ROLES } from "../configs/constants";

export default function Login() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const { username, password } = credentials;

    try {
      const userRole = await authenticate(username, password);

      switch (userRole) {
        case USER_ROLES.ADMIN:
          navigate(PATHS.ADMIN);
          break;
        case USER_ROLES.STAFF:
          navigate(PATHS.STAFF);
          break;
        case USER_ROLES.AUTHOR:
          navigate(PATHS.AUTHOR);
          break;
        default:
          navigate(PATHS.USER);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl"> {/* 🌟 Softer rounded-xl and deeper shadow-2xl */}
        <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-900"> {/* 🌟 Larger, bolder title */}
          Sign In
        </h2>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 border border-red-200"> {/* Enhanced error box */}
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6"> {/* Increased spacing */}
          {/* ... (Username Input) ... */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={credentials.username}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          {/* ... (Password Input) ... */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Secure Sign In
          </button>
        </form>

        {/* 🌟 New Modern Registration Call-to-Action */}
        <div className="mt-6 text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Interested in becoming an author?
            <Link
              to="/register-author"
              className="ml-2 font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
            >
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
