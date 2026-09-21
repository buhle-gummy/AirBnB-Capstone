import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBuilding,
  FaMapMarkerAlt,
  FaUsers,
  FaHome,
  FaSyncAlt,
} from "react-icons/fa";

import { adminApi } from "../services/api";

const AIRBNB_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg";

export default function Listings() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadListings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await adminApi.getAccommodations();

      const items = Array.isArray(data)
        ? data
        : data?.accommodations || data?.data || [];

      setListings(items);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this listing?"
  );

  if (!confirmed) return;

  try {
    setDeletingId(id);
    setError("");

    await adminApi.deleteAccommodation(id);

    // Remove the deleted listing immediately from the screen
    setListings((currentListings) =>
      currentListings.filter((listing) => listing._id !== id)
    );
  } catch (err) {
    console.error("Delete error:", err);
    setError(err.message || "Failed to delete listing.");
  } finally {
    setDeletingId(null);
  }
};

    

  return (
    <div style={styles.page}>
      {/* TOP HEADER */}
      <header style={styles.header}>
        <div style={styles.brandArea}>
          <img
            src={AIRBNB_LOGO}
            alt="airbnb"
            style={styles.logo}
          />

          <div style={styles.divider} />

          <div>
            <div style={styles.adminLabel}>ADMIN PORTAL</div>
            <div style={styles.pageName}>Listings</div>
          </div>
        </div>

        <div style={styles.headerButtons}>
          <button
            style={styles.backButton}
            onClick={() => navigate("/dashboard")}
          >
            <FaArrowLeft />
            Dashboard
          </button>

          <button
            style={styles.addButton}
            onClick={() => navigate("/listings/add")}
          >
            <FaPlus />
            Add Listing
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* PAGE INTRO */}
        <section style={styles.intro}>
          <div>
            <div style={styles.breadcrumb}>
              Admin / Dashboard / Listings
            </div>

            <h1 style={styles.title}>
              Property Listings
            </h1>

            <p style={styles.subtitle}>
              View, edit and manage all accommodation properties.
            </p>
          </div>

          <div style={styles.listingCount}>
            <FaBuilding />
            <div>
              <span style={styles.countLabel}>
                Total properties
              </span>
              <strong style={styles.countNumber}>
                {loading ? "..." : listings.length}
              </strong>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div style={styles.error}>
            <div>
              <strong>Something went wrong</strong>
              <span>{error}</span>
            </div>

            <button
              style={styles.retryButton}
              onClick={loadListings}
            >
              <FaSyncAlt />
              Retry
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div style={styles.loadingCard}>
            <div style={styles.spinner}>
              <FaSyncAlt />
            </div>

            <h3 style={styles.loadingTitle}>
              Loading listings
            </h3>

            <p style={styles.loadingText}>
              Fetching your properties...
            </p>
          </div>
        ) : listings.length === 0 ? (
          /* EMPTY STATE */
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>
              <FaHome />
            </div>

            <h2 style={styles.emptyTitle}>
              No listings found
            </h2>

            <p style={styles.emptyText}>
              There are currently no accommodation listings.
              Create your first property to get started.
            </p>

            <button
              style={styles.addButton}
              onClick={() => navigate("/listings/add")}
            >
              <FaPlus />
              Add Your First Listing
            </button>
          </div>
        ) : (
          /* LISTINGS */
          <section style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <div>
                <h2 style={styles.tableTitle}>
                  All Properties
                </h2>

                <p style={styles.tableSubtitle}>
                  {listings.length}{" "}
                  {listings.length === 1
                    ? "property"
                    : "properties"}{" "}
                  currently listed
                </p>
              </div>

              <button
                style={styles.refreshButton}
                onClick={loadListings}
                disabled={loading}
              >
                <FaSyncAlt />
                Refresh
              </button>
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>PROPERTY</th>
                    <th style={styles.th}>LOCATION</th>
                    <th style={styles.th}>TYPE</th>
                    <th style={styles.th}>PRICE</th>
                    <th style={styles.th}>GUESTS</th>
                    <th
                      style={{
                        ...styles.th,
                        textAlign: "right",
                      }}
                    >
                      ACTIONS
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {listings.map((listing) => (
                    <tr
                      key={listing._id}
                      style={styles.tableRow}
                    >
                      {/* PROPERTY */}
                      <td style={styles.td}>
                        <div style={styles.propertyCell}>
                          <div style={styles.propertyImage}>
                            {listing.images?.[0] ? (
                              <img
                                src={listing.images[0]}
                                alt={listing.title}
                                style={styles.propertyImageImg}
                                onError={(event) => {
                                  event.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <FaBuilding />
                            )}
                          </div>

                          <div>
                            <strong
                              style={styles.propertyTitle}
                            >
                              {listing.title ||
                                "Untitled Property"}
                            </strong>

                            <span
                              style={styles.propertyDescription}
                            >
                              {listing.bedrooms || 0} bedroom
                              {Number(listing.bedrooms) === 1
                                ? ""
                                : "s"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* LOCATION */}
                      <td style={styles.td}>
                        <div style={styles.locationCell}>
                          <FaMapMarkerAlt />

                          <span>
                            {listing.location ||
                              "Not specified"}
                          </span>
                        </div>
                      </td>

                      {/* TYPE */}
                      <td style={styles.td}>
                        <span style={styles.typeBadge}>
                          {listing.type || "Property"}
                        </span>
                      </td>

                      {/* PRICE */}
                      <td style={styles.td}>
                        <strong style={styles.price}>
                          R
                          {Number(
                            listing.price || 0
                          ).toLocaleString()}
                        </strong>

                        <span style={styles.perNight}>
                          / night
                        </span>
                      </td>

                      {/* GUESTS */}
                      <td style={styles.td}>
                        <div style={styles.guestsCell}>
                          <FaUsers />
                          <span>
                            {listing.guests || 0}
                          </span>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td
                        style={{
                          ...styles.td,
                          textAlign: "right",
                        }}
                      >
                        <div style={styles.actions}>
                          <button
                            style={styles.editButton}
                            onClick={() =>
                              navigate(
                                `/listings/edit/${listing._id}`
                              )
                            }
                          >
                            <FaEdit />
                            Edit
                          </button>

                          <button
                            style={{
                              ...styles.deleteButton,
                              opacity:
                                deletingId === listing._id
                                  ? 0.6
                                  : 1,
                            }}
                            disabled={
                              deletingId === listing._id
                            }
                            onClick={() =>
                              handleDelete(listing._id)
                            }
                          >
                            <FaTrash />

                            {deletingId === listing._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer style={styles.footer}>
          <img
            src={AIRBNB_LOGO}
            alt="airbnb"
            style={styles.footerLogo}
          />

          <span>
            Airbnb Admin Portal • Property Management
          </span>
        </footer>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f7",
    color: "#222222",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  },

  /* HEADER */
  header: {
    height: "76px",
    background: "#ffffff",
    borderBottom: "1px solid #eeeeee",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 38px",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },

  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  logo: {
    width: "112px",
    height: "auto",
    display: "block",
  },

  divider: {
    width: "1px",
    height: "32px",
    background: "#dddddd",
  },

  adminLabel: {
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.6px",
    color: "#999999",
    WebkitTextFillColor: "#999999",
  },

  pageName: {
    marginTop: "3px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#222222",
    WebkitTextFillColor: "#222222",
  },

  headerButtons: {
    display: "flex",
    gap: "10px",
  },

  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    border: "1px solid #dddddd",
    borderRadius: "24px",
    background: "#ffffff",
    color: "#222222",
    WebkitTextFillColor: "#222222",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },

  addButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "11px 19px",
    border: "none",
    borderRadius: "24px",
    background: "#ff385c",
    color: "#ffffff",
    WebkitTextFillColor: "#ffffff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    boxShadow: "0 4px 12px rgba(255,56,92,0.18)",
  },

  /* MAIN */
  main: {
    width: "100%",
    maxWidth: "1500px",
    margin: "0 auto",
    padding: "38px 42px 50px",
    boxSizing: "border-box",
  },

  intro: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "25px",
    marginBottom: "30px",
  },

  breadcrumb: {
    color: "#999999",
    WebkitTextFillColor: "#999999",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "10px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    lineHeight: "1.2",
    color: "#222222",
    WebkitTextFillColor: "#222222",
    letterSpacing: "-0.8px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#717171",
    WebkitTextFillColor: "#717171",
    fontSize: "14px",
  },

  listingCount: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    background: "#ffffff",
    border: "1px solid #eeeeee",
    borderRadius: "14px",
    padding: "13px 18px",
    minWidth: "150px",
  },

  countLabel: {
    display: "block",
    fontSize: "10px",
    color: "#888888",
    WebkitTextFillColor: "#888888",
  },

  countNumber: {
    display: "block",
    fontSize: "21px",
    color: "#222222",
    WebkitTextFillColor: "#222222",
    marginTop: "2px",
  },

  /* ERROR */
  error: {
    background: "#fff4f4",
    border: "1px solid #ffd6d6",
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    color: "#b42318",
    WebkitTextFillColor: "#b42318",
    fontSize: "13px",
  },

  retryButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "1px solid #e0bcbc",
    background: "#ffffff",
    color: "#b42318",
    WebkitTextFillColor: "#b42318",
    padding: "8px 13px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  /* LOADING */
  loadingCard: {
    background: "#ffffff",
    border: "1px solid #eeeeee",
    borderRadius: "18px",
    padding: "70px 30px",
    textAlign: "center",
    boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
  },

  spinner: {
    width: "45px",
    height: "45px",
    margin: "0 auto 16px",
    borderRadius: "50%",
    background: "#fff0f3",
    color: "#ff385c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
  },

  loadingTitle: {
    margin: 0,
    fontSize: "17px",
    color: "#222222",
    WebkitTextFillColor: "#222222",
  },

  loadingText: {
    margin: "7px 0 0",
    color: "#888888",
    WebkitTextFillColor: "#888888",
    fontSize: "13px",
  },

  /* EMPTY */
  empty: {
    background: "#ffffff",
    border: "1px solid #eeeeee",
    borderRadius: "18px",
    padding: "75px 30px",
    textAlign: "center",
  },

  emptyIcon: {
    width: "65px",
    height: "65px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background: "#fff0f3",
    color: "#ff385c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
  },

  emptyTitle: {
    margin: 0,
    color: "#222222",
    WebkitTextFillColor: "#222222",
    fontSize: "21px",
  },

  emptyText: {
    maxWidth: "480px",
    margin: "9px auto 23px",
    color: "#717171",
    WebkitTextFillColor: "#717171",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  /* TABLE */
  tableCard: {
    background: "#ffffff",
    border: "1px solid #eeeeee",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(0,0,0,0.035)",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "23px 25px",
    borderBottom: "1px solid #eeeeee",
  },

  tableTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#222222",
    WebkitTextFillColor: "#222222",
  },

  tableSubtitle: {
    margin: "5px 0 0",
    fontSize: "12px",
    color: "#888888",
    WebkitTextFillColor: "#888888",
  },

  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "1px solid #dddddd",
    background: "#ffffff",
    color: "#555555",
    WebkitTextFillColor: "#555555",
    padding: "9px 13px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },

  th: {
    textAlign: "left",
    padding: "14px 20px",
    borderBottom: "1px solid #eeeeee",
    color: "#888888",
    WebkitTextFillColor: "#888888",
    fontSize: "10px",
    letterSpacing: "0.7px",
    fontWeight: "800",
    background: "#fafafa",
  },

  td: {
    padding: "17px 20px",
    borderBottom: "1px solid #f0f0f0",
    color: "#333333",
    WebkitTextFillColor: "#333333",
    fontSize: "13px",
    verticalAlign: "middle",
  },

  tableRow: {
    background: "#ffffff",
  },

  propertyCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: "220px",
  },

  propertyImage: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    background: "#f3f3f3",
    color: "#999999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },

  propertyImageImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  propertyTitle: {
    display: "block",
    color: "#222222",
    WebkitTextFillColor: "#222222",
    fontSize: "13px",
    fontWeight: "700",
    maxWidth: "250px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  propertyDescription: {
    display: "block",
    color: "#999999",
    WebkitTextFillColor: "#999999",
    fontSize: "11px",
    marginTop: "4px",
  },

  locationCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#555555",
    WebkitTextFillColor: "#555555",
  },

  typeBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "20px",
    background: "#f5f5f5",
    color: "#555555",
    WebkitTextFillColor: "#555555",
    fontSize: "11px",
    fontWeight: "700",
  },

  price: {
    color: "#222222",
    WebkitTextFillColor: "#222222",
    fontSize: "13px",
  },

  perNight: {
    color: "#999999",
    WebkitTextFillColor: "#999999",
    fontSize: "11px",
    marginLeft: "3px",
  },

  guestsCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#555555",
    WebkitTextFillColor: "#555555",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "7px",
  },

  editButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    border: "1px solid #dddddd",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#222222",
    WebkitTextFillColor: "#222222",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },

  deleteButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    background: "#222222",
    color: "#ffffff",
    WebkitTextFillColor: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },

  /* FOOTER */
  footer: {
    borderTop: "1px solid #e5e5e5",
    marginTop: "45px",
    paddingTop: "22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#999999",
    WebkitTextFillColor: "#999999",
    fontSize: "11px",
  },

  footerLogo: {
    width: "82px",
    height: "auto",
  },
};