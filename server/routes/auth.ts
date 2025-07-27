
import express from 'express';
import { sendOtp, verifyOtp, login, getUser } from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// Send OTP to email
router.post('/send-otp', sendOtp);
// Verify OTP and signup
router.post('/verify-otp', verifyOtp);
// Login with email/password
router.post('/login', login);
// Get user info (protected)
router.get('/me', authenticateJWT, getUser);

export default router;
