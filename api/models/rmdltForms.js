const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Letter = new Schema({
  projID: String,
  title: String,
  questions: [{
      questionTitle: String,
      questionType: String,
      options: [{ type: String }],
      require: Boolean
    }]
});

module.exports = mongoose.model('rmdltForms', Letter);
