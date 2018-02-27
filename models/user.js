// let db = require('../config/db');
// var bcrypt = require('bcrypt-nodejs');


// //Getters
// function dob (val) {
//   if (!val) return val;
//   return (val.getMonth() + 1) + "/" + val.getDate() + "/" + val.getFullYear();
// }


// //Setters
// function capitalize(v) {
//   return v.charAt(0).toUpperCase() + v.slice(1);
// }
// function toLower (v) {
//   return v.toLowerCase();
// }


// //Validation
// var minlength = [3, 'your {PATH} ({VALUE}) is shorter than the minimum allowed length ({MINLENGTH}).'];


// // Model
// let userModel = new db.Schema({
// 	name: {
// 		type: String,
// 		minlength: minlength,
// 		set: capitalize
// 	},
// 	email: {
// 	    type: String,
// 	    required: true,
// 	    index: {
// 	      unique: true
// 	      // sparse: true
// 	    },
// 	    set: toLower
// 	},
// 	password: {
// 		type: String,
// 		required: true
// 	},
// 	salt: {
//         type: String,
//         required: true
//     },
// 	description: {
// 		type: String
// 	},
// 	alive: Boolean,
// 	enabled: Boolean,
// 	created_at: { type: Date, default: Date.now, get: dob },
// });

// //Virtuals
// userModel.virtual('userId').get(function () {
//     return this.id;
// });



// //Unique validation
// // userModel.path('email').validate(function(value, done) {
// //     this.model('User').count({ email: value }, function(err, count) {
// //         if (err) {
// //             return done(err);
// //         } 
// //         done(!count);
// //     });
// // }, 'Email already exists');


// //Password Encryption
// userModel.pre('save', function(next) {
// 	var user = this;
// 	var SALT_FACTOR = 5;

// 	if (!user.isModified('password')) return next();

// 	bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
// 		if (err) return next(err);

// 		bcrypt.hash(user.password, salt, null, function(err, hash) {
// 			if (err) return next(err);
// 			user.password = hash;
// 			next();
// 		});
// 	});
// });

// //Password compare
// userModel.methods.comparePassword = function(candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };

// //Use Validators on Update
// userModel.pre('findOneAndUpdate', function(next) {
//   this.options.runValidators = true;
//   next();

// });


// module.exports = db.model('User', userModel);


var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

var User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: '0',
        enum: [ '0' , '1' ]
    },
    avatar: {
        type: String
    },
    firstTime: {
        type: Boolean,
        default: true
    },
    bio: {
        type: String,
        default: ''
    },
    location: {
        type: Array
    },
    created: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    pictures: {
        type: Array
    },
    wantsAndKnows: [{
        type: Schema.Types.ObjectId,
        ref: 'WantsAndKnows',
        required: true
    }]
    // knows: {
    //     type: Array
    // },
    // wants: {
    //     type: Array
    // }
});

User.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    //more secure – return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

User.virtual('userId')
    .get(function () {
        return this.id;
    });

User.virtual('password')
    .set(function(password) {
        console.log('password', password)
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('hex');
        //more secure - this.salt = crypto.randomBytes(128).toString('hex');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });


User.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

var UserModel = mongoose.model('User', User);

module.exports.UserModel = UserModel;

