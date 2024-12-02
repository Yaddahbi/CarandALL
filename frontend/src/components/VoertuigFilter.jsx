const VoertuigFilter = ({ filters, setFilters, isZakelijk }) => {
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
            disabled={isZakelijk}
          >
            {!isZakelijk && (
              <>
                <option value="">Alle</option>
                <option value="Auto">Auto</option>
                <option value="Camper">Camper</option>
                <option value="Caravan">Caravan</option>
              </>
            )}
            {isZakelijk && <option value="Auto">Auto</option>}
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
  
  export default VoertuigFilter;
  