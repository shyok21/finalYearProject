const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');
const { compare } = require('./../../services/encrypt.js');
const createPDF = require('./../../services/createPDF');
const { url } = require('inspector');
const { setServers } = require('dns');
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
        var qry = util.format("select * from login where email='%s' and type='%s'", usr, log);
        con.query(qry, (err, result, fields) => {
            if (err) {
                //throw err;
                res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to student portal"});
                return
            }
            if (result.length == 0 || !compare(psw, result[0].password)) {
                var htmlNewFile = htmlFile.replace("{%Login Error%}", "&#9746; Invalid Username or Password!");
                var htmlNewFile = htmlNewFile.replace("{%error-type%}", "login-cross");
                res.send(htmlNewFile);
            } else {
                /* Setting session variables */
                var sess = req.session;
                sess.email = usr;
                sess.userid = result[0].id;
                sess.special = result[0].special_user;
                sess.userType = result[0].type;
                if(sess.special == 'Y') {
                    sess.userType = 'hod';
                }
                console.log("User type: " + sess.userType);
                if (log === 'STUD') {
                    res.redirect('/studentPage');
                } else if (log === 'SUP') {    
                    res.redirect('/supervisorPage');
                } else if (log === 'VC') {
                    res.redirect('/vcPage');
                } else if (log === 'DC') {
                    res.redirect('/dcRegistrationApproval');
                } else { 
                    res.redirect('/prcRegistrationApproval');
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
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to student portal"});
            return
        } else {
            res.redirect('/');
        }
    });
}

module.exports = {
    homePage,
    login,
    logout
}