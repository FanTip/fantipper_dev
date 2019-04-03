var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let usersSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  location: {
    type: String
  }
});

module.exports = mongoose.model(
  'users', usersSchema
);