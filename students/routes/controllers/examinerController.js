const fs = require('fs');
const con = require('./../../db.js');
var randomstring = require("randomstring");
const { decrypt } = require('./../../services/emailEncrypt');

const examAccepted = (req,res) => {
    const x = {
        'iv':req.query.iv,
        'content':req.query.content
    }
    console.log(x);
    var text = decrypt(x);
    //emailChecker = text.split(" ")[0];
    //passChecker = text.split(" ")[1];
    var html = fs.readFileSync('views/mailService/validate.html','utf-8');
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
    var html = fs.readFileSync('views/mailService/validate.html','utf-8');
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
                if(err)
                {
                    res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                    return
                }
                res.render('notification', {message : 'Successfully accepted!', status: 'success'});
            });
        }
        else{
            var qry = `update External set phase = -1 where email = '${emailChecker}'`;
            con.query(qry,(err,result,fields)=>{
                if(err)
                {
                    res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                    return
                }
                res.render('notification', {message : 'Successfully rejected!', status: 'success'});
            });
        }
    }
    else{
        res.render('notification', {message : 'Invalid credentials!', status: 'success'});
    }
}

module.exports = {
    examAccepted,
    examRejected,
    examCheck
}