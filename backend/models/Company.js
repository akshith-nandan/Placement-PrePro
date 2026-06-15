const mongoose = require('mongoose');

const interviewExperienceSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    role: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    experience: { type: String, required: true },
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    logoUrl: { type: String, default: '' },
    hiringPattern: { type: String, default: '' },
    cutoff: { type: String, default: '' },
    previousQuestions: { type: [String], default: [] },
    interviewExperiences: { type: [interviewExperienceSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);