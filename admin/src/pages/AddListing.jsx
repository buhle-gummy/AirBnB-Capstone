import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AirbnbMark from "../components/AirbnbMark";
import { API_URL } from "../config/api";
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
    host: "",
    amenities: "Wi-Fi, Kitchen",
    images: "",
    weeklyDiscount: 0,
    cleaningFee: 0,
    serviceFee: 12,
    occupancyTaxes: 0,
    rating: 0,
    reviews: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleChange = (e) =>
    setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
  const imageUrls = formData.images
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not logged in.");
      const response = await fetch(`${API_URL}/api/accommodations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          guests: Number(formData.guests),
          price: Number(formData.price),
          weeklyDiscount: Number(formData.weeklyDiscount),
          cleaningFee: Number(formData.cleaningFee),
          serviceFee: Number(formData.serviceFee),
          occupancyTaxes: Number(formData.occupancyTaxes),
          rating: Number(formData.rating),
          reviews: Number(formData.reviews),
          amenities: formData.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          images: imageUrls,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to create listing");
      setMessage("Listing created successfully!");
      setTimeout(() => navigate("/listings"), 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="add-listing-page">
      <nav className="top-nav">
        <div className="top-nav-logo">
          <span className="admin-brand-mark">
            <AirbnbMark />
          </span>
          Airbnb
        </div>
        <div className="top-nav-links">
          <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
          <button className="active" onClick={() => navigate("/listings")}>
            🏡 Listings
          </button>
          <button onClick={() => navigate("/reservations")}>📅 Reservations</button>
          <button onClick={() => navigate("/users")}>👥 Users</button>
        </div>
      </nav>
      <div className="add-listing-container">
        <button type="button" onClick={() => navigate("/listings")}>
          ← Back to Listings
        </button>
        <p className="admin-kicker">PROPERTY MANAGEMENT</p>
        <h1>Add New Listing</h1>
        <p>Create a complete, guest-ready accommodation listing.</p>
        <form onSubmit={submit}>
          <label>
            Listing title
            <input
              name="title"
              placeholder="e.g. Sunlit coastal villa"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Location
            <input
              name="location"
              placeholder="e.g. Camps Bay, Cape Town"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Bedrooms
            <input
              type="number"
              min="0"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Bathrooms
            <input
              type="number"
              min="0"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Guest capacity
            <input
              type="number"
              min="1"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Property type
            <select name="type" value={formData.type} onChange={handleChange}>
              <option>Apartment</option>
              <option>House</option>
              <option>Villa</option>
              <option>Cabin</option>
              <option>Room</option>
            </select>
          </label>
          <label>
            Price per night (R)
            <input
              type="number"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Host name
            <input
              name="host"
              value={formData.host}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Guest rating (0–5)
            <input type="number" min="0" max="5" step="0.1" name="rating" value={formData.rating} onChange={handleChange} />
          </label>
          <label>
            Review count
            <input type="number" min="0" name="reviews" value={formData.reviews} onChange={handleChange} />
          </label>
          <label>
            Amenities <span className="label-hint">comma-separated</span>
            <input
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="Wi-Fi, Kitchen, Parking"
            />
          </label>
          <label>
            Image URLs <span className="label-hint">comma-separated</span>
            <input
              name="images"
              value={formData.images}
              onChange={handleChange}
              placeholder="https://...jpg, https://...jpg"
            />
          </label>
          <label>
            Weekly discount (%)
            <input
              type="number"
              min="0"
              name="weeklyDiscount"
              value={formData.weeklyDiscount}
              onChange={handleChange}
            />
          </label>
          <label>
            Cleaning fee (R)
            <input
              type="number"
              min="0"
              name="cleaningFee"
              value={formData.cleaningFee}
              onChange={handleChange}
            />
          </label>
          <label>
            Service fee (%)
            <input
              type="number"
              min="0"
              name="serviceFee"
              value={formData.serviceFee}
              onChange={handleChange}
            />
          </label>
          <label>
            Occupancy taxes (%)
            <input
              type="number"
              min="0"
              name="occupancyTaxes"
              value={formData.occupancyTaxes}
              onChange={handleChange}
            />
          </label>
          <div className="image-preview-grid">
            {imageUrls.map((url) => (
              <img key={url} src={url} alt="Listing preview" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85"; }} />
            ))}
            {!imageUrls.length && (
              <div className="image-placeholder">
                Add image URLs to preview the property gallery.
              </div>
            )}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Creating listing..." : "Create listing"}
          </button>
        </form>
        {message && <p className="listing-message" role="status">{message}</p>}
        {error && <p className="listings-error" role="alert">{error}</p>}
      </div>
    </div>
  );
}
export default AddListing;
