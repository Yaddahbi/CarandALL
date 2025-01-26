import { useState, useEffect } from "react";
import '../style/Verhuuraanvraag.css';
import VerhuuraanvraagLijst from "./VerhuuraanvraagLijst";
import VerhuuraanvraagDetails from "./VerhuuraanvraagDetails";
import { toast } from 'sonner';

const Verhuuraanvraag = () => {
    const [aanvragen, setAanvragen] = useState([]);
    const [filteredAanvragen, setFilteredAanvragen] = useState([]);
    const [geselecteerdeAanvraag, setGeselecteerdeAanvraag] = useState(null);
    const [searchParams, setSearchParams] = useState({ id: "" });

    const fetchAanvragen = async () => {
        try {
            const response = await fetch("https://localhost:7040/api/Huurverzoeken");
            if (response.ok) {
                const data = await response.json();
                const adaptedData = data.map(aanvraag => ({
                    ...aanvraag,
                    id: aanvraag.huurverzoekId, 
                }));
                setAanvragen(adaptedData);
                setFilteredAanvragen(adaptedData);
            } else {
                console.error("Error fetching data");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchAanvragen(); 
    }, []);


    const updateAanvraag = async (id, actie, reden = '') => {
        try {
            // Controleer en log de data die wordt verstuurd
            const payload = {
                status: actie === 'goedkeuren' ? 'Goedgekeurd' : 'Afgewezen',
                reden: actie === 'afwijzen' ? reden : null, // Null als geen reden nodig is
            };

            console.log("Verzonden payload:", payload); // Debugging

            const response = await fetch(`https://localhost:7040/api/Huurverzoeken/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload), // Correcte payload
            });

            if (response.ok) {
                // Update lokale staat
                setAanvragen(prev =>
                    prev.map(aanvraag =>
                        aanvraag.huurverzoekId === id
                            ? { ...aanvraag, status: payload.status, reden: payload.reden }
                            : aanvraag
                    )
                );

                toast(`Aanvraag ${actie === 'goedkeuren' ? 'goedgekeurd' : 'afgewezen'}!`, {
                    type: 'success',
                });

                // Reset geselecteerde aanvraag en fetch vernieuwde data
                setGeselecteerdeAanvraag(null);
                await fetchAanvragen();
            } else {
                // Foutafhandeling
                const errorText = await response.text();
                console.error("Error response:", errorText);
                toast(`Fout bij verwerken: ${errorText}`, {
                    type: 'error',
                });
            }
        } catch (error) {
            console.error("Error:", error);
            toast(`Er is een fout opgetreden: ${error.message}`, {
                type: 'error',
            });
        }
    };

    const handleSearch = () => {
        const { id } = searchParams;
        let results = aanvragen;

        if (id) {
            results = results.filter((aanvraag) =>
                aanvraag.huurverzoekId.toString().includes(id)
            );
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
