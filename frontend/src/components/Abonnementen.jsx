import { useState, useEffect } from "react";
import AboAddMedewerker from "./AboAddMedewerker";
import AboMedewerkersLijst from "./AboMedewerkersLijst";
import AboWijzigAbonnement from "./AboWijzigAbonnement";
import "../style/Abonnementen.css";
import { toast } from "sonner";

const Abonnementen = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [abonnementDetails, setAbonnementDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Functie om de medewerkerslijst opnieuw op te halen
    const refreshMedewerkers = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    // Functie om abonnement details op te halen
    const fetchAbonnementDetails = async () => {
        setLoadingDetails(true);
        try {
            const token = sessionStorage.getItem("jwtToken");
            if (!token) {
                throw new Error("Geen token gevonden. Log opnieuw in.");
            }

            const response = await fetch("https://localhost:7040/api/Abonnement/details", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Fout bij het ophalen van abonnementdetails.");
            }

            const data = await response.json();
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
                            <li><strong>Huidig Abonnement Type:</strong> {abonnementDetails.abonnementType}</li>
                            <li><strong>Bedrijfsdomein:</strong> {abonnementDetails.bedrijfsDomein}</li>
                            {abonnementDetails.toekomstigAbonnementType && (
                                <li><strong>Toekomstig Abonnement Type:</strong> {abonnementDetails.toekomstigAbonnementType}</li>
                            )}
                            {abonnementDetails.wijzigingIngangsdatum && (
                                <li><strong>Wijziging ingangsdatum:</strong> {new Date(abonnementDetails.wijzigingIngangsdatum).toLocaleDateString()}</li>
                            )}
                        </ul>
                    ) : (
                        <p>Geen abonnementdetails beschikbaar.</p>
                    )}
                </div>
                {/* Wijzig abonnement */}
                <section className="wijzig-abonnement-section">
                    <AboWijzigAbonnement
                        huidigType={abonnementDetails?.abonnementType || ""} 
                        toekomstigeWijziging={
                            abonnementDetails?.toekomstigAbonnementType
                                ? {
                                    type: abonnementDetails.toekomstigAbonnementType,
                                    ingangsdatum: abonnementDetails.wijzigingIngangsdatum,
                                }
                                : null
                        }
                        onWijziging={(nieuwType) => {
                            toast.success(`Wijziging naar ${nieuwType} aangevraagd.`);
                            fetchAbonnementDetails();
                        }}
                    />
                </section>
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
    );
};

export default Abonnementen;
