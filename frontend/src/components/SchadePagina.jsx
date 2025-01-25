import React, { useState, useEffect } from "react";
import SchadeToevoegen from "./SchadeToevoegen";
import SchadeDetails from "./SchadeDetails";
import { useNavigate} from "react-router-dom";
import { fetchSchademeldingen } from "../api";
import '../Schadepagina.css';

const SchadePagina = () => {
    const [schademeldingen, setSchademeldingen] = useState([]);
    const [filters, setFilters] = useState({
        status: '',
        datumVan: '',
        datumTot: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const applyFilters = () => {
        const queryFilters = {
            status: filters.status,
            datumVan: filters.datumVan,
            datumTot: filters.datumTot,
        };
        fetchSchademeldingen(queryFilters)
            .then(response => {
                setSchademeldingen(response.data);
            })
            .catch(error => {
                setError("Er is een fout opgetreden bij het ophalen van de schademeldingen.");
            });
    };
    
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const schademeldingen = await fetchSchademeldingen(filters);
                    setSchademeldingen(schademeldingen);
                } catch (error) {
                    setError("Er is een fout opgetreden bij het ophalen van de schademeldingen.");
                }
            };
            fetchData();
            }, [filters]);

        const handleFilterChange = (e) => {
            setFilters({
                ...filters,
                [e.target.name]: e.target.value,
            });
        };

    const handleAddSchade = () => {
        navigate('toevoegen');
    };
    const handleClick = (id) => {
        navigate(`/schade/${id}`);
    };

        return (
            <div className="SchadeBeheer">
                {/* Button voor schade toevoegen */}
                <div className="add-schade-button">
                    <button onClick={handleAddSchade}>Voeg Schade Toe</button>
                </div>

                <div className="layout">
                    {/* Sidebar met filters */}
                    <div className="sidebar">
                        <h3>Filter Schademeldingen</h3>
                        <form>
                            <br/>
                            <label>Status:</label>
                            <select name="status" value={filters.status} onChange={handleFilterChange}>
                                <option value="">Alle statussen</option>
                                <option value="open">Open</option>
                                <option value="afgesloten">Afgesloten</option>
                            </select>
                            <br/>
                            <label>Van Datum:</label>
                            <input
                                type="date"
                                name="datumVan"
                                value={filters.datumVan}
                                onChange={handleFilterChange}
                            />
                            <br/>
                            <label>Tot Datum:</label>
                            <input
                                type="date"
                                name="datumTot"
                                value={filters.datumTot}
                                onChange={handleFilterChange}
                            />
                            <br/>
                            {/* Filter button */}
                            <button type="button" onClick={applyFilters}>Filter</button>
                        </form>
                    </div>

                    {/* Foutmelding */}
                    {error && <div className="error">{error}</div>}

                    {/* Tabel van schademeldingen */}
                    <table>
                        <thead>
                        <tr>
                            <th>Voertuig</th>
                            <th>Beschrijving</th>
                            <th>Datum</th>
                            <th>Foto</th>
                            <th>Status</th>
                            <th>Acties</th>
                        </tr>
                        </thead>
                        <tbody>
                        {schademeldingen.map((melding) => (
                            <tr key={melding.id}>
                                <td>{melding.voertuig}</td>
                                <td>{melding.beschrijving}</td>
                                <td>{melding.datum}</td>
                                <td>
                                    {melding.foto && (
                                        <a href={melding.foto} target="_blank" rel="noopener noreferrer">
                                            Bekijk Foto
                                        </a>
                                    )}
                                </td>
                                <td>{melding.status}</td>
                                <td>
                                    <button onClick={() => handleClick(melding.id)}>
                                        Bekijk Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
};

export default SchadePagina;