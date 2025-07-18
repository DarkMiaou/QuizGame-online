import { Request, Response, NextFunction } from 'express';
import * as quizService from '../services/quizService';
import { Question } from '../models/quiz';

// GET /api/quiz/questions
export function getAllQuestions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const questions = quizService.getAllQuestions();
    res.json(questions);
  } catch (err) {
    next(err);
  }
}

// GET /api/quiz/questions/:id
export function getSinglequestions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id, 10);
    const question = quizService.getSinglequestions(id);
    if (!question) {
      const error = new Error('Question not found') as any;
      error.status = 404;
      throw error;
    }
    res.json(question);
  } catch (err) {
    next(err);
  }
}

// POST /api/quiz/questions
export function createQuestion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const q = req.body as Question;
    const created = quizService.addQuestion(q);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

// PUT /api/quiz/questions/:id
export function updateQuestion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id, 10);
    const q = req.body as Question;
    const updated = quizService.updateQuestion(id, q);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/quiz/questions/:id
export function removeQuestion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id, 10);
    quizService.deleteQuestion(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
