import { useState, useEffect } from 'react';
import { fetchHuurgeschiedenisBedrijf, fetchMedewerkers } from '../api';
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

    const voertuigTypen = ['Auto', 'Caravan', 'Camper'];

    // Functie om de huurgeschiedenis op te halen
    const loadHuurgeschiedenis = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log(filters); // Log de filters om te zien of ze goed zijn ingesteld
            const data = await fetchHuurgeschiedenisBedrijf(filters);
            console.log(data); // Log de ontvangen data om te controleren

            // Gegevens verwerken
            setHuurgeschiedenis(data);
        } catch (err) {
            setError('Er is een fout opgetreden bij het ophalen van de huurgeschiedenis.');
            console.error(err); // Foutmelding loggen
        } finally {
            setLoading(false);
        }
    };

    // Functie om de medewerkers op te halen
    const loadMedewerkers = async () => {
        try {
            const data = await fetchMedewerkers();
            setMedewerkers(data);
        } catch (err) {
            setError('Er is een fout opgetreden bij het ophalen van de medewerkers.');
        }
    };

    useEffect(() => {
        loadMedewerkers();
    }, []);

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
                    <h1>Huurgeschiedenis Beheerder</h1>
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
                        {/* Als de medewerkerId is geselecteerd, filteren we de verzoeken op die medewerker */}
                        {Object.keys(huurgeschiedenis).length > 0 ? (
                            Object.keys(huurgeschiedenis).map((medewerkerNaam) => {
                                const verzoeken = huurgeschiedenis[medewerkerNaam];

                                // Als er een medewerker filter is geselecteerd, alleen de verzoeken van die medewerker tonen
                                if (filters.medewerkerId && medewerkerNaam !== filters.medewerkerId) {
                                    return null; 
                                }

                                return (
                                    <div key={medewerkerNaam}>
                                        <h3>Huurverzoeken voor {medewerkerNaam}</h3>
                                        <table>
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
                            <p>Geen huurverzoeken gevonden.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default HuurgeschiedenisBedrijf;
