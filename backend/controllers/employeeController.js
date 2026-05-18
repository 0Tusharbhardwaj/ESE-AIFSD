const Employee = require('../models/Employee');

/**
 * @desc    Create a new employee
 * @route   POST /api/employees
 * @access  Private
 */
const createEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, experience, status, role } = req.body;

    // Check for duplicate email
    const existing = await Employee.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `An employee with email '${email}' already exists.`,
      });
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      skills: Array.isArray(skills) ? skills : skills?.split(',').map((s) => s.trim()),
      performanceScore,
      experience,
      status,
      role,
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully.',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all employees with filtering, sorting, pagination
 * @route   GET /api/employees
 * @access  Private
 */
const getAllEmployees = async (req, res, next) => {
  try {
    const {
      department,
      minScore,
      maxScore,
      status,
      sort = '-createdAt',
      page = 1,
      limit = 10,
      search,
    } = req.query;

    // Build dynamic filter query
    const filter = {};

    if (department) filter.department = department;
    if (status) filter.status = status;

    if (minScore || maxScore) {
      filter.performanceScore = {};
      if (minScore) filter.performanceScore.$gte = Number(minScore);
      if (maxScore) filter.performanceScore.$lte = Number(maxScore);
    }

    // Full-text search across name, email, department
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Employee.countDocuments(filter);

    const employees = await Employee.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single employee by ID
 * @route   GET /api/employees/:id
 * @access  Private
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update employee by ID
 * @route   PUT /api/employees/:id
 * @access  Private
 */
const updateEmployee = async (req, res, next) => {
  try {
    const updates = req.body;

    // Normalize skills if sent as string
    if (updates.skills && !Array.isArray(updates.skills)) {
      updates.skills = updates.skills.split(',').map((s) => s.trim());
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully.',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete employee by ID
 * @route   DELETE /api/employees/:id
 * @access  Private (Admin only)
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully.',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search employees by department or query param
 * @route   GET /api/employees/search
 * @access  Private
 */
const searchEmployees = async (req, res, next) => {
  try {
    const { department, q, minScore, maxScore } = req.query;
    const filter = {};

    if (department) filter.department = { $regex: department, $options: 'i' };
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { skills: { $in: [new RegExp(q, 'i')] } },
      ];
    }
    if (minScore || maxScore) {
      filter.performanceScore = {};
      if (minScore) filter.performanceScore.$gte = Number(minScore);
      if (maxScore) filter.performanceScore.$lte = Number(maxScore);
    }

    const employees = await Employee.find(filter).sort('-performanceScore').lean();

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get analytics data: department stats, performance distribution
 * @route   GET /api/employees/analytics
 * @access  Private
 */
const getAnalytics = async (req, res, next) => {
  try {
    const [deptStats, perfDistribution, topPerformers, total] = await Promise.all([
      // Average performance by department
      Employee.aggregate([
        {
          $group: {
            _id: '$department',
            avgScore: { $avg: '$performanceScore' },
            count: { $sum: 1 },
            avgExperience: { $avg: '$experience' },
          },
        },
        { $sort: { avgScore: -1 } },
      ]),

      // Performance score distribution in brackets
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

      // Top 10 performers
      Employee.find({})
        .sort('-performanceScore')
        .limit(10)
        .select('name department performanceScore experience skills status')
        .lean(),

      Employee.countDocuments({}),
    ]);

    const avgScore = await Employee.aggregate([{ $group: { _id: null, avg: { $avg: '$performanceScore' } } }]);

    res.status(200).json({
      success: true,
      data: {
        total,
        averageScore: avgScore[0]?.avg?.toFixed(1) || 0,
        promotionEligible: await Employee.countDocuments({ performanceScore: { $gte: 80 }, experience: { $gte: 2 } }),
        needsTraining: await Employee.countDocuments({ performanceScore: { $lt: 60 } }),
        deptStats,
        perfDistribution,
        topPerformers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  getAnalytics,
};
