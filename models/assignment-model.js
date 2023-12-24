const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  files: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      createdAt: { type: Date, default: Date.now },
      filename: { type: String, required: true },
    },
  ],
  typeOfGrade: { type: Number, required: true },
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
