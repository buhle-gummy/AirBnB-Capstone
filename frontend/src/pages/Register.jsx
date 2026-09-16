import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AirbnbMark from "../components/AirbnbMark";
import { API_URL } from "../config/api";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const baseUrl = API_URL || "/api";
      const response = await fetch(`${baseUrl}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, email: form.email.trim().toLowerCase() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      const login = await fetch(`${baseUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim().toLowerCase(), password: form.password }),
      });
      const loginData = await login.json();
      if (!login.ok) throw new Error(loginData.message || "Account created, but sign-in failed");

      localStorage.setItem("token", loginData.token);
      localStorage.setItem("user", JSON.stringify(loginData.user));
      const destination = location.state?.from || "/";
      navigate(destination, { replace: true, state: location.state?.booking });
    } catch (error) {
      setMessage(error.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="login-brand"><span className="admin-brand-mark"><AirbnbMark /></span>Airbnb</Link>
        <p className="admin-kicker">JOIN AIRBNB</p>
        <h1>Create your account</h1>
        <p>Save inspiring stays and make your next reservation with ease.</p>
        <form onSubmit={submit}>
          <label htmlFor="username">Full name</label>
          <input id="username" value={form.username} minLength="2" onChange={updateField("username")} placeholder="Your name" autoComplete="name" required />
          <label htmlFor="register-email">Email address</label>
          <input id="register-email" type="email" value={form.email} onChange={updateField("email")} placeholder="you@example.com" autoComplete="email" required />
          <label htmlFor="register-password">Password</label>
          <input id="register-password" type="password" value={form.password} minLength="6" onChange={updateField("password")} placeholder="At least 6 characters" autoComplete="new-password" required />
          <button type="submit" disabled={loading}>{loading ? "Creating your account..." : "Create account"}</button>
        </form>
        {message && <p className="login-message" role="alert">{message}</p>}
        <p className="auth-switch">Already have an account? <Link to="/login" state={location.state}>Sign in</Link></p>
      </div>
    </div>
  );
}

export default Register;
