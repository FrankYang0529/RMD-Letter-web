const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const InvitationLetter = new Schema({
  projID: String,
  title: String,
  content: String
});

module.exports = mongoose.model('invitelts', InvitationLetter);
