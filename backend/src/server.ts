import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import app from './index';            
import config from './config/default';
import socketHandler from './socket/socket';

const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.origin,
    methods: ['GET', 'POST'],
  }
});

socketHandler(io);

httpServer.listen(config.port, () => {
  console.log(`Server started in ${config.env} mode on port ${config.port}`);
});
