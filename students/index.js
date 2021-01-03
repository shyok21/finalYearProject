const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const util = require('util');
const mysql = require('mysql');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
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
    var newAccFile = fs.readFileSync("./newAccount.html", "utf-8");
    app.get("/newAccount", (req, res) => {
        var captchaStr = randomstring.generate(6);
        captcha = captchaStr;

        var newHtmlFile = newAccFile.replace("{%error%}", "");
        for (var i = 0; i < captchaStr.length; i++) {
            newHtmlFile = newHtmlFile.replace("{%captcha%}", captchaStr[i]);
        }

        res.send(newHtmlFile);
    });
    var m_pass, c_pass, m_cap, m_email;
    var verify_code;
    app.post("/validate", urlencodedParser, (req, res) => {
        // console.log(req.body);
        console.log(captcha);
        m_pass = req.body.set_pass;
        c_pass = req.body.conf_pass;
        m_cap = req.body.captcha;
        m_email = req.body.email_id;
        var qry = "select count(*) as count from login where email='" + m_email + "';";
        con.query(qry, (err, results, fields) => {
            console.log(results[0].count);
            if (results[0].count == 0) {
                if (m_pass != c_pass) {
                    var sendAccFile = newAccFile.replace("{%error%}", "&#9746; Password Mismatched");
                    captcha = randomstring.generate(6);
                    for (var i = 0; i < captcha.length; i++) {
                        sendAccFile = sendAccFile.replace("{%captcha%}", captcha[i]);
                    }
                    res.send(sendAccFile);
                } else if (m_cap != captcha) {
                    var sendAccFile = newAccFile.replace("{%error%}", "&#9746; Captcha Verification Failed");
                    captcha = randomstring.generate(6);
                    for (var i = 0; i < captcha.length; i++) {
                        sendAccFile = sendAccFile.replace("{%captcha%}", captcha[i]);
                    }
                    res.send(sendAccFile);
                } else {
                    verify_code = randomstring.generate(8);
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: 'notifyserver123@gmail.com',
                            pass: 'categorized123'
                        }
                    });
                    var mailOptions = {
                        from: 'notifyserver123@gmail.com',
                        to: m_email,
                        subject: 'Verification Code: Admins Of Jadavpur University',
                        html: '<p>Hello,</p><p>Your Verification Code is:<h3>' + verify_code + '</h3></p><p>Please Dont send this to anyone</p>'
                    };

                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    res.send("<form method='post' action='/verify' style='background-color:#fefefe;'><h2 style='color:#5375e2;margin:10px;'>A verification code has been send to your Email Id.</h2><label for='ver_code' style='color:#7791a1;font-size:1.2em;margin:5px;'>Verification Code:</label><input type='text' name='ver_code' style='width:140px;height:40px;background-color:#dcdcdc;font-size:1.5em;border-style:none;border-radius:8px;margin:5px'><input type='submit' style='width:80px;height:35px;background-color:#f3aa92;border-style:none;border-radius:8px;margin:5px;' value='Verify'></form>");
                }
            } else {
                res.send("<h1>Email Id is Already Registered.</h1>")
            }
        });

    });
    app.post("/verify", urlencodedParser, (req, res) => {
        console.log(req.body.ver_code);
        console.log(verify_code);
        if (verify_code === req.body.ver_code) {
            var qrys = "select count(*) as count from login where type='STUD';";
            con.query(qrys, (err, result, field) => {
                var count = result[0].count + 1;
                var s_id = "stud" + count;
                // var qry = "insert into login values(s_id + , m_email, m_pass, 'stud')";
                var qry = util.format("insert into login values('%s','%s','%s','stud');", s_id, m_email, m_pass);
                //console.log(qry);
                con.query(qry, (err, results, fields) => {
                    console.log("Student Added to Login Database");
                    console.log(results);
                    res.send("<h1>Thank You! Your Account has Been Created!</h1>");
                    con.query("select* from login where type='stud'", (err, res, fil) => {
                        console.log(res);
                    });
                });
            });

        } else {
            res.send("<h1>Sorry, Your Account Could Not been Verified</h1>");
        }
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