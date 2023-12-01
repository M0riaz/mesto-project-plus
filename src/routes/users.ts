import { Router } from 'express';
import {getUser, createUser, getUserById, patchUser, patchAvatar} from "../controllers/user";

const router = Router()

router.get('/', getUser);
router.get(`/:userId`, getUserById)
router.post('/', createUser)
router.patch('/me', patchUser)
router.patch('/me/avatar', patchAvatar)

export default router