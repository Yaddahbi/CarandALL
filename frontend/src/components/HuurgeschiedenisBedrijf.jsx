import { useState, useEffect } from 'react';
import { fetchHuurgeschiedenisBedrijf } from '../api';
import '../style/Huurgeschiedenis.css';

const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('nl-NL');
};

const HuurgeschiedenisBedrijf = () => {
    const [huurgeschiedenis, setHuurgeschiedenis] = useState({});
    const [medewerkers, setMedewerkers] = useState([]);
    const [filters, setFilters] = useState({ startDatum: '', eindDatum: '', voertuigType: 'Auto', medewerkerId: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const voertuigTypen = ['Auto'];

    // Functie om de huurgeschiedenis op te halen
    const loadHuurgeschiedenis = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchHuurgeschiedenisBedrijf(filters);
            setHuurgeschiedenis(data);

            // Extract unieke medewerkersnamen
            const uniekeMedewerkers = Object.keys(data).map((medewerkerNaam) => ({
                id: medewerkerNaam,
                naam: medewerkerNaam,
            }));
            setMedewerkers(uniekeMedewerkers);
        } catch (err) {
            setError('Er is een fout opgetreden bij het ophalen van de huurgeschiedenis.');
            console.error(err);
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
            <section className="huurgeschiedenis-hero">
                <div className="container huurgeschiedenis">
                    <h1>Huurgeschiedenis</h1>
                    <h2>medewerkers</h2>
                    <p>Bekijk de huurgeschiedenis van medewerkers en beheer hun huuraanvragen.</p>
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
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Medewerker:
                    <select
                        name="medewerkerId"
                        value={filters.medewerkerId}
                        onChange={handleFilterChange}
                    >
                        <option value="">Alle medewerkers</option>
                        {medewerkers.map((medewerker) => (
                            <option key={medewerker.id} value={medewerker.id}>
                                {medewerker.naam}
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
                        {Object.keys(huurgeschiedenis).length > 0 ? (
                            Object.keys(huurgeschiedenis).map((medewerkerNaam) => {
                                const verzoeken = huurgeschiedenis[medewerkerNaam];

                                if (filters.medewerkerId && medewerkerNaam !== filters.medewerkerId) {
                                    return null;
                                }

                                return (
                                    <div key={medewerkerNaam}>
                                        <h3>Huurverzoeken voor {medewerkerNaam}</h3>
                                        <table className="tabel">
                                            <thead>
                                                <tr>
                                                    <th>Huurperiode</th>
                                                    <th>Voertuig</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {verzoeken.map((item) => (
                                                    <tr key={item.huurverzoekId}>
                                                        <td>{formatDate(item.startDatum)} - {formatDate(item.eindDatum)}</td>
                                                        <td>{item.voertuigMerk} ({item.voertuigType})</td>
                                                        <td>{item.status}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            })
                        ) : (
                            <p className= "pgeenhv">Geen huurverzoeken gevonden.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default HuurgeschiedenisBedrijf;
