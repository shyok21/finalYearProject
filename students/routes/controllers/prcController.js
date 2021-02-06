const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');

const prcController = (req, res) => {
    var htmlFile = fs.readFileSync("views/supervisor.html", "utf-8");
    var sess = req.session;
    htmlFile = htmlFile.replace("{%name%}", sess.userid);
    res.send(htmlFile);
};
module.exports = {
    prcController
}