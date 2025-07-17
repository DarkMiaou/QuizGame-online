import { Server, Socket } from 'socket.io';

interface Question {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
}

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

export default function socketHandler(io: Server): void {
  const scoresByRoom = new Map<string, Map<string, number>>();
  const questionIndexByRoom = new Map<string, number>();
  const timersByRoom = new Map<string, NodeJS.Timeout>();

  const sendNextQuestion = (roomId: string) => {
    const index = questionIndexByRoom.get(roomId) ?? 0;

    if (index >= questions.length) {
      const scores = scoresByRoom.get(roomId)!;
      const finalScores: Record<string, number> = {};
      scores.forEach((score, playerId) => (finalScores[playerId] = score));
      io.to(roomId).emit('quizFinished', { finalScores });
      cleanupRoom(roomId);
      return;
    } else {
      const question = questions[index];
      io.to(roomId).emit('nextQuestion', { question });
      questionIndexByRoom.set(roomId, index + 1);
    }
  };

  const startQuizForRoom = (roomId: string) => {
    sendNextQuestion(roomId);
    const timer = setInterval(() => sendNextQuestion(roomId), 30_000);
    timersByRoom.set(roomId, timer);
  };

  const cleanupRoom = (roomId: string) => {
    const timer = timersByRoom.get(roomId);
    if (timer) {
      clearInterval(timer);
      timersByRoom.delete(roomId);
    }
    scoresByRoom.delete(roomId);
    questionIndexByRoom.delete(roomId);
  };

  const handleLeaveRoom = (socket: Socket, roomId: string) => {
    socket.leave(roomId);

    const scores = scoresByRoom.get(roomId);
    if (!scores) return;

    scores.delete(socket.id);

    io.to(roomId).emit('playerLeft', { playerId: socket.id });

    if (scores.size === 0) {
      cleanupRoom(roomId);
    }
  };

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // TODO: joinRoom, answer

    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);

      if (!scoresByRoom.has(roomId)) {
        scoresByRoom.set(roomId, new Map());
        questionIndexByRoom.set(roomId, 0);
      }

      const scores = scoresByRoom.get(roomId)!;
      scores.set(socket.id, 0);

      socket.emit('joined', { roomId, playerId: socket.id });

      socket.to(roomId).emit('playerJoined', { playerId: socket.id });

      if (scores.size === 1) {
        startQuizForRoom(roomId);
      }
    });

    socket.on('leaveRomm', (roomId: string) => {
      handleLeaveRoom(socket, roomId);
    });

    socket.on(
      'answer',
      (data: { roomId: string; questionId: number; selectedIndex: number }) => {
        const { roomId, questionId, selectedIndex } = data;
        const scores = scoresByRoom.get(roomId);
        if (!scores) {
          return;
        }

        const question = questions.find((q) => q.id === questionId);
        if (!question) {
          return;
        }

        const correct = selectedIndex === question.answerIndex;
        if (correct) {
          const prev = scores.get(socket.id) ?? 0;
          scores.set(socket.id, prev + 1);
        }

        socket.emit('answerResult', { questionId, correct });

        const scoreObj: Record<string, number> = {};
        scores.forEach((score, playerId) => {
          scoreObj[playerId] = score;
        });
        io.to(roomId).emit('scoreUpdate', { scores: scoreObj });
      },
    );

    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id} (reason: ${reason})`);
      socket.rooms.forEach((roomId) => {
        if (roomId !== socket.id) {
          handleLeaveRoom(socket, roomId);
        }
      });
    });
  });
}
