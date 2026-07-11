import express from 'express';
import { registerUser, loginUser, logoutUser, getProfile, updateProfile, searchUsers, getOnlineUsers } from '../controllers/authController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authenticateToken, logoutUser);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/search', authenticateToken, searchUsers);
router.get('/online-users', authenticateToken, getOnlineUsers);

export default router;
