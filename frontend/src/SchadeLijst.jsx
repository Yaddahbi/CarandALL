import { useState, useEffect } from "react";
import { fetchSchades } from "./api";

const SchadeLijst = ({ schades }) => {
    return (
        <div>
            <h3>Schade Lijst</h3>
            {schades.length > 0 ? (
                schades.map((schade) => (
                    <div key={schade.schadeId}>
                        <p>{schade.beschrijving}</p>
                        <p>Datum: {schade.datum}</p>
                        <p>Status: {schade.status}</p>
                        <p>Kosten: €{schade.kosten}</p>
                    </div>
                ))
            ) : (
                <p>Geen schades gevonden.</p>
            )}
        </div>
    );
};

export default SchadeLijst;
