const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Database setup
require('./db');

// Routes setup
app.use('/', require('./routes/index.js'));

// Server setup
var port = 8000;
app.listen(port, () => {
    console.log("Server Created!");
    console.log("http://localhost:" + port + "/");
});