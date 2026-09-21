import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaStar, FaArrowLeft } from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from "../services/api";

import "./StayDetails.css";

export default function StayDetails() {
  const { id } = useParams();

  const [stay, setStay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadStay() {
      try {
        setLoading(true);
        setError("");
        setStay(null);

        if (!id) {
          throw new Error(
            "No accommodation was selected."
          );
        }

        const data =
          await api.getAccommodation(id);

        const accommodation =
          data?.accommodation ||
          data?.data ||
          data;

        if (
          !accommodation ||
          !accommodation._id
        ) {
          throw new Error(
            "Accommodation not found."
          );
        }

        if (isMounted) {
          setStay(accommodation);
        }
      } catch (err) {
        console.error(
          "Failed to fetch accommodation:",
          err
        );

        if (isMounted) {
          setStay(null);

          setError(
            err?.message ||
              "Failed to fetch accommodation."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadStay();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const totalPreview = useMemo(() => {
    if (!stay) {
      return 0;
    }

    const price =
      Number(stay.price) || 0;

    const cleaning =
      Number(stay.cleaningFee) || 0;

    const service =
      Number(stay.serviceFee) || 0;

    const taxes =
      Number(stay.occupancyTaxes) || 0;

    return (
      price +
      cleaning +
      service +
      taxes
    );
  }, [stay]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="details-page">
          <div className="loading-page">
            Loading stay...
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !stay) {
    return (
      <>
        <Navbar />

        <main className="details-page">
          <Link
            to="/listings"
            className="back-link"
          >
            <FaArrowLeft />
            Back to stays
          </Link>

          <div className="notice error">
            <h2>
              Unable to load this stay
            </h2>

            <p>
              {error ||
                "Accommodation not found."}
            </p>

            <Link
              to="/listings"
              className="reserve-button"
            >
              View available stays
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /* =====================================================
     REAL DATABASE IMAGES ONLY
  ===================================================== */

  const images =
    Array.isArray(stay.images)
      ? stay.images.filter(Boolean)
      : [];

  return (
    <>
      <Navbar />

      <main className="details-page">
        <Link
          to="/listings"
          className="back-link"
        >
          <FaArrowLeft />
          Back to stays
        </Link>

        <div className="details-heading">
          <div>
            <h1>
              {stay.title ||
                "Accommodation"}
            </h1>

            <p>
              <FaStar />

              {stay.rating
                ? stay.rating
                : "New"}

              {" · "}

              {stay.location ||
                "Location unavailable"}
            </p>
          </div>
        </div>

        {/* =================================================
            PHOTOS
        ================================================= */}

        {images.length > 0 ? (
          <div className="photo-grid">
            {images
              .slice(0, 5)
              .map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${stay.title || "Stay"} ${
                    index + 1
                  }`}
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ))}
          </div>
        ) : (
          <div className="notice">
            No photos are available for this
            accommodation.
          </div>
        )}

        <div className="details-layout">
          <section>
            <h2>
              About this place
            </h2>

            <p className="description">
              {stay.description ||
                "No description has been added for this accommodation yet."}
            </p>

            <div className="facts">
              <span>
                {stay.guests || 1} guests
              </span>

              <span>
                {stay.bedrooms || 1} bedrooms
              </span>

              <span>
                {stay.bathrooms || 1} bathrooms
              </span>
            </div>

            <h2>Amenities</h2>

            {Array.isArray(
              stay.amenities
            ) &&
            stay.amenities.length > 0 ? (
              <div className="amenities">
                {stay.amenities.map(
                  (item, index) => (
                    <span
                      key={`${item}-${index}`}
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p>
                No amenities have been
                listed for this stay.
              </p>
            )}
          </section>

          {/* =================================================
              BOOKING CARD
          ================================================= */}

          <aside className="booking-card">
            <div className="price-row">
              <strong>
                R
                {Number(
                  stay.price || 0
                ).toLocaleString()}
              </strong>

              <span>
                night
              </span>
            </div>

            <div className="booking-summary">
              <span>
                Base price
              </span>

              <strong>
                R
                {Number(
                  stay.price || 0
                ).toLocaleString()}
              </strong>
            </div>

            <div className="booking-summary">
              <span>
                Cleaning fee
              </span>

              <strong>
                R
                {Number(
                  stay.cleaningFee || 0
                ).toLocaleString()}
              </strong>
            </div>

            <div className="booking-summary">
              <span>
                Service fee
              </span>

              <strong>
                R
                {Number(
                  stay.serviceFee || 0
                ).toLocaleString()}
              </strong>
            </div>

            <div className="booking-summary">
              <span>
                Occupancy taxes
              </span>

              <strong>
                R
                {Number(
                  stay.occupancyTaxes ||
                    0
                ).toLocaleString()}
              </strong>
            </div>

            <div className="booking-total">
              <span>
                Estimated total
              </span>

              <strong>
                R
                {totalPreview.toLocaleString()}
              </strong>
            </div>

            <Link
              to={`/reserve/${stay._id}`}
              className="reserve-button"
            >
              Book now
            </Link>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}