const mongoose = require('mongoose');
const blog=require('./blog');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.createConnection('mongodb://localhost/student',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const student = new Schema({
    username:String,
    branch:String,
    rollNo:String,
    Email:String,
    content:[{ type: Schema.Types.ObjectId, ref:'Blog',required:true}],
    password:String,
    

});

student.plugin(passportLocalMongoose);

module.exports = mongoose.model('Student', student);