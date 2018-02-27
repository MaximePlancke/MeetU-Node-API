let db = require('../config/db');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Getters
function dob (val) {
  if (!val) return val;
  return (val.getMonth() + 1) + "/" + val.getDate() + "/" + val.getFullYear();
}

// Model
var Message = new Schema({
	conversationId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Conversation'
	},
	senderId: {
	    type: Schema.Types.ObjectId,
	    required: true,
	    ref: 'User'
	},
	status: {
		type: String,
		default: 'new'
	},
	content: {
		type: String
	},
	created_at: { type: Date, default: Date.now, get: dob }
});


let MessageModel = mongoose.model('Message', Message);
module.exports.MessageModel = MessageModel;