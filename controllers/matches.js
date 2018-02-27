var express = require('express');
let MatchModel = require('../models/match').MatchModel;
var router = express.Router();
_ = require("underscore")

exports.getMatches = (req, res) => {
	MatchModel
	.find({user1Id: req.user._id})
	.populate('user2Id', 'username pictures bio')
  	.exec(function (err, matches) {
		if (err) {
			return res.json({err: err}); 
		}
		return res.json(matches);
	});
}



exports.postMatch = (req, res) => {

	var match = new MatchModel(_.extend({ user1Id: req.user._id }, req.body));

	MatchModel.findOne({user1Id: match.user1Id, user2Id: match.user2Id}, function(err, existingMatch) {
		if (err) {
			return res.json({err: err}); 
		}
		if (!existingMatch) { 

			// let match = new MatchModel();
			// match.matches = data.matches;
			// match.user1Id = req.user._id;
			// match.user2Id = data.user2Id;

			match.save((err, data) => {
				if(err)
					return res.json({err: String(err)});
				else
					return res.json(data);
			});
		} else {
			return res.json({error: 'Match already exist.'});
		}
	})
};



exports.putMatch = (req, res) => {

	let modifiableFields = ['matches', 'status'];

	MatchModel.findOne({user1Id: req.user._id, user2Id: req.query.user2Id}, function(err, match) {
		if (err) {
			return res.json({err: err}); 
		}
		if (!match) {  
			return res.json({error: 'Incorrect match.'});
		}

		let modifiedMatch = match;
		let matches = match.matches.toString();

		for(let field of modifiableFields) {
			if(req.body[field]) {
				modifiedMatch[field] = req.body[field];
			}
		}

		if(matches !== modifiedMatch.matches.toString()) {
			modifiedMatch.status = 'new';
		}

		modifiedMatch.save((err, data) => {
			if(err)
				return res.json({err: String(err)});
			else
				return res.json(data);
		});

	});
}