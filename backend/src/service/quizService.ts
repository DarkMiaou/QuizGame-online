import { Question } from '../models/quiz';

const questions: Question[] = [
  {
    id: 1,
    question: 'Capital of France?',
    options: ['Paris', 'Lyon', 'Marseille', 'Nice'],
    answerIndex: 0,
  },
  {
    id: 2,
    question: '2 + 2 = ?',
    options: ['3', '4', '5', '22'],
    answerIndex: 1,
  },
];
//Example

export function getAllquestions(): Question[] {
  return questions;
}

export function getSinglequestions(id: number): Question | undefined {
  return questions.find((q) => q.id === id);
}

export function addQuestion(q: Question): Question {
  if (questions.some((x) => x.id === q.id)) {
    const err = new Error(`Question with id=${q.id} already exists`) as any;
    err.status = 409;
    throw err;
  }
  questions.push(q);
  return q;
}

export function updateQuestion(id: number, newQ: Partial<Question>): Question {
  const idx = questions.findIndex((x) => x.id === id);
  if (idx === -1) {
    const err = new Error(`Question id=${id} not found`) as any;
    err.status = 404;
    throw err;
  }
  const updated = { ...questions[idx], ...newQ, id };
  questions[idx] = updated;
  return updated;
}

export function deleteQuestion(id: number): void {
  const idx = questions.findIndex((x) => x.id === id);
  if (idx === -1) {
    const err = new Error(`Question id=${id} not found`) as any;
    err.status = 404;
    throw err;
  }
  questions.splice(idx, 1);
}
