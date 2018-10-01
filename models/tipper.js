//the person who tips
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tipperSchema = new Schema({
    tipperID : {type : Schema.Types.ObjectId, ref : 'user'},
    tipAmount : {type : Number},
    tipTo : {type : String}, 
    tipDate : {type : Date}
});

module.exports = mongoose.model(
    'tipper', tipperSchema
);