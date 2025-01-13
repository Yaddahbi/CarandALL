import { useState, useEffect } from "react";
import AboAddMedewerker from "./AboAddMedewerker";
import AboMedewerkersLijst from "./AboMedewerkersLijst";
import "../style/Abonnementen.css";
import { toast } from "sonner";

const Abonnementen = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [abonnementDetails, setAbonnementDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Functie om de medewerkerslijst opnieuw op te halen
    const refreshMedewerkers = () => {
        setRefreshKey((prevKey) => prevKey + 1); // Verhoog de key om de lijst opnieuw te laden
    };

    // Functie om abonnement details op te halen
    const fetchAbonnementDetails = async () => {
        setLoadingDetails(true);
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                throw new Error("Geen token gevonden. Log opnieuw in.");
            }

            const response = await fetch("https://localhost:7040/api/Abonnement/details", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            // Controleer of de response een succesvolle status heeft
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Fout bij het ophalen van abonnementdetails.");
            }

            const data = await response.json();
            // Zorg ervoor dat je de juiste data uit de API haalt
            setAbonnementDetails(data);
        } catch (error) {
            console.error("Fout bij het ophalen van gegevens:", error.message);
            toast.error(error.message);
        } finally {
            setLoadingDetails(false);
        }
    };

    useEffect(() => {
        fetchAbonnementDetails();
    }, []);

    return (
        <>
            <div className="abo-container">
            {/* Hero-sectie */}
            <section className="abonnementen-hero">
                <div className="container abonnementen">
                    <h1>Abonnement Beheer</h1>
                    <p>Beheer eenvoudig medewerkers die toegang hebben tot de abonnementen.</p>
                </div>
            </section>

            {/* Abonnement Details - direct na de hero sectie */}
            <section className="abonnement-details">
                <div className="container">
                    <h2>Abonnement Details</h2>
                    {loadingDetails ? (
                        <p>Details laden...</p>
                    ) : abonnementDetails ? (
                        <ul>
                            <li><strong>Maximale aantal medewerkers:</strong> {abonnementDetails.maxMedewerkers}</li>
                            <li><strong>Abonnement Type:</strong> {abonnementDetails.abonnementType}</li>
                            <li><strong>Bedrijfsdomein:</strong> {abonnementDetails.bedrijfsDomein}</li>
                        </ul>
                    ) : (
                        <p>Geen abonnementdetails beschikbaar.</p>
                    )}
                </div>
            </section>

            {/* Content-sectie */}
            <div className="abonnementen-content">
                <div className="add-medewerker-section">
                    <AboAddMedewerker refreshMedewerkers={refreshMedewerkers} />
                </div>
                <div className="medewerkers-lijst-section">
                    <AboMedewerkersLijst refreshKey={refreshKey} />
                </div>
                </div>
            </div>
        </>
    );

};

    export default Abonnementen;
