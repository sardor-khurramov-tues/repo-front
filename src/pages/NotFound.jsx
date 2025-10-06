import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <h1>Oops... resource not found!</h1>
      <p>
        Please go to <Link to="/">welcome</Link> page.
      </p>
    </div>
  );
}
