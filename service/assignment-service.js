const assignmentModel = require('../models/assignment-model');

class AssignmentService {
  async create(title, description, files, students, courseId) {
    const assignment = await assignmentModel.create({
      title: title,
      courseId: courseId,
      description: description,
      files: files,
      students: students,
    });

    return assignment;
  }
}

module.exports = new AssignmentService();
