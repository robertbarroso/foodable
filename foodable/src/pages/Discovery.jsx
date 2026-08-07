import { useState } from "react";
import { searchProducts } from "../services/discoveryService";
import "./Discovery.css";

function Discovery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const data = await searchProducts(searchTerm);
      setResults(data.places || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="discovery-container">
      <h1>Find Food Near You</h1>

      <form onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="text"
          inputMode="numeric"
          maxLength="5"
          placeholder="Enter ZIP code..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <button
          className="search-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p>{error}</p>}

      <hr />

      {results.map((item) => (
        <div className="store-card" key={item.id}>
          <h2>{item.name}</h2>

          {item.addressLine1 !== item.name && (
            <p>{item.addressLine1}</p>
          )}

          <p>
            {item.city}, {item.state} {item.zip}
          </p>

          {item.distanceMiles !== null && (
            <p className="distance">
              {item.distanceMiles} miles away
            </p>
          )}

          {item.latitude && item.longitude && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`}
              target="_blank"
              rel="noreferrer"
            >
              View on Map
            </a>
          )}
        </div>
      ))}

      {!loading && !error && results.length === 0 && (
        <p>Enter a ZIP code to find nearby food retailers.</p>
      )}
    </div>
  );
}

export default Discovery;