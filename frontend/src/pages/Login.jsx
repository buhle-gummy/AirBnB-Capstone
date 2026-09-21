import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { api } from "../services/api";

import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function change(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function submit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await api.login(form);

      const token =
        data?.token ||
        data?.accessToken ||
        data?.data?.token;

      const user =
        data?.user ||
        data?.data?.user ||
        {};

      if (!token) {
        throw new Error(
          "Login succeeded but no token was returned."
        );
      }

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      navigate(
        location.state?.from || "/dashboard"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="auth-page">
        <form
          className="auth-card"
          onSubmit={submit}
        >
          <h1>Welcome back</h1>

          <p>
            Log in to continue your Airbnb journey.
          </p>

          <label>
            Email

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={change}
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={change}
              required
            />
          </label>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Log in"}
          </button>

          <p className="auth-footer">
            Don't have an account?{" "}
            <Link to="/register">
              Sign up
            </Link>
          </p>
        </form>
      </main>
    </>
  );
}