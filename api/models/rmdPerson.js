const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Person = new Schema({
  name: String,
  email: String,
  serviceUnit: String,   //  服務單位
  jobTitle: String,       //  職稱
  verification: Boolean,
  phone: String,
});

const RecommendPerson = new Schema({
  projID: String,
  person: [Person],
});

module.exports = mongoose.model('RmdPerson', RecommendPerson);
