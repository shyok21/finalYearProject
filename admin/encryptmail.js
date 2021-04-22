const express = require('express');
const app = express();
const bodyParser = require('body-parser');

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
    const text = decrypt(x);
    res.send(text);
});
const port = 9000;
app.listen(port, () => {
    console.log("Server Created!");
    console.log("http://localhost:" + port + "/");
});
// const text = decrypt(hash);