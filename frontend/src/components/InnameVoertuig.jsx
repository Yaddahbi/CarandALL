import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import "../style/InnameVoertuig.css";

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
                navigate('/uitgifteinnamebeheren');
            } else {
                toast.error('Er is iets misgegaan bij de inname.');
            }
        } catch (error) {
            toast.error('Fout bij de inname.');
        }
    };

    return (
        <>
            <section className="inname-hero">
                <div className="inname-container">
                    <h1>Inname Voertuig</h1>
                    <p>Hier kunt u de details van het ingebrachte voertuig invoeren.</p>
                </div>
            </section>

            <div className="container-inname">
                <div className="inname-form">
                    <h2>Details van Voertuig</h2>
                    <div className="form-row">
                        <p>Voertuig ID: {geselecteerdeUitgifte?.voertuigId}</p>
                        <p>Voertuig Soort: {geselecteerdeUitgifte?.voertuigSoort}</p>
                        <p>Voertuig Type: {geselecteerdeUitgifte?.voertuigType}</p>
                        <p>Voertuig Kenteken: {geselecteerdeUitgifte?.voertuigKenteken}</p>
                    </div>
                    <div className="form-row">
                        <p>Huurder Naam: {geselecteerdeUitgifte?.huurderNaam}</p>
                        <p>Huurder Email: {geselecteerdeUitgifte?.huurderEmail}</p>
                        <p>Huurder Telefoon: {geselecteerdeUitgifte?.huurderTelefoonnummer}</p>
                    </div>
                    <div className="form-row">
                        <p>Begindatum Huurverzoek: {geselecteerdeUitgifte?.startDatum}</p>
                        <p>Einddatum Huurverzoek: {geselecteerdeUitgifte?.eindDatum}</p>
                    </div>
                </div>

                <div className="inname-form">
                    <h2>Invoer Details</h2>
                    <div className="form-row">
                        <div>
                            <label htmlFor="kilometerstand">Kilometerstand</label>
                            <input
                                id="kilometerstand"
                                type="number"
                                value={kilometerstand}
                                onChange={(e) => setKilometerstand(e.target.value)}
                                placeholder="Kilometerstand bij inname"
                            />
                        </div>
                        <div>
                            <label htmlFor="opmerkingen">Opmerkingen</label>
                            <textarea
                                id="opmerkingen"
                                value={opmerkingen}
                                onChange={(e) => setOpmerkingen(e.target.value)}
                                placeholder="Opmerkingen"
                                rows="4"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div>
                <label>Is er schade aan het voertuig?</label>
                            <select id="schadeOptie" value={schadeOptie} onChange={(e) => setSchadeOptie(e.target.value)}>
                                <option value="Nee">Nee</option>
                                <option value="Ja">Ja</option>
                            </select>                           
            </div>

            {/* Als 'Ja' wordt gekozen, toon een knop om schademelding te maken */}
            {schadeOptie === 'Ja' && (
                <div>
                    <button onClick={() => navigate('/schades/toevoegen')}>Schademelding</button>
                </div>
               )}
                        <div>
                            <label htmlFor="status">Status</label>
                            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Teruggebracht">Teruggebracht</option>
                <option value="In Afwachting">In Afwachting</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
            <button onClick={handleInname}>Bevestigen Inname</button>
            <button onClick={() => navigate('/uitgifteinnamebeheren')}>Terug</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InnameVoertuig;