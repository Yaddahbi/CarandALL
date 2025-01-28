import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from 'sonner';

const VerhuuraanvraagDetails = ({ aanvraag, onUpdateAanvraag }) => {
    const [reden, setReden] = useState("");

    const handleGoedkeuren = () => {
        onUpdateAanvraag(aanvraag.id, 'goedkeuren');
    };

    const handleAfwijzen = () => {
        if (!reden.trim()) {
            toast(`Reden is verplicht bij afwijzen.`, {
                type: 'warning',
            });
            return;
        }
        onUpdateAanvraag(aanvraag.id, 'afwijzen', reden);
    };

    return (
        <div className="details-card">
            <h3>Details Aanvraag #{aanvraag.id}</h3>
            <div className="details-info">
                <p><strong>Startdatum:</strong> {new Date(aanvraag.startDatum).toLocaleDateString('nl-NL')}</p>
                <p><strong>Einddatum:</strong> {new Date(aanvraag.eindDatum).toLocaleDateString('nl-NL')}</p>
                <p><strong>Status:</strong> {aanvraag.status}</p>
                {aanvraag.status === 'Afgewezen' && (
                    <p><strong>Reden Afwijzing:</strong> {aanvraag.reden}</p>
                )}
                <p><strong>Huurder:</strong> {aanvraag.userNaam}</p>
                <p><strong>Voertuig:</strong> {aanvraag.voertuigMerk} {aanvraag.voertuigType}</p>
                <p><strong>Voertuig Status:</strong> {aanvraag.voertuigStatus}</p>
            </div>

            <div className="action-container">
                <button className="approve-button" onClick={handleGoedkeuren}>
                    Goedkeuren
                </button>
                <button className="reject-button" onClick={handleAfwijzen}>
                    Afwijzen
                </button>
            </div>
            <textarea
                className="afwijzing-reden"
                placeholder="Reden voor afwijzing"
                value={reden}
                onChange={(e) => setReden(e.target.value)}
            />
        </div>
    );
};
VerhuuraanvraagDetails.propTypes = {
    aanvraag: PropTypes.shape({
        id: PropTypes.number.isRequired,
        startDatum: PropTypes.string.isRequired,
        eindDatum: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        reden: PropTypes.string,
        userNaam: PropTypes.string.isRequired,
        voertuigMerk: PropTypes.string.isRequired,
        voertuigType: PropTypes.string.isRequired,
        voertuigStatus: PropTypes.string.isRequired,
    }).isRequired,
    onUpdateAanvraag: PropTypes.func.isRequired,
};

export default VerhuuraanvraagDetails;
