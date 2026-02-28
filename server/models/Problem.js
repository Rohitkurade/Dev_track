const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    platform: {
      type: String,
      required: [true, 'Platform is required'],
      enum: ['LeetCode', 'HackerRank', 'CodeForces', 'GeeksforGeeks', 'Others'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: ['Easy', 'Medium', 'Hard'],
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      enum: [
        'Array',
        'String',
        'LinkedList',
        'Tree',
        'Graph',
        'DynamicProgramming',
        'Recursion',
        'Backtracking',
        'Greedy',
        'Sorting',
        'Searching',
        'Stack',
        'Queue',
        'Heap',
        'Hashing',
        'Math',
        'BitManipulation',
        'TwoPointers',
        'SlidingWindow',
        'Binary Search',
        'Others',
      ],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['Solved', 'Revision', 'Pending'],
      default: 'Pending',
    },
    notes: {
      type: String,
      trim: true,
    },
    problemLink: {
      type: String,
      trim: true,
    },
    solutionLink: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
problemSchema.index({ userId: 1, createdAt: -1 });
problemSchema.index({ userId: 1, difficulty: 1 });
problemSchema.index({ userId: 1, topic: 1 });
problemSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Problem', problemSchema);
