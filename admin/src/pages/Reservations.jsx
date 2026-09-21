import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaAirbnb,
  FaArrowLeft,
  FaCalendarCheck,
  FaUser,
  FaHome,
  FaUsers,
  FaMoneyBillWave,
  FaSyncAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { adminApi } from "../services/api";

const AIRBNB_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg";

export default function Reservations() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadReservations = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await adminApi.getReservations();

      const items = Array.isArray(data)
        ? data
        : data?.reservations || data?.data || [];

      setReservations(items);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to load reservations."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const getGuestName = (reservation) => {
    const guest =
      reservation.user ||
      reservation.guest;

    if (typeof guest === "string") {
      return guest;
    }

    return (
      guest?.name ||
      guest?.username ||
      guest?.email ||
      reservation.guestName ||
      reservation.name ||
      "Guest"
    );
  };

  const getPropertyName = (reservation) => {
    const accommodation =
      reservation.accommodation ||
      reservation.property ||
      reservation.listing;

    if (typeof accommodation === "string") {
      return accommodation;
    }

    return (
      accommodation?.title ||
      reservation.propertyName ||
      reservation.listingName ||
      "Property"
    );
  };

  const getStatus = (reservation) => {
    return (
      reservation.status ||
      reservation.bookingStatus ||
      "pending"
    );
  };

  const getStatusIcon = (status) => {
    const normalized = status.toLowerCase();

    if (normalized === "confirmed") {
      return <FaCheckCircle />;
    }

    if (
      normalized === "cancelled" ||
      normalized === "canceled"
    ) {
      return <FaTimesCircle />;
    }

    return <FaClock />;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const formatted = new Date(date);

    if (Number.isNaN(formatted.getTime())) {
      return date;
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

  const formatPrice = (reservation) => {
    const price =
      reservation.totalPrice ??
      reservation.total ??
      reservation.price ??
      0;

    return `R${Number(price).toLocaleString(
      "en-ZA"
    )}`;
  };

  const getGuestCount = (reservation) => {
    return (
      reservation.guests ||
      reservation.numberOfGuests ||
      0
    );
  };

  const confirmedCount = reservations.filter(
    (reservation) =>
      getStatus(reservation).toLowerCase() ===
      "confirmed"
  ).length;

  const pendingCount = reservations.filter(
    (reservation) =>
      getStatus(reservation).toLowerCase() ===
      "pending"
  ).length;

  const cancelledCount = reservations.filter(
    (reservation) =>
      ["cancelled", "canceled"].includes(
        getStatus(reservation).toLowerCase()
      )
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

              <span>
                /
              </span>

              <span>
                Reservations
              </span>
            </div>

            <h1 style={styles.title}>
              Reservations
            </h1>

            <p style={styles.subtitle}>
              View and manage guest reservations across your properties.
            </p>
          </div>

          <button
            type="button"
            style={styles.refreshButton}
            onClick={() =>
              loadReservations(true)
            }
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
                Unable to load reservations
              </strong>

              <p>{error}</p>

              <button
                type="button"
                style={styles.retryButton}
                onClick={() =>
                  loadReservations()
                }
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* SUMMARY CARDS */}
        {!loading &&
          reservations.length > 0 && (
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div
                  style={{
                    ...styles.statIcon,
                    background: "#fff0f3",
                    color: "#e31c5f",
                  }}
                >
                  <FaCalendarCheck />
                </div>

                <div>
                  <p style={styles.statLabel}>
                    Total Reservations
                  </p>

                  <h2 style={styles.statValue}>
                    {reservations.length}
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
                  <FaCheckCircle />
                </div>

                <div>
                  <p style={styles.statLabel}>
                    Confirmed
                  </p>

                  <h2 style={styles.statValue}>
                    {confirmedCount}
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
                  <FaClock />
                </div>

                <div>
                  <p style={styles.statLabel}>
                    Pending
                  </p>

                  <h2 style={styles.statValue}>
                    {pendingCount}
                  </h2>
                </div>
              </div>

              <div style={styles.statCard}>
                <div
                  style={{
                    ...styles.statIcon,
                    background: "#ffebee",
                    color: "#c62828",
                  }}
                >
                  <FaTimesCircle />
                </div>

                <div>
                  <p style={styles.statLabel}>
                    Cancelled
                  </p>

                  <h2 style={styles.statValue}>
                    {cancelledCount}
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
              Loading reservations
            </h2>

            <p style={styles.loadingText}>
              Please wait while we retrieve the latest bookings.
            </p>
          </div>
        ) : reservations.length === 0 ? (
          /* EMPTY STATE */
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>
              <FaCalendarCheck />
            </div>

            <h2 style={styles.emptyTitle}>
              No reservations yet
            </h2>

            <p style={styles.emptyText}>
              Guest reservations will appear here once someone books one of your properties.
            </p>

            <button
              type="button"
              style={styles.emptyButton}
              onClick={() =>
                loadReservations(true)
              }
            >
              <FaSyncAlt />
              Refresh Reservations
            </button>
          </div>
        ) : (
          /* TABLE */
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <div>
                <h2 style={styles.tableTitle}>
                  All Reservations
                </h2>

                <p style={styles.tableSubtitle}>
                  {reservations.length}{" "}
                  reservation
                  {reservations.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>

              <div style={styles.tableBadge}>
                <FaCalendarCheck />
                Live Data
              </div>
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>
                      Guest
                    </th>

                    <th style={styles.th}>
                      Property
                    </th>

                    <th style={styles.th}>
                      Check-in
                    </th>

                    <th style={styles.th}>
                      Check-out
                    </th>

                    <th style={styles.th}>
                      Guests
                    </th>

                    <th style={styles.th}>
                      Total
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {reservations.map(
                    (reservation) => {
                      const status =
                        getStatus(
                          reservation
                        );

                      const normalizedStatus =
                        status.toLowerCase();

                      return (
                        <tr
                          key={
                            reservation._id ||
                            reservation.id
                          }
                          style={styles.tr}
                        >
                          {/* GUEST */}
                          <td style={styles.td}>
                            <div
                              style={
                                styles.guestCell
                              }
                            >
                              <div
                                style={
                                  styles.avatar
                                }
                              >
                                <FaUser />
                              </div>

                              <div>
                                <strong
                                  style={
                                    styles.guestName
                                  }
                                >
                                  {getGuestName(
                                    reservation
                                  )}
                                </strong>

                                <span
                                  style={
                                    styles.cellSubtext
                                  }
                                >
                                  Guest
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* PROPERTY */}
                          <td style={styles.td}>
                            <div
                              style={
                                styles.propertyCell
                              }
                            >
                              <div
                                style={
                                  styles.propertyIcon
                                }
                              >
                                <FaHome />
                              </div>

                              <span
                                style={
                                  styles.propertyName
                                }
                              >
                                {getPropertyName(
                                  reservation
                                )}
                              </span>
                            </div>
                          </td>

                          {/* CHECK-IN */}
                          <td style={styles.td}>
                            <div
                              style={
                                styles.dateCell
                              }
                            >
                              <FaCalendarCheck />

                              <span>
                                {formatDate(
                                  reservation.checkIn ||
                                    reservation.startDate
                                )}
                              </span>
                            </div>
                          </td>

                          {/* CHECK-OUT */}
                          <td style={styles.td}>
                            <div
                              style={
                                styles.dateCell
                              }
                            >
                              <FaCalendarCheck />

                              <span>
                                {formatDate(
                                  reservation.checkOut ||
                                    reservation.endDate
                                )}
                              </span>
                            </div>
                          </td>

                          {/* GUEST COUNT */}
                          <td style={styles.td}>
                            <div
                              style={
                                styles.guestCount
                              }
                            >
                              <FaUsers />

                              <span>
                                {getGuestCount(
                                  reservation
                                )}
                              </span>
                            </div>
                          </td>

                          {/* PRICE */}
                          <td style={styles.td}>
                            <div
                              style={
                                styles.priceCell
                              }
                            >
                              <FaMoneyBillWave />

                              <strong>
                                {formatPrice(
                                  reservation
                                )}
                              </strong>
                            </div>
                          </td>

                          {/* STATUS */}
                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.status,
                                ...(normalizedStatus ===
                                "confirmed"
                                  ? styles.confirmed
                                  : normalizedStatus ===
                                      "cancelled" ||
                                    normalizedStatus ===
                                      "canceled"
                                  ? styles.cancelled
                                  : styles.pending),
                              }}
                            >
                              {getStatusIcon(
                                status
                              )}

                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FOOTER COUNT */}
        {!loading &&
          reservations.length > 0 && (
            <div style={styles.bottomText}>
              Showing{" "}
              <strong>
                {reservations.length}
              </strong>{" "}
              reservation
              {reservations.length !== 1
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

          <span>
            Admin Portal
          </span>

          <span style={styles.footerDot}>
            •
          </span>

          <span>
            Reservation Management
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
      "repeat(4, minmax(0, 1fr))",
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
    width: "42px",
    height: "42px",
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "300px",
    padding: "40px",
    background: "#ffffff",
    border: "1px solid #eeeeee",
    borderRadius: "16px",
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

  tableBadge: {
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
    minWidth: "1050px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "15px 18px",
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
    padding: "17px 18px",
    borderBottom: "1px solid #eeeeee",
    color: "#333333",
    fontSize: "13px",
    verticalAlign: "middle",
  },

  guestCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: "150px",
  },

  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#f1f1f1",
    color: "#555555",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    flexShrink: 0,
  },

  guestName: {
    display: "block",
    color: "#222222",
    fontSize: "13px",
    fontWeight: "700",
  },

  cellSubtext: {
    display: "block",
    marginTop: "3px",
    color: "#999999",
    fontSize: "11px",
  },

  propertyCell: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    minWidth: "170px",
  },

  propertyIcon: {
    width: "31px",
    height: "31px",
    borderRadius: "8px",
    background: "#f7f7f7",
    color: "#717171",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    flexShrink: 0,
  },

  propertyName: {
    color: "#333333",
    fontWeight: "600",
    lineHeight: 1.4,
  },

  dateCell: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#555555",
    whiteSpace: "nowrap",
  },

  dateCellIcon: {
    color: "#717171",
  },

  guestCount: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#555555",
  },

  priceCell: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#222222",
    whiteSpace: "nowrap",
  },

  status: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 11px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },

  confirmed: {
    background: "#eaf7ee",
    color: "#2e7d32",
  },

  pending: {
    background: "#fff8e6",
    color: "#8a6500",
  },

  cancelled: {
    background: "#ffebee",
    color: "#c62828",
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