import express from 'express';

import { authenticateToken } from '../middleware';

import { 
    loginPage, 
    indexPage, 
    messagesPage, 
    addMessage } from '../controllers';

const indexRouter = express.Router();

indexRouter.get('/', indexPage);
indexRouter.post('/login', loginPage);
indexRouter.get('/messages', authenticateToken, messagesPage);
indexRouter.post('/messages', authenticateToken, addMessage);

export default indexRouter;
