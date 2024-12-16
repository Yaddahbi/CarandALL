import PropTypes from "prop-types";

const VerhuuraanvraagLijst = ({ aanvragen, onSelectAanvraag }) => {
    return (
        <div>
            <table >
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
                    {aanvragen.map((aanvraag) => (
                        <tr key={aanvraag.id}>
                            <td>{aanvraag.id}</td>
                            <td>{aanvraag.startDatum}</td>
                            <td>{aanvraag.eindDatum}</td>
                            <td>{aanvraag.status}</td>
                            <td>
                                <button onClick={() => onSelectAanvraag(aanvraag)}>
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
