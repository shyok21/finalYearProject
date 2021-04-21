const fs = require('fs');
const nodemailer = require('nodemailer');
var htmlFile = fs.readFileSync('main.html','utf-8');
const { encrypt, decrypt } = require('./crypto');
var url = '?username=shyokmutsuddi21@gmail.com&password=12345';
const hash = encrypt(url);
console.log(hash);
const text = decrypt(hash);
console.log(text);
/*var transporter = nodemailer.createTransport({
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
	to: 'shyokmutsuddi21@gmail.com', 
	subject: 'Invitation for Examiner',
	html: htmlFile
};
transporter.sendMail(mailOptions, function(error, info) {
	if (error) {
		console.log(error);
	} else {
		console.log('Email sent: ' + info.response);
	}
});*/
