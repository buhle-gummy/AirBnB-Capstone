import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  FaChevronRight,
  FaHeart,
  FaAirbnb,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { api } from "../services/api";

import "./Home.css";

/* =========================================================
   NEARBY DESTINATIONS
========================================================= */

const nearby = [
  {
    name: "Sandton City",
    distance: "10 km away",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Johannesburg",
    distance: "15 km away",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Woodmead",
    distance: "8 km away",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Hyde Park",
    distance: "12 km away",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85",
  },
];

/* =========================================================
   FUTURE DESTINATIONS
========================================================= */

const futureDestinations = [
  "Cape Town",
  "Johannesburg",
  "Durban",
  "Pretoria",
  "Knysna",
  "Ballito",
  "Stellenbosch",
  "Hermanus",
];

/* =========================================================
   HOME PAGE
========================================================= */

export default function Home() {
  const navigate = useNavigate();

  /* =======================================================
     REAL ACCOMMODATIONS FROM DATABASE
  ======================================================= */

  const [homes, setHomes] = useState([]);
  const [homesLoading, setHomesLoading] = useState(true);
  const [homesError, setHomesError] = useState("");

  /* =======================================================
     SEARCH STATE
  ======================================================= */

  const [activeSearch, setActiveSearch] = useState(null);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(0);

  /* =======================================================
     LOAD REAL ACCOMMODATIONS
  ======================================================= */

  useEffect(() => {
    let isMounted = true;

    async function loadHomes() {
      try {
        setHomesLoading(true);
        setHomesError("");

        const response = await api.getAccommodations();

        console.log("HOME ACCOMMODATIONS:", response);

        const accommodations =
          response?.accommodations ||
          response?.data ||
          response ||
          [];

        if (!Array.isArray(accommodations)) {
          throw new Error("Invalid accommodation data received.");
        }

        if (isMounted) {
          setHomes(accommodations);
        }
      } catch (error) {
        console.error("Failed to fetch accommodations:", error);

        if (isMounted) {
          setHomes([]);
          setHomesError(
            error?.message ||
              "Failed to load accommodations."
          );
        }
      } finally {
        if (isMounted) {
          setHomesLoading(false);
        }
      }
    }

    loadHomes();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =======================================================
     SEARCH LOCATIONS
  ======================================================= */

  const locations = [
    "Johannesburg",
    "Sandton",
    "Cape Town",
    "Durban",
    "Pretoria",
    "Everywhere",
  ];

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  function formatDate(date) {
    if (!date) {
      return "Add dates";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-ZA",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  /* =======================================================
     SEARCH LISTINGS
  ======================================================= */

  function handleSearch() {
    const params = new URLSearchParams();

    if (location) {
      params.set("location", location);
    }

    if (checkIn) {
      params.set("checkIn", checkIn);
    }

    if (checkOut) {
      params.set("checkOut", checkOut);
    }

    if (guests) {
      params.set("guests", guests);
    }

    navigate(`/listings?${params.toString()}`);

    setActiveSearch(null);
  }

  return (
    <div className="home-page">
      <Navbar />

      <main>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero">
          <div className="hero-overlay">
            <div className="hero-content">

              <div class="banner-content">
      <h1 id="destination-heading" class="banner-heading">
        Not sure where to go? Perfect.
      </h1>

      <button class="banner-button" type="button">
        I’m flexible
      </button>
    </div>
              {/* =================================================
                  SEARCH BAR
              ================================================= */}

              <div
                className="search-box"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >

                {/* WHERE */}

                <div
                  className={`search-item ${
                    activeSearch === "location"
                      ? "search-active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveSearch("location")
                  }
                >
                  <span className="search-label">
                    Where
                  </span>

                  <span className="search-value">
                    {location || "Search destinations"}
                  </span>

                  {activeSearch === "location" && (
                    <div className="search-dropdown location-dropdown">

                      <div className="dropdown-title">
                        Where do you want to go?
                      </div>

                      {locations.map((place) => (
                        <button
                          key={place}
                          type="button"
                          className="location-option"
                          onClick={() => {
                            setLocation(place);
                            setActiveSearch(null);
                          }}
                        >
                          <span>{place}</span>
                        </button>
                      ))}

                    </div>
                  )}
                </div>

                <div className="search-divider" />

                {/* CHECK IN */}

                <div
                  className={`search-item ${
                    activeSearch === "checkIn"
                      ? "search-active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveSearch("checkIn")
                  }
                >
                  <span className="search-label">
                    Check in
                  </span>

                  <span className="search-value">
                    {formatDate(checkIn)}
                  </span>

                  {activeSearch === "checkIn" && (
                    <div className="search-dropdown date-dropdown">

                      <div className="dropdown-title">
                        Select check-in date
                      </div>

                      <input
                        type="date"
                        value={checkIn}
                        min={
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={(event) => {
                          setCheckIn(event.target.value);
                          setActiveSearch(null);
                        }}
                        autoFocus
                      />

                    </div>
                  )}
                </div>

                <div className="search-divider" />

                {/* CHECK OUT */}

                <div
                  className={`search-item ${
                    activeSearch === "checkOut"
                      ? "search-active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveSearch("checkOut")
                  }
                >
                  <span className="search-label">
                    Check out
                  </span>

                  <span className="search-value">
                    {formatDate(checkOut)}
                  </span>

                  {activeSearch === "checkOut" && (
                    <div className="search-dropdown date-dropdown">

                      <div className="dropdown-title">
                        Select check-out date
                      </div>

                      <input
                        type="date"
                        value={checkOut}
                        min={
                          checkIn ||
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={(event) => {
                          setCheckOut(event.target.value);
                          setActiveSearch(null);
                        }}
                        autoFocus
                      />

                    </div>
                  )}
                </div>

                <div className="search-divider" />

                {/* GUESTS */}

                <div
                  className={`search-item ${
                    activeSearch === "guests"
                      ? "search-active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveSearch("guests")
                  }
                >
                  <span className="search-label">
                    Guests
                  </span>

                  <span className="search-value">
                    {guests === 0
                      ? "Add guests"
                      : `${guests} ${
                          guests === 1
                            ? "guest"
                            : "guests"
                        }`}
                  </span>

                  {activeSearch === "guests" && (
                    <div className="search-dropdown guests-dropdown">

                      <div className="dropdown-title">
                        How many guests?
                      </div>

                      {[1, 2, 3, 4, 5].map((number) => (
                        <button
                          key={number}
                          type="button"
                          className={`guest-option ${
                            guests === number
                              ? "guest-selected"
                              : ""
                          }`}
                          onClick={() => {
                            setGuests(number);
                            setActiveSearch(null);
                          }}
                        >
                          <span>
                            {number}{" "}
                            {number === 1
                              ? "guest"
                              : "guests"}
                          </span>

                          {guests === number && (
                            <span>✓</span>
                          )}
                        </button>
                      ))}

                    </div>
                  )}
                </div>

                {/* SEARCH BUTTON */}

                <button
                  type="button"
                  className="search-button"
                  aria-label="Search listings"
                  onClick={handleSearch}
                >
                  <FaSearch />
                </button>

              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            HOMES GUESTS LOVE
            REAL DATABASE LISTINGS ONLY
        ================================================= */}

        <section className="home-section">

          <div className="section-heading">
            <div>
              <h2>Homes guests love</h2>
              <p>
                Stay somewhere special.
              </p>
            </div>

            <Link
              to="/listings"
              className="circle-button"
              aria-label="View all homes"
            >
              <FaChevronRight />
            </Link>
          </div>

          {/* LOADING */}

          {homesLoading && (
            <div className="notice">
              Loading available stays...
            </div>
          )}

          {/* ERROR */}

          {!homesLoading && homesError && (
            <div className="notice error">
              <p>
                Unable to load accommodations.
              </p>

              <small>
                {homesError}
              </small>
            </div>
          )}

          {/* NO LISTINGS */}

          {!homesLoading &&
            !homesError &&
            homes.length === 0 && (
              <div className="notice">
                <h3>No stays available yet.</h3>

                <p>
                  Add an accommodation from the
                  admin dashboard and it will appear
                  here automatically.
                </p>
              </div>
            )}

          {/* REAL LISTINGS */}

          {!homesLoading &&
            !homesError &&
            homes.length > 0 && (
              <div className="property-grid">

                {homes.map((home) => {

                  const image =
                    Array.isArray(home.images) &&
                    home.images.length > 0
                      ? home.images[0]
                      : null;

                  return (
                    <article
                      className="property-card"
                      key={home._id}
                    >

                      <Link
                        to={`/stay/${home._id}`}
                        className="property-image-link"
                      >

                        <div className="property-image">

                          {image ? (
                            <img
                              src={image}
                              alt={
                                home.title ||
                                "Accommodation"
                              }
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="no-image">
                              No photo available
                            </div>
                          )}

                          <span className="favorite-badge">
                            Guest favorite
                          </span>

                          <button
                            type="button"
                            className="heart-button"
                            aria-label={`Save ${
                              home.title ||
                              "accommodation"
                            }`}
                            onClick={(event) =>
                              event.preventDefault()
                            }
                          >
                            <FaHeart />
                          </button>

                        </div>

                      </Link>

                      <div className="property-info">

                        <div className="property-title-row">

                          <h3>
                            {home.title ||
                              "Accommodation"}
                          </h3>

                          <span className="property-rating">
                            ★{" "}
                            {home.rating
                              ? home.rating
                              : "New"}
                          </span>

                        </div>

                        <p>
                          {home.location ||
                            "Location unavailable"}
                        </p>

                        <strong className="property-price">
                          R
                          {Number(
                            home.price || 0
                          ).toLocaleString()}{" "}
                          <span>night</span>
                        </strong>

                      </div>

                    </article>
                  );
                })}

              </div>
            )}

        </section>

        {/* =================================================
            INSPIRATION
        ================================================= */}

        <section className="inspiration-section">

          <div className="home-section">

            <div className="section-heading">

              <div>
                <h2>
                  Inspiration for your next trip
                </h2>

                <p>
                  Explore places close to you.
                </p>
              </div>

              <Link
                to="/listings"
                className="circle-button"
                aria-label="Explore destinations"
              >
                <FaChevronRight />
              </Link>

            </div>

            <div className="inspiration-grid">

              {nearby.map((place) => (
                <Link
                  to={`/listings?location=${encodeURIComponent(
                    place.name
                  )}`}
                  className="inspiration-card"
                  key={place.name}
                >

                  <div className="inspiration-image">

                    <img
                      src={place.image}
                      alt={place.name}
                    />

                  </div>

                  <div className="inspiration-content">

                    <h3>{place.name}</h3>

                    <p>{place.distance}</p>

                    <span>
                      Explore stays
                      <FaArrowRight />
                    </span>

                  </div>

                </Link>
              ))}

            </div>

          </div>

        </section>

        {/* =================================================
            EXPERIENCES
        ================================================= */}

        <section
          className="home-section experiences-section"
          id="experiences"
        >

          <div className="section-heading">

            <div>
              <h2>
                Discover Airbnb Experiences
              </h2>

              <p>
                Things to do on your trip or from home.
              </p>
            </div>

          </div>

          <div className="experiences-grid">

            <article className="experience-card">

              <div className="experience-image">

                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85"
                  alt="People enjoying an Airbnb experience"
                />

              </div>

              <div className="experience-content">

                <span className="experience-label">
                  ON YOUR TRIP
                </span>

                <h3>
                  Things to do on your trip
                </h3>

                <p>
                  Book unforgettable activities
                  hosted by locals and discover
                  something new.
                </p>

                <Link
                  to="/listings"
                  className="experience-link"
                >
                  Explore Experiences
                  <FaArrowRight />
                </Link>

              </div>

            </article>

            <article className="experience-card">

              <div className="experience-image">

                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=85"
                  alt="People enjoying an online experience"
                />

              </div>

              <div className="experience-content">

                <span className="experience-label">
                  FROM HOME
                </span>

                <h3>
                  Things to do from home
                </h3>

                <p>
                  Connect with people around the
                  world through unique online
                  experiences.
                </p>

                <a
                  href="#gift-cards"
                  className="experience-link"
                >
                  Explore Online Experiences
                  <FaArrowRight />
                </a>

              </div>

            </article>

          </div>

        </section>

        {/* =================================================
            GIFT CARDS
        ================================================= */}

        <section
          className="gift-section"
          id="gift-cards"
        >

          <div className="gift-content">

            <h2>
              Shop Airbnb
              <br />
              gift cards
            </h2>

            <p>
              Give someone the gift of travel,
              discovery and unforgettable stays.
            </p>

            <Link
              to="/listings"
              className="gift-button"
            >
              Learn more
            </Link>

          </div>

          <div className="gift-cards-visual">

            <div className="gift-card gift-card-left">

              <img
                src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=700&q=85"
                alt="Travel destination"
              />

              <FaAirbnb className="airbnb-symbol" />

            </div>

            <div className="gift-card gift-card-middle">

              <FaAirbnb className="middle-symbol" />

            </div>

            <div className="gift-card gift-card-right">

              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=85"
                alt="Beach destination"
              />

              <FaAirbnb className="airbnb-symbol" />

            </div>

          </div>

        </section>

        {/* =================================================
            HOSTING
        ================================================= */}

        <section className="hosting-section">

          <div className="hosting-image">

            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=90"
              alt="Beautiful Airbnb home"
            />

          </div>

          <div className="hosting-overlay" />

          <div className="hosting-content">

            <span className="section-eyebrow">
              BECOME A HOST
            </span>

            <h2>
              Questions
              <br />
              about
              <br />
              hosting?
            </h2>

            <p>
              Share your space and earn money
              hosting guests.
            </p>

            <Link
              to="/listings"
              className="hosting-button"
            >
              Ask a Superhost
            </Link>

          </div>

        </section>

        {/* =================================================
            FUTURE GETAWAYS
        ================================================= */}

        <section className="future-section">

          <div className="home-section">

            <div className="section-heading">

              <div>
                <h2>
                  Inspiration for future getaways
                </h2>

                <p>
                  Explore more destinations across
                  South Africa.
                </p>
              </div>

            </div>

            <div className="future-tabs">

              <button
                type="button"
                className="active"
              >
                Popular destinations
              </button>

              <button type="button">
                Arts &amp; culture
              </button>

              <button type="button">
                Outdoor adventure
              </button>

              <button type="button">
                Mountains
              </button>

              <button type="button">
                Beach
              </button>

              <button type="button">
                Unique stays
              </button>

            </div>

            <div className="future-grid">

              {futureDestinations.map((city) => (
                <Link
                  to={`/listings?location=${encodeURIComponent(
                    city
                  )}`}
                  className="future-card"
                  key={city}
                >

                  <div>
                    <strong>{city}</strong>
                    <span>South Africa</span>
                  </div>

                  <FaChevronRight />

                </Link>
              ))}

            </div>

            <div className="future-more">

              <Link
                to="/listings"
                className="show-more"
              >
                Show more
                <FaChevronRight />
              </Link>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}