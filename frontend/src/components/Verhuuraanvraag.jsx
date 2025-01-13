import { useEffect, useState } from 'react';
import "../style/Verhuuraanvraag.css"

const Verhuuraanvragen = () => {
    const [aanvragen, setAanvragen] = useState([]);

    useEffect(() => {
        fetch('https://localhost:7040/api/Huurverzoeken')
            .then(response => response.json())
            .then(data => setAanvragen(data))
            .catch(error => console.error('Fout bij ophalen aanvragen:', error));
    }, []);

    const handelBijwerken = (id, status, reden = "") => {
        fetch(`https://localhost:7040/api/Huurverzoeken/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                huurStatus: status,
                afwijzingsreden: reden
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Fout bij bijwerken aanvraag");
                }
                return response.json();
            })
            .then(bijgewerktVerzoek => {
                // Verwijder het goedgekeurde of afgewezen verzoek uit de lijst
                setAanvragen(aanvragen.filter(aanvraag => aanvraag.huurverzoekId !== id));
                alert(`Aanvraag ${status === "Goedgekeurd" ? "goedgekeurd" : "afgewezen"}!`);
            })
            .catch(error => console.error('Fout bij bijwerken aanvraag:', error));
    };

    return (
        <>
            <section className="verhuuraanvraag-hero">
                <div className="container verhuuraanvraag">
                    <h1>Mijn Verhuuraanvragen</h1>
                    <p>Hier kun je de verhuurgeschiedenis zien</p>
                </div>
            </section>

            <div className="verhuuraanvraag-container">
                <div className="verhuuraanvraag-content">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Huurder</th>
                                <th>Voertuig</th>
                                <th>Startdatum</th>
                                <th>Einddatum</th>
                                <th>Status</th>
                                <th>Actie</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aanvragen.map(aanvraag => (
                                <tr
                                    key={aanvraag.huurverzoekId}
                                    className={aanvraag.status === "Afgewezen" ? "table-danger" : ""}
                                >
                                    <td>{aanvraag.huurderNaam}</td>
                                    <td>{aanvraag.voertuigMerk} {aanvraag.voertuigType}</td>
                                    <td>{new Date(aanvraag.startDatum).toLocaleDateString('nl-NL')}</td>
                                    <td>{new Date(aanvraag.eindDatum).toLocaleDateString('nl-NL')}</td>
                                    <td>{aanvraag.status}</td>
                                    <td>
                                        {aanvraag.status !== "Goedgekeurd" && aanvraag.status !== "Afgewezen" && (
                                            <>
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => handelBijwerken(aanvraag.huurverzoekId, "Goedgekeurd")}
                                                >
                                                    Goedkeuren
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => {
                                                        const reden = prompt("Geef een reden voor afwijzing:");
                                                        if (reden) {
                                                            handelBijwerken(aanvraag.huurverzoekId, "Afgewezen", reden);
                                                        }
                                                    }}
                                                >
                                                    Afwijzen
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Verhuuraanvragen;
