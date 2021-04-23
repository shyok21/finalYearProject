const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
var emailChecker;
var passChecker;
var randomstring = require("randomstring");
const mysql = require('mysql');
const fs = require('fs');
const nodemailer = require('nodemailer');
var htmlFile = fs.readFileSync('main.html','utf-8');
const { encrypt, decrypt } = require('./crypto');
app.get('/',(req,res)=>{
    var email = 'shyokmutsuddi21@gmail.com';
    var pass = randomstring.generate(10);
    var url = `${email} ${pass}`;
    const hash = encrypt(url);
    htmlFile = htmlFile.replace('{%query%}',`iv=${hash.iv}&content=${hash.content}`);
    htmlFile = htmlFile.replace('{%query%}',`iv=${hash.iv}&content=${hash.content}`);
    htmlFile = htmlFile.replace('{%username%}',email);
    htmlFile = htmlFile.replace('{%password%}',pass);
    res.send(htmlFile);
});
app.get('/examAccepted',(req,res)=>{
    const x = {
        'iv':req.query.iv,
        'content':req.query.content
    }
    var text = decrypt(x);
    emailChecker = text.split(" ")[0];
    passChecker = text.split(" ")[1];
    var html = `
    	<form action='/examCheck' method="POST">
    	<input type="hidden" value="AC" name="type">
    	<input type="text" name="email">
    	<input type="password" name="pass">
    	<input type="submit">
    	</form>
    `;
    res.send(html);
});
app.post('/examCheck',urlencodedParser,(req,res)=>{
	if(req.body.)
	res.send(x);
});
const port = 9000;
app.listen(port, () => {
    console.log("Server Created!");
    console.log("http://localhost:" + port + "/");
});
// const text = decrypt(hash);
