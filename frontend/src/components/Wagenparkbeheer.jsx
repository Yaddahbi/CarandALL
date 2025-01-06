import { useState, useEffect } from 'react';
import "../style/Wagenparkbeheer.css";

const Wagenparkbeheer = () => {
    const [voertuigen, setVoertuigen] = useState([]);
    const [voertuig, setVoertuig] = useState({ merk: '', type: '', kleur: '', aanschafjaar: '', kenteken: '', opmerkingen: '' });
    const [bewerken, setBewerken] = useState(false);
    const [bewerkVoertuigId, setBewerkVoertuigId] = useState(null);

    useEffect(() => {
        fetch('https://localhost:7040/api/Voertuigs')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP-fout! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setVoertuigen(data))
            .catch((error) => console.error('Fout bij het ophalen van voertuigen:', error));
    }, []);

    const handleOpslaan = () => {
        console.log("Opslaan data:", voertuig); // Check the structure of the data

        if (!voertuig.merk || !voertuig.type || !voertuig.kleur || !voertuig.aanschafjaar || !voertuig.kenteken) {
            alert("Alle velden (behalve opmerkingen) zijn verplicht!");
            return;
        }

        const methode = bewerken ? 'PUT' : 'POST';
        const url = bewerken
            ? `https://localhost:7040/api/Voertuigs/${bewerkVoertuigId}`
            : 'https://localhost:7040/api/Voertuigs';

        fetch(url, {
            method: methode,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(voertuig),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP-fout! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((opgeslagenVoertuig) => {
                if (bewerken) {
                    setVoertuigen(voertuigen.map((v) =>
                        v.voertuigId === bewerkVoertuigId ? opgeslagenVoertuig : v
                    ));
                } else {
                    setVoertuigen([...voertuigen, opgeslagenVoertuig]);
                }

                setVoertuig({ merk: '', type: '', kleur: '', aanschafjaar: '', kenteken: '', opmerkingen: '' });
                setBewerken(false);
                setBewerkVoertuigId(null);
            })
            .catch((error) => console.error('Fout bij het opslaan van het voertuig:', error));
    };

    const handleBewerk = (voertuig) => {
        setVoertuig(voertuig);
        setBewerken(true);
        setBewerkVoertuigId(voertuig.voertuigId);
    };

    const handleVerwijder = (id) => {
        fetch(`https://localhost:7040/api/Voertuigs/${id}`, { method: 'DELETE' })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP-fout! Status: ${response.status}`);
                }
                setVoertuigen(voertuigen.filter((v) => v.voertuigId !== id));
            })
            .catch((error) => console.error('Fout bij het verwijderen van voertuig:', error));
    };

    return (
        <>
            <section className="wagenparkbeheer-hero">
                <div className="container">
                    <h1>Wagenparkbeheer</h1>
                </div>
            </section>

            <div className="container-wagenparkbeheer">
                <div className="wagenparkbeheer">
                    <div className="form-row">
                        <input
                            placeholder="Merk"
                            value={voertuig.merk}
                            onChange={(e) => setVoertuig({ ...voertuig, merk: e.target.value })}
                        />
                        <input
                            placeholder="Type"
                            value={voertuig.type}
                            onChange={(e) => setVoertuig({ ...voertuig, type: e.target.value })}
                        />
                        <input
                            placeholder="Kleur"
                            value={voertuig.kleur}
                            onChange={(e) => setVoertuig({ ...voertuig, kleur: e.target.value })}
                        />
                    </div>
                    <div className="form-row-2">
                        <input
                            placeholder="Bouwjaar"
                            value={voertuig.aanschafjaar}
                            onChange={(e) => setVoertuig({ ...voertuig, aanschafjaar: e.target.value })}
                        />
                        <input
                            placeholder="Kenteken"
                            value={voertuig.kenteken}
                            onChange={(e) => setVoertuig({ ...voertuig, kenteken: e.target.value })}
                        />
                    </div>
                    <div className="form-row-1">
                        <textarea
                            placeholder="Opmerkingen"
                            value={voertuig.opmerkingen}
                            onChange={(e) => setVoertuig({ ...voertuig, opmerkingen: e.target.value })}
                            rows="5"
                            style={{ resize: 'vertical' }}
                        ></textarea>
                    </div>
                    <button onClick={handleOpslaan}>{bewerken ? 'Opslaan' : 'Toevoegen'}</button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Merk</th>
                            <th>Type</th>
                            <th>Kleur</th>
                            <th>Bouwjaar</th>
                            <th>Kenteken</th>
                            <th>Acties</th>
                        </tr>
                    </thead>
                    <tbody>
                        {voertuigen.map((v) => (
                            <tr key={v.voertuigId}>
                                <td>{v.merk}</td>
                                <td>{v.type}</td>
                                <td>{v.kleur}</td>
                                <td>{v.aanschafjaar}</td>
                                <td>{v.kenteken}</td>
                                <td>
                                    <button onClick={() => handleBewerk(v)}>Wijzigen</button>
                                    <button onClick={() => handleVerwijder(v.voertuigId)}>Verwijderen</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Wagenparkbeheer;
