import React, { useState, useEffect } from "react";
import SchadeToevoegen from "./SchadeToevoegen";
import SchadeDetails from "./SchadeDetails";
import { useNavigate} from "react-router-dom";
import '../style/SchadePagina.css';

const fetchSchades = async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`/api/schade?${queryParams}`);
    if (!response.ok) {
        throw new Error("Fout bij het ophalen van schades");
    }
    return await response.json();
};

const SchadePagina = () => {
    const [schades, setSchades] = useState([]);
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
        fetchSchades(queryFilters)
            .then(response => {
                setSchades(response);
            })
            .catch(error => {
                setError("Er is een fout opgetreden bij het ophalen van de schades.");
            });
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const schades = await fetchSchades(filters);
                setSchades(schades);
            } catch (error) {
                setError("Er is een fout opgetreden bij het ophalen van de schades.");
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
        navigate('/schades/toevoegen');
    };
    const handleClick = (id) => {
        navigate(`/schade/details/${id}`);
    };

        return (
            <div className="SchadeBeheer">
                <h2>Schadebeheer Pagina</h2>
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
                                <option value="in behandeling">In Behandeling</option>
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
                            <th>Status</th>
                            <th>Acties</th>
                        </tr>
                        </thead>
                        <tbody>
                        {schades.map((schade) => (
                            <tr key={schade.id}>
                                <td>{schade.voertuig}</td>
                                <td>{schade.beschrijving}</td>
                                <td>{schade.datum}</td>
                                <td>{schade.status}</td>
                                <td>
                                    <button onClick={() => handleClick(schade.id)}>
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