import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from "../services/api";

import "./CreateReservation.css";

export default function CreateReservation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) {
      return 0;
    }

    const start = new Date(form.checkIn);
    const end = new Date(form.checkOut);

    const difference = end - start;

    return difference > 0
      ? Math.ceil(difference / 86400000)
      : 0;
  }, [form.checkIn, form.checkOut]);

  function change(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function submit(event) {
    event.preventDefault();

    setMessage("");

    if (!nights) {
      setMessage(
        "Please choose a valid check-in and check-out date."
      );
      return;
    }

    setSaving(true);

    try {
      await api.createReservation({
        accommodation: id,
        accommodationId: id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
      });

      setMessage(
        "Reservation created successfully!"
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="reservation-page">
        <Link to={`/stay/${id}`}>
          ← Back to listing
        </Link>

        <div className="reservation-box">
          <h1>Reserve your stay</h1>

          <p>
            Choose your dates and number of guests.
          </p>

          <form onSubmit={submit}>
            <label>
              Check in

              <input
                type="date"
                name="checkIn"
                value={form.checkIn}
                onChange={change}
                required
              />
            </label>

            <label>
              Check out

              <input
                type="date"
                name="checkOut"
                value={form.checkOut}
                onChange={change}
                required
              />
            </label>

            <label>
              Guests

              <input
                type="number"
                name="guests"
                min="1"
                value={form.guests}
                onChange={change}
                required
              />
            </label>

            {nights > 0 && (
              <p>
                {nights} night(s) selected.
              </p>
            )}

            {message && (
              <div className="form-message">
                {message}
              </div>
            )}

            <button type="submit" disabled={saving}>
              {saving
                ? "Booking..."
                : "Confirm reservation"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}