import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import '../style/UitgifteInname.css'

const UitgifteVoertuig = ({ geselecteerdeAanvraag }) => {
    const [Huurgeschiedenis, setHuurgeschiedenis] = useState(null);
    const [kilometerstand, setKilometerstand] = useState('');
    const [opmerkingen, setOpmerkingen] = useState('');
    const [status, setStatus] = useState('Uitgegeven');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHuurgeschiedenis = async () => {
            try {
                const response = await fetch(`https://localhost:7040/api/huurverzoeken/${geselecteerdeAanvraag.huurverzoekId}`);
                if (!response.ok) {
                    throw new Error('Er is iets misgegaan bij het ophalen van de huurgeschiedenis');
                }
                const data = await response.json();
                setHuurgeschiedenis(data);
            } catch (error) {
                toast.error(error.message);
            }
        };

        if (geselecteerdeAanvraag?.verzoekId) {
            fetchHuurgeschiedenis();
        }
    }, [geselecteerdeAanvraag]);
    
    const handleUitgifte = async () => {
        try {
            const response = await fetch(`https://localhost:7040/api/uitgiftes/bevestigen/${geselecteerdeAanvraag.uitgifteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kilometerstand: kilometerstand,
                    opmerkingen: opmerkingen,
                    status: status
                })
            });

            if (response.ok) {
                toast('Voertuig is uitgegeven!', { type: 'success' });
            } else {
                toast('Er is iets misgegaan bij de uitgifte.', { type: 'error' });
            }
        } catch (error) {
            toast('Fout bij de uitgifte.', { type: 'error' });
        }
    };

    return (
        <div className="uitgifte-container">
            <h2>Uitgifte van Voertuig</h2>
            <p>Voertuig ID: {geselecteerdeAanvraag?.voertuigId}</p>
            <p>Voertuig Soort: {geselecteerdeAanvraag?.voertuigSoort}</p> 
            <p>Voertuig Type: {geselecteerdeAanvraag?.voertuigType}</p>
            <p>Voertuig Kenteken: {geselecteerdeAanvraag?.voertuigKenteken}</p>
            <p>Huurder Naam: {geselecteerdeAanvraag?.huurderNaam}</p>
            <p>Huurder Email: {geselecteerdeAanvraag?.huurderEmail}</p>
            <p>Huurder Telefoon: {geselecteerdeAanvraag?.huurderTelefoonnummer}</p>
            <p>Begindatum Huurverzoek: {geselecteerdeAanvraag?.startDatum}</p>
            <p>Einddatum Huurverzoek: {geselecteerdeAanvraag?.eindDatum}</p>
            <input
                type="number"
                value={kilometerstand}
                onChange={(e) => setKilometerstand(e.target.value)}
                placeholder="Beginkilometerstand"
            />
            <textarea
                value={opmerkingen}
                onChange={(e) => setOpmerkingen(e.target.value)}
                placeholder="Opmerkingen"
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Uitgegeven">Uitgegeven</option>
                <option value="In Afwachting">In Afwachting</option>
            </select>
            <button onClick={handleUitgifte}>Bevestigen Uitgifte
            </button>
            <button onClick={() => navigate('/uitgifteinnamebeheren')}>Terug
            </button>
        <div>
            <h2>Uitgifte Voertuig Registreren</h2>
            <form onSubmit={handleUitgifteSubmit}>
                <label>
                    Huurder ID:
                    <input
                        type="text"
                        value={uitgifteData.huurderId}
                        onChange={(e) =>
                            setUitgifteData({ ...uitgifteData, huurderId: e.target.value })
                        }
                        required
                    />
                </label>
                <br />
                <label>
                    Voertuig ID:
                    <input
                        type="number"
                        value={uitgifteData.voertuigId}
                        onChange={(e) =>
                            setUitgifteData({ ...uitgifteData, voertuigId: e.target.value })
                        }
                        required
                    />
                </label>
                <br />
                <label>
                    Opmerkingen:
                    <textarea
                        value={uitgifteData.opmerkingen}
                        onChange={(e) =>
                            setUitgifteData({ ...uitgifteData, opmerkingen: e.target.value })
                        }
                    />
                </label>
                <br />
                <button type="submit">Voertuig Uitgeven</button>
            </form>
        </div>
    );
};

export default UitgifteVoertuig;
