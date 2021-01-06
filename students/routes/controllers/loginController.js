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
                    
                    var stud_id = result[0].id;

                    // Storing student ID and email as session objects
                    var sess = req.session;
                    sess.email = usr;
                    sess.userid = stud_id;
                    res.redirect('/studentPage');
                    
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

const logout = (req, res) => {
    const sess = req.session;
    sess.destroy(err => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/');
        }    
    });
}

module.exports = {
    homePage, 
    login,
    logout
}