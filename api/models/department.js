const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const Department = new Schema({
	department_id : String,
	name : String,
	url : String,
	form : String,
	note : String
});

module.exports = mongoose.model('Ddata', Department);