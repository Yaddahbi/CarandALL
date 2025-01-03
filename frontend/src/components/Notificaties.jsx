import { useEffect, useState } from "react";
import { toast } from "sonner";

const Notificaties = () => {
    const [notificaties, setNotificaties] = useState([]);

    useEffect(() => {
        const fetchNotificaties = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
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
        <div>
            <h2>Uw Notificaties</h2>
            <ul>
                {notificaties.map((notificatie) => (
                    <li key={notificatie.id}>
                        {notificatie.bericht} - {new Date(notificatie.datumTijd).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notificaties;
