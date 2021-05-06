const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));
app.set('view engine', 'ejs');
const cron = require('node-cron');
const con = require('./db');

// Session management setup
app.use(
    session({
    secret: 'thisisasecret',
    saveUninitialized: false,
    resave: false
    })
);

// Database setup
require('./db');

//Background Job Setup
require('./backgroundJobs')();

// Routes setup
app.use('/', require('./routes/index.js'));

// Server setup
var port = 8000;
app.listen(port, () => {
    console.log("Server Created!");
    console.log("http://localhost:" + port + "/");
});


//6 month report report to student
//1 month examiner checking
//3 years remainder