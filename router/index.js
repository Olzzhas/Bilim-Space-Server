const Router = require('express').Router;
const router = new Router();
const userController = require('../controllers/user-controller');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const postController = require('../controllers/post-controller');
const courseController = require('../controllers/course-controller');
const assignmentController = require('../controllers/assignment-controller');
const upload = require('../middlewares/uppload-middleware');

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
  body('password').isLength({ min: 8, max: 32 }),
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
// router.put('/course/adduser/:id', courseController.addUser); TODO TODO TODO TODO

router.get('/assignment/:id', assignmentController.getAssignmentById);
router.post('/assignment', assignmentController.create);
router.delete('/assignment', assignmentController.deleteAssignment);
// router.put('/assignment-add', courseController.addAssignment);

router.put('/assignment/grade', assignmentController.setGrade);
router.post('/assignment/grade', assignmentController.getGradeById);
// router.delete('/assignment/grade', assignmentController.deleteGrade)

router.post('/file/test', upload.single('file'), (req, res, next) => {
  try {
    res.json({ message: 'File uploaded successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
