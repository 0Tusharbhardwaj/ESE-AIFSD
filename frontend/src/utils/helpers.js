/**
 * Frontend utility functions for EmpAI.
 * Formatting helpers used across components.
 */

/**
 * Get Tailwind color class based on performance score.
 * @param {number} score
 * @returns {{ text: string, bg: string, badge: string }}
 */
export const getScoreColors = (score) => {
  if (score >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-400', badge: 'badge-green' };
  if (score >= 60) return { text: 'text-amber-400', bg: 'bg-amber-400', badge: 'badge-amber' };
  return { text: 'text-red-400', bg: 'bg-red-400', badge: 'badge-red' };
};

/**
 * Get performance tier label.
 * @param {number} score
 * @returns {string}
 */
export const getPerformanceTier = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  return 'Needs Improvement';
};

/**
 * Generate consistent initials color based on name.
 * @param {string} name
 * @returns {string} Tailwind bg class
 */
export const getAvatarColor = (name) => {
  const palette = ['bg-brand-500', 'bg-violet-500', 'bg-emerald-600', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-600', 'bg-pink-500', 'bg-teal-500'];
  return palette[(name?.charCodeAt(0) || 0) % palette.length];
};

/**
 * Format date to relative time (e.g., "2 days ago").
 * @param {string|Date} date
 * @returns {string}
 */
export const timeAgo = (date) => {
  if (!date) return 'Never';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

/**
 * Truncate long text with ellipsis.
 * @param {string} text
 * @param {number} maxLength
 */
export const truncate = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Get rank medal emoji for top 3.
 * @param {number} index - 0-indexed rank
 */
export const getRankMedal = (index) => {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return `#${index + 1}`;
};

/**
 * Get Recharts-friendly color palette.
 */
export const CHART_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
