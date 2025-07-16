import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import config from './config/default';
import quizRoutes from './routes/quizRoutes';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(helmet());                       
app.use(cors({ origin: config.origin })); 
app.use(express.json());                
app.use(express.urlencoded({ extended: true }));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

app.use('api/quiz', quizRoutes);
app.use(errorHandler);

export default app;