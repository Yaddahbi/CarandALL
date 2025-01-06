const API_URL = "https://localhost:7040/api/Voertuigs";
const SCHADE_API_URL = "https://localhost:7040/api/Schade";
const HUURVERZOEK_API_URL = "https://localhost:7040/api/Huurverzoeken";
const BASE_URL = "https://localhost:7040/api";

export const voegGebruikerToe = async (gebruikerData) => {
  try {
    const response = await fetch(USER_REGISTER_URL, {
      method: "POST", // We gebruiken de POST-methode om nieuwe gegevens toe te voegen
      headers: {
        "Content-Type": "application/json", // Zorg ervoor dat de content als JSON wordt verzonden
      },
      body: JSON.stringify(gebruikerData), // Gegevens worden verstuurd als JSON
    });

    if (!response.ok) {
      throw new Error("Fout bij het toevoegen van een gebruiker");
    }
    return await response.json(); // Retourneer de response in JSON-formaat
  } catch (error) {
    console.error("Fout bij het versturen van gebruiker:", error);
    throw error; // Gooi de fout opnieuw om de frontend te laten weten dat er iets mis ging
  }
};

// Functie om gebruikers op te halen (optioneel gefilterd op rol)
export const fetchGebruikers = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString(); // Zet filters om in query parameters
    const response = await fetch(`${API_BASE_URL}?${queryParams}`); // Stuur GET-verzoek naar de API

    if (!response.ok) {
      throw new Error("Fout bij het ophalen van gebruikers");
    }
    return await response.json(); // Retourneer de response in JSON-formaat
  } catch (error) {
    console.error("Fout bij het ophalen van gebruikers:", error);
    throw error; // Gooi de fout opnieuw om de frontend te laten weten dat er iets mis ging
  }
};

export const fetchFilteredVoertuigen = async (filters) => {
  const queryParams = new URLSearchParams({
      soort: filters.soort,
      startDatum: filters.startDatum,
      eindDatum: filters.eindDatum,
      sorteerOp: filters.sorteerOp,
  }).toString();
  const response = await fetch(`${API_URL}/filter?${queryParams}`);
  if (!response.ok) {
      throw new Error("Failed to fetch voertuigen");
  }
  return response.json();
};

export const fetchSchades = async () => {
    return await fetchApi(SCHADE_API_URL);
};

export const fetchSchadeById = async (id) => {
    return await fetchApi(`${SCHADE_API_URL}/${id}`);
};

export const voegSchadetoe = async (schadeData) => {
    return await fetchApi(SCHADE_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(schadeData),
    });
};
export const updateSchade = async (id, schadeData) => {
    return await fetchApi(`${SCHADE_API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(schadeData),
    });
};

export const deleteSchade = async (id) => {
    return await fetchApi(`${SCHADE_API_URL}/${id}`, {
        method: "DELETE",
    });
};

export const createHuurverzoek = async (huurverzoek) => {
    const token = localStorage.getItem('jwtToken'); // Haal het JWT-token op uit localStorage
    if (!token) {
        throw new Error("Token niet gevonden. Zorg ervoor dat je ingelogd bent.");
    }
    const response = await fetch(HUURVERZOEK_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Voeg het token toe in de header
        },
        body: JSON.stringify(huurverzoek),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    return response.json();
};


export const fetchHuurgeschiedenis = async (filters) => {
    try {
        const token = localStorage.getItem('jwtToken'); // Haal het JWT-token op uit localStorage
        if (!token) {
            throw new Error("Token niet gevonden. Zorg ervoor dat je ingelogd bent.");
        }

        const params = new URLSearchParams();

        // Voeg alleen filters toe als ze een waarde hebben
        if (filters.startDatum) params.append('startDatum', filters.startDatum);
        if (filters.eindDatum) params.append('eindDatum', filters.eindDatum);

        // Voeg voertuigType alleen toe als het niet leeg is
        if (filters.voertuigType && filters.voertuigType !== '') {
            params.append('voertuigType', filters.voertuigType);
        }

        const response = await fetch(`${BASE_URL}/Huurverzoeken/geschiedenis?${params.toString()}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`, // Voeg het JWT-token toe in de header
            },
        });

        if (!response.ok) {
            throw new Error(`Fout bij ophalen huurgeschiedenis: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};


