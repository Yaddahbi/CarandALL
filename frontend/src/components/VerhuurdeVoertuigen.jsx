import { useState, useEffect } from 'react';
import { CSVLink } from "react-csv";
import { saveAs } from 'file-saver';

const VerhuurdeVoertuigen = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filters, setFilters] = useState({ period: '', type: '', renter: '' });

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(`/api/Voertuig/rented?period=${filters.period}&type=${filters.type}&renter=${filters.renter}`);
                const data = await response.json();
                setVehicles(data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchVehicles();
    }, [filters]);

    const handleExportCSV = () => {
        const csvData = vehicles.map(vehicle => ({
            licensePlate: vehicle.licensePlate,
            rentalDate: vehicle.rentalDate,
            renter: vehicle.renter.name
        }));
        return csvData;
    };

    return (
        <div>
            <h2>Overzicht van Verhuurde Voertuigen</h2>
            <div>
                <label>Periode: </label>
                <input
                    type="date"
                    onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                />
                <label>Voertuigtype: </label>
                <input
                    type="text"
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                />
                <label>Huurder: </label>
                <input
                    type="text"
                    onChange={(e) => setFilters({ ...filters, renter: e.target.value })}
                />
            </div>
            <table>
                <thead>
                <tr>
                    <th>Kenteken</th>
                    <th>Verhuurdatum</th>
                    <th>Huurder</th>
                </tr>
                </thead>
                <tbody>
                {vehicles.map(vehicle => (
                    <tr key={vehicle.id}>
                        <td>{vehicle.licensePlate}</td>
                        <td>{vehicle.rentalDate}</td>
                        <td>{vehicle.renter.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <CSVLink data={handleExportCSV()} filename="verhuurde_voertuigen.csv">
                <button>Exporteer naar CSV</button>
            </CSVLink>
        </div>
    );
};

export default VerhuurdeVoertuigen;
