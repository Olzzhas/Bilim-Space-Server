const assignmentModel = require('../models/assignment-model');

class AssignmentService {
  async create(title, description, files, avatar, grades) {
    const assignment = await assignmentModel.create({
      title: title,
      description: description,
      files: files,
      avatar: avatar,
      grades: grades,
    });

    return assignment;
  }
}

module.exports = new AssignmentService();
