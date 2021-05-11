const fs = require('fs');
const util = require('util');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
var nodemailer = require('nodemailer');
var location = require('location-href');
const url = require('url');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const { encrypt } = require('./services/encrypt')
const cron = require('node-cron');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

const con = mysql.createConnection({
    host: "fypdatabase.c3lhoz340eat.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "A987yuBU",
	database: "phd_management"
});

var port = 8040;
var transporter = nodemailer.createTransport({
    service: 'gmail',
    //port: 587,
    //secure: false,
    //requireTLS: true,
    auth: {
        user: 'checacc99@gmail.com',
        pass: 'checkingaccount'
    }
});
var mailOptions = {
    from: 'checacc99@gmail.com',
    to: 'roopkathasamanta6@gmail.com', 
    subject: 'Report Submission Reminder',
    html: 'hello'
};

con.connect(function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Connected to Database");
    cron.schedule('* * * */6 *', () => {
        //function to send mail to student
        var query = "Select * from six_monthly_report;";
        con.query(query, (err, result, fields) => {
            if (err) {
                console.log(err);
                return;
            }
            for(var student=0; student<result.length; student++) {
                if(result[student].date_time) {
                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                }
            }
        });
    });

    app.listen(port, () => {
        console.log("Server Created!");
        console.log("http://localhost:" + port + "/");
    });
});