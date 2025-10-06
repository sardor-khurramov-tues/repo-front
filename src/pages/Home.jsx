import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Repo App</h1>
      <p>
        Please <Link to="/login">Login</Link> to continue.
      </p>
    </div>
  );
}
