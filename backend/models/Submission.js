const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem', required: true },
    language: { type: String, enum: ['javascript', 'python', 'java', 'cpp'], required: true },
    code: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Wrong Answer', 'Error'], default: 'Pending' },
    runtime: { type: String, default: '' },
    output: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);