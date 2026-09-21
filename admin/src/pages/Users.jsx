import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaUsers,
  FaUserShield,
  FaSyncAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { adminApi } from "../services/api";

const AIRBNB_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg";

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await adminApi.getUsers();

      const items = Array.isArray(data)
        ? data
        : data?.users || data?.data || [];

      setUsers(items);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to load users."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getUserName = (user) => {
    return (
      user.username ||
      user.name ||
      user.fullName ||
      "Unnamed User"
    );
  };

  const getRole = (user) => {
    return user.role || "user";
  };

  const getInitials = (user) => {
    const name = getUserName(user);

    if (!name || name === "Unnamed User") {
      return "U";
    }

    const parts = name.trim().split(" ");

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const formatted = new Date(date);

    if (Number.isNaN(formatted.getTime())) {
      return "—";
    }

    return formatted.toLocaleDateString(
      "en-ZA",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const adminCount = users.filter(
    (user) =>
      getRole(user).toLowerCase() === "admin"
  ).length;

  const regularUserCount = users.filter(
    (user) =>
      getRole(user).toLowerCase() !== "admin"
  ).length;

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand}>
            <img
              src={AIRBNB_LOGO}
              alt="Airbnb"
              style={styles.logo}
            />

            <div style={styles.divider}></div>

            <span style={styles.portalText}>
              Admin Portal
            </span>
          </div>

          <button
            type="button"
            style={styles.dashboardButton}
            onClick={() => navigate("/dashboard")}
          >
            <FaArrowLeft />
            Dashboard
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={styles.main}>
        {/* INTRO */}
        <div style={styles.pageIntro}>
          <div>
            <div style={styles.breadcrumb}>
              <span
                style={styles.breadcrumbLink}
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Dashboard
              </span>

              <span>/</span>

              <span>Users</span>
            </div>

            <h1 style={styles.title}>
              Users
            </h1>

            <p style={styles.subtitle}>
              View registered users and manage account information.
            </p>
          </div>

          <button
            type="button"
            style={styles.refreshButton}
            onClick={() => loadUsers(true)}
            disabled={refreshing}
          >
            <FaSyncAlt
              style={{
                animation: refreshing
                  ? "spin 1s linear infinite"
                  : "none",
              }}
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div style={styles.error}>
            <FaExclamationCircle
              style={styles.alertIcon}
            />

            <div>
              <strong>
                Unable to load users
              </strong>

              <p>{error}</p>

              <button
                type="button"
                style={styles.retryButton}
                onClick={() => loadUsers()}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* SUMMARY */}
        {!loading && users.length > 0 && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div
                style={{
                  ...styles.statIcon,
                  background: "#fff0f3",
                  color: "#e31c5f",
                }}
              >
                <FaUsers />
              </div>

              <div>
                <p style={styles.statLabel}>
                  Total Users
                </p>

                <h2 style={styles.statValue}>
                  {users.length}
                </h2>
              </div>
            </div>

            <div style={styles.statCard}>
              <div
                style={{
                  ...styles.statIcon,
                  background: "#eaf7ee",
                  color: "#2e7d32",
                }}
              >
                <FaUser />
              </div>

              <div>
                <p style={styles.statLabel}>
                  Regular Users
                </p>

                <h2 style={styles.statValue}>
                  {regularUserCount}
                </h2>
              </div>
            </div>

            <div style={styles.statCard}>
              <div
                style={{
                  ...styles.statIcon,
                  background: "#fff8e6",
                  color: "#9a6b00",
                }}
              >
                <FaUserShield />
              </div>

              <div>
                <p style={styles.statLabel}>
                  Administrators
                </p>

                <h2 style={styles.statValue}>
                  {adminCount}
                </h2>
              </div>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div style={styles.loadingCard}>
            <div style={styles.spinner}></div>

            <h2 style={styles.loadingTitle}>
              Loading users
            </h2>

            <p style={styles.loadingText}>
              Please wait while we retrieve registered users.
            </p>
          </div>
        ) : users.length === 0 ? (
          /* EMPTY */
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>
              <FaUsers />
            </div>

            <h2 style={styles.emptyTitle}>
              No users found
            </h2>

            <p style={styles.emptyText}>
              Registered users will appear here once accounts are created.
            </p>

            <button
              type="button"
              style={styles.emptyButton}
              onClick={() => loadUsers(true)}
            >
              <FaSyncAlt />
              Refresh Users
            </button>
          </div>
        ) : (
          /* USERS TABLE */
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <div>
                <h2 style={styles.tableTitle}>
                  Registered Users
                </h2>

                <p style={styles.tableSubtitle}>
                  {users.length} registered{" "}
                  {users.length === 1
                    ? "user"
                    : "users"}
                </p>
              </div>

              <div style={styles.liveBadge}>
                <FaCheckCircle />
                Live Data
              </div>
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>
                      User
                    </th>

                    <th style={styles.th}>
                      Email
                    </th>

                    <th style={styles.th}>
                      Role
                    </th>

                    <th style={styles.th}>
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const role = getRole(user);

                    const isAdmin =
                      role.toLowerCase() ===
                      "admin";

                    return (
                      <tr
                        key={
                          user._id ||
                          user.id
                        }
                        style={styles.tr}
                      >
                        {/* USER */}
                        <td style={styles.td}>
                          <div
                            style={
                              styles.userCell
                            }
                          >
                            <div
                              style={
                                styles.avatar
                              }
                            >
                              {getInitials(user)}
                            </div>

                            <div>
                              <strong
                                style={
                                  styles.userName
                                }
                              >
                                {getUserName(
                                  user
                                )}
                              </strong>

                              <span
                                style={
                                  styles.userSubtext
                                }
                              >
                                Registered account
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td style={styles.td}>
                          <div
                            style={
                              styles.emailCell
                            }
                          >
                            <FaEnvelope />

                            <span>
                              {user.email ||
                                "—"}
                            </span>
                          </div>
                        </td>

                        {/* ROLE */}
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.role,
                              ...(isAdmin
                                ? styles.adminRole
                                : styles.userRole),
                            }}
                          >
                            {isAdmin ? (
                              <FaUserShield />
                            ) : (
                              <FaUser />
                            )}

                            {role}
                          </span>
                        </td>

                        {/* JOINED */}
                        <td style={styles.td}>
                          <div
                            style={
                              styles.dateCell
                            }
                          >
                            <FaCalendarAlt />

                            <span>
                              {formatDate(
                                user.createdAt ||
                                  user.dateCreated ||
                                  user.created_at
                              )}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COUNT */}
        {!loading && users.length > 0 && (
          <div style={styles.bottomText}>
            Showing{" "}
            <strong>{users.length}</strong>{" "}
            registered user
            {users.length !== 1
              ? "s"
              : ""}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <img
            src={AIRBNB_LOGO}
            alt="Airbnb"
            style={styles.footerLogo}
          />

          <span>Admin Portal</span>

          <span style={styles.footerDot}>
            •
          </span>

          <span>
            User Management
          </span>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f7",
    color: "#222222",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  header: {
    background: "#ffffff",
    borderBottom: "1px solid #ebebeb",
    position: "sticky",
    top: 0,
    zIndex: 20,
  },

  headerInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "18px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  logo: {
    width: "108px",
    height: "auto",
    display: "block",
  },

  divider: {
    width: "1px",
    height: "25px",
    background: "#dddddd",
  },

  portalText: {
    color: "#717171",
    fontSize: "14px",
    fontWeight: "600",
  },

  dashboardButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 16px",
    border: "1px solid #dddddd",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#222222",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "42px 28px 70px",
  },

  pageIntro: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "30px",
  },

  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "14px",
    color: "#717171",
    fontSize: "13px",
  },

  breadcrumbLink: {
    color: "#555555",
    fontWeight: "600",
    cursor: "pointer",
  },

  title: {
    margin: 0,
    color: "#222222",
    fontSize: "34px",
    lineHeight: 1.2,
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin: "9px 0 0",
    color: "#717171",
    fontSize: "15px",
  },

  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "12px 18px",
    border: "1px solid #dddddd",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#222222",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  error: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
    padding: "16px 18px",
    marginBottom: "22px",
    border: "1px solid #ffd2d2",
    borderRadius: "12px",
    background: "#fff1f1",
    color: "#b42318",
  },

  alertIcon: {
    marginTop: "2px",
    fontSize: "18px",
    flexShrink: 0,
  },

  retryButton: {
    marginTop: "10px",
    padding: "8px 13px",
    border: "1px solid #e0a0a0",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#b42318",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "20px",
    background: "#ffffff",
    border: "1px solid #eeeeee",
    borderRadius: "14px",
    boxShadow:
      "0 2px 8px rgba(0, 0, 0, 0.035)",
  },

  statIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    flexShrink: 0,
  },

  statLabel: {
    margin: 0,
    color: "#717171",
    fontSize: "12px",
    fontWeight: "600",
  },

  statValue: {
    margin: "5px 0 0",
    color: "#222222",
    fontSize: "25px",
    lineHeight: 1,
  },

  loadingCard: {
    minHeight: "300px",
    padding: "40px",
    background: "#ffffff",
    border: "1px solid #eeeeee",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  spinner: {
    width: "34px",
    height: "34px",
    marginBottom: "18px",
    border: "3px solid #eeeeee",
    borderTop: "3px solid #ff385c",
    borderRadius: "50%",
    animation:
      "spin 1s linear infinite",
  },

  loadingTitle: {
    margin: 0,
    color: "#222222",
    fontSize: "20px",
  },

  loadingText: {
    margin: "8px 0 0",
    color: "#717171",
    fontSize: "14px",
  },

  empty: {
    padding: "75px 30px",
    background: "#ffffff",
    border: "1px solid #eeeeee",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow:
      "0 2px 10px rgba(0, 0, 0, 0.035)",
  },

  emptyIcon: {
    width: "65px",
    height: "65px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#fff0f3",
    color: "#e31c5f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
  },

  emptyTitle: {
    margin: 0,
    color: "#222222",
    fontSize: "22px",
  },

  emptyText: {
    maxWidth: "500px",
    margin: "10px auto 0",
    color: "#717171",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  emptyButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "22px",
    padding: "12px 18px",
    border: "none",
    borderRadius: "9px",
    background: "#ff385c",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  tableCard: {
    background: "#ffffff",
    border: "1px solid #eeeeee",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow:
      "0 2px 10px rgba(0, 0, 0, 0.035)",
  },

  tableHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "22px 24px",
    borderBottom: "1px solid #eeeeee",
  },

  tableTitle: {
    margin: 0,
    color: "#222222",
    fontSize: "18px",
  },

  tableSubtitle: {
    margin: "5px 0 0",
    color: "#717171",
    fontSize: "12px",
  },

  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#f1faf3",
    color: "#2e7d32",
    fontSize: "12px",
    fontWeight: "700",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "800px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "15px 20px",
    textAlign: "left",
    background: "#fafafa",
    borderBottom: "1px solid #eeeeee",
    color: "#717171",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    whiteSpace: "nowrap",
  },

  tr: {
    transition: "background 0.2s ease",
  },

  td: {
    padding: "17px 20px",
    borderBottom: "1px solid #eeeeee",
    color: "#333333",
    fontSize: "13px",
    verticalAlign: "middle",
  },

  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: "190px",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#fff0f3",
    color: "#e31c5f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "800",
    flexShrink: 0,
  },

  userName: {
    display: "block",
    color: "#222222",
    fontSize: "14px",
    fontWeight: "700",
  },

  userSubtext: {
    display: "block",
    marginTop: "3px",
    color: "#999999",
    fontSize: "11px",
  },

  emailCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#555555",
    whiteSpace: "nowrap",
  },

  role: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "7px 11px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "capitalize",
  },

  adminRole: {
    background: "#fff0f3",
    color: "#e31c5f",
  },

  userRole: {
    background: "#f1f1f1",
    color: "#555555",
  },

  dateCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#555555",
    whiteSpace: "nowrap",
  },

  bottomText: {
    marginTop: "16px",
    color: "#717171",
    fontSize: "13px",
  },

  footer: {
    background: "#ffffff",
    borderTop: "1px solid #ebebeb",
  },

  footerInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "22px 28px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    color: "#717171",
    fontSize: "12px",
  },

  footerLogo: {
    width: "76px",
    height: "auto",
  },

  footerDot: {
    color: "#aaaaaa",
  },
};