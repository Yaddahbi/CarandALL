import { useState } from "react";
import AboAddMedewerker from "./AboAddMedewerker";
import AboMedewerkersLijst from "./AboMedewerkersLijst";
import "../style/Abonnementen.css"; 

const Abonnementen = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    // Functie om de medewerkerslijst opnieuw op te halen
    const refreshMedewerkers = () => {
        setRefreshKey((prevKey) => prevKey + 1); // Verhoog de key om de lijst opnieuw te laden
    };
    return (
        <>
            {/* Hero-sectie */}
            <section className="abonnementen-hero">
                <div className="container abonnementen">
                    <h1>Abonnement Beheer</h1>
                    <p>Beheer eenvoudig medewerkers die toegang hebben tot de abonnementen.</p>
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
        </>
    );
};

export default Abonnementen;
