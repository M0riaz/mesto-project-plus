import { Request, Response } from 'express';
import User from '../models/user'

export const getUser = (req: Request, res: Response) => {
  return User.find({})
    .then(users => {
      if (users.length === 0) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.send({ data: users });
      }
    })
    .catch(err => res.status(500).send({ message: err.message }));
}

export const getUserById = (req: Request, res: Response) => {
  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch(err => res.status(500).send({ message: err.message }));
}

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then(u => res.send({ data: u }))
    .catch(err => {
      if (err.status === 400) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя'});
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

export const patchUser = (req: Request, res: Response) => {
  User.findByIdAndUpdate(req.user._id, {name: req.body.name, about: req.body.about},  {new: true})
    .then(user => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден'});
      } else {
        res.send({ data: user });
      }
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля'});
      } else {
        res.status(500).send({ message: err.message });
      }
    });
}

export const patchAvatar = (req: Request, res: Response) => {
  User.findByIdAndUpdate(req.user._id, {avatar: req.body.avatar}, {new:true})
    .then(ava => {
      if (!ava) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден'});
      } else {
        res.send({data: ava})
      }
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара'});
      } else {
        res.status(500).send({message: err.message})
      }
    });
}



