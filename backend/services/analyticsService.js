const Employee = require('../models/Employee');

/**
 * Employee analytics service — computes statistics and rankings.
 * Separated from controller for cleaner architecture and testability.
 */

/**
 * Get performance tier label for a score.
 * @param {number} score
 * @returns {'Excellent'|'Good'|'Needs Improvement'}
 */
const getPerformanceTier = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  return 'Needs Improvement';
};

/**
 * Compute summary analytics across all employees.
 * @returns {Promise<Object>}
 */
const computeAnalytics = async () => {
  const [deptStats, perfDistribution, topPerformers, totalCount, avgResult] = await Promise.all([
    // Average performance and count grouped by department
    Employee.aggregate([
      { $group: { _id: '$department', avgScore: { $avg: '$performanceScore' }, count: { $sum: 1 }, avgExperience: { $avg: '$experience' } } },
      { $sort: { avgScore: -1 } },
    ]),

    // Score distribution in 5 brackets
    Employee.aggregate([
      {
        $bucket: {
          groupBy: '$performanceScore',
          boundaries: [0, 20, 40, 60, 80, 101],
          default: 'Other',
          output: { count: { $sum: 1 } },
        },
      },
    ]),

    // Top 10 performers by score
    Employee.find({}).sort('-performanceScore').limit(10).select('name department performanceScore experience skills status').lean(),

    // Total count
    Employee.countDocuments({}),

    // Company-wide average
    Employee.aggregate([{ $group: { _id: null, avg: { $avg: '$performanceScore' } } }]),
  ]);

  const [promotionEligible, needsTraining] = await Promise.all([
    Employee.countDocuments({ performanceScore: { $gte: 80 }, experience: { $gte: 2 } }),
    Employee.countDocuments({ performanceScore: { $lt: 60 } }),
  ]);

  return {
    total: totalCount,
    averageScore: Number((avgResult[0]?.avg || 0).toFixed(1)),
    promotionEligible,
    needsTraining,
    deptStats,
    perfDistribution,
    topPerformers: topPerformers.map((emp) => ({ ...emp, performanceTier: getPerformanceTier(emp.performanceScore) })),
  };
};

module.exports = { computeAnalytics, getPerformanceTier };
