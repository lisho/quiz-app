import { Router } from 'express';
import { getQuestions } from '../controllers/questionsController.js';

const router = Router();

router.get('/', getQuestions);

export default router;