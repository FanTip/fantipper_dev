var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    userID : {type : Schema.Types.ObjectId, ref : 'user'},
    tags : [{type:String}]
});


module.exports = mongoose.model(
    'Categories',CategorySchema
);