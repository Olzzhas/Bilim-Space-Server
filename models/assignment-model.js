const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  files: [{ type: String, default: '' }],
  typeOfGrade: { type: Number, required: true },
  // 1 - First part
  // 2 - First srs
  // 3 - Second part
  // 4 - Second srs
  // 5 - Final
  grades: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      grade: { type: Number, default: 0 },
      gradeType: { type: Number },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  deadline: { type: Date },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
