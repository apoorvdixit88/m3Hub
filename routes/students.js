const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../db/student');
const route = require('./home');
router.use(express.urlencoded({ extended: true }));
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', catchAsync(async (req, res,next) => {
    try {
    
        const {  username,branch,rollNo,Email,password } = req.body;
        const user = new User({username ,branch,rollNo,Email,content:[]});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));



router.post('/', passport.authenticate('local', { failureFlash: true, failureRedirect: '/' }), catchAsync(async(req, res) => {
   try{ req.flash('success', 'welcome back!');
    
    var id=req.user._id;
    var branch=await User.findById(id).exec();
    var sub=branch.branch;
    var redirectUrl;
    if(sub=='cse'){
    redirectUrl = req.session.returnTo || '/cse';}
    if(sub=='che'){
        redirectUrl = req.session.returnTo || '/chemical_engineering';}
        if(sub=='it'){
            redirectUrl = req.session.returnTo || '/information_technology';}
            if(sub=='me'){
                redirectUrl = req.session.returnTo || '/mechanical_engineering';}
                if(sub=='ce'){
                    redirectUrl = req.session.returnTo || '/civil_engineering';}
    delete req.session.returnTo;
    res.redirect(redirectUrl);}
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/');
    }
}))

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
})

module.exports = router;