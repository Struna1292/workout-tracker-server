import express from 'express';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import { login, register, refreshToken, logoutToken, getEmailVerificationCode } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refreshToken);
router.post('/logout', logoutToken);

// get e-mail with verification code
router.get('/verify-email', [authToken, loadUser], getEmailVerificationCode);

export default router;