import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import validator from 'validator';
import {
  createCard, deleteCard, deleteLike, getCard, putLikes,
} from '../controllers/card';
import BadRequestError from '../utils/errors/BadRequestError';

const router = Router();

router.get('/', getCard);
router.post('/', celebrate({
  body: Joi.object?.()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      link: Joi.string()
        .required()
        .min(7)
        .custom((v: string) => {
          if (validator.isURL(v)) return v;
          throw new BadRequestError('Введите корректную ссылку');
        }),
    }),
}), createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .hex()
        .length(24)
        .required(),
    }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .hex()
        .length(24)
        .required(),
    }),
}), putLikes);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .hex()
        .length(24)
        .required(),
    }),
}), deleteLike);

export default router;
