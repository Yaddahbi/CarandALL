
const API_URL = "https://localhost:7040/api/Voertuigs";

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

