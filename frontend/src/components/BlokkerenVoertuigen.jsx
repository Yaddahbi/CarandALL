import { useState, useEffect } from 'react';

const BlokkerenVoertuigen = () => {
    const [vehicles, setVehicles] = useState([]);
    const [blockReason, setBlockReason] = useState('');

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch('/api/Voertuigs/available');
                const data = await response.json();
                setVehicles(data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchVehicles();
    }, []);

    const handleBlockVehicle = async (vehicleId) => {
        try {
            const response = await fetch(`/api/vehicles/${vehicleId}/block`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason: blockReason }),
            });

            if (response.ok) {
                setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
            } else {
                console.error('Failed to block vehicle');
            }
        } catch (error) {
            console.error('Error blocking vehicle: ', error);
        }
    };

    return (
        <div>
            <h2>Voertuigen Blokkeren voor Verhuur</h2>
            <textarea
                placeholder="Geef de reden voor blokkeren"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
            />
            <table>
                <thead>
                <tr>
                    <th>Kenteken</th>
                    <th>Actie</th>
                </tr>
                </thead>
                <tbody>
                {vehicles.map(vehicle => (
                    <tr key={vehicle.id}>
                        <td>{vehicle.licensePlate}</td>
                        <td>
                            <button onClick={() => handleBlockVehicle(vehicle.id)}>Blokkeren</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BlokkerenVoertuigen;
