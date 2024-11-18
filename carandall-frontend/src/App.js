import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API-aanroep om gegevens op te halen van je ASP.NET Web API
  useEffect(() => {
    // Pas de URL aan naar de endpoint van jouw API
    const apiUrl = "hhttps://localhost:7040/swagger/index.html"; // Vervang 'endpoint' door je eigen API route

    async function fetchData() {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Er is een fout opgetreden bij het ophalen van de data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gegevens van de API</h1>

        {loading && <p>Data laden...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {data ? (
          <pre style={{ textAlign: 'left', backgroundColor: '#eee', padding: '10px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          !loading && <p>Geen data beschikbaar</p>
        )}
      </header>
    </div>
  );
}

export default App;

