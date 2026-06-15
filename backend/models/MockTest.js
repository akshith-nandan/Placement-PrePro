const mongoose = require('mongoose');

const mockTestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['Aptitude', 'Coding', 'Full Placement'], required: true },
    durationMinutes: { type: Number, required: true },
    aptitudeQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AptitudeQuestion' }],
    codingProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem' }]
  },
  { timestamps: true }
);

const mockTestResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mockTest: { type: mongoose.Schema.Types.ObjectId, ref: 'MockTest', required: true },
    score: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    skippedCount: { type: Number, default: 0 },
    timeTakenSeconds: { type: Number, default: 0 },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOption: Number, // -1 if skipped
        isCorrect: Boolean
      }
    ]
  },
  { timestamps: true }
);

module.exports = {
  MockTest: mongoose.model('MockTest', mockTestSchema),
  MockTestResult: mongoose.model('MockTestResult', mockTestResultSchema)
};