import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Repo App</h1>
      <p>
        Please <Link to="/login">Login</Link> to continue.
      </p>
      <h1 className="justify-center text-red-600">Hello Tailwind!</h1>
      <div className="min-h-screen flex items-center justify-center bg-blue-500 text-white text-3xl font-bold">
        Tailwind is working 🎉
      </div>
    </div>
  );
}
