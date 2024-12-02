import { useState, useEffect } from "react";
import { fetchSchades } from "./api";
import SchadeLijst from "./SchadeLijst";
import SchadeToevoegen from "./SchadeToevoegen";

const SchadePagina = () => {
    const [schades, setSchades] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        const loadSchades = async () => {
            try {
                const data = await fetchSchades();
                console.log("Schades in useEffect:", data);
                setSchades(data);
            } catch (err) {
                setError(err.message);
                console.log("Error fetching schades:", err);
            }
        };
        loadSchades();
    }, []);


    const handleSchadeToevoegen = (newSchade) => {
        setSchades((prevSchades) => [...prevSchades, newSchade]);
    };

    return (
        <div>
            <h2>Schadebeheer</h2>

            {/* De SchadeToevoegen component met een callback om nieuwe schade toe te voegen */}
            <SchadeToevoegen onSchadeToevoegen={handleSchadeToevoegen}/>

            {/* De SchadeLijst component die de lijst van schades weergeeft */}
            <SchadeLijst schades={schades}/>

            {error && <p style={{color: "red"}}>{error}</p>} {/* Foutmelding als er iets misgaat */}
        </div>
    );
};

export default SchadePagina;
