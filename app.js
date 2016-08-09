var express = require('express');
var app = express();
var passport = require('passport');
var mongoose = require('mongoose');
var morgan = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongostore')(session);

require('./passport.js');
console.log("mongoose connect next")
mongoose.connect(process.env.MONGOLAB_URI);
console.log("Mongoose connect prev")
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
console.log("session")
app.use(session({
    cookie: {
        maxAge: 691200000
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true,
    auto_reconnect:true
}));
console.log("session")
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('./public'));
//app.set('view engine', 'ejs');
require('./routes.js')(app, passport);
require('./passport.js')(passport);


var server = app.listen(process.env.PORT);
console.log("Server running on port: " + (process.env.PORT || 8888));
//Seeing if Git works
