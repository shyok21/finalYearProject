const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));
app.set('view engine', 'ejs');

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
const { PORT, ROOT_URL } = require('./config');
app.listen(PORT, () => {
    console.log("Server Created!");
    console.log(ROOT_URL);
});
