import express from 'express';
import { sendMessage, getMessages, markAsRead, markAsSeen, getConversations, deleteMessage, updateMessage } from '../controllers/messageController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/send', authenticateToken, sendMessage);
router.get('/get', authenticateToken, getMessages);
router.put('/update', authenticateToken, updateMessage);
router.post('/mark-read', authenticateToken, markAsRead);
router.post('/mark-seen', authenticateToken, markAsSeen);
router.get('/conversations', authenticateToken, getConversations);
router.delete('/delete', authenticateToken, deleteMessage);

export default router;
