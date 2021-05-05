const fs = require('fs');
const con = require('./../../db.js');
var randomstring = require("randomstring");
const nodemailer = require("nodemailer");
// const { encrypt, decrypt } = require('crypto');
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = crypto.randomBytes(16);

const encrypt = (text) => {

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};
const addExaminerVC = (req,res) => {
    con.query(`select * from student s join department d on s.dept_id = d.dept_id join faculty f on f.fac_id = d.fac_id where examiner_phase = '2';`,(err,results,field) => {
        if(err) {
            res.send('error' + err);
        }
        
        var htmlFile = fs.readFileSync('views/addExamVC.html','utf-8');
        var formText = "";
        console.log(results);
        for(var i=0;i<results.length;i++)
        {
            formText += `<form class="list" method='POST' action='/selectExams'>`;
            formText += `<img src="student_photo/${results[i].photo_filename}" alt="Couldn't Load Image" >`;
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

const selectExams = (req, res) => {
    var stud_id = Object.keys(req.body)[0];
    var qry = `select * from External where Student_ID = '${stud_id}' order by Type;`;
    var htmlFile = fs.readFileSync('views/selectExam.html','utf-8');
    con.query(qry,(err,result,fields)=>{
        for(var i=1;i<9;i++)
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

const examSelected = (req, res) => {
    var today_date = new Date();
    var qry = `update student set examiner_phase='3' where stud_id='${req.body.stud_id}';`;
    console.log(req.body.stud_id);
    con.query(qry,(err,results,fields)=>{
            
        var email1 = req.body.instate;
        var email2 = req.body.outstate;
        var email3;
        if(req.body.viva == 'null')
            email3 = req.body.Email;
        else
            email3 = req.body.viva;
        var email = [email1,email2,email3];
        for(var i=0;i<email.length;i++)	{
            
            var htmlFile = fs.readFileSync('mailService/main.html','utf-8');
            
            var pass = randomstring.generate(10);
            var url = `${email[i]} ${pass}`;
            const hash = encrypt(url);
            htmlFile = htmlFile.replace('{%query%}',`iv=${hash.iv}&content=${hash.content}`);
            htmlFile = htmlFile.replace('{%query%}',`iv=${hash.iv}&content=${hash.content}`);
            htmlFile = htmlFile.replace('{%username%}',email[i]);
            htmlFile = htmlFile.replace('{%password%}',pass);
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
                to: 'ju.phdms2021@gmail.com', 
                subject: 'Invitation for Examiner',
                html: htmlFile
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
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
            res.render('notification', {message : 'Emails sent successfully', status: 'success', backLink : "/vcPage", backText: "Back to VC portal"});
        });
    });
}

const examAccepted = (req,res) => {
    const x = {
        'iv':req.query.iv,
        'content':req.query.content
    }
    console.log(x);
    var text = decrypt(x);
    //emailChecker = text.split(" ")[0];
    //passChecker = text.split(" ")[1];
    var html = fs.readFileSync('mailService/validate.html','utf-8');
    html = html.replace("{%iv%}",req.query.iv);
    html = html.replace("{%content%}",req.query.content);
    html = html.replace('{%type%}','AC');
    res.send(html);
}

const examRejected = (req,res) => {
    const x = {
        'iv':req.query.iv,
        'content':req.query.content
    }
    var text = decrypt(x);
    //emailChecker = text.split(" ")[0];
    //passChecker = text.split(" ")[1];
    var html = fs.readFileSync('mailService/validate.html','utf-8');
    html = html.replace("{%iv%}",req.query.iv);
    html = html.replace("{%content%}",req.query.content);
    html = html.replace('{%type%}','WA');
    res.send(html);
}

const examCheck = (req,res) => {
    const x = {
        'iv':req.body.iv,
        'content':req.body.content
    }
    console.log(x);
    var text = decrypt(x);
    var emailChecker = text.split(" ")[0];
    var passChecker = text.split(" ")[1];
    if(req.body.user == emailChecker && req.body.pass == passChecker)
    {
        if(req.body.type == 'AC'){
            var qry = `update External set phase = 3 where email = '${emailChecker}'`;
            con.query(qry,(err,result,fields)=>{
                res.render('notification', {message : 'Successfully accepted!', status: 'success'});
            });
        }
        else{
            var qry = `update External set phase = -1 where email = '${emailChecker}'`;
            con.query(qry,(err,result,fields)=>{
                res.render('notification', {message : 'Successfully rejected!', status: 'success'});
            });
        }
    }
    else{
        res.render('notification', {message : 'Invalid credentials!', status: 'success'});
    }
}

module.exports = {
    addExaminerVC,
    selectExams,
    examSelected,
    examAccepted,
    examRejected,
    examCheck
}