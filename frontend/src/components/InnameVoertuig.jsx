import React, { useState } from 'react';
import { createInname } from '../api';

const InnameVoertuig = () => {
    const [innameData, setInnameData] = useState({
        huurderId: '',
        voertuigId: '',
        schadeOpmerkingen: '',
        status: 'Teruggebracht',
        schadeFoto: null,
    });

    const handleInnameSubmit = async (event) => {
        event.preventDefault();

        const innameObject = {
            huurderId: innameData.huurderId,
            voertuigId: innameData.voertuigId,
            status: innameData.status,
            schadeOpmerkingen: innameData.schadeOpmerkingen,
            schadeFoto: innameData.schadeFoto ? innameData.schadeFoto : null, 
        };

        try {
            const response = await createInname(innameObject);

            if (response) {
                alert('Voertuig succesvol ingeleverd!');
            } else {
                alert('Er is iets misgegaan bij de inname.');
            }
        } catch (error) {
            console.error('Er is een fout opgetreden tijdens het registreren van de inname:', error);
            alert('Er is iets misgegaan bij het registreren van de inname.');
        }
    };


    return (
        <div>
            <h2>Inname Voertuig Registreren</h2>
            <form onSubmit={handleInnameSubmit}>
                <label>
                    Huurder ID:
                    <input
                        type="number"
                        value={innameData.huurderId}
                        onChange={(e) =>
                            setInnameData({ ...innameData, huurderId: e.target.value })
                        }
                        required
                    />
                </label>
                <br />
                <label>
                    Voertuig ID:
                    <input
                        type="number"
                        value={innameData.voertuigId}
                        onChange={(e) =>
                            setInnameData({ ...innameData, voertuigId: e.target.value })
                        }
                        required
                    />
                </label>
                <br />
                <label>
                    Schade Opmerkingen:
                    <textarea
                        value={innameData.schadeOpmerkingen}
                        onChange={(e) =>
                            setInnameData({ ...innameData, schadeOpmerkingen: e.target.value })
                        }
                    />
                </label>
                <br />
                <label>
                    Voeg Schade Foto toe:
                    <input
                        type="file"
                        onChange={(e) =>
                            setInnameData({ ...innameData, schadeFoto: e.target.files[0] })
                        }
                    />
                </label>
                <br />
                <button type="submit">Voertuig Innemen</button>
            </form>
        </div>
    );
};

export default InnameVoertuig;
