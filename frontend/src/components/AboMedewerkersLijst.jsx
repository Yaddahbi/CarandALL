import { useEffect, useState } from "react";
import { toast } from "sonner";
import Modal from "./Modal"; 

const AboMedewerkersLijst = ({ refreshKey }) => {
    const [medewerkers, setMedewerkers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMedewerkers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                throw new Error("Geen token gevonden. Log opnieuw in.");
            }

            const response = await fetch("https://localhost:7040/api/Abonnement/medewerkers", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Fout bij het ophalen van medewerkers.");
            }

            const data = await response.json();
            console.log("Fetched medewerkers:", data);

            const filteredMedewerkers = data.filter(medewerker => medewerker.rol !== "ZakelijkeKlant");
            setMedewerkers(filteredMedewerkers);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (medewerkerId) => {
        const toastId = toast(
            (t) => (
                <div>
                    <p>Weet je zeker dat je deze medewerker wilt verwijderen?</p>
                    <button
                        onClick={async () => {
                            try {
                                const token = localStorage.getItem("jwtToken");
                                const response = await fetch(`https://localhost:7040/api/Abonnement/remove-medewerker/${medewerkerId}`, {
                                    method: "DELETE",
                                    headers: {
                                        "Authorization": `Bearer ${token}`,
                                    },
                                });

                                if (response.ok) {
                                    toast.success("Medewerker succesvol verwijderd.");
                                    fetchMedewerkers(); // Refresh de lijst
                                } else {
                                    const data = await response.json();
                                    toast.error(data.message || "Er is iets fout gegaan.");
                                }
                            } catch (error) {
                                toast.error("Er is een netwerkfout opgetreden.");
                            }
                            toast.dismiss(toastId); // Sluit de toast na actie
                        }}
                    >
                        Ja, verwijderen
                    </button>
                    <button
                        onClick={() => toast.dismiss(toastId)} // Zorg ervoor dat de juiste toast wordt gesloten
                    >
                        Nee, annuleren
                    </button>
                </div>
            ),
            {
                duration: Infinity, // Toast blijft open totdat het wordt gesloten
            }
        );
    };


    useEffect(() => {
        fetchMedewerkers(); 
    }, [refreshKey]);

    return (
        <div>
            <h2>Medewerkers</h2>
            {loading ? (
                <p>Laden...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Naam</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acties</th>
                        </tr>
                        </thead>
                    <tbody>
                        {medewerkers && medewerkers.length > 0 ? (
                            medewerkers.map((medewerker) => (
                                <tr key={medewerker.id}> 
                                    <td>{medewerker.naam}</td> 
                                    <td>{medewerker.email}</td>
                                    <td>{medewerker.rol}</td>
                                    <td>
                                        <button onClick={() => handleDelete(medewerker.id)}>Verwijderen</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">Geen medewerkers gevonden.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AboMedewerkersLijst;
