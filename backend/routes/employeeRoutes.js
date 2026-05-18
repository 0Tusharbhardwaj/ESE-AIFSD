const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  getAnalytics,
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

/**
 * Employee Routes
 * Base path: /api/employees
 * All routes are protected — require valid JWT
 */

// IMPORTANT: Define /search and /analytics BEFORE /:id to avoid route conflicts
// @route  GET /api/employees/search?department=Engineering&q=react
router.get('/search', protect, searchEmployees);

// @route  GET /api/employees/analytics
router.get('/analytics', protect, getAnalytics);

// @route  POST /api/employees
// @route  GET /api/employees
router
  .route('/')
  .post(protect, createEmployee)
  .get(protect, getAllEmployees);

// @route  GET /api/employees/:id
// @route  PUT /api/employees/:id
// @route  DELETE /api/employees/:id (Admin only)
router
  .route('/:id')
  .get(protect, getEmployeeById)
  .put(protect, updateEmployee)
  .delete(protect, authorize('Admin', 'HR'), deleteEmployee);

module.exports = router;
