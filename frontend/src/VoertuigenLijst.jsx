
import { useState, useEffect } from "react";
import { fetchFilteredVoertuigen } from "./api";

const VoertuigenLijst = () => {
  const [voertuigen, setVoertuigen] = useState([]);
  const [filters, setFilters] = useState({
    soort: "",
    kleur: "",
    vanafAanschafjaar: "",
    totAanschafjaar: "",
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div>
      <h2>Filter Voertuigen</h2>
      <div>
        <label>Soort: </label>
        <select name="soort" onChange={handleFilterChange}>
          <option value="">Alle</option>
          <option value="Auto">Auto</option>
          <option value="Camper">Camper</option>
          <option value="Caravan">Caravan</option>
        </select>

        <label>Kleur: </label>
        <input
          type="text"
          name="kleur"
          onChange={handleFilterChange}
          placeholder="Bijv. Rood"
        />

        <label>Vanaf Jaar: </label>
        <input
          type="number"
          name="vanafAanschafjaar"
          onChange={handleFilterChange}
        />

        <label>Tot Jaar: </label>
        <input
          type="number"
          name="totAanschafjaar"
          onChange={handleFilterChange}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <h3>Beschikbare Voertuigen</h3>
        {voertuigen.length > 0 ? (
          voertuigen.map((voertuig) => (
            <div key={voertuig.voertuigId}>
              <p>
                <strong>
                  {voertuig.merk} {voertuig.type} ({voertuig.soort})
                </strong>{" "}
                - {voertuig.kleur}, {voertuig.aanschafjaar}
              </p>
            </div>
          ))
        ) : (
          <p>Geen voertuigen gevonden.</p>
        )}
      </div>
    </div>
  );
};

export default VoertuigenLijst;
