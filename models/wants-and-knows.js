let db = require('../config/db');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Getters
function dob (val) {
  if (!val) return val;
  return (val.getMonth() + 1) + "/" + val.getDate() + "/" + val.getFullYear();
}

// Model
var WantsAndKnows = new Schema({
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category'
		required: true
	},
	user: {
	    type: Schema.Types.ObjectId,
	    required: true,
	    ref: 'User'
	},
	wants: {
		type: Array
	},
	knows: {
		type: Array
	},
	created_at: { type: Date, default: Date.now, get: dob }
});


let WantsAndKnowsModel = mongoose.model('WantsAndKnows', WantsAndKnows);
module.exports.WantsAndKnowsModel = WantsAndKnowsModel;
