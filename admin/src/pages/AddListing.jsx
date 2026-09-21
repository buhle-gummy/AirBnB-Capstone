import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import {
  FaArrowLeft,
  FaHome,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaUsers,
  FaTag,
  FaWifi,
  FaImage,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";

const AIRBNB_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg";

function AddListing() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    bedrooms: "",
    bathrooms: "",
    guests: "",
    type: "Apartment",
    price: "",
    amenities: "",
    image: "",
    host: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.title ||
      !formData.location ||
      !formData.description ||
      !formData.bedrooms ||
      !formData.bathrooms ||
      !formData.guests ||
      !formData.price
    ) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your admin session has expired. Please log in again.");
        setLoading(false);
        return;
      }

      const payload = {
        title: formData.title,
        location: formData.location,
        description: formData.description,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        guests: Number(formData.guests),
        type: formData.type,
        price: Number(formData.price),
        amenities: formData.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        images: formData.image ? [formData.image] : [],
        host: formData.host || "Admin",
      };

      const response = await fetch(`${API_URL}/accommodations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to create the listing."
        );
      }

      setMessage("Listing created successfully!");

      setTimeout(() => {
        navigate("/listings");
      }, 1000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f7f7f7",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      color: "#222222",
    },

    header: {
      height: "72px",
      background: "#ffffff",
      borderBottom: "1px solid #eeeeee",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 42px",
      position: "sticky",
      top: 0,
      zIndex: 10,
    },

    logo: {
      width: "118px",
      height: "auto",
      display: "block",
    },

    topBackButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      border: "1px solid #dddddd",
      background: "#ffffff",
      color: "#222222",
      WebkitTextFillColor: "#222222",
      padding: "10px 16px",
      borderRadius: "24px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
    },

    content: {
      width: "min(1000px, calc(100% - 40px))",
      margin: "0 auto",
      padding: "45px 0 70px",
    },

    heading: {
      marginBottom: "30px",
    },

    title: {
      fontSize: "32px",
      margin: "0 0 8px",
      color: "#222222",
      fontWeight: "700",
    },

    subtitle: {
      margin: 0,
      color: "#717171",
      fontSize: "15px",
    },

    card: {
      background: "#ffffff",
      borderRadius: "18px",
      border: "1px solid #e5e5e5",
      padding: "32px",
      boxShadow: "0 3px 15px rgba(0,0,0,0.05)",
      marginBottom: "22px",
    },

    sectionTitle: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "19px",
      fontWeight: "700",
      margin: "0 0 22px",
      color: "#222222",
    },

    sectionIcon: {
      color: "#ff385c",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "20px",
    },

    fullWidth: {
      gridColumn: "1 / -1",
    },

    field: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },

    label: {
      fontSize: "13px",
      fontWeight: "700",
      color: "#333333",
    },

    required: {
      color: "#ff385c",
    },

    input: {
      width: "100%",
      boxSizing: "border-box",
      padding: "13px 14px",
      border: "1px solid #dcdcdc",
      borderRadius: "10px",
      fontSize: "14px",
      outline: "none",
      color: "#222222",
      background: "#ffffff",
      WebkitTextFillColor: "#222222",
    },

    inputWithIconWrapper: {
      position: "relative",
      width: "100%",
    },

    inputIcon: {
      position: "absolute",
      left: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#717171",
      pointerEvents: "none",
    },

    inputWithIcon: {
      width: "100%",
      boxSizing: "border-box",
      padding: "13px 14px 13px 40px",
      border: "1px solid #dcdcdc",
      borderRadius: "10px",
      fontSize: "14px",
      outline: "none",
      color: "#222222",
      background: "#ffffff",
      WebkitTextFillColor: "#222222",
    },

    textarea: {
      width: "100%",
      minHeight: "130px",
      boxSizing: "border-box",
      padding: "13px 14px",
      border: "1px solid #dcdcdc",
      borderRadius: "10px",
      fontSize: "14px",
      outline: "none",
      resize: "vertical",
      fontFamily: "inherit",
      color: "#222222",
      background: "#ffffff",
      WebkitTextFillColor: "#222222",
    },

    select: {
      width: "100%",
      boxSizing: "border-box",
      padding: "13px 14px",
      border: "1px solid #dcdcdc",
      borderRadius: "10px",
      fontSize: "14px",
      outline: "none",
      color: "#222222",
      background: "#ffffff",
      WebkitTextFillColor: "#222222",
      cursor: "pointer",
    },

    priceWrapper: {
      position: "relative",
    },

    currency: {
      position: "absolute",
      left: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      fontWeight: "700",
      color: "#555555",
      pointerEvents: "none",
    },

    priceNumber: {
      width: "100%",
      boxSizing: "border-box",
      padding: "13px 14px 13px 34px",
      border: "1px solid #dcdcdc",
      borderRadius: "10px",
      fontSize: "14px",
      outline: "none",
      color: "#222222",
      background: "#ffffff",
      WebkitTextFillColor: "#222222",
    },

    hint: {
      color: "#888888",
      fontSize: "12px",
      marginTop: "2px",
    },

    imagePreview: {
      width: "100%",
      maxHeight: "300px",
      objectFit: "cover",
      borderRadius: "12px",
      marginTop: "14px",
      border: "1px solid #eeeeee",
    },

    alertSuccess: {
      display: "flex",
      alignItems: "center",
      gap: "9px",
      padding: "14px 16px",
      borderRadius: "10px",
      background: "#eaf8ef",
      color: "#20743b",
      marginBottom: "20px",
      fontSize: "14px",
      fontWeight: "600",
    },

    alertError: {
      padding: "14px 16px",
      borderRadius: "10px",
      background: "#fff0f1",
      color: "#c62828",
      marginBottom: "20px",
      fontSize: "14px",
      fontWeight: "600",
    },

    actions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
      marginTop: "10px",
    },

    cancelButton: {
      padding: "13px 22px",
      borderRadius: "10px",
      border: "1px solid #dddddd",
      background: "#ffffff",
      color: "#222222",
      WebkitTextFillColor: "#222222",
      fontWeight: "600",
      cursor: "pointer",
    },

    submitButton: {
      padding: "13px 25px",
      borderRadius: "10px",
      border: "none",
      background: "#ff385c",
      color: "#ffffff",
      WebkitTextFillColor: "#ffffff",
      fontWeight: "700",
      cursor: "pointer",
      minWidth: "150px",
    },

    footer: {
      textAlign: "center",
      padding: "30px",
      color: "#717171",
      fontSize: "13px",
    },

    footerLogo: {
      width: "95px",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <img
          src={AIRBNB_LOGO}
          alt="airbnb"
          style={styles.logo}
        />

        <button
          type="button"
          style={styles.topBackButton}
          onClick={() => navigate("/listings")}
        >
          <FaArrowLeft />
          Back to Listings
        </button>
      </header>

      <main style={styles.content}>
        <div style={styles.heading}>
          <h1 style={styles.title}>Create a new listing</h1>

          <p style={styles.subtitle}>
            Add a beautiful accommodation to your Airbnb property collection.
          </p>
        </div>

        {message && (
          <div style={styles.alertSuccess}>
            <FaCheckCircle />
            {message}
          </div>
        )}

        {error && (
          <div style={styles.alertError}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* BASIC INFORMATION */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <FaHome style={styles.sectionIcon} />
              Basic information
            </h2>

            <div style={styles.grid}>
              <div
                style={{
                  ...styles.field,
                  ...styles.fullWidth,
                }}
              >
                <label style={styles.label}>
                  Property title{" "}
                  <span style={styles.required}>*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern apartment in Johannesburg"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Location{" "}
                  <span style={styles.required}>*</span>
                </label>

                <div style={styles.inputWithIconWrapper}>
                  <FaMapMarkerAlt style={styles.inputIcon} />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Johannesburg"
                    style={styles.inputWithIcon}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Property type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Cabin">Cabin</option>
                  <option value="Villa">Villa</option>
                  <option value="Condo">Condo</option>
                  <option value="Guesthouse">Guesthouse</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div
                style={{
                  ...styles.field,
                  ...styles.fullWidth,
                }}
              >
                <label style={styles.label}>
                  Description{" "}
                  <span style={styles.required}>*</span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell guests what makes this property special..."
                  style={styles.textarea}
                />
              </div>
            </div>
          </div>

          {/* PROPERTY DETAILS */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <FaBed style={styles.sectionIcon} />
              Property details
            </h2>

            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>
                  Bedrooms{" "}
                  <span style={styles.required}>*</span>
                </label>

                <div style={styles.inputWithIconWrapper}>
                  <FaBed style={styles.inputIcon} />

                  <input
                    type="number"
                    min="0"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="Number of bedrooms"
                    style={styles.inputWithIcon}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Bathrooms{" "}
                  <span style={styles.required}>*</span>
                </label>

                <div style={styles.inputWithIconWrapper}>
                  <FaBath style={styles.inputIcon} />

                  <input
                    type="number"
                    min="0"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    placeholder="Number of bathrooms"
                    style={styles.inputWithIcon}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Maximum guests{" "}
                  <span style={styles.required}>*</span>
                </label>

                <div style={styles.inputWithIconWrapper}>
                  <FaUsers style={styles.inputIcon} />

                  <input
                    type="number"
                    min="1"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    placeholder="Maximum guests"
                    style={styles.inputWithIcon}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Price per night{" "}
                  <span style={styles.required}>*</span>
                </label>

                <div style={styles.priceWrapper}>
                  <span style={styles.currency}>R</span>

                  <input
                    type="number"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    style={styles.priceNumber}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AMENITIES */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <FaWifi style={styles.sectionIcon} />
              Amenities
            </h2>

            <div style={styles.field}>
              <label style={styles.label}>
                Amenities
              </label>

              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                placeholder="Wi-Fi, Kitchen, Parking, Pool"
                style={styles.input}
              />

              <span style={styles.hint}>
                Separate each amenity with a comma.
              </span>
            </div>
          </div>

          {/* IMAGE */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <FaImage style={styles.sectionIcon} />
              Property image
            </h2>

            <div style={styles.field}>
              <label style={styles.label}>
                Image URL
              </label>

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/property-image.jpg"
                style={styles.input}
              />

              <span style={styles.hint}>
                Add a direct image URL to display the property photo.
              </span>

              {formData.image && (
                <img
                  src={formData.image}
                  alt="Property preview"
                  style={styles.imagePreview}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display = "block";
                  }}
                />
              )}
            </div>
          </div>

          {/* HOST */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <FaUser style={styles.sectionIcon} />
              Host information
            </h2>

            <div style={styles.field}>
              <label style={styles.label}>
                Host name
              </label>

              <input
                type="text"
                name="host"
                value={formData.host}
                onChange={handleChange}
                placeholder="e.g. Buhle"
                style={styles.input}
              />

              <span style={styles.hint}>
                If left empty, the host will be listed as Admin.
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={() => navigate("/listings")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Listing"}
            </button>
          </div>
        </form>
      </main>

      <footer style={styles.footer}>
        <img
          src={AIRBNB_LOGO}
          alt="airbnb"
          style={styles.footerLogo}
        />

        <div>
          Airbnb Admin • Property Management
        </div>
      </footer>
    </div>
  );
}

export default AddListing;