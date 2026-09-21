import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaAirbnb,
  FaArrowLeft,
  FaBed,
  FaBath,
  FaUsers,
  FaHome,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaWifi,
  FaImage,
  FaUser,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { API_URL } from "../config/api";

const AIRBNB_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    guests: 1,
    type: "Apartment",
    price: "",
    amenities: "",
    image: "",
    host: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadListing = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/accommodations/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load listing."
          );
        }

        const listing =
          data?.accommodation || data?.data || data;

        setFormData({
          title: listing.title || "",
          location: listing.location || "",
          description: listing.description || "",
          bedrooms: listing.bedrooms || 1,
          bathrooms: listing.bathrooms || 1,
          guests: listing.guests || 1,
          type: listing.type || "Apartment",
          price: listing.price || "",
          amenities: Array.isArray(listing.amenities)
            ? listing.amenities.join(", ")
            : listing.amenities || "",
          image:
            Array.isArray(listing.images) &&
            listing.images.length > 0
              ? listing.images[0]
              : "",
          host:
            typeof listing.host === "string"
              ? listing.host
              : listing.host?.name || "",
        });
      } catch (err) {
        console.error(err);
        setError(
          err.message || "Failed to load listing."
        );
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const payload = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        guests: Number(formData.guests),
        type: formData.type,
        price: Number(formData.price),

        amenities: formData.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        images: formData.image
          ? [formData.image.trim()]
          : [],

        host: formData.host.trim() || "Admin",
      };

      const response = await fetch(
        `${API_URL}/accommodations/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update listing."
        );
      }

      setSuccess(
        "Listing updated successfully!"
      );

      setTimeout(() => {
        navigate("/listings");
      }, 1200);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <h2 style={styles.loadingTitle}>
            Loading listing
          </h2>
          <p style={styles.loadingText}>
            Please wait while we retrieve the property details.
          </p>
        </div>
      </div>
    );
  }

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

            <div style={styles.brandDivider}></div>

            <span style={styles.portalText}>
              Admin Portal
            </span>
          </div>

          <button
            type="button"
            style={styles.backButton}
            onClick={() => navigate("/listings")}
          >
            <FaArrowLeft />
            <span>Back to Listings</span>
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={styles.main}>
        {/* PAGE INTRO */}
        <div style={styles.pageIntro}>
          <div>
            <div style={styles.breadcrumb}>
              <span
                style={styles.breadcrumbLink}
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </span>

              <span style={styles.breadcrumbSeparator}>
                /
              </span>

              <span
                style={styles.breadcrumbLink}
                onClick={() => navigate("/listings")}
              >
                Listings
              </span>

              <span style={styles.breadcrumbSeparator}>
                /
              </span>

              <span>Edit</span>
            </div>

            <h1 style={styles.title}>
              Edit Listing
            </h1>

            <p style={styles.subtitle}>
              Update the details of your accommodation.
            </p>
          </div>

          <div style={styles.editBadge}>
            <FaHome />
            <span>Editing Property</span>
          </div>
        </div>

        {/* ALERTS */}
        {error && (
          <div style={styles.error}>
            <FaExclamationCircle
              style={styles.alertIcon}
            />

            <div>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div style={styles.success}>
            <FaCheckCircle
              style={styles.alertIcon}
            />

            <div>
              <strong>Success</strong>
              <p>{success}</p>
            </div>
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >
          {/* PROPERTY INFORMATION */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>
                <FaHome />
              </div>

              <div>
                <h2 style={styles.sectionTitle}>
                  Property Information
                </h2>

                <p style={styles.sectionDescription}>
                  Basic information guests will see about this property.
                </p>
              </div>
            </div>

            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>
                  Property Title
                  <span style={styles.required}>*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Modern apartment in Johannesburg"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Location
                  <span style={styles.required}>*</span>
                </label>

                <div style={styles.inputWithIcon}>
                  <FaMapMarkerAlt
                    style={styles.inputIcon}
                  />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Sandton, Johannesburg"
                    style={styles.iconInput}
                  />
                </div>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Description
                <span style={styles.required}>*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Describe the property, its atmosphere and what makes it special..."
                style={styles.textarea}
              />

              <small style={styles.help}>
                Give guests a clear and welcoming description of the property.
              </small>
            </div>
          </section>

          {/* PROPERTY DETAILS */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>
                <FaBed />
              </div>

              <div>
                <h2 style={styles.sectionTitle}>
                  Property Details
                </h2>

                <p style={styles.sectionDescription}>
                  Tell guests about the space and who it can accommodate.
                </p>
              </div>
            </div>

            <div style={styles.gridFour}>
              <div style={styles.field}>
                <label style={styles.label}>
                  Bedrooms
                </label>

                <div style={styles.inputWithIcon}>
                  <FaBed
                    style={styles.inputIcon}
                  />

                  <input
                    type="number"
                    name="bedrooms"
                    min="1"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    style={styles.iconInput}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Bathrooms
                </label>

                <div style={styles.inputWithIcon}>
                  <FaBath
                    style={styles.inputIcon}
                  />

                  <input
                    type="number"
                    name="bathrooms"
                    min="1"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    style={styles.iconInput}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Guests
                </label>

                <div style={styles.inputWithIcon}>
                  <FaUsers
                    style={styles.inputIcon}
                  />

                  <input
                    type="number"
                    name="guests"
                    min="1"
                    value={formData.guests}
                    onChange={handleChange}
                    style={styles.iconInput}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Property Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="Apartment">
                    Apartment
                  </option>

                  <option value="House">
                    House
                  </option>

                  <option value="Cabin">
                    Cabin
                  </option>

                  <option value="Villa">
                    Villa
                  </option>

                  <option value="Hotel">
                    Hotel
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* PRICING */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>
                <FaMoneyBillWave />
              </div>

              <div>
                <h2 style={styles.sectionTitle}>
                  Pricing
                </h2>

                <p style={styles.sectionDescription}>
                  Set the nightly price guests will pay.
                </p>
              </div>
            </div>

            <div style={styles.priceField}>
              <label style={styles.label}>
                Price per night
                <span style={styles.required}>*</span>
              </label>

              <div style={styles.priceInput}>
                <span style={styles.currency}>
                  R
                </span>

                <input
                  type="number"
                  name="price"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="0"
                  style={styles.priceInputElement}
                />
              </div>

              <small style={styles.help}>
                Enter the price in South African Rand.
              </small>
            </div>
          </section>

          {/* AMENITIES */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>
                <FaWifi />
              </div>

              <div>
                <h2 style={styles.sectionTitle}>
                  Amenities
                </h2>

                <p style={styles.sectionDescription}>
                  Add the facilities and features available to guests.
                </p>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Available Amenities
              </label>

              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                placeholder="Wi-Fi, Kitchen, Parking, Pool"
                style={styles.input}
              />

              <small style={styles.help}>
                Separate each amenity with a comma.
              </small>
            </div>
          </section>

          {/* IMAGE */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>
                <FaImage />
              </div>

              <div>
                <h2 style={styles.sectionTitle}>
                  Property Image
                </h2>

                <p style={styles.sectionDescription}>
                  Add a high-quality image that represents the property.
                </p>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Image URL
              </label>

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/property.jpg"
                style={styles.input}
              />

              <small style={styles.help}>
                Use a direct image URL for the best results.
              </small>
            </div>

            {formData.image && (
              <div style={styles.imagePreview}>
                <img
                  src={formData.image}
                  alt="Property preview"
                  style={styles.previewImage}
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />

                <div style={styles.previewInfo}>
                  <FaImage />
                  <span>Current property image</span>
                </div>
              </div>
            )}
          </section>

          {/* HOST */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>
                <FaUser />
              </div>

              <div>
                <h2 style={styles.sectionTitle}>
                  Host
                </h2>

                <p style={styles.sectionDescription}>
                  Update the name displayed as the property host.
                </p>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Host Name
              </label>

              <div style={styles.inputWithIcon}>
                <FaUser
                  style={styles.inputIcon}
                />

                <input
                  type="text"
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  placeholder="e.g. Buhle"
                  style={styles.iconInput}
                />
              </div>
            </div>
          </section>

          {/* ACTIONS */}
          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={() => navigate("/listings")}
              disabled={saving}
            >
              <FaTimes />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                ...styles.saveButton,
                opacity: saving ? 0.65 : 1,
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              <FaSave />

              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <img
            src={AIRBNB_LOGO}
            alt="Airbnb"
            style={styles.footerLogo}
          />

          <span style={styles.footerText}>
            Admin Portal
          </span>

          <span style={styles.footerDot}>
            •
          </span>

          <span style={styles.footerText}>
            Manage your properties with ease.
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
    zIndex: 10,
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

  brandDivider: {
    width: "1px",
    height: "25px",
    background: "#dddddd",
  },

  portalText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#717171",
  },

  backButton: {
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
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "42px 24px 70px",
  },

  pageIntro: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "28px",
  },

  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "14px",
    fontSize: "13px",
    color: "#717171",
  },

  breadcrumbLink: {
    cursor: "pointer",
    color: "#555555",
    fontWeight: "600",
  },

  breadcrumbSeparator: {
    color: "#aaaaaa",
  },

  title: {
    margin: 0,
    color: "#222222",
    fontSize: "34px",
    lineHeight: 1.2,
    fontWeight: "700",
    letterSpacing: "-0.6px",
  },

  subtitle: {
    margin: "9px 0 0",
    color: "#717171",
    fontSize: "15px",
  },

  editBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#fff0f3",
    color: "#e31c5f",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  error: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
    background: "#fff1f1",
    border: "1px solid #ffd2d2",
    borderRadius: "12px",
    padding: "16px 18px",
    marginBottom: "20px",
    color: "#b42318",
  },

  success: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
    background: "#effaf2",
    border: "1px solid #ccebd4",
    borderRadius: "12px",
    padding: "16px 18px",
    marginBottom: "20px",
    color: "#18763b",
  },

  alertIcon: {
    marginTop: "2px",
    fontSize: "18px",
    flexShrink: 0,
  },

  form: {
    background: "#ffffff",
    border: "1px solid #ebebeb",
    borderRadius: "18px",
    boxShadow:
      "0 4px 18px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
  },

  section: {
    padding: "30px 34px",
    borderBottom: "1px solid #eeeeee",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "25px",
  },

  sectionIcon: {
    width: "40px",
    height: "40px",
    minWidth: "40px",
    borderRadius: "10px",
    background: "#fff0f3",
    color: "#e31c5f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
  },

  sectionTitle: {
    margin: 0,
    color: "#222222",
    fontSize: "19px",
    fontWeight: "700",
  },

  sectionDescription: {
    margin: "5px 0 0",
    color: "#717171",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  gridFour: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "16px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },

  label: {
    marginBottom: "8px",
    color: "#333333",
    fontSize: "14px",
    fontWeight: "700",
  },

  required: {
    marginLeft: "4px",
    color: "#e31c5f",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    border: "1px solid #cccccc",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#222222",
    WebkitTextFillColor: "#222222",
    fontSize: "14px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    border: "1px solid #cccccc",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#222222",
    WebkitTextFillColor: "#222222",
    fontSize: "14px",
    lineHeight: 1.6,
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    outline: "none",
  },

  inputWithIcon: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #cccccc",
    borderRadius: "9px",
    background: "#ffffff",
    overflow: "hidden",
  },

  inputIcon: {
    marginLeft: "13px",
    color: "#717171",
    fontSize: "14px",
    flexShrink: 0,
  },

  iconInput: {
    width: "100%",
    minWidth: 0,
    padding: "13px 12px",
    border: "none",
    outline: "none",
    background: "#ffffff",
    color: "#222222",
    WebkitTextFillColor: "#222222",
    fontSize: "14px",
  },

  help: {
    marginTop: "7px",
    color: "#717171",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  priceField: {
    maxWidth: "420px",
  },

  priceInput: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #cccccc",
    borderRadius: "9px",
    background: "#ffffff",
    overflow: "hidden",
  },

  currency: {
    paddingLeft: "14px",
    color: "#555555",
    fontSize: "15px",
    fontWeight: "700",
  },

  priceInputElement: {
    width: "100%",
    padding: "13px 12px",
    border: "none",
    outline: "none",
    background: "#ffffff",
    color: "#222222",
    WebkitTextFillColor: "#222222",
    fontSize: "15px",
  },

  imagePreview: {
    marginTop: "5px",
    border: "1px solid #eeeeee",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#fafafa",
  },

  previewImage: {
    width: "100%",
    height: "230px",
    objectFit: "cover",
    display: "block",
  },

  previewInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 14px",
    color: "#717171",
    fontSize: "12px",
    fontWeight: "600",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px",
    padding: "24px 34px",
    background: "#fafafa",
  },

  cancelButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "13px 20px",
    border: "1px solid #dddddd",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#222222",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  saveButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "13px 23px",
    border: "none",
    borderRadius: "9px",
    background: "#ff385c",
    color: "#ffffff",
    WebkitTextFillColor: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7f7f7",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  loadingCard: {
    width: "min(420px, calc(100% - 40px))",
    padding: "38px",
    background: "#ffffff",
    border: "1px solid #eeeeee",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow:
      "0 4px 20px rgba(0, 0, 0, 0.05)",
  },

  spinner: {
    width: "34px",
    height: "34px",
    margin: "0 auto 18px",
    border: "3px solid #eeeeee",
    borderTop: "3px solid #ff385c",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
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
    lineHeight: 1.5,
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
    gap: "12px",
    flexWrap: "wrap",
  },

  footerLogo: {
    width: "76px",
    height: "auto",
  },

  footerText: {
    color: "#717171",
    fontSize: "12px",
  },

  footerDot: {
    color: "#aaaaaa",
    fontSize: "12px",
  },
};