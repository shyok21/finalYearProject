const fs = require('fs');
const con = require('./../../db.js');
var htmlFile = fs.readFileSync("views/applicationForm.html", "utf-8");

const applicationFormPage = (req, res) => {
    res.send(htmlFile);
}

const applicationFormSubmit = (req, res) => { 
    // Insert DB code here
    res.send("Waiting for approval!");
}

module.exports = {
    applicationFormPage,
    applicationFormSubmit
}
