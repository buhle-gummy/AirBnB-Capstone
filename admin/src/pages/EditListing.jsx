import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AirbnbMark from "../components/AirbnbMark";
import { API_URL } from "../config/api";
function EditListing() {
  const { id } = useParams();
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
    amenities: "",
    images: "",
    weeklyDiscount: 0,
    cleaningFee: 0,
    serviceFee: 12,
    occupancyTaxes: 0,
    rating: 0,
    reviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`${API_URL}/api/accommodations/${id}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || "Failed to load listing");
        const x = d.accommodation;
        setFormData({
          title: x.title || "",
          location: x.location || "",
          description: x.description || "",
          bedrooms: x.bedrooms || "",
          bathrooms: x.bathrooms || "",
          guests: x.guests || "",
          type: x.type || "Apartment",
          price: x.price || "",
          host: x.host || "",
          amenities: (x.amenities || []).join(", "),
          images: (x.images || []).join(", "),
          weeklyDiscount: x.weeklyDiscount || 0,
          cleaningFee: x.cleaningFee || 0,
          serviceFee: x.serviceFee ?? 12,
          occupancyTaxes: x.occupancyTaxes || 0,
          rating: x.rating || 0,
          reviews: x.reviews || 0,
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);
  const change = (e) =>
    setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
  const urls = formData.images
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(
        `${API_URL}/api/accommodations/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
              .map((x) => x.trim())
              .filter(Boolean),
            images: urls,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update listing");
      setMessage("Listing updated successfully!");
      setTimeout(() => navigate("/listings"), 900);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };
  if (loading)
    return <div className="listings-message">Loading listing...</div>;
  if (error && !formData.title)
    return <div className="listings-error">{error}</div>;
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
        <h1>Edit Listing</h1>
        <p>Update the complete details for this accommodation.</p>
        <form onSubmit={submit}>
          <label>
            Listing title
            <input
              name="title"
              value={formData.title}
              onChange={change}
              required
            />
          </label>
          <label>
            Location
            <input
              name="location"
              value={formData.location}
              onChange={change}
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={change}
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
              onChange={change}
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
              onChange={change}
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
              onChange={change}
              required
            />
          </label>
          <label>
            Property type
            <select name="type" value={formData.type} onChange={change}>
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
              onChange={change}
              required
            />
          </label>
          <label>
            Host name
            <input
              name="host"
              value={formData.host}
              onChange={change}
              required
            />
          </label>
          <label>
            Guest rating (0–5)
            <input type="number" min="0" max="5" step="0.1" name="rating" value={formData.rating} onChange={change} />
          </label>
          <label>
            Review count
            <input type="number" min="0" name="reviews" value={formData.reviews} onChange={change} />
          </label>
          <label>
            Amenities
            <input
              name="amenities"
              value={formData.amenities}
              onChange={change}
            />
          </label>
          <label>
            Image URLs
            <input name="images" value={formData.images} onChange={change} />
          </label>
          <label>
            Weekly discount (%)
            <input
              type="number"
              min="0"
              name="weeklyDiscount"
              value={formData.weeklyDiscount}
              onChange={change}
            />
          </label>
          <label>
            Cleaning fee (R)
            <input
              type="number"
              min="0"
              name="cleaningFee"
              value={formData.cleaningFee}
              onChange={change}
            />
          </label>
          <label>
            Service fee (%)
            <input
              type="number"
              min="0"
              name="serviceFee"
              value={formData.serviceFee}
              onChange={change}
            />
          </label>
          <label>
            Occupancy taxes (%)
            <input
              type="number"
              min="0"
              name="occupancyTaxes"
              value={formData.occupancyTaxes}
              onChange={change}
            />
          </label>
          <div className="image-preview-grid">
            {urls.map((url) => (
              <img key={url} src={url} alt="Listing preview" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85"; }} />
            ))}
            {!urls.length && (
              <div className="image-placeholder">
                No gallery images added yet.
              </div>
            )}
          </div>
          <button type="submit" disabled={saving}>
            {saving ? "Saving changes..." : "Save changes"}
          </button>
        </form>
        {message && <p className="listing-message" role="status">{message}</p>}
        {error && <p className="listings-error" role="alert">{error}</p>}
      </div>
    </div>
  );
}
export default EditListing;
