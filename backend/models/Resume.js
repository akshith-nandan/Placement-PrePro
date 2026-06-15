const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    template: { type: String, default: 'classic' },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      summary: { type: String, default: '' }
    },
    education: [
      {
        institution: String,
        degree: String,
        startYear: String,
        endYear: String,
        score: String
      }
    ],
    projects: [
      {
        title: String,
        description: String,
        techStack: String,
        link: String
      }
    ],
    skills: { type: [String], default: [] },
    certifications: [
      {
        title: String,
        issuer: String,
        year: String
      }
    ],
    atsScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);