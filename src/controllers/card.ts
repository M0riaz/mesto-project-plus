import {Request, Response} from 'express';
import Card from '../models/card'

export const getCard = (req: Request, res: Response) => {
  return Card.find({})
    .then(cards => res.send({data: cards}))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные при создании карточки.'});
      } else {
        res.status(500).send({message: err.message});
      }
    });
}

export const createCard = (req: Request, res: Response) => {
  const {name, link} = req.body;
  const owner = req.user._id;
  return Card.create({name, link, owner})
    .then(card => res.send({data: card}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные при создании карточки.'});
      } else {
        res.status(500).send({message: err.message});
      }
    });
}

export const deleteCard = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({message: 'Карточка успешно удалена!'});
      } else {
        res.status(404).send({message: 'Карточка не найдена'});
      }
    })
    .catch(err => res.status(500).send({message: err.message}));
}

export const putLikes = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(req.params.cardId, {$addToSet: {likes: req.user._id}}, {new: true},)
    .then(like => {
      if (!like) {
        res.status(404).send({message: 'Передан несуществующий _id карточки'})
      } else {
        res.send({data: like})
      }
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные для постановки/снятии лайка'})
      }
      res.status(500).send({message: err.message})
    });
}

export const deleteLike = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(req.params.cardId, {$pull: {likes: req.user._id}}, {new: true},)
    .then(like => {
      if (!like) {
        res.status(404).send({message: 'Передан несуществующий _id карточки'})
      } else {
        res.send({data: like})
      }
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные для постановки/снятии лайка'})
      }
      res.status(500).send({message: err.message})
    });
}
