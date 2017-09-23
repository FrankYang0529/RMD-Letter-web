const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rmdPerson = new Schema({
  rmdPersonID: String,
  rmdPersonName: String,
  sendTime: Date,
});

const stuAccount = new Schema({
  username: { type: String, required: true, unique: false },
  password: { type: String },
  displayName: { type: String, required: true },
  email: {
    type: String,
    validate: {
      validator(email) {
        return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
      },
      message: '{VALUE} is not a valid email!',
    },
    required: true,
    unique: false,
  },
  gravatar: String,
  subdomain: String,
  type: String,
  sentLetter: [rmdPerson],
});

module.exports = mongoose.model('stuaccounts', stuAccount);