const mongoose = require('mongoose');

/**
 * Employee Schema - Core data model for the AI Employee Analytics system.
 * Stores employee profile, skills, and performance metrics.
 */
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design', 'Operations', 'Legal'],
        message: '{VALUE} is not a valid department',
      },
    },
    skills: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0 && arr.length <= 20,
        message: 'Employee must have between 1 and 20 skills',
      },
      default: [],
    },
    performanceScore: {
      type: Number,
      required: [true, 'Performance score is required'],
      min: [0, 'Performance score cannot be negative'],
      max: [100, 'Performance score cannot exceed 100'],
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience cannot exceed 50 years'],
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Terminated', 'Remote'],
      default: 'Active',
    },
    role: {
      type: String,
      default: 'Employee',
      trim: true,
    },
    // AI-generated recommendation cache
    aiRecommendation: {
      type: String,
      default: null,
    },
    lastAiUpdate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: performance tier classification
employeeSchema.virtual('performanceTier').get(function () {
  if (this.performanceScore >= 80) return 'Excellent';
  if (this.performanceScore >= 60) return 'Good';
  return 'Needs Improvement';
});

// Indexes for optimized queries
employeeSchema.index({ department: 1 });
employeeSchema.index({ performanceScore: -1 });
employeeSchema.index({ email: 1 }, { unique: true });
employeeSchema.index({ name: 'text', email: 'text', department: 'text' }); // Full-text search

module.exports = mongoose.model('Employee', employeeSchema);
