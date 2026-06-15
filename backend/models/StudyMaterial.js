const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['DSA', 'DBMS', 'OS', 'CN', 'OOPs', 'SQL'],
      required: true
    },
    type: { type: String, enum: ['PDF', 'Video'], required: true },
    url: { type: String, required: true }, // PDF link or video link
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);