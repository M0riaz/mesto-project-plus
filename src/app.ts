import * as mongoose from 'mongoose';
import express from 'express';
import { errors } from 'celebrate';
import cardRouter from './routes/cards';
import userRouter from './routes/users';
import { createUser, login } from './controllers/user';
import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
// mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(requestLogger);
app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка =(' : err.message;

  res.status(statusCode)
    .send({ message });
});
app.listen(PORT, () => {
  //
});
