import { useState, useEffect } from "react";
import '../style/Verhuuraanvraag.css';
import VerhuuraanvraagLijst from "./VerhuuraanvraagLijst";
import VerhuuraanvraagDetails from "./VerhuuraanvraagDetails";

const Verhuuraanvraag = () => {
    const [aanvragen, setAanvragen] = useState([]);
    const [filteredAanvragen, setFilteredAanvragen] = useState([]);
    const [geselecteerdeAanvraag, setGeselecteerdeAanvraag] = useState(null);
    const [searchParams, setSearchParams] = useState({ id: "" });

    useEffect(() => {
        const fetchAanvragen = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/huurverzoeken");
                if (response.ok) {
                    const data = await response.json();
                    setAanvragen(data);
                    setFilteredAanvragen(data); 
                } else {
                    console.error("Error fetching data");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchAanvragen();
    }, []);

    const updateAanvraag = async (id, actie, reden = '') => {
        try {
            const response = await fetch(`http://localhost:5000/api/huurverzoeken/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: actie === 'goedkeuren' ? 'Goedgekeurd' : 'Afgewezen',
                    reason: actie === 'afgewezen' ? reden : ''
                })
            });

            if (response.ok) {
                setAanvragen(prev =>
                    prev.map(aanvraag =>
                        aanvraag.id === id
                            ? { ...aanvraag, status: actie === 'goedkeuren' ? 'Goedgekeurd' : 'Afgewezen', reason: reden }
                            : aanvraag
                    )
                );
                setGeselecteerdeAanvraag(null); 
            } else {
                console.error("Failed to update request");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSearch = () => {
        const { id } = searchParams;
        let results = aanvragen;

        if (id) {
            results = results.filter((aanvraag) => aanvraag.id.toString().includes(id));
        }

        setFilteredAanvragen(results); 
    };

    return (
        <>
            <section className="verhuuraanvraag-hero">
                <div className="container verhuuraanvraag">
                    <h1>Beheer Verhuur Aanvragen</h1>
                    <p>Bekijk en beheer alle aanvragen in een overzicht.</p>
                    <div className="verhuuraanvraag-search-bar">
                        <input
                            className="aanvraag-ID"
                            type="text"
                            placeholder="Zoek op aanvraag ID"
                            value={searchParams.id}
                            onChange={(e) =>
                                setSearchParams({ ...searchParams, id: e.target.value }) 
                            }
                        />
                        <button onClick={handleSearch}>Zoeken</button> 
                    </div>
                </div>
            </section>

            <div className="verhuuraanvraag-container">
                <div className="verhuuraanvraag-content">
                    <VerhuuraanvraagLijst
                        aanvragen={filteredAanvragen} 
                        onSelectAanvraag={(aanvraag) => setGeselecteerdeAanvraag(aanvraag)} 
                    />
                    {geselecteerdeAanvraag && (
                        <VerhuuraanvraagDetails
                            aanvraag={geselecteerdeAanvraag} 
                            onUpdateAanvraag={updateAanvraag} 
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Verhuuraanvraag;
