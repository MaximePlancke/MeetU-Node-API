let db = require('../config/db');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Getters
function dob (val) {
  if (!val) return val;
  return (val.getMonth() + 1) + "/" + val.getDate() + "/" + val.getFullYear();
}

// Model
var Category = new Schema({
	name: {
		type: String
	},
	icon: {
		type: String
	},
	iconColor: {
		type: String
	},
	type: {
		type: String
	},
	created_at: { type: Date, default: Date.now, get: dob }
});


let CategoryModel = mongoose.model('Category', Category);
module.exports.CategoryModel = CategoryModel;