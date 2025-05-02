// Importamos las funciones modificadas y la nueva
import { getQuestionsFromDB, getFilterOptionsFromDB, countQuestionsFromDB } from '../db/queries.js';

// --- getQuestions MODIFICADO ---
// Ahora espera parámetros individuales (o ninguno si es "ALL")
export const getQuestions = async (req, res) => {
    try {
        const { bloque, tema, limit } = req.query; // Ya no esperamos arrays

        const filters = {};
        if (bloque && bloque !== '__ALL__') filters.bloque = bloque; // Usar '__ALL__' o similar para indicar "todos"
        if (tema && tema !== '__ALL__') filters.tema = tema;

        const numLimit = limit ? parseInt(limit, 10) : null;

        // Llamar a la función de base de datos con filtros y límite
        const questions = await getQuestionsFromDB(filters, numLimit);
        res.json(questions);

    } catch (error) {
        console.error('Error fetching questions:', error.message, error.stack); // Log stack trace
        res.status(500).json({ error: 'Internal Server Error getting questions' });
    }
};

// --- getFilterOptions MODIFICADO ---
// Ahora devuelve la estructura anidada
export const getFilterOptions = async (req, res) => {
    try {
        const options = await getFilterOptionsFromDB(); // { bloques: [...], temasPorBloque: {...} }
        res.json(options);
    } catch (error) {
        console.error('Error fetching filter options:', error.message);
        res.status(500).json({ error: 'Internal Server Error getting filter options' });
    }
};

// --- NUEVA FUNCIÓN CONTROLADORA ---
export const getAvailableCount = async (req, res) => {
     try {
        const { bloque, tema } = req.query;
        const filters = {};
        if (bloque && bloque !== '__ALL__') filters.bloque = bloque;
        if (tema && tema !== '__ALL__') filters.tema = tema;

        const count = await countQuestionsFromDB(filters);
        res.json({ count: count });

    } catch (error) {
        console.error('Error fetching available count:', error.message);
        res.status(500).json({ error: 'Internal Server Error getting available count' });
    }
};