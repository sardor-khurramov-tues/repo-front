import { Link } from "react-router-dom";

export default function AuthorDashboard() {
  return (
    <div>
      <h1>Author Dashboard</h1>
      <p>Welcome, Author!</p>
      <Link to="/user">View User Data</Link>
      <br />
      <Link to="/author/document/submission">Document submission</Link>
    </div>
  );
}
