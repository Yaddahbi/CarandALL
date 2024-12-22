import { useState, useEffect } from "react";
import { fetchFilteredVoertuigen } from "../api";
import "../style/voertuigenPagina.css";
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
        <div className="voertuigen-pagina">
            <header className="page-header">
                <h2>{isZakelijk ? "Filter Auto's voor Zakelijke Huurder" : "Filter Voertuigen"}</h2>
            </header>
            {ontbrekendeDatums && (
                <div className="datum-waarschuwing">
                    <p>Voer een start- en einddatum in om beschikbare voertuigen te zien.</p>
                </div>
            )}
            <VoertuigFilter filters={filters} setFilters={setFilters} isZakelijk={isZakelijk} />
            {error && <p className="error-message">{error}</p>}
            {!ontbrekendeDatums && <VoertuigWeergave voertuigen={voertuigen} filters={filters} />}
        </div>
    );
};

export default VoertuigenPagina;
