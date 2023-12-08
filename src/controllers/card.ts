import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { CustomRequest } from '../utils/utils';
import BadRequestError from '../utils/errors/BadRequestError';
import NotFoundError from '../utils/errors/NotFoundError';
import ForbidenError from '../utils/errors/ForbidenError';
import InternalServerError from '../utils/errors/InternalServerError';

export const getCard = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    link,
  } = req.body;
  const owner = req.user._id;

  return Card.create({
    name,
    link,
    owner,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbidenError('У вас нет прав на удаление этой карточки');
      } else {
        Card.findByIdAndDelete(req.params.cardId)
          .then(() => {
            res.send({ message: 'Карточка успешно удалена!' });
          })
          .catch(() => {
            throw new InternalServerError('На сервере произошла ошибка при удалении карточки');
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка при удалении'));
      } else {
        next(err);
      }
    });
};

export const putLikes = (req: CustomRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((like) => {
      if (!like) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      } else {
        res.send({ data: like });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(err);
      }
    });
};

export const deleteLike = (req: CustomRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((like) => {
      if (!like) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      } else {
        res.send({ data: like });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(err);
      }
    });
};
