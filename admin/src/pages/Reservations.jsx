import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../config/api";
function Reservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [search, setSearch] = useState("");

  // Fetch reservations
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const baseUrl = API_URL || "/api";
      const response = await fetch(
        `${baseUrl}/reservations`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load reservations"
        );
      }

      setReservations(data.reservations || []);
    } catch (err) {
      setError(
        err.message || "Unable to load reservations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Update reservation status
  const handleStatusChange = async (
    reservationId,
    status
  ) => {
    try {
      setUpdatingId(reservationId);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const baseUrl = API_URL || "/api";
      const response = await fetch(
        `${baseUrl}/reservations/${reservationId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update reservation status"
        );
      }

      setMessage(`Reservation marked ${status}.`);
      setError("");
      // Update reservation immediately on the page
      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation._id === reservationId
            ? {
                ...reservation,
                status: data.reservation.status,
              }
            : reservation
        )
      );
    } catch (err) {
      setError(err.message || "Unable to update reservation status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete reservation
  const handleDelete = async (reservationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reservation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(reservationId);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const baseUrl = API_URL || "/api";
      const response = await fetch(
        `${baseUrl}/reservations/${reservationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete reservation"
        );
      }

      setMessage("Reservation deleted successfully.");
      setError("");
      // Remove deleted reservation from page
      setReservations((currentReservations) =>
        currentReservations.filter(
          (reservation) =>
            reservation._id !== reservationId
        )
      );
    } catch (err) {
      setError(err.message || "Unable to delete reservation");
    } finally {
      setDeletingId(null);
    }
  };

  // Status styling
  const getStatusClass = (status) => {
    const currentStatus = (
      status || "pending"
    ).toLowerCase();

    if (currentStatus === "cancelled") {
      return "status-cancelled";
    }

    if (currentStatus === "pending") {
      return "status-pending";
    }

    if (currentStatus === "completed") {
      return "status-completed";
    }

    return "status-confirmed";
  };

  const visibleReservations = reservations.filter((reservation) => {
    const text = `${reservation.accommodation?.title || ""} ${reservation.user?.username || ""} ${reservation.user?.email || ""}`.toLowerCase();
    return (statusFilter === "All statuses" || reservation.status === statusFilter) && text.includes(search.toLowerCase());
  });

  return (
    <div className="reservations-page">
      {/* Header */}
      <div className="reservations-header">

        <div>
          <h1>Reservations</h1>

          <p>
            Manage your accommodation reservations
          </p>
        </div>

        <div className="reservation-count">
          {reservations.length}{" "}
          {reservations.length === 1
            ? "Reservation"
            : "Reservations"}
        </div>

        <div className="reservation-tools">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search guests or stays" aria-label="Search reservations" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter reservations"><option>All statuses</option><option>pending</option><option>confirmed</option><option>completed</option><option>cancelled</option></select>
          <button className="clear-filter-button" onClick={() => { setSearch(""); setStatusFilter("All statuses"); }}>Clear</button>
        </div>

        <span className="filter-result-count">Showing {visibleReservations.length} of {reservations.length} reservations</span>

      </div>

      {/* Loading */}
      {loading && (
        <div className="listings-message">
          Loading reservations...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="listings-error" role="alert">
          {error}
        </div>
      )}
      {message && <div className="listing-message" role="status">{message}</div>}

      {/* Empty */}
      {!loading &&
        !error &&
        reservations.length === 0 && (
          <div className="empty-listings">

            <h2>No reservations yet</h2>

            <p>
              Reservations made by guests will
              appear here.
            </p>

          </div>
        )}

      {/* Reservations */}
      {!loading &&
        !error &&
        reservations.length > 0 && (

          <div className="reservations-list">

            {visibleReservations.map((reservation) => (

              <div
                className="reservation-card"
                key={reservation._id}
              >

                {/* Reservation Header */}
                <div className="reservation-card-header">

                  <div>

                    <h2>
                      {reservation.accommodation?.title ||
                        "Accommodation"}
                    </h2>

                    <p>
                      📍{" "}
                      {reservation.accommodation?.location ||
                        "Location unavailable"}
                    </p>

                  </div>

                  {/* Status */}
                  <span
                    className={`reservation-status ${getStatusClass(
                      reservation.status
                    )}`}
                  >
                    {reservation.status || "pending"}
                  </span>

                </div>

                {/* Reservation Details */}
                <div className="reservation-details">

                  <div>
                    <span>Guest</span>

                    <strong>
                      {reservation.user?.username ||
                        "Unknown guest"}
                    </strong>
                  </div>

                  <div>
                    <span>Email</span>

                    <strong>
                      {reservation.user?.email ||
                        "No email"}
                    </strong>
                  </div>

                  <div>
                    <span>Check-in</span>

                    <strong>
                      {formatDate(
                        reservation.checkIn
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Check-out</span>

                    <strong>
                      {formatDate(
                        reservation.checkOut
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Guests</span>

                    <strong>
                      {reservation.guests}
                    </strong>
                  </div>

                  <div>
                    <span>Total</span>

                    <strong>
                      R
                      {Number(
                        reservation.totalPrice || 0
                      ).toLocaleString("en-ZA")}
                    </strong>
                  </div>

                </div>

                {/* Footer */}
                <div className="reservation-footer">

                  <div className="reservation-id">
                    Reservation ID:{" "}
                    {reservation._id}
                  </div>

                  {/* Action Buttons */}
                  <div className="reservation-actions">

                    {/* Confirm */}
                    {reservation.status ===
                      "pending" && (
                      <button
                        className="confirm-button"
                        onClick={() =>
                          handleStatusChange(
                            reservation._id,
                            "confirmed"
                          )
                        }
                        disabled={
                          updatingId ===
                          reservation._id
                        }
                      >
                        {updatingId ===
                        reservation._id
                          ? "Updating..."
                          : "✅ Confirm"}
                      </button>
                    )}

                    {/* Complete */}
                    {reservation.status ===
                      "confirmed" && (
                      <button
                        className="complete-button"
                        onClick={() =>
                          handleStatusChange(
                            reservation._id,
                            "completed"
                          )
                        }
                        disabled={
                          updatingId ===
                          reservation._id
                        }
                      >
                        {updatingId ===
                        reservation._id
                          ? "Updating..."
                          : "✔️ Complete"}
                      </button>
                    )}

                    {/* Cancel */}
                    {reservation.status !==
                      "cancelled" &&
                      reservation.status !==
                        "completed" && (
                        <button
                          className="cancel-button"
                          onClick={() =>
                            handleStatusChange(
                              reservation._id,
                              "cancelled"
                            )
                          }
                          disabled={
                            updatingId ===
                            reservation._id
                          }
                        >
                          {updatingId ===
                          reservation._id
                            ? "Updating..."
                            : "❌ Cancel"}
                        </button>
                      )}

                    {/* Delete */}
                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(
                          reservation._id
                        )
                      }
                      disabled={
                        deletingId ===
                        reservation._id
                      }
                    >
                      {deletingId ===
                      reservation._id
                        ? "Deleting..."
                        : "🗑 Delete"}
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

    </div>
  );
}

export default Reservations;
