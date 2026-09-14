import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AirbnbMark from "../../components/AirbnbMark";

function Listings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [priceFilter, setPriceFilter] = useState("All prices");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const loadListings = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/accommodations");
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Could not load listings");
      setListings(data.accommodations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const searchableText =
        `${listing.title || ""} ${listing.location || ""}`.toLowerCase();
      const price = Number(listing.price || 0);
      const matchesSearch = searchableText.includes(search.toLowerCase());
      const matchesType =
        typeFilter === "All types" || listing.type === typeFilter;
      const matchesPrice =
        priceFilter === "All prices" ||
        (priceFilter === "Under R1,500" && price < 1500) ||
        (priceFilter === "R1,500–R2,500" && price >= 1500 && price <= 2500) ||
        (priceFilter === "Over R2,500" && price > 2500);
      return matchesSearch && matchesType && matchesPrice;
    });
  }, [listings, search, typeFilter, priceFilter]);

  const deleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/accommodations/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Could not delete listing");
      loadListings();
    } catch (err) {
      setError(err.message);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All types");
    setPriceFilter("All prices");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const averagePrice = listings.length
    ? Math.round(
        listings.reduce((total, item) => total + Number(item.price || 0), 0) /
          listings.length,
      )
    : 0;

  return (
    <div className="listings-page">
      <nav className="top-nav">
        <div className="top-nav-logo">
          <span className="admin-brand-mark">
            <AirbnbMark />
          </span>
          Airbnb
        </div>
        <div className="top-nav-links">
          <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
          <button className="active">🏡 Listings</button>
          <button onClick={() => navigate("/reservations")}>
            📅 Reservations
          </button>
          <button onClick={() => navigate("/users")}>👥 Users</button>
          <button className="logout-nav" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </nav>

      <main className="listings-content table-listings-content">
        <header className="dashboard-header listings-header">
          <div>
            <p className="admin-kicker">PROPERTY MANAGEMENT</p>
            <h1>Listings</h1>
            <p>
              Manage your Airbnb accommodation inventory,{" "}
              {user?.username || "Admin"}.
            </p>
          </div>
          <button
            className="add-listing-button"
            onClick={() => navigate("/listings/new")}
          >
            ＋ Add listing
          </button>
        </header>

        <section className="stats-grid listing-stats">
          <div className="stat-card">
            <div className="stat-icon">🏡</div>
            <div>
              <p>Total listings</p>
              <h2>{loading ? "…" : listings.length}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⌕</div>
            <div>
              <p>Matching results</p>
              <h2>{filteredListings.length}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">R</div>
            <div>
              <p>Average nightly rate</p>
              <h2>R{averagePrice.toLocaleString("en-ZA")}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">★</div>
            <div>
              <p>Collection status</p>
              <h2>{listings.length ? "Live" : "Ready"}</h2>
            </div>
          </div>
        </section>

        <section className="table-toolbar">
          <div>
            <strong>All properties</strong>
            <small>
              Showing {filteredListings.length} of {listings.length} listings
            </small>
          </div>
          <div className="table-filters">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search listings"
            />
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option>All types</option>
              <option>Apartment</option>
              <option>House</option>
              <option>Villa</option>
              <option>Cabin</option>
              <option>Room</option>
            </select>
            <select
              value={priceFilter}
              onChange={(event) => setPriceFilter(event.target.value)}
            >
              <option>All prices</option>
              <option>Under R1,500</option>
              <option>R1,500–R2,500</option>
              <option>Over R2,500</option>
            </select>
            <button onClick={clearFilters}>Clear</button>
          </div>
        </section>

        {loading && <div className="listings-message">Loading listings...</div>}
        {error && <div className="listings-error">{error}</div>}

        {!loading && !error && (
          <div className="listings-table-wrap">
            {listings.length === 0 ? (
              <div className="table-empty">
                No listings yet. Add your first property.
              </div>
            ) : (
              <table className="listings-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Capacity</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((listing) => (
                    <tr key={listing._id}>
                      <td>
                        <div className="table-property">
                          <img
                            src={
                              listing.images?.[0] ||
                              "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=300&q=80"
                            }
                            alt={listing.title}
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src =
                                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85";
                            }}
                          />
                          <div>
                            <strong>{listing.title}</strong>
                            <small>
                              {listing.bedrooms} bedrooms · {listing.bathrooms}{" "}
                              baths
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>{listing.location}</td>
                      <td>
                        <span className="table-type">
                          {listing.type || "Stay"}
                        </span>
                      </td>
                      <td>
                        <strong className="table-price">
                          R{Number(listing.price || 0).toLocaleString("en-ZA")}
                        </strong>
                        <small className="table-night"> / night</small>
                      </td>
                      <td>{listing.guests} guests</td>
                      <td>
                        <span className="table-rating">
                          ★ {listing.rating || "New"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="table-view"
                            onClick={() =>
                              navigate(`/stays/${listing._id}`)
                            }
                          >
                            Book Now
                          </button>
                          <button
                            className="table-edit"
                            onClick={() =>
                              navigate(`/listings/edit/${listing._id}`)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="table-delete"
                            onClick={() => deleteListing(listing._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {listings.length > 0 && filteredListings.length === 0 && (
              <div className="table-empty">No listings match your filters.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Listings;
