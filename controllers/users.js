let express = require('express');
let UserModel = require('../models/user').UserModel;
let router = express.Router();


exports.getUser = (req, res) => {
	// UserModel.findOne({email: req.params.user_id}, function(err, user) {
	// 	if (err) {
	// 		return res.json({err: err}); 
	// 	}
	// 	if (!user) {  
	// 		return res.json({error: 'No user'});
	// 	}
		return res.json(req.user);
	// });
}

exports.putUser = (req, res) => { 

	let modifiableFields = ['name', 'username', 'password', 'gender', 'avatar', 'bio', 'location'];

	UserModel.findOne({_id: req.user._id}, function(err, user) {
		if (err) {
			return res.json({err: err}); 
		}
		if (!user) {  
			return res.json({error: 'No user'}); 
		}

		let modifiedUser = user;
		for(let field of modifiableFields) {
			if(req.body[field]) {
				modifiedUser[field] = req.body[field];
			}
		}

		modifiedUser.save((err, data) => {
			if(err)
				return res.json({err: String(err)});
			else
				return res.json(data);
		});

	});

		// user.comparePassword(req.body.password, (err, isMatch) => {
		// 	if (isMatch) {
		// 		user.name = req.body.name;
		// 		user.email = req.body.email;
		// 		user.save((err) => {
		// 	      if (err) {
		// 	      	return res.json({err: err});
		// 	      }
		// 	      return res.json(user);
		// 	    });	
		// 	} else {
		// 		return res.json({err: 'Incorrect password.'});
		// 	}
		// });
}


exports.deleteUser = (req, res) => {
	UserModel.findOneAndRemove({_id: req.user._id}, function(err, user) {
		if (err) {
			return res.json({err: err}); 
		}
		if (!user) {  
			return res.json({error: 'No user'});
		} else {
			return res.json(user);
		}
	});
}


exports.getUsers = (req, res) => {
	UserModel.find({}, (err, users) => {
		if (err) return res.json({err: err});
		if (!users) return res.json({error: 'No users'});
		return res.json(users);
	});
}


exports.postUser = (req, res) => {
	let user = new UserModel();
	user.name = req.body.name;
	user.username = req.body.username;
	user.password = req.body.password;
	// user.gender = req.body.gender;
	// user.bio = req.body.bio;

	user.save((err, data) => {
		if(err)
			return res.json({err: String(err)});
		else
			return res.json(data);
	});
};