import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.userRole)) {
    return <Navigate to="/" />;
  }

  return children;
}
