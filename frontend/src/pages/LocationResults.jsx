import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AirbnbMark from "../components/AirbnbMark";
import { API_URL } from "../config/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85";

function LocationResults() {
  const [params] = useSearchParams();
  const location = params.get("location") || "Everywhere";
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All stays");
  const [price, setPrice] = useState("Any price");
  const [sort, setSort] = useState("Recommended");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetch(`${API_URL}/api/accommodations`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load stays");
        if (active) setStays(data.accommodations || []);
      })
      .catch((loadError) => active && setError(loadError.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const filteredStays = useMemo(() => {
    const results = stays.filter((stay) => {
      const searchable = `${stay.title || ""} ${stay.location || ""} ${stay.type || ""}`.toLowerCase();
      const matchesLocation = location === "Everywhere" || `${stay.location} ${stay.title}`.toLowerCase().includes(location.toLowerCase());
      const matchesQuery = !query.trim() || searchable.includes(query.trim().toLowerCase());
      const matchesCategory = category === "All stays" || String(stay.type || "").toLowerCase() === category.toLowerCase();
      const nightlyRate = Number(stay.price || 0);
      const matchesPrice = price === "Any price" || (price === "Under R1,500" && nightlyRate < 1500) || (price === "R1,500–R2,500" && nightlyRate >= 1500 && nightlyRate <= 2500) || (price === "Over R2,500" && nightlyRate > 2500);
      return matchesLocation && matchesQuery && matchesCategory && matchesPrice;
    });

    return [...results].sort((left, right) => {
      if (sort === "Price: low to high") return Number(left.price || 0) - Number(right.price || 0);
      if (sort === "Price: high to low") return Number(right.price || 0) - Number(left.price || 0);
      if (sort === "Top rated") return Number(right.rating || 0) - Number(left.rating || 0);
      return 0;
    });
  }, [category, location, price, query, sort, stays]);

  const resetFilters = () => {
    setQuery("");
    setCategory("All stays");
    setPrice("Any price");
    setSort("Recommended");
  };

  return (
    <div className="location-results-page">
      <header className="detail-header">
        <Link className="stay-brand" to="/">
          <span className="brand-mark"><AirbnbMark /></span> Airbnb
        </Link>
        <Link className="detail-back" to="/">← Back home</Link>
      </header>
      <main className="location-results-main">
        <div className="results-heading">
          <div>
            <p className="eyebrow">EXPLORE AIRBNB</p>
            <h1>Stays in {location}</h1>
            <p className="location-count">
              {loading ? "Finding beautiful places…" : `${filteredStays.length} accommodation${filteredStays.length === 1 ? "" : "s"} available`}
            </p>
          </div>
          <span className="results-summary">Thoughtful stays, ready when you are</span>
        </div>

        <section className="results-toolbar" aria-label="Filter stays">
          <label className="results-search"><span>Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, location or type" /></label>
          <label><span>Type</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>All stays</option><option>Apartment</option><option>Villa</option><option>Cabin</option><option>Cottage</option><option>Loft</option><option>Chalet</option></select></label>
          <label><span>Price</span><select value={price} onChange={(event) => setPrice(event.target.value)}><option>Any price</option><option>Under R1,500</option><option>R1,500–R2,500</option><option>Over R2,500</option></select></label>
          <label><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option>Recommended</option><option>Top rated</option><option>Price: low to high</option><option>Price: high to low</option></select></label>
          <button type="button" className="results-reset" onClick={resetFilters}>Reset</button>
        </section>

        {loading && <div className="location-empty"><h2>Finding your next stay</h2><p>Loading the latest homes and guest favourites.</p></div>}
        {error && <div className="location-empty results-error"><h2>We couldn't load stays</h2><p>{error}</p><button type="button" onClick={() => window.location.reload()}>Try again</button></div>}
        {!loading && !error && !filteredStays.length && <div className="location-empty"><h2>No stays found</h2><p>Try another search or reset your filters.</p><button type="button" onClick={resetFilters}>Show all stays</button></div>}

        {!loading && !error && filteredStays.length > 0 && (
          <div className="location-list">
            {filteredStays.map((stay) => (
              <article className="location-card" key={stay._id}>
                <Link className="location-card-image" to={`/stays/${stay._id}`} aria-label={`View ${stay.title}`}>
                  <img src={stay.images?.[0] || FALLBACK_IMAGE} alt={stay.title} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = FALLBACK_IMAGE; }} />
                </Link>
                <div className="location-card-copy">
                  <div className="location-card-topline"><span>{stay.type || "Stay"}</span><small>★ {stay.rating || "New"}</small></div>
                  <h2>{stay.title}</h2>
                  <p className="location-card-location">{stay.location}</p>
                  <p className="location-card-meta">{stay.bedrooms || 0} bedrooms · {stay.bathrooms || 0} bathrooms · up to {stay.guests || 1} guests</p>
                  <div className="location-card-footer"><strong>R{Number(stay.price || 0).toLocaleString("en-ZA")} <em>/ night</em></strong><Link className="book-now" to={`/stays/${stay._id}`}>Book Now <span>→</span></Link></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default LocationResults;
