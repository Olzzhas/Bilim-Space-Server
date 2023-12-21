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
            $set: {
              courses: courseID,
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
}

module.exports = new CourseController();
