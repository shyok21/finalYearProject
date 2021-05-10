const fs = require('fs');
const con = require('./../../db.js');
var randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const { encrypt } = require('./../../services/emailEncrypt');
const sendEmail = require('./../../services/sendEmail');

const vcPage = (req,res) => {
    con.query(`select * from student s join department d on s.dept_id = d.dept_id join faculty f on f.fac_id = d.fac_id where examiner_phase = '2';`,(err,results,field) => {
        if(err) {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to student portal"});
            return
        }
        
        var htmlFile = fs.readFileSync('views/VC/addExamVC.html','utf-8');
        var formText = "";
        console.log(results);
        for(var i=0;i<results.length;i++)
        {
            formText += `<form class="list" method='POST' action='/vc/selectExaminer'>`;
            formText += `<img src="/student_photo/${results[i].photo_filename}" alt="Couldn't Load Image" >`;
            formText += `<div class="g1">${results[i].name}</div>`;
            formText += `<div class="g2">${results[i].dept_name}</div>`;
            formText += `<div class="g3">${results[i].fac_name}</div>`;
            formText += `<input type="Submit" name="${results[i].stud_id}" value="Select Examiners">`;
            formText += `</form>`;
        }
        htmlFile = htmlFile.replace("{%forms%}",formText);
        res.send(htmlFile);
    });
}

const vcSelectExaminer = (req, res) => {
    var stud_id = Object.keys(req.body)[0];
    var qry = `select * from External where Student_ID = '${stud_id}' order by Type;`;
    var htmlFile = fs.readFileSync('views/VC/selectExam.html','utf-8');
    con.query(qry,(err,result,fields)=>{
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        for(var i=1;i<12;i++)
        {
            var r = result[i-1];
            htmlFile = htmlFile.replace(`{%name${i}%}`,r.Name);
            htmlFile = htmlFile.replace(`{%designation${i}%}`,r.Designation);
            htmlFile = htmlFile.replace(`{%email${i}%}`,r.Email);
            htmlFile = htmlFile.replace(`{%email${i}%}`,r.Email);
            htmlFile = htmlFile.replace(`{%state${i}%}`,r.State);
        }
        htmlFile = htmlFile.replace(`{%stud_id%}`, stud_id);
        res.send(htmlFile);
    });
}

const vcSelectExaminerSubmit = (req, res) => {
    var today_date = new Date();
    var qry = `update student set examiner_phase='3' where stud_id='${req.body.stud_id}';`;
    console.log(req.body.stud_id);
    con.query(qry,(err,results,fields)=>{
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
            
        var email1 = req.body.instate;
        var email2 = req.body.outstate;
        var email3;
        if(req.body.viva == 'null')
            email3 = req.body.Email;
        else
            email3 = req.body.viva;
        var email = [email1,email2,email3];
        for(var i=0;i<email.length;i++)	{
            
            var htmlFile = fs.readFileSync('views/mailService/main.html','utf-8');
            
            var pass = randomstring.generate(10);
            var url = `${email[i]} ${pass}`;
            const hash = encrypt(url);
            htmlFile = htmlFile.replace('{%query%}',`iv=${hash.iv}&content=${hash.content}`);
            htmlFile = htmlFile.replace('{%query%}',`iv=${hash.iv}&content=${hash.content}`);
            htmlFile = htmlFile.replace('{%username%}',email[i]);
            htmlFile = htmlFile.replace('{%password%}',pass);
            
            var mailData = {
                to: email[i], 
                subject: 'Invitation for Examiner',
                html: htmlFile
            };
            
            sendEmail(mailData, function(error, info) {
                if (error) {
                    console.log(error);
                    res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                    return;
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            
        }
        var emails = `('${email1}','${email2}','${email3}')`;
        var today_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var qry2 = `Update External set phase = 1, last_mail_sent_date = '${today_date}' where email in ${emails} and Student_ID='${req.body.stud_id}';`;
        console.log(qry2);
        con.query(qry2,(err,ress,f)=>{
            if(err)
            {
                res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                return
            }
            res.render('notification', {message : 'Emails sent successfully', status: 'success', backLink : "/vc", backText: "Back to VC portal"});
        });
    });
}


module.exports = {
    vcPage,
    vcSelectExaminer,
    vcSelectExaminerSubmit
}