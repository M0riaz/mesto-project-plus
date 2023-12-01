import { Router } from 'express';
import {getCard, createCard, deleteCard, putLikes, deleteLike} from "../controllers/card";

const router = Router();

router.get('/', getCard);
router.post('/', createCard);
router.delete('/:cardId', deleteCard)
router.put('/:cardId/likes', putLikes)
router.delete('/:cardId/likes', deleteLike)

export default router