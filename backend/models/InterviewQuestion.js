const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Technical', 'HR'], required: true },
    subject: {
      type: String,
      enum: ['DBMS', 'OS', 'CN', 'OOPs', 'Cloud Computing', 'General'],
      default: 'General'
    },
    question: { type: String, required: true },
    sampleAnswer: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);