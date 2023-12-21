const assignmentService = require('../service/assignment-service');
const courseService = require('../service/course-service');
class CourseController {
  async create(req, res, next) {
    try {
      const { title, description, teacher, students } = req.body;
      const courseData = await courseService.create(title, description, teacher, students);

      return res.json(courseData);
    } catch (error) {
      next(error);
    }
  }

  async addAssignment(req, res, next) {
    try {
      const { courseId, title, description, files, avatar, grades, teacher, students } = req.body;

      const assignment = await assignmentService.create(title, description, files, avatar, grades);

      const assignmentData = await courseService.addAssignment(courseId, assignment);

      return res.json(assignmentData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();
