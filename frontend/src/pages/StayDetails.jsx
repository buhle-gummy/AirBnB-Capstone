import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AirbnbMark from "../components/AirbnbMark";

import { API_URL } from "../config/api";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85";

function StayDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetch(`${API_URL}/api/accommodations/${id}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load this stay");
        if (active) setHome(data.accommodation || data);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000);
    return days > 0 ? days : 0;
  }, [checkIn, checkOut]);

  if (loading) return <div className="detail-page"><div className="booking-loading">Loading this beautiful stay...</div></div>;
  if (error || !home) {
    return <div className="detail-page"><div className="booking-error"><h2>Stay unavailable</h2><p>{error || "This accommodation could not be found."}</p><button onClick={() => navigate("/")}>Back to stays</button></div></div>;
  }

  const images = Array.isArray(home.images) && home.images.length ? home.images : [FALLBACK_IMAGE];
  const money = (value) => `R${Number(value || 0).toLocaleString("en-ZA")}`;
  const subtotal = nights * Number(home.price || 0);
  const discount = nights >= 7 ? Math.round((subtotal * Number(home.weeklyDiscount || 0)) / 100) : 0;
  const serviceFee = Math.round(((subtotal - discount) * Number(home.serviceFee || 0)) / 100);
  const taxes = Math.round(((subtotal - discount) * Number(home.occupancyTaxes || 0)) / 100);
  const cleaningFee = nights ? Number(home.cleaningFee || 0) : 0;
  const total = nights ? subtotal - discount + cleaningFee + serviceFee + taxes : 0;
  const today = new Date().toISOString().split("T")[0];

  const reserve = () => {
    if (!checkIn || !checkOut || !nights) {
      setNotice("Choose valid check-in and check-out dates to continue.");
      return;
    }
    if (!guests || guests < 1 || guests > Number(home.guests || 0)) {
      setNotice("Choose a valid number of guests for this stay.");
      return;
    }
    if (!localStorage.getItem("token")) {
      navigate("/login", {
        state: {
          from: `/reservations/new/${home._id}`,
          booking: { checkIn, checkOut, guests },
        },
      });
      return;
    }
    navigate(`/reservations/new/${home._id}`, { state: { checkIn, checkOut, guests } });
  };

  return (
    <div className="detail-page">
      <header className="detail-header">
        <Link to="/" className="stay-brand"><span className="brand-mark"><AirbnbMark /></span><span>Airbnb</span></Link>
        <Link to="/" className="detail-back">← Back to stays</Link>
      </header>
      <main className="detail-main">
        <div className="detail-title-row">
          <div>
            <p className="eyebrow">{home.type?.toUpperCase()} · {home.location?.toUpperCase()}</p>
            <h1>{home.title}</h1>
            <p className="detail-rating">★ {home.rating || "New"} · {home.reviews || 0} reviews · <u>{home.location}</u></p>
          </div>
          <button className={`save-detail ${saved ? "saved" : ""}`} onClick={() => setSaved(!saved)}>{saved ? "♥ Saved" : "♡ Save"}</button>
        </div>

        <div className="gallery-grid" aria-label={`${home.title} photo gallery`}>
          {images.slice(0, 5).map((image, index) => (
            <button className={`gallery-image-button ${index === 0 ? "gallery-main" : ""}`} key={`${image}-${index}`} onClick={() => setSelectedImage(index)}>
              <img src={image} alt={`${home.title} ${index === 0 ? "exterior" : `interior view ${index}`}`} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = FALLBACK_IMAGE; }} />
            </button>
          ))}
        </div>
        {images.length > 1 && <div className="gallery-caption">{images.length} photos · Select a photo to view it larger</div>}

        <div className="detail-layout">
          <section className="detail-copy">
            <div className="host-row"><div className="host-avatar">{(home.host || "H").charAt(0).toUpperCase()}</div><div><h2>Hosted by {home.host || "an Airbnb host"}</h2><p>{home.guests} guests · {home.bedrooms} bedrooms · {home.bathrooms} bathrooms</p></div></div>
            <div className="detail-rule" />
            <h2>About this place</h2><p className="description">{home.description}</p>
            <div className="amenities"><h2>What this place offers</h2><div>{(home.amenities?.length ? home.amenities : ["Wi-Fi", "Kitchen", "Self check-in"]).map((item) => <span key={item}>{item}</span>)}</div></div>
            <div className="detail-extra"><h2>House rules & check-in</h2><p>Check-in information: {home.selfCheckIn ? "Self check-in is available." : "Your host will share check-in instructions before arrival."}</p><p>House rules: Please respect the home, neighbours, and listed guest capacity.</p></div>
          </section>

          <aside className="booking-card">
            <div className="booking-price"><strong>{money(home.price)}</strong> <span>night</span></div>
            <div className="date-fields"><label>CHECK-IN<input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} min={today} /></label><label>CHECK-OUT<input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn || today} /></label></div>
            <label className="guest-field">GUESTS<select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>{Array.from({ length: Number(home.guests || 1) }, (_, index) => index + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}</select></label>
            <button type="button" className="reserve-button" onClick={reserve}>Book now</button>
            {notice && <p className="booking-notice">{notice}</p>}
            <div className="price-breakdown">{nights ? <><div><span>{money(home.price)} × {nights} nights</span><span>{money(subtotal)}</span></div>{discount > 0 && <div><span>Weekly discount</span><span>-{money(discount)}</span></div>}<div><span>Cleaning fee</span><span>{money(cleaningFee)}</span></div><div><span>Service fee</span><span>{money(serviceFee)}</span></div><div><span>Occupancy taxes</span><span>{money(taxes)}</span></div><div className="total"><strong>Total</strong><strong>{money(total)}</strong></div></> : <p className="booking-helper">Add dates for an exact price breakdown. You won't be charged yet.</p>}</div>
          </aside>
        </div>
      </main>

      {selectedImage !== null && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Expanded property photo" onClick={() => setSelectedImage(null)}><button className="lightbox-close" onClick={() => setSelectedImage(null)} aria-label="Close gallery">×</button><button className="lightbox-arrow previous" onClick={(e) => { e.stopPropagation(); setSelectedImage((selectedImage - 1 + images.length) % images.length); }} aria-label="Previous photo">‹</button><img src={images[selectedImage]} alt={`${home.title} expanded view`} onClick={(e) => e.stopPropagation()} /><button className="lightbox-arrow next" onClick={(e) => { e.stopPropagation(); setSelectedImage((selectedImage + 1) % images.length); }} aria-label="Next photo">›</button><span className="lightbox-count">{selectedImage + 1} / {images.length}</span></div>}
    </div>
  );
}

export default StayDetails;
