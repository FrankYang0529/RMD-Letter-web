const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const Department_data = new Schema({
	department_id : String,
    name: String,
    url: String,
    form: String,
    note: String
});

module.exports = mongoose.model('Ddata', Department_data);