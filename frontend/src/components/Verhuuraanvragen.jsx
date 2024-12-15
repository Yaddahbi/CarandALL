import  { useEffect, useState } from 'react';

const Verhuuraanvragen = () => {
    const [aanvragen, setAanvragen] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/huurverzoeken')
            .then(response => response.json())
            .then(data => setAanvragen(data));
    }, []);

    const handelBijwerken = (id, status, reden) => {
        fetch(`http://localhost:5000/api/huurverzoeken/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ HuurStatus: status, Afwijzingsreden: reden })
        })
            .then(response => response.json())
            .then(bijgewerktVerzoek => {
                setAanvragen(aanvragen.map(aanvraag =>
                    aanvraag.HuurverzoekID === id ? bijgewerktVerzoek : aanvraag
                ));
            });
    };

    return (
        <div className="container mt-5">
            <h1>Verhuuraanvragen</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Startdatum</th>
                        <th>Einddatum</th>
                        <th>Status</th>
                        <th>Actie</th>
                    </tr>
                </thead>
                <tbody>
                    {aanvragen.map(aanvraag => (
                        <tr key={aanvraag.HuurverzoekId}>
                            <td>{aanvraag.HuurverzoekId}</td>
                            <td>{new Date(aanvraag.Startdatum).toLocaleDateString()}</td>
                            <td>{new Date(aanvraag.Einddatum).toLocaleDateString()}</td>
                            <td>{aanvraag.HuurStatus}</td>
                            <td>
                                <button
                                    className="btn btn-success"
                                    onClick={() => handelBijwerken(aanvraag.HuurverzoekId, "Goedgekeurd", "")}
                                >
                                    Goedkeuren
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                        const reden = prompt("Geef een reden voor afwijzing:");
                                        handelBijwerken(aanvraag.HuurverzoekId, "Afgewezen", reden);
                                    }}
                                >
                                    Afwijzen
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Verhuuraanvragen;