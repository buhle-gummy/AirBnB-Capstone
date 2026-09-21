import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  const id = property._id || property.id;

  const image =
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80";

  const price = Number(
    property.price || 0
  ).toLocaleString("en-ZA");

  return (
    <article className="property-card">
      <Link
        to={`/stay/${id}`}
        className="property-image-link"
      >
        <div className="property-image">
          <img
            src={image}
            alt={property.title || "Accommodation"}
          />

          <span className="favorite-badge">
            Guest favorite
          </span>

          <button
            className="heart-button"
            aria-label="Save listing"
            onClick={(event) =>
              event.preventDefault()
            }
          >
            <FaHeart />
          </button>
        </div>
      </Link>

      <div className="property-info">
        <Link
          to={`/stay/${id}`}
          className="property-title"
        >
          {property.title || "Beautiful stay"}
        </Link>

        <p>
          {property.location || "South Africa"}
        </p>

        <div className="property-bottom">
          <strong>
            R{price} night
          </strong>

          <span>
            ★ {property.rating || "New"}
          </span>
        </div>
      </div>
    </article>
  );
}