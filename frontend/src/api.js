
const API_BASE_URL = "https://localhost:7040/api/Voertuigs";

export const fetchFilteredVoertuigen = async (filters) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_BASE_URL}/filter?${queryParams}`);
  if (!response.ok) {
    throw new Error("Failed to fetch voertuigen");
  }
  return response.json();
};
