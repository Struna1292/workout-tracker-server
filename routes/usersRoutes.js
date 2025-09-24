import express from 'express';
import checkBody from '../middlewares/checkBody.js';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import {
    changePassword,
    removeEmail,
} from '../controllers/usersController.js';

const router = express.Router();

// change user password 
router.patch('/me/password', [checkBody, authToken, loadUser], changePassword);

// remove user e-mail
router.delete('/me/email', [authToken, loadUser], removeEmail);

export default router;