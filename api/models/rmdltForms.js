const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Options = new Schema({
  option: String
});

const Letter = new Schema({
  projID: String,
  title: String,
  questions: [{
      questionTitle: String,
      questionType: String,
      options: [Options],
      require: Boolean
    }]
});

module.exports = mongoose.model('rmdltForms', Letter);
