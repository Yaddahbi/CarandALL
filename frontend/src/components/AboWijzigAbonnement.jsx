import { useState } from "react";
import "../style/Abonnementen.css";

const BeschikbareOpties = [
    { type: "Pay-as-you-go", kosten: 50 },
    { type: "Prepaid", kosten: 200 },
];

const AboWijzigAbonnement = ({ huidigType, onWijziging }) => {
    const [gekozenType, setGekozenType] = useState(huidigType);
    const [toonFormulier, setToonFormulier] = useState(false);

    const volgendeMaand = new Date();
    volgendeMaand.setMonth(volgendeMaand.getMonth() + 1);

    const handleWijziging = () => {
        onWijziging(gekozenType);
        setToonFormulier(false);
    };

    return (
        <div className="wijzig-abonnement-container">
            <button className="wijzig-button" onClick={() => setToonFormulier(!toonFormulier)}>
                Wijzig Abonnement
            </button>
            {toonFormulier && (
                <div className="wijzig-formulier">
                    <h3>Wijzig Abonnement</h3>
                    <select
                        value={gekozenType}
                        onChange={(e) => setGekozenType(e.target.value)}
                    >
                        {BeschikbareOpties.map((optie) => (
                            <option
                                key={optie.type}
                                value={optie.type}
                                disabled={optie.type === huidigType}
                            >
                                {optie.type} - €{optie.kosten}
                            </option>
                        ))}
                    </select>
                    <p>
                        <em>
                            Let op: Wijzigingen gaan in op de eerste dag van de volgende maand (
                            {volgendeMaand.toLocaleDateString()}).
                        </em>
                    </p>
                    <button onClick={handleWijziging} disabled={gekozenType === huidigType}>
                        Bevestig Wijziging
                    </button>
                </div>
            )}
        </div>
    );
};

export default AboWijzigAbonnement;
