import { useState, useEffect } from "react";
import { fetchFilteredVoertuigen } from "../api.js";
import "../voertuigenPagina.css";

const VoertuigenPagina = () => {
  const [voertuigen, setVoertuigen] = useState([]);
  const [filters, setFilters] = useState({
    soort: "",
    startDatum: "",
    eindDatum: "",
    sorteerOp: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVoertuigen = async () => {
      try {
        const data = await fetchFilteredVoertuigen(filters);
        setVoertuigen(data);
      } catch (err) {
        setError(err.message);
      }
    };
    loadVoertuigen();
  }, [filters]);

  return (
    <div className="voertuigen-pagina">
      <h2>Filter Voertuigen</h2>
      <VoertuigFilter filters={filters} setFilters={setFilters} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <VoertuigWeergave voertuigen={voertuigen} />
    </div>
  );
};

const VoertuigFilter = ({ filters, setFilters }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="voertuigen-filters">
      <div>
        <label>Soort:</label>
        <select
          name="soort"
          value={filters.soort}
          onChange={handleFilterChange}
        >
          <option value="">Alle</option>
          <option value="Auto">Auto</option>
          <option value="Camper">Camper</option>
          <option value="Caravan">Caravan</option>
        </select>
      </div>

      <div>
        <label>Startdatum:</label>
        <input
          type="date"
          name="startDatum"
          value={filters.startDatum}
          onChange={handleFilterChange}
        />
      </div>

      <div>
        <label>Einddatum:</label>
        <input
          type="date"
          name="eindDatum"
          value={filters.eindDatum}
          onChange={handleFilterChange}
        />
      </div>

      <div>
        <label>Sorteer op:</label>
        <select
          name="sorteerOp"
          value={filters.sorteerOp}
          onChange={handleFilterChange}
        >
          <option value="">Geen</option>
          <option value="prijs">Prijs</option>
          <option value="merk">Merk</option>
          <option value="beschikbaarheid">Beschikbaarheid</option>
        </select>
      </div>
    </div>
  );
};

const VoertuigWeergave = ({ voertuigen }) => {
  if (!voertuigen.length) {
    return <p>Geen voertuigen gevonden.</p>;
  }

  return (
    <div className="voertuigen-weergave">
      <h3>Beschikbare Voertuigen</h3>
      <div className="voertuigen-grid">
        {voertuigen.map((voertuig) => (
          <div className="voertuigen-kaart" key={voertuig.voertuigId}>
            <p>
              <strong>
                {voertuig.merk} {voertuig.type} ({voertuig.soort})
              </strong>
            </p>
            <p>Kleur: {voertuig.kleur}</p>
            <p>Aanschafjaar: {voertuig.aanschafjaar}</p>
            <p>Prijs: €{voertuig.prijs}</p>
            <p>Status: {voertuig.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoertuigenPagina;
