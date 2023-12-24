const multer = require('multer');
const moment = require('moment');
const fs = require('fs');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const { userId, assignmentId } = req.params;

    if (!fs.existsSync(`uploads/${assignmentId}`)) {
      fs.mkdirSync(`uploads/${assignmentId}`, { recursive: true });
    }

    if (!fs.existsSync(`uploads/${assignmentId}/${userId}`)) {
      fs.mkdirSync(`uploads/${assignmentId}/${userId}`, { recursive: true });
    }

    cb(null, `uploads/${assignmentId}/${userId}/`);
  },
  filename(req, file, cb) {
    const date = moment().format('DDMMYYYY-HHmmss-SSS');
    cb(null, `${date}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/zip'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 20,
};

module.exports = multer({
  storage,
  fileFilter,
  limits,
});
