const mongoose = require('mongoose');

const aptitudeQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['Quantitative', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'],
      required: true
    },
    topic: { type: String, required: true }, // e.g. "Profit & Loss"
    questionText: { type: String, required: true },
    options: { type: [String], required: true, validate: v => v.length === 4 },
    correctOption: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: String, default: '' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);