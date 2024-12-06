

const API_URL = "https://localhost:7040/api/Voertuigs";
const SCHADE_API_URL = "https://localhost:7040/api/Schades";
const HUURVERZOEK_API_URL = "https://localhost:7040/api/Huurverzoeken";

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
  const response = await fetch(SCHADE_API_URL);
  if (!response.ok) {
    throw new Error("Fout bij het ophalen van schades");
  }
  const data = await response.json();
  console.log("Schades opgehaald:", data);  
  return data;
};
export const voegSchadeToe = async (schadeData) => {
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
  return response.json();
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

