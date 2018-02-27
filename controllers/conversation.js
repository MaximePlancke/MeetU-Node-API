var express = require('express');
let ConversationModel = require('../models/conversation').ConversationModel;
var router = express.Router();
_ = require("underscore")

exports.getConversations = (req, res) => {
	ConversationModel
	.find({participants: { $in : [req.user._id] }})
	.populate({path: 'participants', select: 'name wants knows pictures lastLogin'})
  	.exec(function (err, conversations) {
		if (err) {
			return res.json({err: err}); 
		}
		return res.json(conversations);
	});
}

// exports.getConversation = (req, res) => {
// 	ConversationModel
// 	.findById(req.params.conversation_id)
// 	.populate({path: 'participants', select: 'name wants knows pictures lastLogin'})
//   	.exec(function (err, conversation) {
// 		if (err) {
// 			return res.json({err: err}); 
// 		}
// 		return res.json(conversation);
// 	});
// }



exports.postConversation = (req, res) => {

	var participants = [];
	participants.push(req.user._id);
	participants.push(req.body.participant)
	var conversation = new ConversationModel(_.extend({ participants: participants }));

	ConversationModel.findOne({participants: { $all : conversation.participants }}, function(err, existingConversation) {
		if (err) {
			return res.json({err: err}); 
		}
		if (!existingConversation) {   

			conversation.save((err, data) => {
				if(err)
					return res.json({err: String(err)});
				else
					return res.json(data);
			});
		} else {
			return res.json({error: 'Conversation already exist.'});
		}
	})
};


