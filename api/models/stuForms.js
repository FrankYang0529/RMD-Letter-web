const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Options = new Schema({
  option: String,
});

const SubQuestions = new Schema({
  title: String,
  questionType: String, //  目前都預設為text
});


const StudentForms = new Schema({
  projID: { type: String, unique: true },
  title: String,
  questions: [
    {
      questionTitle: String,  // 題目
      questionType: String,
      options: [Options],  // 選擇或多選的選項
      subQuestions: [SubQuestions],  // textSet的問題
      require: Boolean,
    },
  ],
});

module.exports = mongoose.model('stuForms', StudentForms);
