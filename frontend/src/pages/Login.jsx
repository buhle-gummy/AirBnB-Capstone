import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AirbnbMark from "../components/AirbnbMark";

import { API_URL } from "../config/api";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful!");
      const destination = location.state?.from || (data.user?.role === "admin" ? "/dashboard" : "/");
      navigate(destination, { state: location.state?.booking });
    } catch (error) {
      setMessage("Unable to connect to the server.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="login-brand">
          <span className="admin-brand-mark">
            <AirbnbMark />
          </span>
          Airbnb
        </Link>
        <p className="admin-kicker">WELCOME BACK</p>
        <h1>Sign in to Airbnb</h1>
        <p>Access your stays and reservations.</p>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {message && <p className="login-message" role="alert">{message}</p>}
        <p className="auth-switch">
          New to Airbnb? <Link to="/register" state={location.state}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
