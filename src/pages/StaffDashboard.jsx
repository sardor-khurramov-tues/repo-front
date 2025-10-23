import { Link } from "react-router-dom";

export default function StaffDashboard() {
  return (
    <div>
      <h1>Staff Dashboard</h1>
      <p>Welcome, Staff!</p>
      <Link to="/user">View User Data</Link>
    </div>
  );
}
