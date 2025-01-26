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

    const voertuigTypen = ['Auto', 'Caravan', 'Camper'];

    const loadHuurgeschiedenis = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchHuurgeschiedenis(filters);
            setHuurgeschiedenis(data);
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

    return (
        <>
            {/* Hero-sectie */}
            <section className="huurgeschiedenis-hero">
                <div className="container huurgeschiedenis">
                    <h1>Mijn Huurgeschiedenis</h1>
                    <p>Bekijk en beheer je gehuurde voertuigen en aanvragen.</p>
                </div>
            </section>

            {/* Gegevensweergave */}
            <div className="huurgeschiedenis-filters">
                <label htmlFor="startDatum">
                    Startdatum:
                    <input
                        type="date"
                        name="startDatum"
                        id="startDatum"
                        value={filters.startDatum}
                        onChange={handleFilterChange}
                        tabIndex="0" // Zorgt ervoor dat het tabbable is
                    />
                </label>
                <label htmlFor="eindDatum">
                    Einddatum:
                    <input
                        type="date"
                        name="eindDatum"
                        id="eindDatum"
                        value={filters.eindDatum}
                        onChange={handleFilterChange}
                        tabIndex="0" // Zorgt ervoor dat het tabbable is
                    />
                </label>
                <label htmlFor="voertuigType">
                    Voertuigtype:
                    <select
                        name="voertuigType"
                        id="voertuigType"
                        value={filters.voertuigType}
                        onChange={handleFilterChange}
                        tabIndex="0" // Zorgt ervoor dat het tabbable is
                    >
                        {voertuigTypen.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="huurgeschiedenis-container">
                {loading ? (
                    <p>Gegevens worden geladen...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <div>
                        {/* Goedgekeurde verzoeken */}
                        {huurgeschiedenis['Goedgekeurd'] && huurgeschiedenis['Goedgekeurd'].length > 0 && (
                            <>
                                <h3>Goedgekeurde Verzoeken</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Huurperiode</th>
                                            <th>Voertuig</th>
                                            <th>Kosten</th>
                                            <th>Factuur</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {huurgeschiedenis['Goedgekeurd'].map((item) => (
                                            <tr key={item.huurverzoekId} tabIndex="0" className="tabelrij">
                                                <td>
                                                    {formatDate(item.startDatum)} - {formatDate(item.eindDatum)}
                                                </td>
                                                <td>
                                                    {item.voertuigMerk} ({item.voertuigType})
                                                </td>
                                                <td>�{item.kosten.toFixed(2)}</td>
                                                <td>
                                                    <a
                                                        href={item.factuurUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        tabIndex="0" // Zorgt ervoor dat de link tabbable is
                                                    >
                                                        Download
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}

                        {/* In afwachting verzoeken */}
                        {huurgeschiedenis['In afwachting'] && huurgeschiedenis['In afwachting'].length > 0 && (
                            <>
                                <h3>In Afwachting Verzoeken</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Huurperiode</th>
                                            <th>Voertuig</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {huurgeschiedenis['In afwachting'].map((item) => (
                                            <tr key={item.huurverzoekId} tabIndex="0" className="tabelrij">
                                                <td>{formatDate(item.startDatum)} - {formatDate(item.eindDatum)}</td>
                                                <td>{item.voertuigMerk} ({item.voertuigType})</td>
                                                <td>{item.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}

                        {/* Afgewezen verzoeken */}
                        {huurgeschiedenis['Afgewezen'] && huurgeschiedenis['Afgewezen'].length > 0 && (
                            <>
                                <h3>Afgewezen Verzoeken</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Huurperiode</th>
                                            <th>Voertuig</th>
                                            <th>Reden van Afwijzing</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {huurgeschiedenis['Afgewezen'].map((item) => (
                                            <tr key={item.huurverzoekId} tabIndex="0" className="tabelrij">
                                                <td>{formatDate(item.startDatum)} - {formatDate(item.eindDatum)}</td>
                                                <td>{item.voertuigMerk} ({item.voertuigType})</td>
                                                <td>{item.afwijzingsreden}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Huurgeschiedenis;
