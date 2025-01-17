import { useState, useEffect } from "react";
import { fetchFilteredVoertuigen } from "../api";
import "../style/Voertuigen.css";
import VoertuigFilter from "./VoertuigFilter";
import VoertuigWeergave from "./VoertuigWeergave";
import { useAuth } from "../AuthContext";

const VoertuigenPagina = () => {
    const { user } = useAuth();
    const isZakelijk = user?.role === "Zakelijk";
    const [voertuigen, setVoertuigen] = useState([]);
    const [filters, setFilters] = useState({
        soort: isZakelijk ? "Auto" : "",
        startDatum: "",
        eindDatum: "",
        sorteerOp: "",
    });
    const [error, setError] = useState(null);

    const ontbrekendeDatums = !filters.startDatum || !filters.eindDatum;
    useEffect(() => {
        if (!ontbrekendeDatums) {
            const loadVoertuigen = async () => {
                try {
                    const data = await fetchFilteredVoertuigen(filters);
                    setVoertuigen(data);
                } catch (err) {
                    setError(err.message);
                }
            };
            loadVoertuigen();
        }
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
                <VoertuigFilter filters={filters} setFilters={setFilters} isZakelijk={isZakelijk} />
                
      {error && <p style={{ color: "red" }}>{error}</p>}
                {ontbrekendeDatums && (
                    <div className="datum-waarschuwing1">
                        <p>Voer een start- en einddatum in om beschikbare voertuigen te zien.</p>
                    </div>
                )}
                    {error && <p className="error-message">{error}</p>}
                    {!ontbrekendeDatums && <VoertuigWeergave voertuigen={voertuigen} filters={filters} />}
                </div>
            
   </>
  );

};

export default VoertuigenPagina;
