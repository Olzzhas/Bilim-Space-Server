const ApiError = require('../exceptions/api-error');
const assignmentModel = require('../models/assignment-model');
const courseModel = require('../models/course-model');

class AssignmentController {
  async create(req, res, next) {
    try {
      const { title, courseId, description, filepath, typeOfGrade, deadline, teacher } = req.body;

      let typeGrade;
      if (typeOfGrade === 'ВСК1') {
        typeGrade = 1;
      } else if (typeOfGrade === 'Midterm') {
        typeGrade = 2;
      } else if (typeOfGrade === 'ВСК1') {
        typeGrade = 3;
      } else if (typeOfGrade === 'Endterm') {
        typeGrade = 4;
      } else if (typeOfGrade === 'Final') {
        typeGrade = 5;
      }

      const assignmentData = await assignmentModel.create({
        title: title,
        typeOfGrade: typeOfGrade,
        description: description,
        filepath: filepath,
        deadline: deadline,
        teacher: teacher,
      });

      console.log(courseId);

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
