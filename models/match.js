let db = require('../config/db');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Getters
function dob (val) {
  if (!val) return val;
  return (val.getMonth() + 1) + "/" + val.getDate() + "/" + val.getFullYear();
}

// Model
var Match = new Schema({
	user1Id: {
		type: Schema.Types.ObjectId,
		required: true
	},
	user2Id: {
	    type: Schema.Types.ObjectId,
	    required: true,
	    ref: 'User'
	},
	matches: {
		type: Array,
		required: true
	},
	status: {
		type: String,
		default: 'new'
	},
	active: {
		type: Boolean,
		default: true
	},
	created_at: { type: Date, default: Date.now, get: dob }
});


let MatchModel = mongoose.model('Match', Match);
module.exports.MatchModel = MatchModel;

// module.exports = db.model('Match', Match);