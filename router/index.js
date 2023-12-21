const Router = require('express').Router;
const router = new Router();
const userController = require('../controllers/user-controller');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const postController = require('../controllers/post-controller');
const courseController = require('../controllers/course-controller');
const assignmentController = require('../controllers/assignment-controller');

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
  userController.registration,
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);

router.post('/course', courseController.create);
router.get('/courses', courseController.getCourses);

router.post('/assignment', assignmentController.create);
router.put('/assignment-add', courseController.addAssignment);

module.exports = router;
