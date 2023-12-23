const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  files: { type: String },
  grades: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      grade: { type: Number, default: 0 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  deadline: { type: Date },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
