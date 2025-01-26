import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import '../style/UitgifteInname.css'

const InnameVoertuig = ({ geselecteerdeUitgifte }) => {
    const [kilometerstand, setKilometerstand] = useState('');
    const [opmerkingen, setOpmerkingen] = useState('');
    const [schadeOptie, setSchadeOptie] = useState('Nee');
    const [status, setStatus] = useState('Teruggebracht');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHuurgeschiedenis = async () => {
            try {
                const response = await fetch(`https://localhost:7040/api/huurverzoeken/${geselecteerdeUitgifte.huurverzoekId}`);
                if (!response.ok) {
                    throw new Error('Er is iets misgegaan bij het ophalen van de huurgeschiedenis');
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        if (geselecteerdeUitgifte?.huurverzoekId) {
            fetchHuurgeschiedenis();
        }
    }, [geselecteerdeUitgifte]);
    
    const handleInname = async () => {
        try {
            const response = await fetch(`https://localhost:7040/api/inname/${geselecteerdeUitgifte.voertuigId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kilometerstand,
                    opmerkingen,
                    schade: schadeOptie === 'Ja' ? 'Schademelding vereist' : 'Geen schade',
                    status
                })
            });

            if (response.ok) {
                toast.success('Voertuig is ingekomen!');
                navigate('/uitgifte-inname-beheren');
            } else {
                toast.error('Er is iets misgegaan bij de inname.');
            }
        } catch (error) {
            toast.error('Fout bij de inname.');
        }
    };

    return (
        <div className="inname-container">
            <h2>Inname van Voertuig</h2>
            <p>Voertuig ID: {geselecteerdeUitgifte?.voertuigId}</p>
            <p>Voertuig Soort: {geselecteerdeUitgifte?.voertuigSoort}</p>
            <p>Voertuig Type: {geselecteerdeUitgifte?.voertuigType}</p>
            <p>Voertuig Kenteken: {geselecteerdeUitgifte?.voertuigKenteken}</p>
            <p>Huurder Naam: {geselecteerdeUitgifte?.huurderNaam}</p>
            <p>Huurder Email: {geselecteerdeUitgifte?.huurderEmail}</p>
            <p>Huurder Telefoon: {geselecteerdeUitgifte?.huurderTelefoonnummer}</p>
            <p>Begindatum Huurverzoek: {geselecteerdeUitgifte?.startDatum}</p>
            <p>Einddatum Huurverzoek: {geselecteerdeUitgifte?.eindDatum}</p>
            <input
                type="number"
                value={kilometerstand}
                onChange={(e) => setKilometerstand(e.target.value)}
                placeholder="Kilometerstand bij inname"
            />
            <textarea
                value={opmerkingen}
                onChange={(e) => setOpmerkingen(e.target.value)}
                placeholder="Opmerkingen"
            />
            <div>
                <label>Is er schade aan het voertuig?</label>
                <select value={schadeOptie} onChange={(e) => setSchadeOptie(e.target.value)}>
                    <option value="Nee">Nee</option>
                    <option value="Ja">Ja</option>
                </select>
            </div>

            {/* Als 'Ja' wordt gekozen, toon een knop om schademelding te maken */}
            {schadeOptie === 'Ja' && (
                <div>
                    <button onClick={() => navigate('/schade/toevoegen')}>Schademelding</button>
                </div>
            )}
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Teruggebracht">Teruggebracht</option>
                <option value="In Afwachting">In Afwachting</option>
            </select>
            <button onClick={handleInname}>Bevestigen Inname</button>
            <button onClick={() => navigate('/uitgifte-inname-beheren')}>Terug</button>
        </div>
    );
};

export default InnameVoertuig;