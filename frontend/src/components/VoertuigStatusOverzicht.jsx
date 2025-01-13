import { useState, useEffect } from 'react';

const VoertuigStatusOverzicht = () => {
    const [vehicles, setVehicles] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(`/api/Voertuigs/status?status=${statusFilter}`);
                const data = await response.json();
                setVehicles(data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchVehicles();
    }, [statusFilter]);

    const handleStatusChange = async (vehicleId, status) => {
        try {
            const response = await fetch(`/api/vehicles/${vehicleId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                setVehicles(vehicles.map(vehicle =>
                    vehicle.id === vehicleId ? { ...vehicle, status } : vehicle
                ));
            } else {
                console.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status: ', error);
        }
    };

    return (
        <div>
            <h2>Voertuigstatus Overzicht</h2>
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
            <table>
                <thead>
                <tr>
                    <th>Kenteken</th>
                    <th>Status</th>
                    <th>Wijzig Status</th>
                </tr>
                </thead>
                <tbody>
                {vehicles.map(vehicle => (
                    <tr key={vehicle.id}>
                        <td>{vehicle.licensePlate}</td>
                        <td>{vehicle.status}</td>
                        <td>
                            <button onClick={() => handleStatusChange(vehicle.id, 'beschikbaar')}>Beschikbaar</button>
                            <button onClick={() => handleStatusChange(vehicle.id, 'verhuurd')}>Verhuurd</button>
                            <button onClick={() => handleStatusChange(vehicle.id, 'in_reparatie')}>In Reparatie</button>
                            <button onClick={() => handleStatusChange(vehicle.id, 'geblokkeerd')}>Geblokkeerd</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default VoertuigStatusOverzicht;
