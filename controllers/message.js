var express = require('express');
let MessageModel = require('../models/message').MessageModel;
let ConversationModel = require('../models/conversation').ConversationModel;
var router = express.Router();
_ = require("underscore");



exports.postMessage = (req, res) => {
	var message = new MessageModel(_.extend({ senderId: req.user._id }, req.body));

	ConversationModel.findById(message.conversationId, function(err, existingConversation) {
		if (err) {
			return res.json({err: err}); 
		}
		if (!existingConversation) {   
			return res.json({error: 'Conversation doesn\'t exist.'});
		} else {
			if(existingConversation.participants.indexOf(req.user._id) === -1) {
				return res.json({error: 'User doesn\'t belong to conversation.'});
			} else {
				message.save((err, data) => {
					if(err)
						return res.json({err: String(err)});
					else
						return res.json(data);
				});
			}
		}
	})
}

exports.getMessages = (req, res) => {
	ConversationModel
	.findById(req.params.conversation_id)
  	.exec(function (err, existingConversation) {
		if (err) {
			return res.json({err: err}); 
		}
		if (!existingConversation) {   
			return res.json({error: 'Conversation doesn\'t exist.'});
		} else {
			if(existingConversation.participants.indexOf(req.user._id) === -1) {
				return res.json({error: 'User doesn\'t belong to conversation.'});
			} else {

				//TODO : Change messages of this conversation from this sender ONLY to seen 

				MessageModel
				.find({conversationId: req.params.conversation_id})
				.populate({path: 'senderId', select: 'name'})
			  	.exec(function (err, messages) {
					if (err) {
						return res.json({err: err}); 
					}
					existingConversation.messages = messages
					return res.json(messages);
				});
			}
		}
	});
}
