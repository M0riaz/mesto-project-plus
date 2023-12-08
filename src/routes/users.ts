import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import validator from 'validator';
import {
  getUser, getUserById, getUserInfo, patchAvatar, patchUser,
} from '../controllers/user';
import BadRequestError from '../utils/errors/BadRequestError';

const router = Router();

router.get('/', getUser);
router.get('/me', getUserInfo);
router.get('/:userId', celebrate({
  params: Joi.object()
    .keys({
      userId: Joi.string()
        .hex()
        .length(24)
        .required(),
    }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
    }),
}), patchUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string()
        .required()
        .custom((v: string) => {
          if (validator.isURL(v)) return v;
          throw new BadRequestError('Введите корректную ссылку =)');
        }),
    }),
}), patchAvatar);

export default router;
