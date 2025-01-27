const API_URL = "https://localhost:7040/api/Voertuigs";
const SCHADE_API_URL = "https://localhost:7040/api/Schade";
const HUURVERZOEK_API_URL = "https://localhost:7040/api/Huurverzoeken";
const UITGIFTE_INNAME_API_URL = "https://localhost:7040/api/UitgifteInnameBeheren";
const API_BASE_URL = "https://localhost:7040/api/Gebruikers";
const BASE_URL = "https://localhost:7040/api";

/** GEBRUIKERS FUNCTIONS **/
export const voegGebruikerToe = async (gebruikerData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(gebruikerData),
        });

        if (!response.ok) {
            throw new Error("Fout bij het toevoegen van een gebruiker");
        }
        return await response.json();
    } catch (error) {
        console.error("Fout bij het versturen van gebruiker:", error);
        throw error;
    }
};

export const fetchGebruikers = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_BASE_URL}?${queryParams}`);

        if (!response.ok) {
            throw new Error("Fout bij het ophalen van gebruikers");
        }
        return await response.json();
    } catch (error) {
        console.error("Fout bij het ophalen van gebruikers:", error);
        throw error;
    }
};

/** VOERTUIGEN FUNCTIONS **/
export const fetchFilteredVoertuigen = async (filters) => {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/filter?${queryParams}`);

        if (!response.ok) {
            throw new Error("Failed to fetch voertuigen");
        }
        return await response.json();
    } catch (error) {
        console.error("Fout bij het ophalen van voertuigen:", error);
        throw error;
    }
};

/** SCHADE FUNCTIONS **/
export const fetchSchades = async () => {
    try {
        const response = await fetch(SCHADE_API_URL);
        if (!response.ok) {
            throw new Error("Netwerkfout: De server gaf een foutstatus terug.");
        }
        return await response.json();
    } catch (error) {
        console.error("Fout bij het ophalen van schades:", error);
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

export const voegSchadetoe = async (schadeData) => {
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
    /* export const uploadSchadeFoto = async (file) => {
        if (!file) {
            throw new Error("Geen bestand geselecteerd");
        }
    }
    const formData = new FormData();
    formData.append("file", file); 

    const response = await fetch("/api/schade/upload", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Fout bij het uploaden van foto");
    }

    const data = await response.json();
    return data.url;
};*/

    /** HUURVERZOEK FUNCTIONS **/
    export const createHuurverzoek = async (huurverzoek) => {
        const token = sessionStorage.getItem('jwtToken');
        if (!token) {
            throw new Error("Token niet gevonden. Zorg ervoor dat je ingelogd bent.");
        }
        try {
            const response = await fetch(HUURVERZOEK_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(huurverzoek),
            });

            if (!response.ok) {

                throw new Error("Fout bij het maken van huurverzoek");
            }
            return awaitresponse.json();
        } catch (error) {
            console.error("Fout bij het maken van huurverzoek:", error);
            throw error;
        }
    };
    export const fetchHuurgeschiedenis = async (filters) => {
        try {
            const token = sessionStorage.getItem('jwtToken');
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

    export const fetchHuurgeschiedenisBedrijf = async (filters) => {
        try {
            const token = sessionStorage.getItem('jwtToken');
            if (!token) {
                throw new Error("Token niet gevonden. Zorg ervoor dat je ingelogd bent.");
            }

            const params = new URLSearchParams();


            if (filters.startDatum) params.append('startDatum', filters.startDatum);
            if (filters.eindDatum) params.append('eindDatum', filters.eindDatum);


            if (filters.voertuigType && filters.voertuigType !== '') {
                params.append('voertuigType', filters.voertuigType);
            }

            const response = await fetch(`${BASE_URL}/Huurverzoeken/bedrijf/huurgeschiedenis?${params.toString()}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
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
    export const fetchMedewerkers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/Abonnement/medewerkers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`, // Zet de juiste token als header
                },
            });

            if (!response.ok) {
                throw new Error('Er is een probleem met het ophalen van de medewerkers.');
            }

            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    /** INNAME & UITGIFTE FUNCTIONS **/
    export const createInname = async (innameData) => {
        try {
            const response = await fetch(UITGIFTE_INNAME_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(innameData),
            });

            if (!response.ok) {
                throw new Error("Fout bij het registreren van de inname");
            }
            return await response.json();
        } catch (error) {
            console.error("Fout bij het registreren van inname:", error);
            throw error;
        }
    };

    export const createUitgifte = async (uitgifteData) => {
        try {
            const response = await fetch(UITGIFTE_INNAME_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(uitgifteData),
            });

            if (!response.ok) {
                throw new Error("Fout bij het registreren van de uitgifte");
            }
            return await response.json();
        } catch (error) {
            console.error("Fout bij het registreren van uitgifte:", error);
            throw error;
        }
    };