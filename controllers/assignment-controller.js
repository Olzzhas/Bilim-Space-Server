const assignmentModel = require('../models/assignment-model');
const courseModel = require('../models/course-model');
const assignmentService = require('../service/assignment-service');

class AssignmentController {
  async create(req, res, next) {
    try {
      const { title, courseId, description, files } = req.body;

      const assignmentData = await assignmentModel.create({
        title: title,
        description: description,
        files: files,
      });

      const newAssignmentId = assignmentData._id.toString();

      const courseData = await courseModel.updateOne(
        { _id: courseId },
        {
          $push: {
            assignments: newAssignmentId,
          },
        },
      );

      return res.json(assignmentData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AssignmentController();
