import { useState } from 'react';
import checkDatum from './Datumcheck';

const VoertuigFormulier = ({ voertuig, onClose, onSubmit }) => {
  const [startDatum, setStartDatum] = useState('');
  const [eindDatum, setEindDatum] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();  // pagina word niet herladen (StackOverflow)
    const message = checkDatum(startDatum, eindDatum);
    if (message) {
      alert(message); 
      return; 
    }

    const huurverzoekData = {
      voertuigId: voertuig.voertuigId,
      startDatum: startDatum,
      eindDatum: eindDatum,
    };

    onSubmit(huurverzoekData); 
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div> <h4>Huur formulier voor {voertuig.merk} {voertuig.type}</h4>
          <label htmlFor="startDatum">Startdatum: </label>
          <input
            type="date"
            id="startDatum"
            value={startDatum}
            onChange={(e) => setStartDatum(e.target.value)} //update state na invoeren(Stackoverflow)
            required
          />
        </div>
        <div>
          <label htmlFor="eindDatum">Einddatum: </label>
          <input
            type="date"
            id="eindDatum"
            value={eindDatum}
            onChange={(e) => setEindDatum(e.target.value)}  
            required
          />
        </div>
        <div>
          <button type="submit">Verstuur huurverzoek</button>
          <button type="button" onClick={onClose}>Annuleer</button>
        </div>
      </form>
    </div>
  );
};

export default VoertuigFormulier;