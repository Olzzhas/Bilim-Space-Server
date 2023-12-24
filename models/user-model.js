const mongoose = require('mongoose');
const { stringify } = require('querystring');

const UserSchema = new mongoose.Schema({
  email: { type: String, requried: true, unique: true },
  password: { type: String, requried: true },
  firstname: { type: String },
  lastname: { type: String },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  courses: [
    {
      id: { type: String },
      title: { type: String },
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
