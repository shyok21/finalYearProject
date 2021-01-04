const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
var m_pass, c_pass, m_cap, m_email;
var verify_code;
var captcha;
var newAccFile = fs.readFileSync("views/newAccount.html", "utf-8");

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

}

// Handles the event when student submits the verification code
const verify = (req, res) => {
    console.log(req.body.ver_code);
    console.log(verify_code);
    if (verify_code === req.body.ver_code) {
        var qrys = "select count(*) as count from login where type='STUD';";
        con.query(qrys, (err, result, field) => {
            var count = result[0].count + 2;
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
}

module.exports = {
    registerPage,
    validate,
    verify
}