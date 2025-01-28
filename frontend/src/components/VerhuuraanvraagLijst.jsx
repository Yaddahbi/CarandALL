import PropTypes from "prop-types";
import { useState } from "react";

const VerhuuraanvraagLijst = ({ aanvragen, onSelectAanvraag }) => {
    const [filterStatus, setFilterStatus] = useState("");
    
    const gefilterdeAanvragen = aanvragen.filter((aanvraag) =>
        filterStatus ? aanvraag.status === filterStatus : true
    );

    return (
        <div>
  
            <div className="verhuurfilter-container">
                <label htmlFor="status-filter">Filter op status:</label>
                <select
                    id="verhuutstatus-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">Alle</option>
                    <option value="In afwachting">In afwachting</option>
                    <option value="Goedgekeurd">Goedgekeurd</option>
                    <option value="Afgewezen">Afgewezen</option>
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Startdatum</th>
                        <th>Einddatum</th>
                        <th>Status</th>
                        <th>Acties</th>
                    </tr>
                </thead>
                <tbody>
                    {gefilterdeAanvragen
                        .sort(
                            (a, b) =>
                                new Date(b.startDatum) - new Date(a.startDatum)
                        )
                        .map((aanvraag) => (
                            <tr key={aanvraag.id}>
                                <td>{aanvraag.id}</td>
                                <td>
                                    {new Date(
                                        aanvraag.startDatum
                                    ).toLocaleDateString("nl-NL")}
                                </td>
                                <td>
                                    {new Date(
                                        aanvraag.eindDatum
                                    ).toLocaleDateString("nl-NL")}
                                </td>
                                <td>{aanvraag.status}</td>
                                <td>
                                    <button
                                        onClick={() => onSelectAanvraag(aanvraag)}
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

VerhuuraanvraagLijst.propTypes = {
    aanvragen: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            startDatum: PropTypes.string.isRequired,
            eindDatum: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
        })
    ).isRequired,
    onSelectAanvraag: PropTypes.func.isRequired,
};

export default VerhuuraanvraagLijst;
