import { useState, useEffect } from 'react';
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";

const VerhuurdeVoertuigen = () => {
    const [voertuigen, setVoertuigen] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [filters, setFilters] = useState({ periode: '', type: '', huurder: '' });
    const [blockReden, setBlockReden] = useState('');

    useEffect(() => {
        const fetchVoertuigen = async () => {
            try {
                const response = await fetch(`https://localhost:7040/api/Voertuigs?status=${statusFilter}&period=${filters.periode}&type=${filters.type}&renter=${filters.huurder}`);
                const data = await response.json();
                setVoertuigen(data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchVoertuigen();
    }, [statusFilter, filters]);

    const handleBlockVoertuig = async (voertuigId) => {
        try {
            const response = await fetch(`/api/vehicles/${voertuigId}/block`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason: blockReden }),
            });

            if (response.ok) {
                setVoertuigen(voertuigen.filter(voertuig => voertuig.id !== voertuigId));
            } else {
                console.error('Failed to block vehicle');
            }
        } catch (error) {
            console.error('Error blocking vehicle: ', error);
        }
    };

    const handleExportCSV = () => {
        const csvData = voertuigen.map(voertuig => ({
            kenteken: voertuig.licensePlate,
            verhuurDatum: voertuig.rentalDate,
            huurder: voertuig.renter ? voertuig.renter.name : '',
            status: voertuig.status
        }));
        return csvData;
    };
    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text("Overzicht van Verhuurde Voertuigen", 14, 10);

        let yPosition = 20;
        voertuigen.forEach(voertuig => {
            doc.text(`Kenteken: ${voertuig.licensePlate} - Verhuurdatum: ${voertuig.rentalDate} - Huurder: ${voertuig.renter ? voertuig.renter.name : 'N/A'} - Status: ${voertuig.status}`, 14, yPosition);
            yPosition += 10;
        });

        doc.save('verhuurde_voertuigen.pdf');
    };

    return (
        <div>
            <h2>Overzicht van Verhuurde Voertuigen</h2>
            {/* Filteren op status */}
            <div>
                <label>Filter op status: </label>
                <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                    <option value="">Alle</option>
                    <option value="beschikbaar">Beschikbaar</option>
                    <option value="verhuurd">Verhuurd</option>
                    <option value="in_reparatie">In Reparatie</option>
                    <option value="geblokkeerd">Geblokkeerd</option>
                </select>
            </div>

            {/* Filters voor verhuurde voertuigen */}
            <div>
                <label>Periode: </label>
                <input
                    type="date"
                    onChange={(e) => setFilters({ ...filters, periode: e.target.value })}
                />
                <label>Voertuigtype: </label>
                <input
                    type="text"
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                />
                <label>Huurder: </label>
                <input
                    type="text"
                    onChange={(e) => setFilters({ ...filters, huurder: e.target.value })}
                />
            </div>

            {/* Tabel met voertuigen */}
            <table>
                <thead>
                <tr>
                    <th>Kenteken</th>
                    <th>Verhuurdatum</th>
                    <th>Huurder</th>
                    <th>Status</th>
                    <th>Actie</th>
                </tr>
                </thead>
                <tbody>
                {voertuigen.map(voertuig => (
                    <tr key={voertuig.id}>
                        <td>{voertuig.licensePlate}</td>
                        <td>{voertuig.rentalDate}</td>
                        <td>{voertuig.renter ? voertuig.renter.name : 'N/A'}</td>
                        <td>{voertuig.status}</td>
                        <td>
                            <button onClick={() => handleStatusChange(voertuig.id, 'beschikbaar')}>Beschikbaar</button>
                            <button onClick={() => handleStatusChange(voertuig.id, 'verhuurd')}>Verhuurd</button>
                            <button onClick={() => handleStatusChange(voertuig.id, 'in_reparatie')}>In Reparatie</button>
                            <button onClick={() => handleStatusChange(voertuig.id, 'geblokkeerd')}>Geblokkeerd</button>
                        </td>
                        <td>
                            <button onClick={() => handleBlockVoertuig(voertuig.id)}>Blokkeren</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Exporteer naar CSV */}
            <CSVLink data={handleExportCSV()} filename="verhuurde_voertuigen.csv">
                <button>Exporteer naar CSV</button>
            </CSVLink>

            {/* Exporteer naar PDF */}
            <button onClick={handleExportPDF}>Exporteer naar PDF</button>
        </div>
    );
};

export default VerhuurdeVoertuigen;