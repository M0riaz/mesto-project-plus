import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { CustomRequest } from '../utils/utils';
import { SessionRequest } from '../middlewares/auth';
import NotFoundError from '../utils/errors/NotFoundError';
import BadRequestError from '../utils/errors/BadRequestError';
import ConflictError from '../utils/errors/ConflictError';

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  User.findById(userId)

    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const {
    email,
    password,
  } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'super-strong-secret',
        { expiresIn: '7d' },
      );
      return res.send({
        token,
      });
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Эта электронная почта уже зарегистрированная'));
      } else {
        next(err);
      }
    });
};

export const patchUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

export const patchAvatar = (req: CustomRequest, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((ava) => {
      if (!ava) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      } else {
        res.send({ data: ava });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

export const getUserInfo = (req: SessionRequest, res: Response, next: NextFunction) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch(next);
};
