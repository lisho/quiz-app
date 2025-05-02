const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Constante para "Todos"
const ALL_FILTER_VALUE = '__ALL__';

// --- fetchQuestions MODIFICADO ---
// Ahora acepta config { bloque: string, tema: string, limit: number }
export const fetchQuestions = async (config = {}) => {
    try {
        const params = new URLSearchParams();
        // Solo añadimos el parámetro si no es "ALL"
        if (config.bloque && config.bloque !== ALL_FILTER_VALUE) {
            params.append('bloque', config.bloque);
        }
        if (config.tema && config.tema !== ALL_FILTER_VALUE) {
            params.append('tema', config.tema);
        }
        if (config.limit && config.limit > 0) {
            params.append('limit', config.limit);
        }

        const queryString = params.toString();
        const fetchUrl = `${API_URL}/questions${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(fetchUrl);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
};

// --- fetchFilterOptions SIN CAMBIOS EN LLAMADA, PERO ESPERA NUEVA ESTRUCTURA ---
export const fetchFilterOptions = async () => {
    try {
        const response = await fetch(`${API_URL}/questions/filters`);
        if (!response.ok) {
           const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || response.statusText}`);
        }
        // Espera recibir { bloques: string[], temasPorBloque: { [bloque: string]: string[] } }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching filter options:", error);
        throw error;
    }
};

// --- NUEVA FUNCIÓN ---
// Para obtener el conteo disponible
export const fetchAvailableCount = async (bloque = ALL_FILTER_VALUE, tema = ALL_FILTER_VALUE) => {
     try {
        const params = new URLSearchParams();
        if (bloque && bloque !== ALL_FILTER_VALUE) {
            params.append('bloque', bloque);
        }
        if (tema && tema !== ALL_FILTER_VALUE) {
            params.append('tema', tema);
        }
        const queryString = params.toString();
        const fetchUrl = `${API_URL}/questions/count${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(fetchUrl);
         if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || response.statusText}`);
        }
        const data = await response.json(); // Espera { count: number }
        return data.count || 0;

    } catch (error) {
        console.error("Error fetching available count:", error);
        throw error; // Propagar para manejar en UI
    }
};