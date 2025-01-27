import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import '../style/UitgifteInname.css'

const UitgifteInnameBeheren = () => {
    const [huurverzoeken, setHuurverzoeken] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGoedgekeurdeHuurverzoeken = async () => {
            try {
                const response = await fetch('https://localhost:7040/api/huurverzoeken/goedgekeurd');
                if (!response.ok) {
                    throw new Error('Er is een probleem opgetreden bij het ophalen van gegevens.');
                }
                const data = await response.json();
                setHuurverzoeken(data);  
            } catch (error) {
                toast.error(error.message);
            }
        };
        fetchGoedgekeurdeHuurverzoeken();
    }, []);
    
    const handleUitgifteClick = (verzoekId) => {
        navigate(`/uitgifte/${verzoekId}`);
    };

    const handleInnameClick = (verzoekId) => {
        navigate(`/inname/${verzoekId}`);
    };

    return (
        <div className="uitgifte-inname-container">
            <h2>Uitgifte en Inname</h2>
            <h3>Goedgekeurde Verhuurverzoeken</h3>
            <table>
                <thead>
                <tr>
                    <th>Huurverzoek ID</th>
                    <th>Voertuig ID</th>
                    <th>Huurder Naam</th>
                    <th>Datum</th>
                </tr>
                </thead>
                <tbody>
                {huurverzoeken.length === 0 ? (
                    <tr>
                        <td colSpan="4">Er zijn geen goedgekeurde verhuurverzoeken.</td>
                    </tr>
                ) : (
                    huurverzoeken.map((verzoek) => (
                        <tr key={verzoek.huurverzoekId}>
                            <td>{verzoek.voertuigId}</td>
                            <td>{verzoek.huurderNaam}</td>
                            <td>{verzoek.startDatum} - {verzoek.eindDatum}</td>
                            <td>
                                <button onClick={() => handleUitgifteClick(verzoek.huurverzoekId)}>
                                    Uitgifte
                                </button>
                                <button onClick={() => handleInnameClick(verzoek.huurverzoekId)}>
                                    Inname
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default UitgifteInnameBeheren;