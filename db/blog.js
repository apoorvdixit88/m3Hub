const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.createConnection('mongodb://localhost/blog',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const blog = new Schema({
title:String,
introduction:String,
author:String,
editor:String});

module.exports = mongoose.model('Blog', blog);