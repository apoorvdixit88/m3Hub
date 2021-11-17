if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const helmet = require('helmet');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');

const LocalStrategy = require('passport-local');
const User = require('./db/student');
const mongoSanitize = require('express-mongo-sanitize'); 
const students=require('./routes/students');
const home=require('./routes/home');
const blog=require('./routes/blog');
const MongoDBStore = require("connect-mongo");
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/students';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(mongoSanitize({
    replaceWith: '_'
}))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';



const sessionConfig = {
    store:MongoDBStore.create({
        mongoUrl: dbUrl,
        secret:secret,
        touchAfter: 24 * 60 * 60
    }),
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());
app.use(mongoSanitize());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use('/', students);
app.use('/',home);
app.use('/blog',blog);
app.use(helmet({
    contentSecurityPolicy: false,
  }));
app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Serving on port ${port}')});