
//The person who gets tipped
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tipeeSchema = new Schema({
  tipeeID: { type: Schema.Types.ObjectId, ref: 'user' },
  tipAmount: { type: Number },
  tipFrom: { type: String },
  tipDate: { type: Date },
});

module.exports = mongoose.model(
  'tippee', tipeeSchema
);