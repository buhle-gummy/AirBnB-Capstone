import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaAirbnb,
  FaGlobe,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setOpen(false);

    navigate("/");
  }

  return (
    <header className="navbar">
      <Link
        to="/"
        className="brand"
        onClick={() => setOpen(false)}
      >
        <FaAirbnb className="brand-logo" />

        <span className="brand-name">
          airbnb
        </span>
      </Link>

      

      <nav className="desktop-nav">
  <Link to="/">Place to stay</Link>
  <a href="#experiences">Experiences</a>
  <a href="#gift-cards">Online Experience</a>
</nav>
 
      <div className="nav-actions">
        <button
          className="host-link"
          type="button"
        >
          Become a host
        </button>

        <button
          className="round-icon"
          aria-label="Language"
          type="button"
        >
          <FaGlobe />
        </button>

        <button
          className="profile-menu"
          onClick={() =>
            setOpen((value) => !value)
          }
          aria-label="Open menu"
          type="button"
        >
          {open ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}

          <FaUserCircle />
        </button>

        {open && (
          <div className="dropdown">
            {token ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() =>
                    setOpen(false)
                  }
                >
                  Dashboard
                </Link>

                <button onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() =>
                    setOpen(false)
                  }
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  onClick={() =>
                    setOpen(false)
                  }
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}