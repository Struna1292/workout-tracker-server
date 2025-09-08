import express from 'express';
import { login, register, refreshToken, logoutToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refreshToken);
router.post('/logout', logoutToken);

export default router;