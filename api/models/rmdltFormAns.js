const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Choices = new Schema({
  option_id: String,  // 所選選項的ID
  option: String  // 所選選項的答案 ex: 三年級
});

const TextSet = new Schema({
  subQuestion_id: String,
  text: String
});


const LetterAns = new Schema({
  projID: String,
  stuID: { type: String, unique: true },
  answers: [
    {
      question_id: String,
      choices: [Choices],
      file_url: String,
      text: String,
      textSet: [TextSet]
    }
  ]
});

module.exports = mongoose.model('rmdltFormAns', LetterAns);
