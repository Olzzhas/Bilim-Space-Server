const ApiError = require('../exceptions/api-error');
const courseModel = require('../models/course-model');
const userModel = require('../models/user-model');
const assignmentService = require('../service/assignment-service');
const courseService = require('../service/course-service');
const mongoose = require('mongoose');
class CourseController {
  async create(req, res, next) {
    try {
      const { title, description, teacher, studentsData } = req.body;
      const courseData = await courseService.create(title, description, teacher, studentsData);

      const courseID = courseData._id.toString();

      for (let i = 0; i < studentsData.length; i++) {
        await userModel.updateOne(
          { _id: studentsData[i].student },
          {
            $push: {
              courses: { id: courseID, title: title },
            },
          },
        );
      }

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

  async getCourses(req, res, next) {
    try {
      const courses = await courseModel.find();

      return res.json(courses);
    } catch (error) {
      next(error);
    }
  }

  async getCourseById(req, res, next) {
    try {
      const courseData = await courseModel.findById(req.params.id);

      return res.json(courseData);
    } catch (error) {
      next(error);
    }
  }

  async getCoursesOfUser(req, res, next) {
    try {
      const id = req.params.id;

      const userData = await userModel.findById(id);
      if (!userData) {
        throw ApiError.BadRequest('User is not found');
      }

      return res.json(userData.courses);
    } catch (error) {
      next(error);
    }
  }

  async deleteCourse(req, res, next) {
    try {
      const courseId = req.params.id;

      const course = await courseModel.findById(courseId);
      if (!course) {
        throw ApiError.BadRequest('Course is not found');
      }

      const userIds = course.studentsData.map((student) => student.student.toString());
      await courseModel.findByIdAndDelete(courseId);

      await userModel.updateMany(
        { _id: { $in: userIds } },
        { $pull: { courses: { id: courseId } } },
      );

      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async addUser(req, res, next) {
    try {
      const id = req.params.id;

      const course = await courseModel.findByIdAndUpdate(
        { id },
        {
          $push: {},
        },
      );

      await courseModel.updateOne(
        { _id: courseId },
        {
          $push: {
            assignments: { _id: newAssignmentId, title: title },
          },
        },
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();
