const ApiError = require('../exceptions/api-error');
const assignmentModel = require('../models/assignment-model');
const courseModel = require('../models/course-model');

class AssignmentController {
  async create(req, res, next) {
    try {
      const { title, courseId, description, filepath, gradeType, deadline, teacher } = req.body;

      const assignmentData = await assignmentModel.create({
        title: title,
        gradeType: gradeType,
        description: description,
        filepath: filepath,
        deadline: deadline,
        teacher: teacher,
      });

      const newAssignmentId = assignmentData._id.toString();

      await courseModel.updateOne(
        { _id: courseId },
        {
          $push: {
            assignments: { _id: newAssignmentId, title: title },
          },
        },
      );

      return res.json(assignmentData);
    } catch (error) {
      next(error);
    }
  }

  async getAssignmentById(req, res, next) {
    try {
      const id = req.params.id;

      const data = await assignmentModel.findById(id);

      if (!data) {
        return res.json('assignment not found');
      }

      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async setGrade(req, res, next) {
    try {
      const { assignmentId, studentId, grade } = req.body;

      const assignment = await assignmentModel.findById(assignmentId);
      if (!assignment) {
        throw ApiError.BadRequest('Assignment is not found');
      }

      const existingGrade = assignment.grades.find((grade) => grade.student.equals(studentId));

      if (existingGrade) {
        existingGrade.grade = grade;
      } else {
        assignment.grades.push({ student: studentId, grade: grade });
      }

      await assignment.save();

      return res.json(assignment);
    } catch (error) {
      next(error);
    }
  }

  async getGradeById(req, res, next) {
    try {
      const { assignmentId, studentId } = req.body;

      const assignment = await assignmentModel.findById(assignmentId);
      if (!assignment) {
        throw ApiError.BadRequest('Assignment is not found');
      }

      const grade = assignment.grades.find((grade) => grade.student.equals(studentId));
      if (!grade) {
        throw ApiError.BadRequest('Assignment is not found');
      }

      return res.json(grade.grade);
    } catch (error) {
      next(error);
    }
  }

  async deleteAssignment(req, res, next) {
    try {
      const { assignmentId, courseId } = req.body;

      await courseModel.findByIdAndUpdate(courseId, {
        $pull: { assignments: { _id: assignmentId } },
      });

      await assignmentModel.findByIdAndDelete(assignmentId);

      return res.json({ success: true, message: 'assignment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AssignmentController();
