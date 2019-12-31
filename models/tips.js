//the person who tips
const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let tip = new Schema({
    id: { type: Schema.Types.ObjectId },
    amount: { type: Number },
    creator_email: { type: String },
    pay_email: { type: String },
    date: { type: Date },
    loggedIn: { type: Schema.Types.ObjectId },
    tipmessage: { type: String },
});

module.exports = mongoose.model(
    'tip', tip
);