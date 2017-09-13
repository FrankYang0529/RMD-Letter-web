const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const announcementBody = new Schema({
  title: String, // ex: [公告]推薦信截止時間
  text: String,
  file: String,
  timestamp: Date,
});

const Projects = new Schema({
  ownerID: String,
  titleZh: String,
  announcement: [announcementBody],
  email: String,
  phone: String,
  startTime: Date,
  endTime: Date,
  subdomainName: { type: String, required: true, unique: true },
  isDeployed: Boolean,
});

module.exports = mongoose.model('projs', Projects);
