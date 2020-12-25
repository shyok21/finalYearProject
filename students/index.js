const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const util = require('util');
const mysql = require('mysql');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const con = mysql.createConnection({
    host: "sql12.freemysqlhosting.net",
    user: "sql12383722",
    password: "KB3LCenv9V",
    database: "sql12383722"
});
console.log('Connection Established');
app.use(express.static(__dirname + '/public'));
var htmlFile = fs.readFileSync("./index.html", "utf-8");
var htmlFileSend = htmlFile.replace("{%Login Error%}", "");
con.connect(function(err) {
    if (!(err))
        console.log("Connected to Database");
    app.get("/", (req, res) => {
        res.send(htmlFileSend);
    });
    app.post("/login", urlencodedParser, (req, res) => {
        console.log(req.body);
        var isEmpty = 0;
        if (req.body.username == '' || req.body.password == '') {
            var htmlNewFile = htmlFile.replace("{%Login Error%}", "&#9888; Username & Password Can't be Empty!");
            var htmlNewFile = htmlNewFile.replace("{%error-type%}", "login-invalid");
            isEmpty = 1;
            res.send(htmlNewFile);
        }
        if (isEmpty == 0) {
            var log = req.body.logintype;
            var usr = req.body.username;
            var psw = req.body.password;
            var qry = util.format("select* from login where email='%s' and password='%s' and type='%s'", usr, psw, log);
            con.query(qry, (err, result, fields) => {
                if (err) throw err;
                if (result.length == 0) {
                    var htmlNewFile = htmlFile.replace("{%Login Error%}", "&#9746; Invalid Username or Password!");
                    var htmlNewFile = htmlNewFile.replace("{%error-type%}", "login-cross");
                    res.send(htmlNewFile);
                } else
                    res.send(result);
            });

        }

    });
    var port = 8000;
    app.listen(port, () => {
        console.log("Server Created!");
        console.log("https://localhost:" + port + "/");
    });
});