import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";
import { API_URL } from "../config/api";

const AIRBNB_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (!data.token) {
        throw new Error("Login succeeded, but no token was returned.");
      }

      if (data.user?.role !== "admin") {
        throw new Error(
          "This account does not have admin access."
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-image">
        <div className="image-overlay">

          <div className="top-brand">
            <img
              src={AIRBNB_LOGO}
              alt="Airbnb"
              className="airbnb-logo"
            />

            <span>Admin</span>
          </div>

          <div className="image-content">
            <div className="small-badge">
              <FaShieldAlt />
              <span>Admin Dashboard</span>
            </div>

            <h1>
              Manage your
              <br />
              stays easily.
            </h1>

            <p>
              Manage listings, reservations and users
              from one simple dashboard.
            </p>

            <div className="features">

              <div className="feature">
                <div className="feature-icon">
                  ✓
                </div>

                <span>Manage your listings</span>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  ✓
                </div>

                <span>View reservations</span>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  ✓
                </div>

                <span>Manage users</span>
              </div>

            </div>
          </div>

          <p className="image-footer">
            Airbnb Accommodation Platform
          </p>

        </div>
      </div>
      <div className="login-section">

        <div className="login-card">

          <div className="mobile-brand">
            <img
              src={AIRBNB_LOGO}
              alt="Airbnb"
            />

            <span>Admin</span>
          </div>

          <div className="welcome">

            <div className="welcome-icon">
              <FaLock />
            </div>

            <span className="welcome-label">
              ADMIN LOGIN
            </span>

            <h2>
              Welcome back 👋
            </h2>

            <p>
              Sign in to manage your accommodation
              platform.
            </p>

          </div>

          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="form-group">

              <label>
                Email address
              </label>

              <div className="input-wrapper">

                <FaEnvelope className="input-icon" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                  required
                />

              </div>

            </div>
            <div className="form-group">

              <label>
                Password
              </label>

              <div className="input-wrapper">

                <FaLock className="input-icon" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <FaArrowRight />
                </>
              )}

            </button>

          </form>
          {message && (
            <div className="error-message">

              <div className="error-symbol">
                !
              </div>

              <div>
                <strong>
                  Login unsuccessful
                </strong>

                <p>
                  {message}
                </p>
              </div>

            </div>
          )}
          <div className="security">

            <FaShieldAlt />

            <div>
              <strong>
                Secure admin access
              </strong>

              <span>
                Only authorized administrators
                can access this dashboard.
              </span>
            </div>

          </div>

          <div className="login-footer">

            <img
              src={AIRBNB_LOGO}
              alt="Airbnb"
            />

            <span>
              Admin Portal • 2026
            </span>

          </div>

        </div>

      </div>

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          background: #f7f7f7;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          background: #f7f7f7;
        }
        .login-image {
          width: 48%;
          min-height: 100vh;
          padding: 20px;
          background-image:
            url("https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85");
          background-size: cover;
          background-position: center;
        }

        .image-overlay {
          width: 100%;
          height: 100%;
          min-height: calc(100vh - 40px);
          border-radius: 24px;
          padding: 35px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          background:
            linear-gradient(
              135deg,
              rgba(0, 0, 0, 0.72),
              rgba(0, 0, 0, 0.35)
            );

          color: white;
        }

        .top-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 18px;
          font-weight: 600;
        }

        .airbnb-logo {
          width: 105px;
          filter: brightness(0) invert(1);
        }

        .top-brand span {
          border-left: 1px solid rgba(255,255,255,0.5);
          padding-left: 12px;
        }

        .image-content {
          max-width: 480px;
        }

        .small-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border-radius: 50px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.2);
          font-size: 13px;
          margin-bottom: 20px;
        }

        .image-content h1 {
          font-size: clamp(38px, 4vw, 58px);
          line-height: 1.05;
          margin: 0 0 18px;
          letter-spacing: -2px;
        }

        .image-content p {
          font-size: 17px;
          line-height: 1.6;
          color: rgba(255,255,255,0.85);
          max-width: 430px;
          margin-bottom: 28px;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }

        .feature-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ff385c;
          font-size: 12px;
          font-weight: bold;
        }

        .image-footer {
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          margin: 0;
        }

        .login-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px;
        }

        .login-card {
          width: 100%;
          max-width: 470px;
        }

        .mobile-brand {
          display: none;
        }

        .welcome {
          margin-bottom: 32px;
        }

        .welcome-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: #fff0f3;
          color: #ff385c;
          margin-bottom: 18px;
          font-size: 18px;
        }

        .welcome-label {
          display: block;
          color: #717171;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
        }

        .welcome h2 {
          margin: 0;
          font-size: 36px;
          letter-spacing: -1px;
          color: #222;
        }

        .welcome p {
          margin: 10px 0 0;
          color: #717171;
          font-size: 15px;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          font-size: 15px;
        }

        .input-wrapper input {
          width: 100%;
          height: 52px;
          padding: 0 45px;
          border: 1px solid #ddd;
          border-radius: 12px;
          outline: none;
          background: white;
          color: #222;
          font-size: 15px;
          transition: 0.2s ease;
        }

        .input-wrapper input::placeholder {
          color: #aaa;
        }

        .input-wrapper input:focus {
          border-color: #ff385c;
          box-shadow:
            0 0 0 3px rgba(255, 56, 92, 0.1);
        }

        .password-button {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 38px;
          height: 38px;
          border: none;
          background: transparent;
          color: #777;
          cursor: pointer;
          border-radius: 8px;
        }

        .password-button:hover {
          background: #f5f5f5;
        }

        .login-button {
          width: 100%;
          height: 52px;
          margin-top: 5px;
          border: none;
          border-radius: 12px;
          background: #ff385c;
          color: white;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .login-button:hover:not(:disabled) {
          background: #e31c5f;
          transform: translateY(-1px);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .error-message {
          margin-top: 18px;
          padding: 14px;
          display: flex;
          gap: 12px;
          border-radius: 12px;
          background: #fff1f1;
          border: 1px solid #ffd4d4;
          color: #b42318;
        }

        .error-symbol {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #d92d20;
          color: white;
          font-weight: bold;
        }

        .error-message strong {
          display: block;
          font-size: 13px;
          margin-bottom: 3px;
        }

        .error-message p {
          margin: 0;
          font-size: 13px;
          line-height: 1.4;
        }

        .security {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 25px;
          padding: 15px;
          border-radius: 12px;
          background: #f7f7f7;
        }

        .security > svg {
          color: #ff385c;
          font-size: 18px;
        }

        .security div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .security strong {
          font-size: 13px;
          color: #333;
        }

        .security span {
          font-size: 12px;
          color: #777;
        }

        .login-footer {
          margin-top: 35px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #999;
          font-size: 12px;
        }

        .login-footer img {
          width: 75px;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }


        @media (max-width: 900px) {

          .login-page {
            min-height: 100vh;
          }

          .login-image {
            display: none;
          }

          .login-section {
            width: 100%;
            padding: 30px 20px;
          }

          .login-card {
            max-width: 430px;
          }

          .mobile-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 45px;
          }

          .mobile-brand img {
            width: 90px;
          }

          .mobile-brand span {
            padding-left: 10px;
            border-left: 1px solid #ddd;
            font-size: 14px;
            font-weight: 600;
            color: #555;
          }
        }

        @media (max-width: 480px) {

          .login-section {
            padding: 25px 18px;
          }

          .welcome h2 {
            font-size: 30px;
          }

          .login-footer {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
        }

      `}</style>
    </div>
  );
}