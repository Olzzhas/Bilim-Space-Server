const multer = require('multer');
const moment = require('moment');
const fs = require('fs');
const assignmentModel = require('../models/assignment-model');

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
   async filename(req, file, cb) {
      const date = moment().format('DDMMYYYY-HHmmss-SSS');
      cb(null, `${date}-${file.originalname}`);

      const { assignmentId, userId } = req.params;

      const assignment = await assignmentModel.findById(assignmentId);

      const existingFileIndex = assignment.files.findIndex((file) => file.studentId.equals(userId));

      if (existingFileIndex !== -1) {
         // Если запись существует, удаляем её
         assignment.files.splice(existingFileIndex, 1);
         console.log('Old file deleted successfully');
      }

      const filename = date + '-' + file.originalname;

      // Добавляем новую запись
      assignment.files.push({ studentId: userId, filename });
      await assignment.save();
      console.log('New file created successfully');

      // const data = await assignmentModel.findByIdAndUpdate(assignmentId, {
      //    $push: {
      //       files: {
      //          filename: date + '-' + file.originalname,
      //          studentId: userId,
      //       },
      //    },
      // });

      // console.log(data);
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
