/**
 * Input validation service using manual rules (no external deps needed).
 * Used by controllers to validate request bodies before DB operations.
 */

const VALID_DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design', 'Operations', 'Legal'];
const VALID_STATUSES = ['Active', 'On Leave', 'Terminated', 'Remote'];
const VALID_ROLES = ['Admin', 'HR', 'Manager'];

/**
 * Validates employee creation/update payload.
 * @param {Object} body
 * @param {boolean} isUpdate - if true, all fields optional
 * @returns {{ valid: boolean, errors: string[] }}
 */
const validateEmployee = (body, isUpdate = false) => {
  const errors = [];

  if (!isUpdate) {
    if (!body.name || body.name.trim().length < 2) errors.push('Name must be at least 2 characters');
    if (!body.email) errors.push('Email is required');
    if (!body.department) errors.push('Department is required');
    if (body.performanceScore === undefined) errors.push('Performance score is required');
    if (body.experience === undefined) errors.push('Years of experience is required');
  }

  // Conditional validations
  if (body.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(body.email)) {
    errors.push('Invalid email format');
  }
  if (body.department && !VALID_DEPARTMENTS.includes(body.department)) {
    errors.push(`Department must be one of: ${VALID_DEPARTMENTS.join(', ')}`);
  }
  if (body.performanceScore !== undefined) {
    const score = Number(body.performanceScore);
    if (isNaN(score) || score < 0 || score > 100) errors.push('Performance score must be between 0 and 100');
  }
  if (body.experience !== undefined) {
    const exp = Number(body.experience);
    if (isNaN(exp) || exp < 0 || exp > 50) errors.push('Experience must be between 0 and 50 years');
  }
  if (body.skills !== undefined) {
    const skills = Array.isArray(body.skills) ? body.skills : [];
    if (skills.length === 0) errors.push('At least one skill is required');
    if (skills.length > 20) errors.push('Maximum 20 skills allowed');
  }
  if (body.status && !VALID_STATUSES.includes(body.status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Validates user registration payload.
 * @param {Object} body
 * @returns {{ valid: boolean, errors: string[] }}
 */
const validateUser = (body) => {
  const errors = [];
  if (!body.name || body.name.trim().length < 2) errors.push('Name must be at least 2 characters');
  if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email)) errors.push('Valid email is required');
  if (!body.password || body.password.length < 6) errors.push('Password must be at least 6 characters');
  if (body.role && !VALID_ROLES.includes(body.role)) errors.push(`Role must be one of: ${VALID_ROLES.join(', ')}`);
  return { valid: errors.length === 0, errors };
};

module.exports = { validateEmployee, validateUser, VALID_DEPARTMENTS, VALID_STATUSES };
