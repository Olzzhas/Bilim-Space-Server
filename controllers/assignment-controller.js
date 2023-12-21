const assignmentService = require('../service/assignment-service');

class AssignmentController {
  async create(req, res, next) {
    try {
      const { title, description, files, avatar, grades } = req.body;

      const assignment = await assignmentService.create(title, description, files, avatar, grades);

      return res.json(assignment);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AssignmentController();
