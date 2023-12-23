const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignments: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
      title: { type: String },
    },
  ],
  studentsData: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      grades: [{}],
      attendance: [{}],
    },
  ],
});

module.exports = mongoose.model('Course', CourseSchema);
