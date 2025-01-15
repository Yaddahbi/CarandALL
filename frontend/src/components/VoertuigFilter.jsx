import { useEffect } from 'react';
import checkDatum from './Datumcheck';
import { toast } from 'sonner';

const VoertuigFilter = ({ filters, setFilters, isZakelijk, filterType }) => {
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        document.getElementById("startDatum")?.setAttribute("min", today);
        document.getElementById("eindDatum")?.setAttribute("min", today);
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters, [name]: value };
            
  return (
    <div className="voertuigen-filters">
      <div>
        <label htmlFor="soort">Voertuigtype:</label>
        <select
          name="soort"
          id="soort"
          value={filters.soort}
          onChange={handleFilterChange}
          disabled={isZakelijk}
          aria-label="Kies voertuigsoort"
        >
          {isZakelijk ? <option value="Auto">Auto</option>  
          : (
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
          onChange={handleFilterChange}
          aria-label="Selecteer startdatum"
        />
      </div>
      <div>
        <label htmlFor="eindDatum">Einddatum:</label>
        <input
          type="date"
          id="eindDatum"
          name="eindDatum"
          value={filters.eindDatum}
          onChange={handleFilterChange}
          aria-label="Selecteer einddatum"
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
        >
          <option value="">Geen</option>
          <option value="prijs">Prijs</option>
          <option value="merk">Merk</option>
          <option value="beschikbaarheid">Beschikbaarheid</option>
        </select>
      </div>
    </div>
  );
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
        <div className="voertuigen-filters">
            {filterType === "datum" && (
                <>
                    <div className="filter-item">
                        <label htmlFor="startDatum">Startdatum:</label>
                        <input
                            type="date"
                            id="startDatum"
                            name="startDatum"
                            value={filters.startDatum}
                            onChange={handleFilterChange}
                            aria-label="Selecteer startdatum"
                        />
                    </div>
                    <div className="filter-item">
                        <label htmlFor="eindDatum">Einddatum:</label>
                        <input
                            type="date"
                            id="eindDatum"
                            name="eindDatum"
                            value={filters.eindDatum}
                            onChange={handleFilterChange}
                            aria-label="Selecteer einddatum"
                        />
                    </div>
                </>
            )}
            {filterType === "overige" && (
                <>
                    <div className="filter-item">
                        <label htmlFor="soort">Soort:</label>
                        <select
                            name="soort"
                            id="soort"
                            value={filters.soort}
                            onChange={handleFilterChange}
                            disabled={isZakelijk}
                            aria-label="Kies voertuigsoort"
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
                    <div className="filter-item">
                        <label htmlFor="sorteerOp">Sorteer op:</label>
                        <select
                            name="sorteerOp"
                            id="sorteerOp"
                            value={filters.sorteerOp}
                            onChange={handleFilterChange}
                            aria-label="Kies sorteeroptie"
                        >
                            <option value="">Geen</option>
                            <option value="prijs">Prijs (laag =&gt; hoog)</option>
                            <option value="prijsHL">Prijs (hoog =&gt; laag)</option>
                            <option value="merk">Merk (A =&gt; Z)</option>
                            <option value="merkZA">Merk (Z =&gt; A)</option>
                            {/* } <option value="beschikbaarheid">Beschikbaarheid</option>{*/ }
                        </select>
                    </div>
                </>
            )}
        </div>
    );
};

export default VoertuigFilter;

