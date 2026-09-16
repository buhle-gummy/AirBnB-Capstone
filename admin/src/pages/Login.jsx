import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AirbnbMark from "../components/AirbnbMark";
import { apiFetch, clearSession, getStoredUser, getToken } from "../auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = getStoredUser();
    if (getToken() && storedUser?.role === "admin") {
      navigate("/dashboard", { replace: true });
    }
    if (location.state?.message) {
      setMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await apiFetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user?.role !== "admin") {
        clearSession();
        throw new Error("This account does not have admin access.");
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/login" className="login-brand">
          <span className="admin-brand-mark"><AirbnbMark /></span>
          Airbnb
        </Link>
        <p className="admin-kicker">ADMIN PORTAL</p>
        <h1>Welcome back</h1>
        <p>Sign in to manage your stays, listings, and reservations.</p>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email Address</label>
          <input id="email" type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        {message && <p className="login-message">{message}</p>}
        <p className="auth-switch">Need an account? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}
