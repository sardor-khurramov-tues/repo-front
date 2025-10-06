import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function NavBar() {
  const navigate = useNavigate();
  // Re-render will be triggered by navigation, so we can check localStorage directly.
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      // Notify the server to invalidate tokens
      await API.post("/sign-out");
    } catch (error) {
      console.error("Failed to sign out on server:", error);
      // Still proceed with client-side cleanup
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // Assuming token is stored
      navigate("/");
      window.location.reload(); // Force reload to clear all application state
    }
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      &nbsp;|&nbsp;
      {user ? (
        <>
          {user.userRole === "ADMIN" ? <Link to="/admin">Dashboard</Link> :
            user.userRole === "SATFF" ? <Link to="/staff">Dashboard</Link> :
            <Link to="/author">Dashboard</Link>}
          &nbsp;|&nbsp;
          <Link to="/user">Profile</Link>
          &nbsp;|&nbsp;
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
