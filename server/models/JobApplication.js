const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['Applied', 'Interview', 'Rejected', 'Offer'],
      default: 'Applied',
    },
    notes: {
      type: String,
      trim: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      default: 'Full-time',
    },
    salary: {
      type: String,
      trim: true,
    },
    jobLink: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
jobApplicationSchema.index({ userId: 1, appliedDate: -1 });
jobApplicationSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
