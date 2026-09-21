import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import { api } from "../services/api";

import "./Listings.css";

const fallback = [
  {
    id: "camps-bay",
    title: "Oceanfront Villa",
    location: "Camps Bay, Cape Town",
    price: 2850,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "sandton",
    title: "Luxury City Apartment",
    location: "Sandton, Johannesburg",
    price: 1950,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

export default function Listings() {
  const [searchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = searchParams.get("location") || "";
  const type = searchParams.get("type") || "";

  useEffect(() => {
    let active = true;

    async function loadListings() {
      setLoading(true);
      setError("");

      try {
        const data = await api.getAccommodations();

        const list = Array.isArray(data)
          ? data
          : data?.accommodations ||
            data?.data ||
            [];

        if (active) {
          setProperties(list);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
          setProperties(fallback);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadListings();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const locationQuery = location.toLowerCase();
    const categoryQuery = type.toLowerCase();

    return properties.filter((property) => {
      const propertyLocation =
        `${property.location || ""} ${property.title || ""}`
          .toLowerCase();

      const propertyType =
        `${property.type || ""} ${property.title || ""}`
          .toLowerCase();

      const matchesLocation =
        !locationQuery ||
        propertyLocation.includes(locationQuery);

      const matchesType =
        !categoryQuery ||
        propertyType.includes(categoryQuery);

      return matchesLocation && matchesType;
    });
  }, [properties, location, type]);

  return (
    <>
      <Navbar />

      <main className="listings-page">
        <div className="listings-header">
          <div>
            

            <h1>
              {location || type
                ? `Stays ${
                    location
                      ? `in ${location}`
                      : `for ${type}`
                  }`
                : "Explore stays"}
            </h1>

            <p>
              Find a comfortable place for your
              next trip.
            </p>
          </div>

          <Link
            to="/"
            className="back-home"
          >
            Back home
          </Link>
        </div>

        {loading && (
          <p className="status">
            Loading listings...
          </p>
        )}

        {error && (
          <div className="notice">
            The live listings could not be loaded
            right now. Showing available demo stays
            instead.
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="empty">
            <h2>No stays found</h2>

            <p>
              Try another destination or category.
            </p>

            <Link to="/listings">
              Show all stays
            </Link>
          </div>
        )}

        <div className="listing-grid">
          {filtered.map((property) => (
            <PropertyCard
              property={{
                ...property,
                id:
                  property._id ||
                  property.id,
              }}
              key={
                property._id ||
                property.id ||
                property.title
              }
            />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}