import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaUsers,
  FaSignOutAlt,
  FaPlus,
  FaList,
  FaArrowRight,
  FaChartLine,
  FaHome,
  FaBuilding,
  FaSyncAlt,
} from "react-icons/fa";

import { adminApi } from "../services/api";

const AIRBNB_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    listings: 0,
    reservations: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const displayName = user.username || user.name || "Admin";

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [accommodationData, reservationData, userData] =
        await Promise.all([
          adminApi.getAccommodations(),
          adminApi.getReservations(),
          adminApi.getUsers(),
        ]);

      const listings =
        accommodationData?.count ??
        accommodationData?.accommodations?.length ??
        (Array.isArray(accommodationData)
          ? accommodationData.length
          : 0);

      const reservations =
        reservationData?.count ??
        reservationData?.reservations?.length ??
        (Array.isArray(reservationData)
          ? reservationData.length
          : 0);

      const users =
        userData?.count ??
        userData?.users?.length ??
        (Array.isArray(userData) ? userData.length : 0);

      setStats({
        listings,
        reservations,
        users,
      });
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err?.message ||
          "Unable to load dashboard statistics. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.logoContainer}>
            <img
              src={AIRBNB_LOGO}
              alt="Airbnb"
              style={styles.logoImage}
            />
          </div>

          <div style={styles.adminLabel}>ADMIN PORTAL</div>

          <nav style={styles.nav}>
            <button
              type="button"
              style={{
                ...styles.navItem,
                ...styles.navItemActive,
              }}
              onClick={() => navigate("/dashboard")}
            >
              <FaHome />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              style={styles.navItem}
              onClick={() => navigate("/listings")}
            >
              <FaBuilding />
              <span>Listings</span>
            </button>

            <button
              type="button"
              style={styles.navItem}
              onClick={() => navigate("/reservations")}
            >
              <FaCalendarCheck />
              <span>Reservations</span>
            </button>

            <button
              type="button"
              style={styles.navItem}
              onClick={() => navigate("/users")}
            >
              <FaUsers />
              <span>Users</span>
            </button>
          </nav>
        </div>

        <button
          type="button"
          style={styles.logout}
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>
      <main style={styles.main}>
        
        <header style={styles.header}>
          <div>
            <div style={styles.breadcrumb}>
              Admin <span style={styles.breadcrumbSlash}>/</span>{" "}
              Dashboard
            </div>

            <h1 style={styles.title}>
              Welcome back, {displayName} 👋
            </h1>

            <p style={styles.subtitle}>
              Here's what's happening with your Airbnb platform today.
            </p>
          </div>

          <div style={styles.profile}>
            <div style={styles.avatar}>
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong style={styles.profileName}>
                {displayName}
              </strong>

              <span style={styles.profileRole}>
                Administrator
              </span>
            </div>
          </div>
        </header>

        {error && (
          <div style={styles.error}>
            <div>
              <strong style={styles.errorTitle}>
                Something went wrong
              </strong>

              <span style={styles.errorMessage}>
                {error}
              </span>
            </div>

            <button
              type="button"
              style={styles.retryButton}
              onClick={loadDashboard}
            >
              <FaSyncAlt />
              Try again
            </button>
          </div>
        )}

        <section style={styles.statsGrid}>
          {/* LISTINGS */}
          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                ...styles.listingIcon,
              }}
            >
              <FaBuilding />
            </div>

            <div style={styles.statContent}>
              <span style={styles.statLabel}>
                Total Listings
              </span>

              <strong style={styles.statNumber}>
                {loading ? "..." : stats.listings}
              </strong>

              <span style={styles.statDescription}>
                Properties on Airbnb
              </span>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                ...styles.bookingIcon,
              }}
            >
              <FaCalendarCheck />
            </div>

            <div style={styles.statContent}>
              <span style={styles.statLabel}>
                Reservations
              </span>

              <strong style={styles.statNumber}>
                {loading ? "..." : stats.reservations}
              </strong>

              <span style={styles.statDescription}>
                Guest bookings
              </span>
            </div>
          </div>

    
          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                ...styles.userIcon,
              }}
            >
              <FaUsers />
            </div>

            <div style={styles.statContent}>
              <span style={styles.statLabel}>
                Registered Users
              </span>

              <strong style={styles.statNumber}>
                {loading ? "..." : stats.users}
              </strong>

              <span style={styles.statDescription}>
                Platform users
              </span>
            </div>
          </div>
        </section>

        
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Quick Actions
              </h2>

              <p style={styles.sectionSubtitle}>
                Manage your Airbnb platform
              </p>
            </div>

            <div style={styles.sectionIconWrapper}>
              <FaChartLine style={styles.sectionIcon} />
            </div>
          </div>

          <div style={styles.actionsGrid}>
            <button
              type="button"
              style={styles.actionCard}
              onClick={() => navigate("/listings")}
            >
              <div
                style={{
                  ...styles.actionIcon,
                  ...styles.actionBlue,
                }}
              >
                <FaList />
              </div>

              <div style={styles.actionText}>
                <strong style={styles.actionTitle}>
                  Manage Listings
                </strong>

                <span style={styles.actionDescription}>
                  View and manage your properties
                </span>
              </div>

              <FaArrowRight style={styles.arrow} />
            </button>

            
            <button
              type="button"
              style={styles.actionCard}
              onClick={() => navigate("/listings/add")}
            >
              <div
                style={{
                  ...styles.actionIcon,
                  ...styles.actionGreen,
                }}
              >
                <FaPlus />
              </div>

              <div style={styles.actionText}>
                <strong style={styles.actionTitle}>
                  Add New Listing
                </strong>

                <span style={styles.actionDescription}>
                  Create a new accommodation
                </span>
              </div>

              <FaArrowRight style={styles.arrow} />
            </button>

            
            <button
              type="button"
              style={styles.actionCard}
              onClick={() => navigate("/reservations")}
            >
              <div
                style={{
                  ...styles.actionIcon,
                  ...styles.actionOrange,
                }}
              >
                <FaCalendarCheck />
              </div>

              <div style={styles.actionText}>
                <strong style={styles.actionTitle}>
                  View Reservations
                </strong>

                <span style={styles.actionDescription}>
                  Manage guest bookings
                </span>
              </div>

              <FaArrowRight style={styles.arrow} />
            </button>
          </div>
        </section>

        
        <footer style={styles.footer}>
          <img
            src={AIRBNB_LOGO}
            alt="Airbnb"
            style={styles.footerLogoImage}
          />

          <span>
            Admin Dashboard • 2026
          </span>
        </footer>
      </main>
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#f7f7f7",
    color: "#222222",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  },

  sidebar: {
    width: "250px",
    minHeight: "100vh",
    background: "#ffffff",
    borderRight: "1px solid #eeeeee",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "28px 18px",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    flexShrink: 0,
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    padding: "3px 8px 15px",
  },

  logoImage: {
    width: "135px",
    height: "auto",
    display: "block",
  },

  adminLabel: {
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.8px",
    color: "#717171",
    padding: "20px 14px 12px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  navItem: {
    width: "100%",
    border: "none",
    background: "transparent",
    padding: "13px 14px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#555555",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s ease",
  },

  navItemActive: {
    background: "#fff0f3",
    color: "#ff385c",
    fontWeight: "700",
  },

  logout: {
    width: "100%",
    border: "none",
    background: "transparent",
    padding: "13px 14px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#555555",
    cursor: "pointer",
    textAlign: "left",
  },

  main: {
    flex: 1,
    padding: "38px 44px",
    boxSizing: "border-box",
    maxWidth: "1600px",
    margin: "0 auto",
    width: "100%",
    minWidth: 0,
  },

  
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "34px",
    gap: "25px",
  },

  breadcrumb: {
    color: "#717171",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "12px",
  },

  breadcrumbSlash: {
    color: "#c5c5c5",
    margin: "0 5px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    lineHeight: "1.2",
    letterSpacing: "-1px",
    color: "#222222",
    fontWeight: "750",
  },

  subtitle: {
    color: "#717171",
    fontSize: "14px",
    margin: "9px 0 0",
    lineHeight: "1.5",
  },

  
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#ffffff",
    padding: "9px 14px 9px 9px",
    borderRadius: "14px",
    border: "1px solid #eeeeee",
    boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
    flexShrink: 0,
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#222222",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "15px",
  },

  profileName: {
    display: "block",
    fontSize: "13px",
    color: "#222222",
  },

  profileRole: {
    display: "block",
    marginTop: "3px",
    color: "#888888",
    fontSize: "11px",
  },

    error: {
    background: "#fff4f4",
    border: "1px solid #ffd6d6",
    padding: "14px 17px",
    borderRadius: "12px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    color: "#b42318",
  },

  errorTitle: {
    display: "block",
    fontSize: "13px",
    marginBottom: "3px",
  },

  errorMessage: {
    display: "block",
    fontSize: "12px",
    color: "#c04a42",
  },

  retryButton: {
    border: "1px solid #efb7b2",
    background: "#ffffff",
    color: "#b42318",
    borderRadius: "8px",
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    flexShrink: 0,
  },

    statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "20px",
    marginBottom: "42px",
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #eeeeee",
    borderRadius: "18px",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.035)",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease",
  },

  statIcon: {
    width: "54px",
    height: "54px",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  listingIcon: {
    background: "#fff0f3",
    color: "#ff385c",
  },

  bookingIcon: {
    background: "#f0f5ff",
    color: "#3b6eea",
  },

  userIcon: {
    background: "#eefaf3",
    color: "#269653",
  },

  statContent: {
    minWidth: 0,
  },

  statLabel: {
    display: "block",
    color: "#717171",
    fontSize: "12px",
    fontWeight: "600",
  },

  statNumber: {
    display: "block",
    color: "#222222",
    fontSize: "30px",
    lineHeight: "1.2",
    marginTop: "4px",
    fontWeight: "750",
  },

  statDescription: {
    display: "block",
    color: "#999999",
    fontSize: "11px",
    marginTop: "3px",
  },

  
  section: {
    marginBottom: "35px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#222222",
    letterSpacing: "-0.3px",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#888888",
    fontSize: "13px",
  },

  sectionIconWrapper: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#ffffff",
    border: "1px solid #eeeeee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionIcon: {
    color: "#bbbbbb",
    fontSize: "18px",
  },

  actionsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  },

  actionCard: {
    border: "1px solid #eeeeee",
    background: "#ffffff",
    color: "#222222",
    borderRadius: "16px",
    padding: "21px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    textAlign: "left",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease",
  },

  actionIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "17px",
  },

  actionBlue: {
    background: "#f0f5ff",
    color: "#3b6eea",
  },

  actionGreen: {
    background: "#eefaf3",
    color: "#269653",
  },

  actionOrange: {
    background: "#fff6ea",
    color: "#d97706",
  },

  actionText: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  actionTitle: {
    color: "#222222",
    fontSize: "13px",
  },

  actionDescription: {
    color: "#717171",
    fontSize: "11px",
    lineHeight: "1.4",
  },

  arrow: {
    color: "#bbbbbb",
    fontSize: "13px",
    flexShrink: 0,
  },

  
  welcomePanel: {
    background:
      "linear-gradient(135deg, #222222 0%, #444444 100%)",
    borderRadius: "20px",
    padding: "30px 34px",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "45px",
    overflow: "hidden",
    position: "relative",
  },

  welcomeContent: {
    position: "relative",
    zIndex: 1,
  },

  welcomeSmall: {
    fontSize: "10px",
    letterSpacing: "2px",
    fontWeight: "800",
    color: "#ffb3c0",
  },

  welcomeTitle: {
    margin: "9px 0 7px",
    fontSize: "24px",
    color: "#ffffff",
    letterSpacing: "-0.5px",
  },

  welcomeText: {
    margin: 0,
    color: "#d7d7d7",
    fontSize: "13px",
    maxWidth: "600px",
    lineHeight: "1.6",
  },

  welcomeIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    color: "#ffffff",
    flexShrink: 0,
  },

  /* FOOTER */
  footer: {
    borderTop: "1px solid #e5e5e5",
    paddingTop: "22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#999999",
    fontSize: "11px",
  },

  footerLogoImage: {
    width: "82px",
    height: "auto",
    display: "block",
  },
};
