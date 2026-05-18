/**
 * Utility helper functions for EmpAI application.
 * Centralized validators and formatters used across controllers.
 */

/**
 * Validates that required fields are present in the request body.
 * @param {Object} body - req.body
 * @param {string[]} requiredFields - list of required field names
 * @returns {{ valid: boolean, missing: string[] }}
 */
const validateRequired = (body, requiredFields) => {
  const missing = requiredFields.filter((field) => !body[field] && body[field] !== 0);
  return { valid: missing.length === 0, missing };
};

/**
 * Formats a MongoDB validation error into a readable string.
 * @param {Object} err - Mongoose ValidationError
 * @returns {string}
 */
const formatValidationError = (err) => {
  if (err.name !== 'ValidationError') return err.message;
  return Object.values(err.errors)
    .map((e) => e.message)
    .join(', ');
};

/**
 * Builds a paginated response envelope.
 * @param {Array} data - array of documents
 * @param {number} total - total count
 * @param {number} page - current page
 * @param {number} limit - items per page
 */
const paginatedResponse = (data, total, page, limit) => ({
  success: true,
  total,
  page: Number(page),
  pages: Math.ceil(total / limit),
  count: data.length,
  data,
});

/**
 * Sanitizes skill input — trims and deduplicates.
 * @param {string|string[]} skills
 * @returns {string[]}
 */
const sanitizeSkills = (skills) => {
  if (!skills) return [];
  const arr = Array.isArray(skills) ? skills : skills.split(',');
  return [...new Set(arr.map((s) => s.trim()).filter(Boolean))];
};

module.exports = { validateRequired, formatValidationError, paginatedResponse, sanitizeSkills };
