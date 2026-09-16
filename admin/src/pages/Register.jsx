import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AirbnbMark from "../components/AirbnbMark";
import { API_URL } from "../config/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Unable to create account");
      }

      setMessage("Account created. You can sign in now.");
      setTimeout(() => navigate("/login"), 700);
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
        <p className="admin-kicker">JOIN AIRBNB</p>
        <h1>Create account</h1>
        <p>Sign up to access your stays and reservations.</p>

        <form onSubmit={submit}>
          <label htmlFor="username">Username</label>
          <input id="username" value={form.username} minLength={2} onChange={update("username")} placeholder="Your name" required />

          <label htmlFor="email">Email Address</label>
          <input id="email" type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" required />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} minLength={6} onChange={update("password")} placeholder="At least 6 characters" required />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
