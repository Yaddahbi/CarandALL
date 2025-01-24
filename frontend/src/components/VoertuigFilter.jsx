import { useEffect } from 'react';
import checkDatum from './Datumcheck';
import { toast } from 'sonner';

const VoertuigFilter = ({ filters, setFilters, isZakelijk }) => {
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        document.getElementById("startDatum")?.setAttribute("min", today);
        document.getElementById("eindDatum")?.setAttribute("min", today);
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters, [name]: value };
            if (name === "startDatum" || name === "eindDatum") {
                const message = checkDatum(updatedFilters.startDatum, updatedFilters.eindDatum);
                if (message) {
                    toast(`${message}`, {
                        description: "Kies a.u.b een geldige datum.",
                        type: "error",
                    });
                    return prevFilters;
                }
            }
            return updatedFilters;
        });
    };

    return (
        <div className="voertuigen-filters" role="form" aria-label="Filter opties voor voertuigen">
            <div>
                <label htmlFor="soort">Voertuigtype:</label>
                <select
                    name="soort"
                    id="soort"
                    value={filters.soort}
                    onChange={handleFilterChange}
                    aria-label="Kies voertuigsoort"
                    tabIndex="0"
                >
                    {isZakelijk ? (
                        <option value="Auto">Auto</option>
                    ) : (
                        <>
                            <option value="">Alle</option>
                            <option value="Auto">Auto</option>
                            <option value="Camper">Camper</option>
                            <option value="Caravan">Caravan</option>
                        </>
                    )}
                </select>
            </div>
            <div>
                <label htmlFor="startDatum">Startdatum:</label>
                <input
                    type="date"
                    id="startDatum"
                    name="startDatum"
                    value={filters.startDatum}
                    className="datum-filters"
                    onChange={handleFilterChange}
                    aria-label="Selecteer startdatum"
                    tabIndex="0"
                />
            </div>
            <div>
                <label htmlFor="eindDatum">Einddatum:</label>
                <input
                    type="date"
                    id="eindDatum"
                    name="eindDatum"
                    value={filters.eindDatum}
                    className="datum-filters"
                    onChange={handleFilterChange}
                    aria-label="Selecteer einddatum"
                    tabIndex="0"
                />
            </div>
            <div>
                <label htmlFor="sorteerOp">Sorteer op:</label>
                <select
                    name="sorteerOp"
                    id="sorteerOp"
                    value={filters.sorteerOp}
                    onChange={handleFilterChange}
                    aria-label="Kies sorteeroptie"
                    tabIndex="0"
                >
                    <option value="">Geen</option>
                    <option value="prijs">Prijs (laag =&gt; hoog)</option>
                    <option value="prijsHL">Prijs (hoog =&gt; laag)</option>
                    <option value="merk">Merk (A =&gt; Z)</option>
                    <option value="merkZA">Merk (Z =&gt; A)</option>
                </select>
            </div>
        </div>
    );
};

export default VoertuigFilter;
