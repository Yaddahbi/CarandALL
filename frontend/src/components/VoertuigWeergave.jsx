const VoertuigWeergave = ({ voertuigen }) => {
    if (!voertuigen.length) {
      return <p>Geen voertuigen gevonden.</p>;
    }

    const handleOnclick = () => {
        console.log("Huurverzoek!")
    }
  
    return (
      <div className="voertuigen-weergave">
        <h3>Beschikbare Voertuigen</h3>
        <div className="voertuigen-grid">
          {voertuigen.map((voertuig) => (
            <div className="voertuigen-kaart" key={voertuig.voertuigId} onClick = {handleOnclick}>
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
  
  export default VoertuigWeergave;
  