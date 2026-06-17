const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    college: { type: String, default: '' },
    branch: { type: String, default: '' },
    year: { type: String, default: '' },
    placementGoal: { type: String, default: '' },

    // Progress tracking
    quizzesAttempted: { type: Number, default: 0 },
    codingProblemsSolved: { type: Number, default: 0 },
    mockTestsTaken: { type: Number, default: 0 },
    streakCount: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
    skillScore: { type: Number, default: 0 },

    // Topic-wise accuracy { topic: { correct, total } }
    aptitudeStats: { type: Map, of: new mongoose.Schema({ correct: Number, total: Number }, { _id: false }), default: {} },
    codingStats: { type: Map, of: new mongoose.Schema({ correct: Number, total: Number }, { _id: false }), default: {} },

    role: { type: String, enum: ['student', 'admin'], default: 'student' }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Update streak based on last active date
userSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!this.lastActiveDate) {
    this.streakCount = 1;
  } else {
    const last = new Date(this.lastActiveDate);
    last.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      this.streakCount += 1;
    } else if (diffDays > 1) {
      this.streakCount = 1;
    }
    // diffDays === 0 -> already active today, no change
  }
  this.lastActiveDate = today;
};

module.exports = mongoose.model('User', userSchema);