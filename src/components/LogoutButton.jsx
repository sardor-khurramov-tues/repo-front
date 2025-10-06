import { useNavigate } from "react-router-dom";
import API from "../api";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/sign-out");
    } catch (error) {
      console.error("Server sign-out failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
      window.location.reload();
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
