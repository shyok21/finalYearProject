const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');
const { encrypt,compare } = require('./../../services/encrypt.js');
var htmlFile = fs.readFileSync("views/index.html", "utf-8");
const randomstring = require("randomstring");
const sendEmail = require('./../../services/sendEmail');
const { MIN_PASSWORD_LENGTH } = require('./../../config');

var activationCode;
// Renders the homepage from where user can log in
const homePage = (req, res) => {
    var htmlFileSend = htmlFile.replace("{%Login Error%}", "");
    res.send(htmlFileSend);
}

// Handles the event when user logs in
const login = (req, res) => {
    console.log(req.body);
    if (req.body.username == '' || req.body.password == '') {
        var htmlNewFile = htmlFile.replace("{%Login Error%}", "&#9888; Username & Password Can't be Empty!");
        var htmlNewFile = htmlNewFile.replace("{%error-type%}", "login-invalid");
        res.send(htmlNewFile);
    } else {
        var log = req.body.logintype;
        var usr = req.body.username;
        var psw = req.body.password;
        var qry = util.format("select * from login where email='%s' and type='%s'", usr, log);
        con.query(qry, (err, result, fields) => {
            if (err) {
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
                    res.redirect('/student');
                } else if (log === 'SUP') {    
                    res.redirect('/supervisor');
                } else if (log === 'VC') {
                    res.redirect('/vc');
                } else if (log === 'DC') {
                    res.redirect('/dc/registrationApproval');
                } else { 
                    res.redirect('/prc/registrationApproval');
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

const forgetPassword = (req,res) => {
    var html = fs.readFileSync('views/reset.html','utf-8');
    res.send(html);
};

const sendActivation = (req,res) => {
    activationCode = randomstring.generate(10);
    console.log(activationCode);
    var email = req.body.recover_email;
    var qry = `select * from login where email = '${email}';`;
    con.query(qry,(err,result,f) => {
        if(result.length == 0)
        {
            res.render('notification', {message : 'Email Does Not Exist. Register Yourself', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        var htmlString = `<p>Hello ${email}, your recovery code is <b>${activationCode}</b>`;
        const mailData = {
            to: email, 
            subject: 'Reset Password!',
            html: htmlString
        };    
        sendEmail(mailData, function (err, info) {
            if (err) { 
                console.log('Sending to ' + email + ' failed: ' + err);
            } else { 
                console.log('Sent to ' + email);
                var htmlFile = fs.readFileSync('views/activation.html','utf-8');
                htmlFile = htmlFile.replace("{%email%}",email);
                htmlFile = htmlFile.replace("{%email%}",email);
                res.send(htmlFile);
            }
        });
    });
    
};

const checkActivation = (req,res) => {
    if(req.body.recover_code === activationCode){
        var htmlFile = fs.readFileSync('views/resetPassword.html','utf-8');
        htmlFile = htmlFile.replace("{%email%}",req.body.recover_email);
        htmlFile = htmlFile.replace("{%error%}","");
        res.send(htmlFile);
    }
    else{
        res.render('notification', {message : 'Recovery Code Wrong. Try Again!', status: 'error', backLink : "/", backText: "Back to Home page"});
        return;
    }
};

const checkPassword = (req,res) => {
    if(req.body.recover_password.length < MIN_PASSWORD_LENGTH) {
        var htmlFile = fs.readFileSync('views/resetPassword.html','utf-8');
        htmlFile = htmlFile.replace("{%email%}",req.body.recover_email);
        htmlFile = htmlFile.replace("{%error%}", `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
        res.send(htmlFile);
        return;
    }
    if(req.body.recover_password === req.body.confirm_password){
        //res.send(encrypt(req.body.recover_password));
        var qry = `update login set password = '${encrypt(req.body.recover_password)}' where email = '${req.body.recover_email}';`;
        con.query(qry,(err,result,f)=> {
            if(err){
                res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                return
            }
            res.render('notification', {message : 'Successfully Changed Password', status: 'success', backLink : "/", backText: "Back to Home page"});
            return
        });
    }
    else{
        var htmlFile = fs.readFileSync('views/resetPassword.html','utf-8');
        htmlFile = htmlFile.replace("{%email%}",req.body.recover_email);
        htmlFile = htmlFile.replace("{%error%}","Password mismatch");
        res.send(htmlFile);
        return;
    }
};

const changePassword = (req,res) => {
    if(req.session.userid){
        var htmlFile = fs.readFileSync('views/changePassword.html','utf-8');
        htmlFile = htmlFile.replace("{%error%}","");
        res.send(htmlFile);
    }
    else{
        res.render('notification', {message : 'Unauthorised access', status: 'error', backLink : "/", backText: "Back to Home page"});
        return;
    }
};

const changePasswordSubmit = (req,res) => {
    if(req.session.userid) {
        var qry = `select * from login where email = '${req.session.email}';`;
        con.query(qry,(err,results,f)=> {
            if(err){
                res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                return
            }
            var password = req.body.previous_password;
            if(req.body.new_password < MIN_PASSWORD_LENGTH) {
                var htmlFile = fs.readFileSync('views/changePassword.html','utf-8');
                htmlFile = htmlFile.replace("{%error%}",`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
                res.send(htmlFile);
                return;
            }
            if(!compare(password, results[0].password)) {
                var htmlFile = fs.readFileSync('views/changePassword.html','utf-8');
                htmlFile = htmlFile.replace("{%error%}","Wrong password!");
                res.send(htmlFile);
                return;
            }
            if(req.body.new_password !== req.body.confirm_password) {
                var htmlFile = fs.readFileSync('views/changePassword.html','utf-8');
                htmlFile = htmlFile.replace("{%error%}","Password mismatch");
                res.send(htmlFile);
                return;
            }
            var qry2 = `update login set password = '${encrypt(req.body.new_password)}' where email = '${req.session.email}';`;
            con.query(qry2,(err,results2,f)=> {
                if(err){
                    res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                    return
                }
                res.render('notification', {message : 'Successfully Changed Password', status: 'success', backLink : "/", backText: "Back to Home page"});
                return
            });
            
        });    
    }
    else {
        res.render('notification', {message : 'Unauthorised access', status: 'error', backLink : "/", backText: "Back to Home page"});
        return
    }
};

module.exports = {
    homePage,
    login,
    logout,
    forgetPassword,
    sendActivation,
    checkActivation,
    checkPassword,
    changePassword,
    changePasswordSubmit
}