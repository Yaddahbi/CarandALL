import { useState } from 'react';
import VoertuigFormulier from './VoertuigFormulier'; 
import { createHuurverzoek } from '../api';

const VoertuigWeergave = ({ voertuigen }) => {
  const [geselecteerdVoertuig, setGeselecteerdVoertuig] = useState(null);
  const [error, setError] = useState(null);

  const handleVoertuigKlik = (voertuig) => {
    setGeselecteerdVoertuig(voertuig);
  };

  const handleFormulierSluiten = () => {
    setGeselecteerdVoertuig(null);
  };

  const handleHuurverzoek = async (huurverzoekData) => {
    try {
      await createHuurverzoek({ ...huurverzoekData, huurderId: 1 }); // huurderId hardcode
      alert('Huurverzoek succesvol aangemaakt!');
      setGeselecteerdVoertuig(null);
    } catch (err) {
      alert('Voertuig is niet beschikbaar in deze periode.');
      setError(err.message);
    }
  };

  if (!voertuigen.length) {
    return <p>Geen voertuigen gevonden</p>;
  }

  return (
    <div className="voertuigen-weergave">
      <h3>Beschikbare Voertuigen</h3>
      <div className="voertuigen-grid">
        {voertuigen.map((voertuig) => (
          <div className="voertuigen-kaart" key={voertuig.voertuigId} role="article" aria-labelledby={`voertuig-${voertuig.voertuigId}`}>
            <p id={`voertuig-${voertuig.voertuigId}`}>
              <strong>{voertuig.merk} {voertuig.type} ({voertuig.soort})</strong>
            </p>
            <p>Kleur: {voertuig.kleur}</p>
            <p>Aanschafjaar: {voertuig.aanschafjaar}</p>
            <p>Prijs per dag: €{voertuig.prijs}</p>
            <p>Status: {voertuig.status}</p>
            <button onClick={() => handleVoertuigKlik(voertuig)} aria-label={`Huur ${voertuig.merk} ${voertuig.type}`}>
              Huur voertuig
            </button>
          </div>
        ))}
      </div>

      {geselecteerdVoertuig && (
        <VoertuigFormulier
          voertuig={geselecteerdVoertuig}
          onClose={handleFormulierSluiten}
          onSubmit={handleHuurverzoek}
        />
      )}

      {error && <p style={{ color: 'red' }} aria-live="assertive">{error}</p>}
    </div>
  );
};

export default VoertuigWeergave;
