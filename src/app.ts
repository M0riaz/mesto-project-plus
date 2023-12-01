import express from 'express';
import * as mongoose from "mongoose";
import userRouter from '../src/routes/users'
import path from "path";
import { Request, Response } from 'express';
import cardRouter from '../src/routes/cards'



const id = '6568889cc3c5e7dbd9a4afe6'
const { PORT = 3000} = process.env;
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res:Response, next) => {
  req.user = {
    _id: '6569be9b1d82305e59086db9'
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');


app.use('/users', userRouter)
app.use('/cards', cardRouter)



app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(` или ;olнdт ${PORT}`)
})