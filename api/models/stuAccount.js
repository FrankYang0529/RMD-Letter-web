const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stuAccount = new Schema({
  username: { type: String, required: true, unique: false},
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
    unique: false
  },
  gravatar: String,
  subdomain: String,
  type: String
});

module.exports = mongoose.model('stuaccounts', stuAccount);