import { Router } from 'express';
// Importamos los controladores necesarios
import { getQuestions, getFilterOptions, getAvailableCount } from '../controllers/questionsController.js';

const router = Router();

// Ruta existente para obtener preguntas (controlador modificado)
router.get('/', getQuestions);

// Ruta existente para obtener filtros (controlador modificado)
router.get('/filters', getFilterOptions);

// --- NUEVA RUTA ---
// Para obtener el número de preguntas disponibles según filtros
router.get('/count', getAvailableCount);

export default router;