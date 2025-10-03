import express from 'express';
import checkBody from '../middlewares/checkBody.js';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import {
    changePassword,
    removeEmail,
    addEmail,
    changeUsername,
} from '../controllers/usersController.js';

const router = express.Router();

// change user password 
router.patch('/me/password', [checkBody, authToken, loadUser], changePassword);

// remove user e-mail
router.delete('/me/email', [authToken, loadUser], removeEmail);

// adding email
router.patch('/me/email', [checkBody, authToken, loadUser], addEmail);

// change username
router.patch('/me/username', [checkBody, authToken, loadUser], changeUsername);

export default router;