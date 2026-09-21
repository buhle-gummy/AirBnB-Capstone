import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from "../services/api";

import "./Dashboard.css";

export default function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    async function loadReservations() {
      try {
        const data = await api.getReservations();

        const list = Array.isArray(data)
          ? data
          : data?.reservations ||
            data?.data ||
            [];

        setReservations(list);
      } catch (err) {
        setError(err.message);
      }
    }

    loadReservations();
  }, []);

  return (
    <>
      <Navbar />

      <main className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow dark">
              YOUR AIRBNB
            </p>

            <h1>
              Welcome
              {user?.name
                ? `, ${user.name}`
                : ""}.
            </h1>

            <p>
              Manage your trips and reservations.
            </p>
          </div>

          <Link to="/listings">
            Explore stays
          </Link>
        </div>

        <section className="dashboard-card">
          <h2>Your reservations</h2>

          {error && (
            <div className="form-error">
              Could not load reservations:
              {" "}
              {error}
            </div>
          )}

          {!error &&
            reservations.length === 0 && (
              <div className="empty">
                <h3>
                  No reservations yet
                </h3>

                <p>
                  Your future trips will
                  appear here.
                </p>

                <Link to="/listings">
                  Find a stay
                </Link>
              </div>
            )}

          {reservations.map(
            (reservation) => (
              <article
                className="reservation-item"
                key={
                  reservation._id ||
                  reservation.id
                }
              >
                <div>
                  <strong>
                    {reservation
                      .accommodation
                      ?.title ||
                      reservation
                        .accommodationId ||
                      "Your reservation"}
                  </strong>

                  <p>
                    {reservation.checkIn}
                    {" → "}
                    {reservation.checkOut}
                  </p>
                </div>

                <span>
                  {reservation.status ||
                    "Confirmed"}
                </span>
              </article>
            )
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}