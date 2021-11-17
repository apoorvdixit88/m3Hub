const express = require('express');
const route= express.Router();
const fetch=require('node-fetch');
const User=require('../db/student');
const b_post=require('../db/blog');
/*async function getapi(url) {
    
    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    var data = await response.json();
    return data;
}*/

route.get('/',(req,res)=>
{
    res.render('home/home');
});
route.get('/cse', async(req,res)=>
{console.log(req.user);
    var arr=[];
    var k=['code_chef','codeforces','hacker_earth','kick_start'];
    for(var i=0;i<4;i++){
        var url='https://kontests.net/api/v1/'+k[i]
    let response=await fetch(url);
    if (response.ok) { // if HTTP-status is 200-299
        // get the response body (the method explained below)
    
        var f=await response.json();
        arr.push(f);
    
      } else {
        alert("HTTP-Error: " + response.status);
      }}
      const blog_all=await b_post.find({}).exec();
      const user=req.user;
    const color=['background-color:#ff9999', 'background-color:#1aa3ff','background-color:#E5CA25']
      if(user)
      { var user_id=user._id;
      const b= await User.findById(user_id).populate('content');
       res.render('home/home_cse',{cc:arr,blog:b,blog_all:blog_all});}
       else{
           const c="und";
        res.render('home/home_cse',{cc:arr,blog_all:blog_all,blog:c});
       }

});
route.get('/mechanical_engineering',(req,res)=>
{
    res.render('home/home_me');
});
route.get('/civil_engineering',(req,res)=>
{
    res.render('home/home_ce');
});
route.get('/information_technology',(req,res)=>
{
    res.render('home/home_it');
});
route.get('/chemical_engineering',(req,res)=>
{
    res.render('home/home_che');
});

module.exports = route;