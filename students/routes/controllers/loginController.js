const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');
var htmlFile = fs.readFileSync("views/index.html", "utf-8");

// Renders the homepage from where user can log in
const homePage = (req, res) => {
    var htmlFileSend = htmlFile.replace("{%Login Error%}", "");
    res.send(htmlFileSend);
}

// Handles the event when user logs in
const login = (req, res) => {
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
                    var studentFile = fs.readFileSync("views/student.html", "utf-8");
                    var stud_id = result[0].id;
                    var qrys = util.format("select name,registration_phase from student where stud_id='%s'", stud_id);
                    con.query(qrys, (err, results, fields) => {
                        try {
                            var studentName = results[0].name;
                            var studentPhase = results[0].registration_phase;
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
                            var str = "<a href='applicationFormPage' target='_blank'>Click here to register.</a>"
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

}

module.exports = {
    homePage, 
    login
}