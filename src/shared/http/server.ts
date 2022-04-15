import 'reflect-metadata';
import 'dotenv/config';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import '@shared/typeorm';
import { errors } from 'celebrate';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { pagination } from 'typeorm-pagination';
import routes from './routes';
import rateLimiter from './middlewares/rateLimiter';

const app = express();

app.use(cors());

app.use(express.json());

app.use(rateLimiter);

app.use(pagination);

app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

app.use(errors());

app.use((error: Error, request: Request, response: Response, nex: NextFunction) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  return response.status(500).json({
    stats: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
