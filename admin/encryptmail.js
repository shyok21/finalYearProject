const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fs = require('fs');
const nodemailer = require('nodemailer');
var htmlFile = fs.readFileSync('main.html','utf-8');
const { encrypt, decrypt } = require('./crypto');
var url = 'name=shyokmutsuddi21@gmail.com&password=12345';
const hash = encrypt(url);
console.log(hash);
htmlFile = htmlFile.replace('{%query%}',hash);
htmlFile = htmlFile.replace('{%query%}',hash);
app.get('/',(req,res)=>{
    res.send(htmlFile);
});
const port = 9000;
app.listen(port, () => {
    console.log("Server Created!");
    console.log("http://localhost:" + port + "/");
});
const text = decrypt(hash);
console.log(text);