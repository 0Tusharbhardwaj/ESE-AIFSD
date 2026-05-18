const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * Auth Routes
 * Base path: /api/auth
 */

// @route  POST /api/auth/register
// @desc   Register new user account
router.post('/register', register);

// @route  POST /api/auth/login
// @desc   Authenticate user, return JWT
router.post('/login', login);

// @route  GET /api/auth/me
// @desc   Get current authenticated user profile
// @access Private
router.get('/me', protect, getMe);

module.exports = router;
