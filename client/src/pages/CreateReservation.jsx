import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import AirbnbMark from "../../components/AirbnbMark";
function CreateReservation() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [checkIn, setCheckIn] = useState(location.state?.checkIn || "");
  const [checkOut, setCheckOut] = useState(location.state?.checkOut || "");
  const [guests, setGuests] = useState(location.state?.guests || 1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetch(`http://localhost:5000/api/accommodations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || "Failed to load accommodation");
        setAccommodation(d.accommodation || d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, token]);
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000);
    return days > 0 ? days : 0;
  }, [checkIn, checkOut]);
  const nightly = Number(accommodation?.price || 0);
  const subtotal = nights * nightly;
  const weeklyDiscount =
    nights >= 7
      ? Math.round(
          (subtotal * Number(accommodation?.weeklyDiscount || 0)) / 100,
        )
      : 0;
  const cleaningFee = nights ? Number(accommodation?.cleaningFee || 0) : 0;
  const serviceFee = nights
    ? Math.round(
        ((subtotal - weeklyDiscount) * Number(accommodation?.serviceFee || 0)) /
          100,
      )
    : 0;
  const occupancyTaxes = nights
    ? Math.round(
        ((subtotal - weeklyDiscount) *
          Number(accommodation?.occupancyTaxes || 0)) /
          100,
      )
    : 0;
  const totalPrice =
    subtotal - weeklyDiscount + cleaningFee + serviceFee + occupancyTaxes;
  const money = (value) => `R${Number(value).toLocaleString("en-ZA")}`;
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("Please sign in before making a reservation.");
      return;
    }
    if (!nights) {
      setError("Please select valid dates.");
      return;
    }
    if (guests > accommodation.guests) {
      setError(
        `This accommodation allows up to ${accommodation.guests} guests.`,
      );
      return;
    }
    try {
      setSubmitting(true);
      const r = await fetch("https://airbnb-capstone-server.onrender.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accommodation: id,
          checkIn,
          checkOut,
          guests: Number(guests),
          totalPrice,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Failed to create reservation");
      setMessage("Reservation created successfully!");
      setTimeout(() => navigate("/reservations"), 1000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };
  if (loading)
    return (
      <div className="reservation-page">
        <div className="booking-loading">Preparing your stay...</div>
      </div>
    );
  if (error && !accommodation)
    return (
      <div className="reservation-page">
        <div className="booking-error">
          <h2>Stay unavailable</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/")}>Back to Airbnb</button>
        </div>
      </div>
    );
  return (
    <div className="reservation-page">
      <header className="detail-header">
        <Link to="/" className="stay-brand">
          <span className="brand-mark">
            <AirbnbMark />
          </span>
          <span>Airbnb</span>
        </Link>
        <Link to={`/stays/${id}`} className="detail-back">
          ← Back to stay
        </Link>
      </header>
      <div className="reservation-shell">
        <button className="back-button" onClick={() => navigate(`/stays/${id}`)}>
          ← Back to stay
        </button>
        <div className="booking-heading">
          <p className="admin-kicker">SECURE YOUR STAY</p>
          <h1>Book your next escape</h1>
          <p>Choose your dates and review the full transparent price.</p>
        </div>
        <div className="booking-layout">
          <aside className="booking-preview">
            <img
              src={
                accommodation.images?.[0] ||
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85"
              }
              alt={accommodation.title}
            />
            <div className="booking-preview-copy">
              <span className="preview-type">
                {accommodation.type || "Stay"}
              </span>
              <h2>{accommodation.title}</h2>
              <p>📍 {accommodation.location}</p>
              <div className="preview-stats">
                <span>★ {accommodation.rating || "New"}</span>
                <span>🛏 {accommodation.bedrooms} beds</span>
                <span>👥 {accommodation.guests} guests</span>
              </div>
              <div className="preview-price">
                <strong>{money(nightly)}</strong>
                <span> per night</span>
              </div>
            </div>
          </aside>
          <form onSubmit={submit} className="reservation-form">
            <h2>Your trip</h2>
            <p className="form-subtitle">Choose when you would like to stay.</p>
            <div className="date-inputs">
              <label>
                CHECK-IN
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </label>
              <label>
                CHECK-OUT
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  required
                />
              </label>
            </div>
            <label className="guests-input">
              GUESTS
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              >
                {Array.from(
                  { length: accommodation.guests },
                  (_, i) => i + 1,
                ).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </label>
            {nights ? (
              <div className="booking-breakdown">
                <div>
                  <span>
                    {money(nightly)} × {nights} nights
                  </span>
                  <span>{money(subtotal)}</span>
                </div>
                {weeklyDiscount > 0 && (
                  <div>
                    <span>Weekly discount</span>
                    <span>-{money(weeklyDiscount)}</span>
                  </div>
                )}
                <div>
                  <span>Cleaning fee</span>
                  <span>{money(cleaningFee)}</span>
                </div>
                <div>
                  <span>Service fee</span>
                  <span>{money(serviceFee)}</span>
                </div>
                <div>
                  <span>Occupancy taxes</span>
                  <span>{money(occupancyTaxes)}</span>
                </div>
                <div className="booking-total">
                  <strong>Total</strong>
                  <strong>{money(totalPrice)}</strong>
                </div>
              </div>
            ) : (
              <div className="booking-empty">
                Add dates to see the complete price.
              </div>
            )}
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <button className="submit-reservation-button" disabled={submitting}>
              {submitting ? "Confirming your stay..." : "Confirm reservation"}
            </button>
            <small className="booking-footnote">
              You won't be charged yet.
            </small>
          </form>
        </div>
      </div>
    </div>
  );
}
export default CreateReservation;
