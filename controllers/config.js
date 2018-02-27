var express = require('express');
let CategoryModel = require('../models/category').CategoryModel;
var router = express.Router();
_ = require("underscore")

exports.getConfig = (req, res) => {
	CategoryModel
	.find()
  	.exec(function (err, categories) { 
		if (err) {
			return res.json({err: err}); 
		}
		return res.json({categories: categories});
	});
}