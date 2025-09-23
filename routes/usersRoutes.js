import express from 'express';
import checkBody from '../middlewares/checkBody.js';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import {
    changePassword, 
} from '../controllers/usersController.js';

const router = express.Router();

// change user password 
router.patch('/change-password', [checkBody, authToken, loadUser], changePassword);

export default router;