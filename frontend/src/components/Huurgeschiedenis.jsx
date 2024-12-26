import React, { useState, useEffect } from 'react';
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
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
            </section>

            {/* Gegevensweergave */}
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
                                            <tr key={item.huurverzoekId}>
                                                <td>
                                                    {formatDate(item.startDatum)} - {formatDate(item.eindDatum)}
                                                </td>
                                                <td>
                                                    {item.voertuigMerk} ({item.voertuigType})
                                                </td>
                                                <td>€{item.kosten.toFixed(2)}</td>
                                                <td>
                                                    <a
                                                        href={item.factuurUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
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
                        {/* Overige tabellen */}
                    </div>
                )}
            </div>
        </>
    );
};

export default Huurgeschiedenis;
