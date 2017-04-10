const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Projects = new Schema({
  ownerID: String,
  titleZh: String,
  hbr: String,
  subdomainName: String
});

module.exports = mongoose.model('projs', Projects);
