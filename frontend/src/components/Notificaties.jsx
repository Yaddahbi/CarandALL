import { useEffect, useState } from "react";
import { toast } from "sonner";
import "../style/Notificatie.css";

const Notificaties = () => {
    const [notificaties, setNotificaties] = useState([]);

    useEffect(() => {
        const fetchNotificaties = async () => {
            try {
                const token = sessionStorage.getItem("jwtToken");
                if (!token) throw new Error("Niet ingelogd.");

                const response = await fetch("https://localhost:7040/api/User/notificaties", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Kon notificaties niet ophalen.");
                }

                const data = await response.json();
                setNotificaties(data);
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchNotificaties();
    }, []);

    return (
        <main className="notificaties-page-wrapper" aria-labelledby="notificaties-title">
            <div className="notificaties-container">
                <h2 id="notificaties-title" className="notificaties-title">Uw Notificaties</h2>
                {notificaties.length > 0 ? (
                    <ul className="notificaties-list" role="list">
                        {notificaties.map((notificatie) => (
                            <li
                                className="notificatie-item"
                                key={notificatie.id}
                                tabIndex={0}
                                aria-label={`Notificatie: ${notificatie.bericht}, Datum: ${new Date(notificatie.datumTijd).toLocaleString()}`}
                            >
                                <span className="notificatie-bericht">
                                    {notificatie.bericht}
                                </span>
                                <span className="notificatie-datum">
                                    {new Date(notificatie.datumTijd).toLocaleString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p role="alert" className="geen-notificaties">Geen notificaties beschikbaar.</p>
                )}
            </div>
        </main>
    );
};

export default Notificaties;