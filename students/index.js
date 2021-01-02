const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const util = require('util');
const mysql = require('mysql');
var randomstring = require("randomstring");
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const con = mysql.createConnection({
    host: "sql12.freemysqlhosting.net",
    user: "sql12384616",
    password: "yWJQsReUSE",
    database: "sql12384616"
});
console.log('Connection Established');
app.use(express.static(__dirname + '/public'));
var htmlFile = fs.readFileSync("./index.html", "utf-8");
var htmlRegisterFile = fs.readFileSync("./register.html", "utf-8");
var htmlFileSend = htmlFile.replace("{%Login Error%}", "");
con.connect(function(err) {
    if (!(err))
        console.log("Connected to Database");
    app.get("/", (req, res) => {
        res.send(htmlFileSend);
    });
    app.get("/newUser", (req, res) => {
        res.send(htmlRegisterFile);
    });
    var captcha;
    app.get("/newAccount", (req, res) => {
        var htmlFile = fs.readFileSync("./newAccount.html", "utf-8");
        var captchaStr = randomstring.generate(6);
        captcha = captchaStr;
        var newHtmlFile = htmlFile;
        for (var i = 0; i < captchaStr.length; i++) {
            newHtmlFile = newHtmlFile.replace("{%captcha%}", captchaStr[i]);
        }
        // console.log(newHtmlFile);
        res.send(newHtmlFile);
    });
    app.post("/validate", (req, res) => {
        res.send(captcha);
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
                } else {
                    if (log === 'STUD') {
                        var studentFile = fs.readFileSync("./student.html", "utf-8");
                        var stud_id = result[0].id;
                        var qrys = util.format("select name,registration_phase from student where stud_id='%s'", stud_id);
                        con.query(qrys, (err, results, fields) => {
                            try {
                                var studentName = results[0].name;
                                var studentPhase = results[0].registration_phase;
                                var studentMainHtmlFile = htmlNewFile;
                                if (studentPhase == 0) {
                                    var htmlNewFile = studentFile.replace("{%StudentName%}", studentName);
                                    var htmlNewFile = htmlNewFile.replace("{%studentMessage%}", "your Application Gets Rejected.");
                                    for (var i = 0; i < 5; i++)
                                        htmlNewFile = htmlNewFile.replace("{%trackClass%}", "main-track-rejected")
                                    res.send(htmlNewFile);
                                } else {
                                    var htmlNewFile = studentFile.replace("{%StudentName%}", studentName);
                                    var htmlNewFile = htmlNewFile.replace("{%studentMessage%}", "your registration is in Under Process. We will notify you once your Registration gets Complete. You can track your Registration Phase here.");
                                    for (var i = 0; i < 5; i++) {
                                        if (studentPhase > i)
                                            htmlNewFile = htmlNewFile.replace("{%trackClass%}", "main-track-accepted");
                                        else
                                            htmlNewFile = htmlNewFile.replace("{%trackClass%}", "main-track-process");
                                    }
                                    res.send(htmlNewFile);
                                }
                            } catch (e) {
                                var str = "<a href='newUser' target='_blank'>Click here to register.</a>"
                                res.send(str);
                            }
                        });
                    } else if (log === 'SUP') {
                        res.send("Hello Supervisor " + result.name);
                    } else if (log === 'RAC') {
                        res.send("Hello RAC " + result.name);
                    } else if (log === 'DC') {
                        res.send('Doctorate Committie ' + result.name);
                    } else {
                        res.send('Hello PRC ' + result.name);
                    }
                }
            });

        }

    });
    app.post("/register", urlencodedParser, (req, res) => {

        // Insert DB code here

        res.send("Waiting for approval!");
    });
    var port = 8000;
    app.listen(port, () => {
        console.log("Server Created!");
        console.log("https://localhost:" + port + "/");
    });
});