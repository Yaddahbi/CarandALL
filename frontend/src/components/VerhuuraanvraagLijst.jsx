import PropTypes from "prop-types";

const VerhuuraanvraagLijst = ({ aanvragen, onSelectAanvraag }) => {
    // Functie om aanvragen te groeperen op status
    const aanvragenPerStatus = aanvragen.reduce((acc, aanvraag) => {
        acc[aanvraag.status] = acc[aanvraag.status] || [];
        acc[aanvraag.status].push(aanvraag);
        return acc;
    }, {});

    return (
        <div>
            {["In afwachting", "Goedgekeurd", "Afgewezen"].map((status) => (
                <div key={status} className="status-group">
                    <h3>{status}</h3>
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
                            {(aanvragenPerStatus[status] || [])
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
            ))}
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
