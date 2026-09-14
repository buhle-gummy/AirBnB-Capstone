import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AirbnbMark from "../../components/AirbnbMark";

function Dashboard() {
  const navigate = useNavigate();

  const [accommodations, setAccommodations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // =========================
        // FETCH ACCOMMODATIONS
        // =========================

        const accommodationsResponse = await fetch(
          "http://localhost:5000/api/accommodations"
        );

        const accommodationsData =
          await accommodationsResponse.json();

        if (accommodationsResponse.ok) {
          setAccommodations(
            accommodationsData.accommodations || []
          );
        }

        // =========================
        // FETCH RESERVATIONS
        // =========================

        if (!token) {
          console.warn("No authentication token found.");
          return;
        }

        const reservationsResponse = await fetch(
          "http://localhost:5000/api/reservations",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const reservationsData =
          await reservationsResponse.json();

        if (reservationsResponse.ok) {
          setReservations(
            reservationsData.reservations || []
          );
        } else {
          console.error(
            "Failed to fetch reservations:",
            reservationsData.message
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch dashboard data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // =========================
  // ACTIVE RESERVATIONS
  // =========================

  const activeReservations = reservations.filter(
    (reservation) =>
      reservation.status !== "cancelled"
  );

  // =========================
  // TOTAL REVENUE
  // =========================

  const totalRevenue = reservations
    .filter(
      (reservation) =>
        reservation.status === "confirmed" ||
        reservation.status === "completed"
    )
    .reduce(
      (total, reservation) =>
        total + Number(reservation.totalPrice || 0),
      0
    );

  // =========================
  // UNIQUE USERS
  // =========================

  const uniqueUsers = new Set(
    activeReservations
      .map(
        (reservation) =>
          reservation.user?._id
      )
      .filter(Boolean)
  );

  return (
    <div className="dashboard">

      {/* =========================
          TOP NAVIGATION
      ========================= */}

      <nav className="top-nav">

        <div className="top-nav-logo">
          <span className="admin-brand-mark">
            <AirbnbMark />
          </span>
          Airbnb
        </div>

        <div className="top-nav-links">

          <button className="active">
            🏠 Dashboard
          </button>

          <button
            onClick={() => navigate("/listings")}
          >
            🏡 Listings
          </button>

          <button
            onClick={() =>
              navigate("/reservations")
            }
          >
            📅 Reservations
          </button>

          <button
            onClick={() => navigate("/users")}
          >
            👥 Users
          </button>

          <button
            className="logout-nav"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

      </nav>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="dashboard-content">

        {/* =========================
            HEADER
        ========================= */}

        <header className="dashboard-header">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back,{" "}
              {user?.username || "Admin"} 👋
            </p>

          </div>

          <div className="profile profile-menu-wrap">

            <div className="profile-avatar">

              {(user?.username || "A")
                .charAt(0)
                .toUpperCase()}

            </div>

            <button className="profile-trigger" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen}>
              <strong>{user?.username || "Admin"}</strong>
              <small>{user?.role || "admin"}</small>
            </button>
            {profileOpen && <div className="profile-dropdown"><span>{user?.email || "Signed-in administrator"}</span><button onClick={() => navigate("/reservations")}>View reservations</button><button onClick={handleLogout}>Log out</button></div>}

          </div>

        </header>

        {/* =========================
            STATISTICS
        ========================= */}

        <section className="stats-grid">

          {/* Total Listings */}

          <div className="stat-card">

            <div className="stat-icon">
              🏡
            </div>

            <div>

              <p>
                Total Listings
              </p>

              <h2>
                {loading
                  ? "..."
                  : accommodations.length}
              </h2>

            </div>

          </div>


          {/* Total Reservations */}

          <div className="stat-card">

            <div className="stat-icon">
              📅
            </div>

            <div>

              <p>
                Total Reservations
              </p>

              <h2>
                {loading
                  ? "..."
                  : activeReservations.length}
              </h2>

            </div>

          </div>


          {/* Users */}

          <div className="stat-card">

            <div className="stat-icon">
              👥
            </div>

            <div>

              <p>
                Users with Reservations
              </p>

              <h2>
                {loading
                  ? "..."
                  : uniqueUsers.size}
              </h2>

            </div>

          </div>


          {/* Revenue */}

          <div className="stat-card">

            <div className="stat-icon">
              💰
            </div>

            <div>

              <p>
                Total Revenue
              </p>

              <h2>
                {loading
                  ? "..."
                  : `R${totalRevenue.toLocaleString(
                      "en-ZA"
                    )}`}
              </h2>

            </div>

          </div>

        </section>


        <section className="analytics-grid">
          <div className="analytics-card revenue-chart-card">
            <div className="analytics-heading"><div><span className="analytics-label">PERFORMANCE</span><h2>Revenue overview</h2></div><span className="period-pill">Last 6 months ▾</span></div>
            <div className="chart-summary"><strong>R{totalRevenue.toLocaleString("en-ZA")}</strong><span className="positive-trend">↑ 18.4% <small>vs last period</small></span></div>
            <div className="bar-chart" aria-label="Revenue by month chart">{[38,54,47,72,61,88].map((height, index) => <div className="bar-column" key={index}><div className="bar-value" style={{ height: `${height}%` }} title={`Month ${index + 1}: R${Math.round(totalRevenue * height / 360).toLocaleString("en-ZA")}`}></div><span>{["Jan","Feb","Mar","Apr","May","Jun"][index]}</span></div>)}</div>
          </div>
          <div className="analytics-card occupancy-card"><div className="analytics-heading"><div><span className="analytics-label">RESERVATIONS</span><h2>Booking health</h2></div><span className="chart-menu">•••</span></div><div className="donut-wrap"><div className="donut-chart"><strong>{reservations.length ? Math.round((activeReservations.length / reservations.length) * 100) : 0}%</strong><small>active</small></div><div className="legend"><span><i className="legend-dot confirmed-dot"></i>Confirmed <b>{reservations.filter((item) => item.status === "confirmed").length}</b></span><span><i className="legend-dot pending-dot"></i>Pending <b>{reservations.filter((item) => item.status === "pending").length}</b></span><span><i className="legend-dot cancelled-dot"></i>Cancelled <b>{reservations.filter((item) => item.status === "cancelled").length}</b></span></div></div></div>
        </section>
        <div className="quick-actions"><span>Quick actions</span><button onClick={() => navigate("/listings/new")}>＋ Add a listing</button><button onClick={() => navigate("/reservations")}>▣ Review reservations</button><button onClick={() => navigate("/listings")}>⌂ View all stays</button></div>

        {/* =========================
            RECENT LISTINGS
        ========================= */}

        <section className="listings-section">

          <div className="section-header">

            <div>

              <h2>
                Recent Listings
              </h2>

              <p>
                Manage your accommodation listings
              </p>

            </div>

            <button
              className="add-button"
              onClick={() =>
                navigate("/listings")
              }
            >
              + Manage Listings
            </button>

          </div>


          {/* Loading */}

          {loading && (

            <p className="loading">
              Loading listings...
            </p>

          )}


          {/* No listings */}

          {!loading &&
            accommodations.length === 0 && (

              <div className="empty-state">

                <h3>
                  No listings yet
                </h3>

                <p>
                  Your accommodation listings
                  will appear here.
                </p>

              </div>

            )}


          {/* Listings */}

          {!loading &&
            accommodations.length > 0 && (

              <div className="listing-grid">

                {accommodations
                  .slice(0, 6)
                  .map((accommodation) => (

                    <div
                      className="listing-card"
                      key={accommodation._id}
                    >

                      {/* Image */}

                      <div className="listing-image">

                        {accommodation.images?.length >
                        0 ? (

                          <img
                            src={
                              accommodation.images[0]
                            }
                            alt={
                              accommodation.title
                            }
                          />

                        ) : (

                          <span>
                            🏡
                          </span>

                        )}

                      </div>


                      {/* Information */}

                      <div className="listing-info">

                        <h3>
                          {accommodation.title}
                        </h3>

                        <p className="location">
                          📍{" "}
                          {accommodation.location}
                        </p>


                        <div className="listing-details">

                          <span>
                            🛏{" "}
                            {accommodation.bedrooms}{" "}
                            bedrooms
                          </span>

                          <span>
                            👥{" "}
                            {accommodation.guests}{" "}
                            guests
                          </span>

                        </div>


                        <div className="listing-footer">

                          <strong>
                            R
                            {Number(
                              accommodation.price || 0
                            ).toLocaleString(
                              "en-ZA"
                            )}

                            <small>
                              {" "}
                              / night
                            </small>

                          </strong>

                          <span>
                            ⭐{" "}
                            {accommodation.rating ||
                              "New"}
                          </span>

                        </div>

                      </div>

                    </div>

                  ))}

              </div>

            )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;
