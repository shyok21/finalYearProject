const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');
const { encrypt } = require('./../../services/encrypt.js');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
var m_pass, c_pass, m_cap, m_email;
var verify_code;
var captcha;
var newAccFile = fs.readFileSync("views/newAccount.html", "utf-8");
const sendEmail = require('./../../services/sendEmail');

// Renders the register page where new student registers
const registerPage = (req, res) => {
    var captchaStr = randomstring.generate(6);
    captcha = captchaStr;

    var newHtmlFile = newAccFile.replace("{%error%}", "");
    for (var i = 0; i < captchaStr.length; i++) {
        newHtmlFile = newHtmlFile.replace("{%captcha%}", captchaStr[i]);
    }

    res.send(newHtmlFile);
}

// Handles the event when the student submits the registration form
const validate = (req, res) => {
    console.log(captcha);
    m_pass = req.body.set_pass;
    c_pass = req.body.conf_pass;
    m_cap = req.body.captcha;
    m_email = req.body.email_id;
    var qry = "select count(*) as count from login where email='" + m_email + "';";
    con.query(qry, (err, results, fields) => {
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
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
                console.log('Verification code: ' + verify_code);

                mailData = {
                    to: m_email, 
                    subject: 'Verification Code: Admins Of Jadavpur University',
                    html: '<p>Hello,</p><p>Your Verification Code is:<h3>' + verify_code + '</h3></p><p>Please Dont send this to anyone</p>'
                }

                sendEmail(mailData, function(error, info) {
                    if (error) {
                        console.log(error);
                        res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                        return
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.send("<form method='post' action='/verify' style='background-color:#fefefe;'><h2 style='color:#5375e2;margin:10px;'>A verification code has been send to your Email Id.</h2><label for='ver_code' style='color:#7791a1;font-size:1.2em;margin:5px;'>Verification Code:</label><input type='text' name='ver_code' style='width:140px;height:40px;background-color:#dcdcdc;font-size:1.5em;border-style:none;border-radius:8px;margin:5px'><input type='submit' style='width:80px;height:35px;background-color:#f3aa92;border-style:none;border-radius:8px;margin:5px;' value='Verify'></form>");
                    }
                });
                
            }
        } else {
            res.render('notification', {message : 'Email ID is already registered', status: 'error', backLink : "/", backText: "Back to Home page"});
        }
    });

}
const format_str = (x) => {
    if (x < 10)
        return "00000" + x;
    else if (x >= 10 && x < 100)
        return "0000" + x;
    else if (x >= 100 && x < 1000)
        return "000" + x;
    else if (x >= 1000 && x < 10000)
        return "00" + x;
    else if (x >= 10000 && x < 100000)
        return "0" + x;
    else
        return "" + x;
}
// Handles the event when student submits the verification code
const verify = (req, res) => {
    console.log(req.body.ver_code);
    console.log(verify_code);
    if (verify_code === req.body.ver_code) {
        var qrys = "select id from login where type='STUD' order by id desc;";
        con.query(qrys, (err, result, field) => {
            if(err)
            {
                res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                return
            }
            var s_id = "";
            try {
                var id = result[0].id;
                var last_cnt = id.replace("Stud", "");
                var int_last_cnt = parseInt(last_cnt);
                s_id = "Stud" + format_str(int_last_cnt + 1);
            } catch (e) {
                s_id = "Stud000000";
            }
            const enc_pass = encrypt(m_pass);
            console.log("encrypted password" + enc_pass);
            // var qry = "insert into login values(s_id + , m_email, m_pass, 'stud')";
            var qry = util.format("insert into login values('%s','%s','%s','stud','N');", s_id, m_email, enc_pass);
            //console.log(qry);
            con.query(qry, (err, results, fields) => {
                if(err)
                {
                    res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                    return
                }
                console.log("Student Added to Login Database");
                console.log(results);
                res.render('notification', {message : 'Thank you! Your account has been created!', status: 'success', backLink : "/", backText: "Back to home page"});
                con.query("select* from login where type='stud'", (err, res, fil) => {
                    console.log(res);
                });
            });
        });

    } else {
        res.render('notification', {message : 'Sorry! Your account could not be verified!', status: 'error', backLink : "/", backText: "Back to home page"});
    }
}

module.exports = {
    registerPage,
    validate,
    verify
}