import React, { useState } from 'react';
import { createUitgifte } from '../api';

const UitgifteVoertuig = () => {
    const [uitgifteData, setUitgifteData] = useState({
        
        huurderId: '',
        voertuigId: '',
        opmerkingen: '',
        status: 'Uitgegeven',
    });

    const handleUitgifteSubmit = async (event) => {
        event.preventDefault();

        const uitgifteObject = {
            huurderId: uitgifteData.huurderId,
            voertuigId: uitgifteData.voertuigId,
            status: uitgifteData.status,
            opmerkingen: uitgifteData.opmerkingen,
        };

        try {
            const response = await createUitgifte(uitgifteObject);

            if (response) {
                alert('Voertuig succesvol uitgegeven!');
            } else {
                alert('Er is iets misgegaan bij de uitgifte.');
            }
        } catch (error) {
            console.error('Er is een fout opgetreden tijdens het registreren van de uitgifte:', error);
            alert('Er is iets misgegaan bij het registreren van de uitgifte.');
        }
    };

    return (
        <div>
            <h2>Uitgifte Voertuig Registreren</h2>
            <form onSubmit={handleUitgifteSubmit}>
                <label>
                    Huurder ID:
                    <input
                        type="number"
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
