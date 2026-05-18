const express = require('express');
const router = express.Router();
const { getRecommendation, rankEmployees } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

/**
 * AI Routes
 * Base path: /api/ai
 * All routes require authentication
 */

// @route  POST /api/ai/recommend
// @desc   Generate AI recommendation for an employee
// Body: { employeeId: "..." } OR { employeeData: { name, department, performanceScore, experience, skills } }
router.post('/recommend', protect, getRecommendation);

// @route  POST /api/ai/rank
// @desc   AI-powered ranking of multiple employees
// Body: { employeeIds: [...] } — omit for all employees
router.post('/rank', protect, rankEmployees);

module.exports = router;
