import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AirbnbMark from "../components/AirbnbMark";

import { API_URL } from "../config/api";
function Dashboard() {
  const navigate = useNavigate();

  const [accommodations, setAccommodations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // =========================
        // FETCH ACCOMMODATIONS
        // =========================

        const accommodationsResponse = await fetch(
          `${API_URL}/api/accommodations`
        );

        const accommodationsData =
          await accommodationsResponse.json();

        if (!accommodationsResponse.ok) {
          throw new Error(accommodationsData.message || "Unable to load listings");
        }
        setAccommodations(accommodationsData.accommodations || []);

        // =========================
        // FETCH RESERVATIONS
        // =========================

        if (!token) {
          setError("Your admin session has expired. Please sign in again.");
          return;
        }

        const reservationsResponse = await fetch(
          `${API_URL}/api/reservations`,
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
          throw new Error(reservationsData.message || "Unable to load reservations");
        }

        const usersResponse = await fetch(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersResponse.json();
        if (!usersResponse.ok) throw new Error(usersData.message || "Unable to load users");
        setUsers(usersData.users || []);
      } catch (error) {
        setError(error.message || "Unable to load dashboard data. Please try again.");
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

          <button type="button" className="active">
            🏠 Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate("/listings")}
          >
            🏡 Listings
          </button>

          <button type="button" onClick={() => navigate("/listings/new")}>
            ＋ Add Listing
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/reservations")
            }
          >
            📅 Reservations
          </button>

          <button
            type="button"
            onClick={() => navigate("/users")}
          >
            👥 Users
          </button>

          <button
            type="button"
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

        {error && <div className="listings-error" role="alert">{error}</div>}

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

                <p>Total Users</p>

              <h2>
                {loading
                  ? "..."
                  : users.length || uniqueUsers.size}
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
