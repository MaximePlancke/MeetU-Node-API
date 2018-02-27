var mongoose = require('mongoose');

// var Client = new mongoose.Schema({
//   name: { type: String, unique: true, required: true },
//   clientId: { type: String, unique: true, required: true },
//   secret: { type: String, required: true }
// });


// module.exports = mongoose.model('Client', Client);


var Schema = mongoose.Schema;

var Client = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    }
});

var ClientModel = mongoose.model('Client', Client);

module.exports.ClientModel = ClientModel;