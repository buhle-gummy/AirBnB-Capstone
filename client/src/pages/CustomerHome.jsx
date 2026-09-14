import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Customer.css";
import AirbnbMark from "../../components/AirbnbMark";

export const homes = [
  {
    id: "camps-bay",
    title: "Oceanfront villa with panoramic views",
    location: "Camps Bay, Cape Town",
    price: 2850,
    rating: 4.94,
    reviews: 128,
    type: "Villa",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "knysna",
    title: "Modern forest escape near the lagoon",
    location: "Knysna, Western Cape",
    price: 1780,
    rating: 4.89,
    reviews: 86,
    type: "Cabin",
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "ballito",
    title: "Sunlit coastal apartment steps from the beach",
    location: "Ballito, KwaZulu-Natal",
    price: 1420,
    rating: 4.87,
    reviews: 212,
    type: "Apartment",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "franschhoek",
    title: "Quiet vineyard cottage with mountain views",
    location: "Franschhoek, Western Cape",
    price: 2200,
    rating: 4.98,
    reviews: 64,
    type: "Cottage",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "joburg",
    title: "Design-led loft in the heart of the city",
    location: "Rosebank, Johannesburg",
    price: 980,
    rating: 4.82,
    reviews: 173,
    type: "Loft",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "drakensberg",
    title: "Warm mountain home under the stars",
    location: "Drakensberg, KwaZulu-Natal",
    price: 1950,
    rating: 4.91,
    reviews: 91,
    type: "Chalet",
    image:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=85",
  },
];

const inspirations = [
  {
    name: "Cape Town",
    detail: "Coastal escapes",
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Garden Route",
    detail: "Nature & calm",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Johannesburg",
    detail: "City energy",
    image:
      "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Drakensberg",
    detail: "Mountain air",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=85",
  },
];

const defaultPropertyImages = homes.map((home) => home.image);

function getPropertyImage(index = 0) {
  return defaultPropertyImages[index % defaultPropertyImages.length];
}

function CustomerHome() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("Popular");
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);
  const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0 });
  const [theme, setTheme] = useState(
    () => localStorage.getItem("airbnb-theme") || "light",
  );
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("airbnb-theme", theme);
  }, [theme]);

  useEffect(() => {
    fetch("https://airbnb-capstone-server.onrender.com/")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Unable to load stays");
        setListings(data.accommodations || []);
      })
      .catch((error) => setListingError(error.message))
      .finally(() => setLoadingListings(false));
  }, []);

  const filteredHomes = useMemo(
    () =>
      listings.filter((home) => {
        const matchesQuery =
          !query ||
          `${home.title} ${home.location}`
            .toLowerCase()
            .includes(query.toLowerCase());
        return matchesQuery;
      }),
    [listings, query],
  );

  const totalGuests = guests.adults + guests.children;
  const guestLabel = totalGuests || guests.infants
    ? `${totalGuests} guest${totalGuests === 1 ? "" : "s"}${guests.infants ? `, ${guests.infants} infant${guests.infants === 1 ? "" : "s"}` : ""}`
    : "Add guests";

  const updateGuests = (type, amount) => {
    setGuests((current) => ({
      ...current,
      [type]: Math.max(0, current[type] + amount),
    }));
  };

  return (
    <div className="stay-app">
      <header className="stay-header">
        <Link to="/" className="stay-brand">
          <span className="brand-mark"><AirbnbMark /></span>
          <span>Airbnb</span>
        </Link>
        <nav className="stay-nav">
          <a href="#homes">Stays</a>
          <a href="#inspiration">Explore</a>
          <a href="#hosting">Become a host</a>
        </nav>
        <div className="stay-actions">
          <Link to="/admin/login" className="admin-link">
            Manage stays
          </Link>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
          </button>
          <button className="icon-button" aria-label="Open menu">
            ☰
          </button>
          <button
            className="avatar-button"
            aria-label="Profile"
            onClick={() => navigate("/login")}
          >
            ◉
          </button>
        </div>
      </header>

      <main>
        <section className="stay-hero">
          <div className="hero-copy">
            <p className="eyebrow">YOUR NEXT ESCAPE STARTS HERE</p>
            <h1>
              Find a place
              <br />
              <em>worth staying for.</em>
            </h1>
            <p className="hero-subtitle">
              Handpicked homes, thoughtful hosts, and stays that feel like a
              story.
            </p>
          </div>
          <div className="hero-search" role="search">
            <label className="search-pill-field search-pill-location">
              <span className="search-pill-icon" aria-hidden="true">⌂</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Anywhere"
                aria-label="Search destinations"
              />
            </label>
            <label className="search-pill-field">
              <input type="text" placeholder="Anytime" aria-label="When" />
            </label>
            <div className="search-pill-field guest-picker-field">
              <button
                className="guest-picker-trigger"
                type="button"
                aria-expanded={guestPickerOpen}
                aria-haspopup="dialog"
                onClick={() => setGuestPickerOpen((open) => !open)}
              >
                {guestLabel}
              </button>
              {guestPickerOpen && (
                <div className="guest-picker" role="dialog" aria-label="Choose guests">
                  {[
                    ["adults", "Adults", "Ages 13 or above"],
                    ["children", "Children", "Ages 2–12"],
                    ["infants", "Infants", "Under 2"],
                  ].map(([type, title, detail]) => (
                    <div className="guest-picker-row" key={type}>
                      <span>
                        <strong>{title}</strong>
                        <small>{detail}</small>
                      </span>
                      <span className="guest-picker-controls">
                        <button
                          type="button"
                          aria-label={`Remove ${title.toLowerCase()}`}
                          disabled={guests[type] === 0}
                          onClick={() => updateGuests(type, -1)}
                        >−</button>
                        <b>{guests[type]}</b>
                        <button
                          type="button"
                          aria-label={`Add ${title.toLowerCase()}`}
                          onClick={() => updateGuests(type, 1)}
                        >+</button>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setGuestPickerOpen(false);
                document
                  .getElementById("homes")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="search-submit"
            >
              <span aria-hidden="true">⌕</span>
            </button>
          </div>
        </section>

        <section className="section-block" id="inspiration">
          <div className="section-heading">
            <div>
              <p className="eyebrow">GO SOMEWHERE NEW</p>
              <h2>Inspiration for your next trip</h2>
            </div>
            <a href="#homes" className="text-link">
              Explore all <span>→</span>
            </a>
          </div>
          <div className="inspiration-grid">
            {inspirations.map((place) => (
              <button
                className="inspiration-card"
                key={place.name}
                onClick={() => setQuery(place.name)}
              >
                <img src={place.image} alt={place.name} />
                <span>
                  <strong>{place.name}</strong>
                  <small>{place.detail}</small>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="section-block homes-section" id="homes">
          <div className="section-heading">
            <div>
              <p className="eyebrow">STAY A WHILE</p>
              <h2>Homes guests love</h2>
            </div>
          </div>
          <div className="home-grid">
            {loadingListings && (
              <div className="empty-result">
                Finding beautiful stays for you...
              </div>
            )}
            {listingError && <div className="empty-result">{listingError}</div>}
            {filteredHomes.map((home, index) => (
              <article
                className="home-card"
                key={home._id}
                onClick={() => navigate(`/stays/${home._id}`)}
              >
                <div className="home-image">
                  <img
                    src={home.images?.[0] || getPropertyImage(index)}
                    alt={home.title}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = getPropertyImage(index);
                    }}
                  />
                  <button
                    className="heart"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Save home"
                  >
                    ♡
                  </button>
                </div>
                <div className="home-info">
                  <div className="home-title-row">
                    <h3>{home.title}</h3>
                    <span>★ {home.rating || "New"}</span>
                  </div>
                  <p>{home.location}</p>
                  <p className="home-meta">
                    {home.type} · {home.bedrooms} bedrooms · {home.guests}{" "}
                    guests
                  </p>
                  <strong>
                    R{Number(home.price).toLocaleString("en-ZA")}{" "}
                    <small>night</small>
                  </strong>
                </div>
              </article>
            ))}
          </div>
          {!loadingListings && !listingError && filteredHomes.length === 0 && (
            <div className="empty-result">
              No homes matched that search. Try another destination.
            </div>
          )}
        </section>

        <section className="experience-section section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">DISCOVER MORE</p>
              <h2>Make your trip memorable</h2>
            </div>
          </div>
          <div className="experience-grid">
            <article>
              <span>✦</span>
              <h3>Experiences</h3>
              <p>
                Find local activities, food, and stories curated for curious
                travellers.
              </p>
              <button
                onClick={() =>
                  document
                    .getElementById("homes")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore experiences →
              </button>
            </article>
            <article>
              <span>⌂</span>
              <h3>Things to do</h3>
              <p>
                Slow mornings, city walks, and unforgettable moments close to
                your stay.
              </p>
              <button
                onClick={() =>
                  document
                    .getElementById("inspiration")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Find inspiration →
              </button>
            </article>
            <article>
              <span>♡</span>
              <h3>At home</h3>
              <p>
                Bring the feeling of a beautiful getaway into your everyday
                space.
              </p>
              <button
                onClick={() =>
                  document
                    .getElementById("hosting")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Discover more →
              </button>
            </article>
          </div>
        </section>
        <section className="gift-section">
          <div>
            <p className="eyebrow">GIVE THE GIFT OF GETAWAY</p>
            <h2>
              Send someone
              <br />
              <em>somewhere special.</em>
            </h2>
            <p>Share a little more soul with an Airbnb gift card.</p>
            <button
              onClick={() =>
                document
                  .getElementById("homes")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore stays →
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85"
            alt="A thoughtful travel gift"
          />
        </section>
        <section className="feature-banner" id="hosting">
          <div>
            <p className="eyebrow">A MORE MEANINGFUL WAY TO TRAVEL</p>
            <h2>
              Make room for
              <br />
              <em>more connection.</em>
            </h2>
            <p>
              From a quiet weekend away to a month-long reset, find spaces
              designed for the way you want to live.
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("homes")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Discover stays <span>→</span>
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1200&q=85"
            alt="Warm, welcoming living room"
          />
        </section>

        <section className="section-block getaway-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PLAN AHEAD</p>
              <h2>Getaways for every season</h2>
            </div>
            <div className="tab-list">
              {["Popular", "Beach", "Mountains", "City breaks"].map((item) => (
                <button
                  className={tab === item ? "active" : ""}
                  key={item}
                  onClick={() => setTab(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="getaway-content">
            <div>
              <span className="getaway-number">
                0
                {["Popular", "Beach", "Mountains", "City breaks"].indexOf(tab) +
                  1}
              </span>
              <h3>
                {tab === "Popular"
                  ? "Small moments, big memories"
                  : `${tab} escapes made easy`}
              </h3>
              <p>
                Discover stays that make it easy to slow down, switch off, and
                see somewhere through a new lens.
              </p>
              <a href="#homes" className="text-link">
                Find your stay <span>→</span>
              </a>
            </div>
            <img
              src={
                tab === "Mountains"
                  ? inspirations[3].image
                  : tab === "Beach"
                    ? inspirations[0].image
                    : tab === "City breaks"
                      ? inspirations[2].image
                      : inspirations[1].image
              }
              alt={`${tab} getaway`}
            />
          </div>
        </section>
      </main>

      <footer className="stay-footer">
        <div className="footer-top">
          <Link to="/" className="stay-brand">
            <span className="brand-mark"><AirbnbMark /></span>
            <span>Airbnb</span>
          </Link>
          <p>Stays with a little more soul.</p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Airbnb</strong>
            <a href="#inspiration">About us</a>
            <a href="#hosting">Careers</a>
            <a href="/admin/login">Manage listings</a>
          </div>
          <div>
            <strong>Support</strong>
            <a href="#homes">Help centre</a>
            <a href="#homes">Safety information</a>
            <a href="#homes">Cancellation options</a>
          </div>
          <div>
            <strong>Hosting</strong>
            <a href="#hosting">List your home</a>
            <a href="#hosting">Host resources</a>
            <a href="#hosting">Community</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Airbnb, Inc.</span>
          <span>Privacy · Terms · Sitemap</span>
        </div>
      </footer>
    </div>
  );
}

export default CustomerHome;
