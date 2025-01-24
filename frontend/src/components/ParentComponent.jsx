import { useState, useEffect } from 'react';
import Wagenparkbeheer from './Wagenparkbeheer';
import VoertuigWeergave from './VoertuigWeergave';

const ParentComponent = () => {
    const [voertuigen, setVoertuigen] = useState([]);

    useEffect(() => {
        fetch('https://localhost:7040/api/Voertuigen')
            .then((response) => response.json())
            .then((data) => setVoertuigen(data))
            .catch((error) => console.error('Error fetching voertuigen:', error));
    }, []);

    return (
        <div>
            <Wagenparkbeheer voertuigen={voertuigen} setVoertuigen={setVoertuigen} />
            <VoertuigWeergave voertuigen={voertuigen} />
        </div>
    );
};

export default ParentComponent;
