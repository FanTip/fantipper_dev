var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  messageFrom: { type: String },
  content: { type: String },
  sentDate: { type: Date },
  isRead: { type: Boolean },
  reply: {
    replyFrom: { type: String },
    replyDate: { type: Date },
    replyContent: { type: String }
  }
});
module.exports = mongoose.model(
  'Message', messageSchema
);