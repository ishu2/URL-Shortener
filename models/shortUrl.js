var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var urlSchema=new Schema({
    originalUrl:String,
    shorterUrl:String
}, {timestamp: true});

var Model=mongoose.model('shortUrl',urlSchema);

module.exports=Model;