import { useState } from "react";
import { searchProducts } from "../services/discoveryService";

function Discovery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  async function handleSubmit(event) {
    event.preventDefault();

    const data = await searchProducts(searchTerm);
    setResults(data);
  }

  return (
    <div>
      <h1>Discovery</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      <hr />

      {results.map((item) => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <p>{item.address}</p>
          <p>{item.city}</p>
        </div>
      ))}
    </div>
  );
}

export default Discovery;