import { useState, useEffect } from 'react';
import { fetchHuurgeschiedenis } from '../api';
import '../style/Huurgeschiedenis.css';

const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('nl-NL');
};

const Huurgeschiedenis = () => {
    const [huurgeschiedenis, setHuurgeschiedenis] = useState({});
    const [filters, setFilters] = useState({ startDatum: '', eindDatum: '', voertuigType: 'Auto' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSections, setOpenSections] = useState({});

    const voertuigTypen = ['Auto', 'Caravan', 'Camper'];

    const loadHuurgeschiedenis = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchHuurgeschiedenis(filters);
            setHuurgeschiedenis(data);
            setOpenSections(Object.keys(data).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {}));
        } catch (err) {
            setError('Er is een fout opgetreden bij het ophalen van de huurgeschiedenis.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHuurgeschiedenis();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const toggleSection = (status) => {
        setOpenSections({
            ...openSections,
            [status]: !openSections[status],
        });
    };

    const renderVerzoeken = (status, items) => {
        const statusClass =
            status === 'Goedgekeurd' ? 'goedgekeurd' :
                status === 'Afgewezen' ? 'afgewezen' :
                    'in-afwachting';

        const statusIcon =
            status === 'Goedgekeurd' ? '✔️' :
                status === 'Afgewezen' ? '❌' :
                    '⏳';

        return (
            <div key={status} className="status-kaart">
                <button
                    className={`status-label ${statusClass}`}
                    onClick={() => toggleSection(status)}
                    aria-expanded={openSections[status]}
                    aria-controls={`section-${status}`}
                >
                    <span className="status-icon">{statusIcon}</span>
                    <span className="status-text">{status}</span>
                    <span className="toggle-arrow">{openSections[status] ? '▲' : '▼'}</span>
                </button>
                {openSections[status] && (
                    <div className="verzoeken-lijst" id={`section-${status}`}>
                        {items.map((item) => (
                            <div
                                key={item.huurverzoekId}
                                className="verzoek-item"
                                tabIndex="0"
                                aria-label={`Huurverzoek: ${item.voertuigMerk} (${item.voertuigType}), Huurperiode ${formatDate(item.startDatum)} tot ${formatDate(item.eindDatum)}, Kosten €${item.kosten?.toFixed(2) || 'N/A'}`}
                            >
                                <h4>{item.voertuigMerk} ({item.voertuigType})</h4>
                                <p><strong>Huurperiode:</strong> {formatDate(item.startDatum)} - {formatDate(item.eindDatum)}</p>
                                <p><strong>Kosten:</strong> €{item.kosten?.toFixed(2) || 'N/A'}</p>
                                {status === 'Goedgekeurd' && item.factuurUrl && (
                                    <a
                                        href={item.factuurUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="factuur-link"
                                        aria-label={`Download factuur voor ${item.voertuigMerk}`}
                                    >
                                        Download Factuur
                                    </a>
                                )}
                                {status === 'Afgewezen' && item.afwijzingsreden && (
                                    <p className="afwijzing" aria-label={`Afwijzingsreden: ${item.afwijzingsreden}`}>
                                        Reden: {item.afwijzingsreden}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <section className="huurgeschiedenis-hero">
                <div className="container">
                    <h1>Huurgeschiedenis</h1>
                    <p>Bekijk en beheer je gehuurde voertuigen en aanvragen.</p>
                </div>
            </section>

            <div className="huurgeschiedenis-filters">
                <label>
                    Startdatum:
                    <input
                        type="date"
                        name="startDatum"
                        value={filters.startDatum}
                        onChange={handleFilterChange}
                    />
                </label>
                <label>
                    Einddatum:
                    <input
                        type="date"
                        name="eindDatum"
                        value={filters.eindDatum}
                        onChange={handleFilterChange}
                    />
                </label>
                <label>
                    Voertuigtype:
                    <select
                        name="voertuigType"
                        value={filters.voertuigType}
                        onChange={handleFilterChange}
                    >
                        {voertuigTypen.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="huurgeschiedenis-container">
                {loading ? (
                    <p>Gegevens worden geladen...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <div className="status-kaarten">
                        {['In afwachting', 'Goedgekeurd', 'Afgewezen'].map((status) =>
                            huurgeschiedenis[status] && huurgeschiedenis[status].length > 0 ? (
                                renderVerzoeken(status, huurgeschiedenis[status])
                            ) : (
                                <p key={status}>Er zijn geen huurverzoeken met status "{status}".</p>
                            )
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Huurgeschiedenis;
