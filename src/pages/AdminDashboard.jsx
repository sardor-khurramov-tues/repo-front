import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin!</p>
      <Link to="/user">View User Data</Link>
      <br />
      <Link to="/admin/department">Department Dashboard</Link>
    </div>
  );
}
