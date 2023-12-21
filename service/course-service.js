const ApiError = require('../exceptions/api-error');
const courseModel = require('../models/course-model');

class CourseService {
  async create(title, description, teacher, students) {
    const candidate = await courseModel.findOne({ title });
    if (candidate) {
      throw ApiError.BadRequest(`Курс с таким именем ${title} уже существует!`);
    }

    const course = await courseModel.create({
      title: title,
      description: description,
      teacher: teacher,
      studentsData: students,
    });

    return course;
  }

  async addAssignment(courseId, assignment) {
    const course = await courseModel.findById(courseId);
    if (!course) {
      throw ApiError.BadRequest(`Курс не найден!`);
    }

    const assignmentData = courseModel.findOneAndUpdate(
      { _id: courseId },
      { $push: { assignments: assignment } },
      { new: true, useFindAndModify: false },
    );

    return assignmentData;
  }
}

module.exports = new CourseService();
