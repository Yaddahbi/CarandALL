import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { fetchHuurverzoek } from '../api';
import '../style/UitgifteInname.css'

const UitgifteVoertuig = ({ geselecteerdeAanvraag }) => {
    const [kilometerstand, setKilometerstand] = useState('');
    const [huurverzoek, setHuurverzoek] = useState(null);
    const [opmerkingen, setOpmerkingen] = useState('');
    const [status, setStatus] = useState('Uitgegeven');
    const navigate = useNavigate();

    useEffect(() => {
        const haalHuurverzoekOp = async () => {
            if (!geselecteerdeAanvraag?.huurverzoekId) return;
            try {
                const data = await fetchHuurverzoek(geselecteerdeAanvraag.huurverzoekId);
                setHuurverzoek(data);
            } catch (error) {
                toast.error(error.message);
            }
        };

        haalHuurverzoekOp();
    }, [geselecteerdeAanvraag]);

    const handleUitgifte = async () => {
        if (!huurverzoek) {
            toast.error('Huurverzoek is niet geladen.');
            return;
        }
        try {
            const response = await fetch(`https://localhost:7040/api/uitgiftes/bevestigen/${huurverzoek.huurverzoekId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kilometerstand: kilometerstand,
                    opmerkingen: opmerkingen,
                    status: status
                })
            });

            if (response.ok) {
                toast.success('Voertuig is uitgegeven!');
                navigate('/uitgifteinnamebeheren');
            } else {
                toast.error('Er is iets misgegaan bij de uitgifte.');
            }
        } catch (error) {
            toast.error('Fout bij de uitgifte.');
        }
    };

    return (
        <div className="uitgifte-container">
            <h2>Uitgifte van Voertuig</h2>
            <p>Voertuig ID: {huurverzoek?.voertuig.voertuigId}</p>
            <p>Voertuig Soort: {huurverzoek?.voertuig.soort}</p>
            <p>Voertuig Merk: {huurverzoek?.voertuig.merk}</p>
            <p>Voertuig Type: {huurverzoek?.voertuig.type}</p>
            <p>Voertuig Kenteken: {huurverzoek?.voertuig.kenteken}</p>
            <p>User Naam: {huurverzoek?.user.naam}</p>
            <p>User Email: {huurverzoek?.user.email}</p>
            <p>User Telefoon: {huurverzoek?.user.telefoonnummer}</p>
            <p>Begindatum Huurverzoek: {huurverzoek?.startDatum}</p>
            <p>Einddatum Huurverzoek: {huurverzoek?.eindDatum}</p>
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
            <button onClick={handleUitgifte}>Bevestigen Uitgifte</button>
            <button onClick={() => navigate('/uitgifteinnamebeheren')}>Terug</button>
        </div>
    );
};

export default UitgifteVoertuig;