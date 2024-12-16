const API_URL = "https://localhost:7040/api/Voertuigs";
const SCHADE_API_URL = "https://localhost:7040/api/Schade";
const HUURVERZOEK_API_URL = "https://localhost:7040/api/Huurverzoeken";

export const voegGebruikerToe = async (gebruikerData) => {
  try {
    const response = await fetch(API_BASE_URL, {
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
  try {
    const response = await fetch(SCHADE_API_URL);
    if (!response.ok) {
      throw new Error('Netwerkfout: De server gaf een foutstatus terug.');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fout bij het ophalen van schades: ", error);
    throw error;
  }
};
export const fetchSchadeById = async (id) => {
  try {
    const response = await fetch(`${SCHADE_API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Fout bij het ophalen van schade");
    }
    return await response.json();
  } catch (error) {
    console.error("Fout bij het ophalen van schade:", error);
    throw error;
  }
};
export const voegSchadetoe= async (schadeData) => {
  try {
    const response = await fetch(SCHADE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schadeData),
    });
    if (!response.ok) {
      throw new Error("Fout bij het toevoegen van schade");
    }
    return await response.json();
  } catch (error) {
    console.error("Fout bij het versturen van schade:", error);
    throw error;
  }
};
export const updateSchade = async (id, schadeData) => {
  try {
    const response = await fetch(`${SCHADE_API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schadeData),
    });
    if (!response.ok) {
      throw new Error("Fout bij het bijwerken van schade");
    }
    return await response.json();
  } catch (error) {
    console.error("Fout bij het bijwerken van schade:", error);
    throw error;
  }
};
export const deleteSchade = async (id) => {
  try {
    const response = await fetch(`${SCHADE_API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Fout bij het verwijderen van schade");
    }
    return await response.json();
  } catch (error) {
    console.error("Fout bij het verwijderen van schade:", error);
    throw error;
  }
};

export const createHuurverzoek = async (huurverzoek) => {
  const response = await fetch(HUURVERZOEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(huurverzoek),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
};

