let db = require('../config/db');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Getters


// Model
var Conversation = new Schema({
	participants: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
});


let ConversationModel = mongoose.model('Conversation', Conversation);
module.exports.ConversationModel = ConversationModel;
