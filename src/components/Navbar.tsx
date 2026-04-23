import Link from "next/link";
import "./Navbar.css";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="navbar glass">
      <div className="navbar-container container">
        <Link href="/" className="navbar-logo">
          <span className="text-gradient heading-3">InkMatch</span>
        </Link>
        <div className="navbar-links">
          <Link href="/artists" className="nav-link">
            Artists
          </Link>
          <Link href="/studios" className="nav-link">
            Studios
          </Link>
        </div>
        <div className="navbar-actions">
          <ThemeToggle />
          <Link href="/login" className="btn-secondary">
            Log In
          </Link>
          <Link href="/register" className="btn-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
