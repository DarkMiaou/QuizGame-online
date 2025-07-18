import { Router } from 'express';
import {
  getAllQuestions,
  getSinglequestions,
  createQuestion,
  updateQuestion,
  removeQuestion,
} from '../controllers/quizController';

const router = Router();

// GET /api/quiz/questions
router.get('/questions', getAllQuestions);

// GET /api/quiz/questions/:id
router.get('/questions/:id', getSinglequestions);

// POST /api/quiz/questions
router.post('/questions', createQuestion);

// PUT /api/quiz/questions/:id
router.put('/questions/:id', updateQuestion);

// DELETE /api/quiz/questions/:id
router.delete('/questions/:id', removeQuestion);

export default router;
