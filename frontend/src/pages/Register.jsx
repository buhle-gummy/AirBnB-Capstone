import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { api } from "../services/api";

import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      const data = await api.register(form);

      const token =
        data?.token ||
        data?.accessToken ||
        data?.data?.token;

      if (token) {
        localStorage.setItem(
          "token",
          token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            data?.user ||
              data?.data?.user ||
              {}
          )
        );

        navigate("/dashboard");
      } else {
        navigate("/login");
      }
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
          <h1>Create your account</h1>

          <p>
            Join us and start discovering
            beautiful stays.
          </p>

          <label>
            Full name

            <input
              name="name"
              value={form.name}
              onChange={change}
              required
            />
          </label>

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
              minLength="6"
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
              ? "Creating..."
              : "Create account"}
          </button>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/login">
              Log in
            </Link>
          </p>
        </form>
      </main>
    </>
  );
}