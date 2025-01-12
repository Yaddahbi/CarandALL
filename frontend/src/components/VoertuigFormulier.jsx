const VoertuigFormulier = ({ voertuig, startDatum, eindDatum, onClose, onSubmit }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const huurverzoekData = {
            voertuigId: voertuig.voertuigId,
            startDatum,
            eindDatum,
        };

        onSubmit(huurverzoekData);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('nl-NL'); 
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h4>Bevestig uw reservering voor {voertuig.merk} {voertuig.type}</h4>
                <p><strong>Startdatum:</strong> {formatDate(startDatum)}</p>
                <p><strong>Einddatum:</strong> {formatDate(eindDatum)}</p>
                <div>
                    <button type="submit">Bevestig reservering</button>
                    <button type="button" onClick={onClose}>Annuleer</button>
                </div>
            </form>
        </div>
    );
};

export default VoertuigFormulier;
