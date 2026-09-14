import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AirbnbMark from "../../components/AirbnbMark";
function LocationResults() {
  const [params] = useSearchParams();
  const location = params.get("location") || "Everywhere";
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("https://airbnb-capstone-server.onrender.com/")
      .then((r) => r.json())
      .then((d) =>
        setStays(
          (d.accommodations || []).filter(
            (x) =>
              location === "Everywhere" ||
              `${x.location} ${x.title}`
                .toLowerCase()
                .includes(location.toLowerCase()),
          ),
        ),
      )
      .finally(() => setLoading(false));
  }, [location]);
  return (
    <div className="location-results-page">
      <header className="detail-header">
        <Link className="stay-brand" to="/">
          <span className="brand-mark"><AirbnbMark /></span> Airbnb
        </Link>
        <Link className="detail-back" to="/">
          ← Back home
        </Link>
      </header>
      <main className="location-results-main">
        <p className="eyebrow">EXPLORE AIRBNB</p>
        <h1>Stays in {location}</h1>
        <p className="location-count">
          {loading
            ? "Finding beautiful places…"
            : `${stays.length} accommodation${stays.length === 1 ? "" : "s"} available`}
        </p>
        {!loading && !stays.length ? (
          <div className="location-empty">
            <h2>No stays found</h2>
            <p>Try another location or browse everywhere.</p>
            <Link to="/locations">Browse all stays</Link>
          </div>
        ) : (
          <div className="location-list">
            {stays.map((stay) => (
              <Link
                className="location-card"
                to={`/stays/${stay._id}`}
                key={stay._id}
              >
                <img
                  src={
                    stay.images?.[0] ||
                    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=85"
                  }
                  alt={stay.title}
                />
                <div>
                  <span>{stay.type || "Stay"}</span>
                  <h2>{stay.title}</h2>
                  <p>{stay.location}</p>
                  <small>
                    ★ {stay.rating || "New"} · {stay.bedrooms} bedrooms ·{" "}
                    {stay.guests} guests
                  </small>
                  <strong>
                    R{Number(stay.price || 0).toLocaleString("en-ZA")}{" "}
                    <em>/ night</em>
                  </strong>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
export default LocationResults;
