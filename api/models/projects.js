const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Projects = new Schema({
  ownerID: String,
  title: String,
  body: String,
  subdomainName: String
});

module.exports = mongoose.model('projs', Projects);
