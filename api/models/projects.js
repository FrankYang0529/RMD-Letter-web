const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HbrBody = new Schema({
  title: String, // ex: [公告]推薦信截止時間
  text: String,
  img: String,
  file: String,
  timestamp: Date,
});

const Hbr = new Schema({
  email: String,
  phone: String,
  startTime: Date,
  endTime: Date,
  body: [HbrBody],
});

const Projects = new Schema({
  ownerID: String,
  titleZh: String,
  hbr: Hbr,
  subdomainName: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('projs', Projects);
