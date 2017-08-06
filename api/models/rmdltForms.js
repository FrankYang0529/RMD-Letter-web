const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Options = new Schema({
  option: String,
});

const SubQuestions = new Schema({
  title: String,
  questionType: String,
});


const Letter = new Schema({
  projID: { type: String, unique: true },
  title: String,
  questions: [
    {
      questionTitle: String,
      questionType: String,
      options: [Options],
      subQuestions: [SubQuestions],
      require: Boolean,
    },
  ],
});

module.exports = mongoose.model('rmdltForms', Letter);
