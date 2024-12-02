import { useState, useEffect } from "react";
import { fetchFilteredVoertuigen } from "../api";
import "../voertuigenPagina.css";
import VoertuigFilter from "./VoertuigFilter";
import VoertuigWeergave from "./VoertuigWeergave";

const VoertuigenPagina = ({ isZakelijk }) => {
  const [voertuigen, setVoertuigen] = useState([]);
  const [filters, setFilters] = useState({
    soort: isZakelijk ? "Auto" : "",
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
      <h2>{isZakelijk ? "Filter Auto's voor Zakelijke Huurder" : "Filter Voertuigen"}</h2>
      <VoertuigFilter filters={filters} setFilters={setFilters} isZakelijk={isZakelijk} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <VoertuigWeergave voertuigen={voertuigen} />
    </div>
  );
};

export default VoertuigenPagina;
