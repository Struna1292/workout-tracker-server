import express from 'express';
import checkBody from '../middlewares/checkBody.js';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import { 
    login, 
    register, 
    refreshToken, 
    logoutToken, 
    getEmailVerificationCode, 
    verifyEmail,
    getForgotPasswordCode 
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refreshToken);
router.post('/logout', logoutToken);

// get e-mail with verification code
router.get('/verify-email', [authToken, loadUser], getEmailVerificationCode);

// verify email with code
router.post('/verify-email', [checkBody, authToken, loadUser], verifyEmail);

// get e-mail with code to reset password
router.post('/forgot-password', [checkBody], getForgotPasswordCode);



export default router;