import express from 'express';
import checkBody from '../middlewares/checkBody.js';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';
import { 
    login, 
    register, 
    refreshToken, 
    logoutToken,
    loginWithGoogle, 
    getEmailVerificationCode, 
    verifyEmail,
    getForgotPasswordCode,
    verifyResetCode,
    resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginLimiter, login);
router.post('/register', register);
router.post('/refresh', refreshToken);
router.post('/logout', logoutToken);

// login with google id token
router.post('/google', checkBody, loginWithGoogle);

// get e-mail with verification code
router.get('/verify-email', [authToken, loadUser], getEmailVerificationCode);

// verify email with code
router.post('/verify-email', [checkBody, authToken, loadUser], verifyEmail);

// get e-mail with code to reset password
router.post('/forgot-password', checkBody, getForgotPasswordCode);

// verify reset password code and get token with permission to reset password
router.post('/verify-reset-code', checkBody, verifyResetCode);

// reset password
router.post('/reset-password', checkBody, resetPassword);

export default router;