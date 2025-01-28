import { useEffect, useState } from "react";
import { toast } from "sonner";
import "../style/Abonnementen.css";

const AboMedewerkersLijst = ({ refreshKey }) => {
    const [medewerkers, setMedewerkers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMedewerkers = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem("jwtToken");
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
                                const token = sessionStorage.getItem("jwtToken");
                                const response = await fetch(`https://localhost:7040/api/Abonnement/remove-medewerker/${medewerkerId}`, {
                                    method: "DELETE",
                                    headers: {
                                        "Authorization": `Bearer ${token}`,
                                    },
                                });

                                if (response.ok) {
                                    toast.success("Medewerker succesvol verwijderd.");
                                    fetchMedewerkers();
                                } else {
                                    const data = await response.json();
                                    toast.error(data.message || "Er is iets fout gegaan.");
                                }
                            } catch (error) {
                                toast.error("Er is een netwerkfout opgetreden.");
                            }
                            toast.dismiss(toastId);
                        }}
                    >
                        Ja, verwijderen
                    </button>
                    <button
                        onClick={() => toast.dismiss(toastId)}
                    >
                        Nee, annuleren
                    </button>
                </div>
            ),
            {
                duration: Infinity,
            }
        );
    };

    useEffect(() => {
        fetchMedewerkers();
    }, [refreshKey]);

    return (
        <div className="medewerkers-container">
            <h2>Medewerkers</h2>
            {loading ? (
                <p>Laden...</p>
            ) : (
                <div className="tabel-container">
                    <table className="tabel" role="table" aria-label="Overzicht van medewerkers">
                        <thead>
                            <tr role="row">
                                <th role="columnheader">Naam</th>
                                <th role="columnheader">Email</th>
                                <th role="columnheader">Rol</th>
                                <th role="columnheader">Acties</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medewerkers && medewerkers.length > 0 ? (
                                medewerkers.map((medewerker) => (
                                    <tr
                                        role="row"
                                        key={medewerker.id}
                                        tabIndex="0"
                                        aria-label={`Medewerker: ${medewerker.naam}, Email: ${medewerker.email}, Rol: ${medewerker.rol}`}
                                    >
                                        <td role="cell">{medewerker.naam}</td>
                                        <td role="cell">{medewerker.email}</td>
                                        <td role="cell">{medewerker.rol}</td>
                                        <td role="cell">
                                            <button
                                                onClick={() => handleDelete(medewerker.id)}
                                                aria-label={`Verwijder medewerker ${medewerker.naam}`}
                                            >
                                                Verwijderen
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="no-data" role="cell">
                                        Geen medewerkers gevonden.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AboMedewerkersLijst;
