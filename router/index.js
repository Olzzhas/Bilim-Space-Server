const Router = require('express').Router;
const router = new Router();
const userController = require('../controllers/user-controller');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const postController = require('../controllers/post-controller');
const courseController = require('../controllers/course-controller');
const assignmentController = require('../controllers/assignment-controller');
const upload = require('../middlewares/uppload-middleware');
const path = require('path');
const assignmentModel = require('../models/assignment-model');
//front
router.get('/registration', (req, res) => {
  res.render('registration');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/index', (req, res) => {
  const posts = [
    { title: 'Заголовок поста 1', content: 'Содержание поста 1' },
    { title: 'Заголовок поста 2', content: 'Содержание поста 2' },
  ];
  res.render('index', { posts });
});

router.post('/post', authMiddleware, postController.create);

//back
router.get('/users', authMiddleware, userController.getUsers);
router.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 32 }),
  body('firstname').isLength({ max: 64 }),
  body('lastname').isLength({ max: 64 }),
  userController.registration,
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);

router.post('/course', courseController.create);
router.get('/courses', courseController.getCourses);
router.get('/course/:id', courseController.getCourseById);
router.get('/courses/:id', courseController.getCoursesOfUser);
router.put('/course/:id', courseController.deleteCourse);
router.put('/course/adduser', courseController.addUser);

router.get('/assignment/:id', assignmentController.getAssignmentById);
router.post('/assignment', assignmentController.create);
router.delete('/assignment', assignmentController.deleteAssignment);
// router.put('/assignment-add', courseController.addAssignment);

router.put('/assignment/grade', assignmentController.setGrade);
router.post('/assignment/grade', assignmentController.getGradeById);
// router.delete('/assignment/grade', assignmentController.deleteGrade)

router.post('/file/upload/:assignmentId/:userId', upload.single('file'), async (req, res, next) => {
  try {
    const { assignmentId, userId } = req.params;
    console.log(assignmentId + '   ' + userId);
    const data = await assignmentModel.findByIdAndUpdate(assignmentId, {
      $push: {
        files: {
          filename: 'sadasdsa',
          studentId: userId,
        },
      },
    });

    await data.save();

    return res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/file/download/:filename', (req, res, next) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).send('Error downloading file');
    }
  });
});

module.exports = router;
