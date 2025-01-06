import { useState, useEffect } from "react";
import { fetchFilteredVoertuigen } from "../api";
import "../style/Voertuigen.css";
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
        <>
            <section className="voertuigen-hero">
                <div className="container voertuigen">
                    <h1>Voertuigen</h1>
                    <p>In welke auto wil je rijden?</p>
                </div>
            </section>

    <div className="voertuigen-pagina">
      <header className="page-header">
                    {isZakelijk ? "Filter Auto's voor Zakelijke Huurder" : "Filter Voertuigen"}
      </header>
      <VoertuigFilter filters={filters} setFilters={setFilters} isZakelijk={isZakelijk} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <VoertuigWeergave voertuigen={voertuigen} />
            </div>
   </>
  );
};

export default VoertuigenPagina;
