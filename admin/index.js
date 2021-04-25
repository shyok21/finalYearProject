const fs = require('fs');
const util = require('util');
const path = require('path');
const express = require('express');
var randomstring = require("randomstring");
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
var nodemailer = require('nodemailer');
var location = require('location-href');
const url = require('url');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
//const { encrypt } = require('./services/encrypt')

const { encrypt, decrypt } = require('./crypto');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

const con = mysql.createConnection({
    host: "sql6.freesqldatabase.com",
    user: "sql6407671",
    password: "SfxDSFUXhK",
    database: "sql6407671",
    multipleStatements: true
});

var port = 8020;

var htmlFile = fs.readFileSync("views/index.html", "utf-8");
var html = fs.readFileSync("views/studentList.html", "utf-8");
var htmlStudentDetails = fs.readFileSync("views/studentDetails.html", "utf-8");
var addAccountFile = fs.readFileSync("views/admin_add.html", "utf-8");
var supFile = fs.readFileSync("views/add_supervisor.html", "utf-8");
var prcFile = fs.readFileSync("views/add_prc.html", "utf-8");
var dcFile = fs.readFileSync("views/add_dc.html", "utf-8");
var successFile = fs.readFileSync("views/successPage.html", "utf-8");

con.connect(function(err) {
    if (err)
        throw err;
    console.log("Connected to Database");
    app.post("/studentList", urlencodedParser, function(req, res) {
        var qry = "SELECT * FROM student WHERE registration_phase='4'";
        con.query(qry, function(err, result, fields) {
            if (err)
                throw err;
            var sendRes = "";
            for (var i = 0; i < result.length; i++) {
                sendRes += "<tr>";
                sendRes += "<td>" + (result[i].stud_id).toUpperCase() + "</td>";
                sendRes += "<td>" + result[i].name.toUpperCase() + "</td>";
                //sendRes += "<td>" + result[i].email + "</td>";
                sendRes += "<td>" + result[i].perm_address.toUpperCase() + "</td>";
                sendRes += "<td>" + result[i].thesis_title + "</td>";
                sendRes += "<td><a href='studentDetails.html?stud_id=" + result[i].stud_id + "'>View Details</a></td>";
                sendRes += "</tr>";
            }
            var newHtml = html.replace("{%sqlContent%}", sendRes);
            res.send(newHtml);
        });
    });

    app.get("/studentDetails.html", function(req, res) {
        var id = req.query.stud_id;
        console.log(id);
        var qry = `SELECT * FROM student WHERE stud_id="${id}"`;
        con.query(qry, function(err, result, fields) {
            if (err)
                throw err;
            var sendRes = "";
            for (var i = 0; i < result.length; i++) {
                sendRes += "<br>";
                sendRes += "Student ID: " + (result[i].stud_id).toUpperCase();
                sendRes += "<br>Name: " + result[i].name.toUpperCase();
                sendRes += "<br>Sex: " + result[i].sex.toUpperCase();
                sendRes += "<br>Category: " + result[i].category;
                sendRes += "<br>DOB: " + result[i].dob;
                sendRes += "<br>Mobile No.: " + result[i].mobile_no;
                //sendRes += "<td>" + result[i].email + "</td>";
                sendRes += "<br>Address: " + result[i].perm_address.toUpperCase();
                sendRes += "<br>Thesis title: " + result[i].thesis_title;
                sendRes += "<br>Proposed Theme: " + result[i].proposed_theme.toUpperCase();
            }
            var newHtml = htmlStudentDetails.replace("{%listContent%}", sendRes);
            newHtml = newHtml.replace("{%student_value%}", id);
            res.send(newHtml);
        });
    });

    app.post('/approve', urlencodedParser, function(req, res) {
        var id = req.body.stud_id;
        var fees = req.body.fees_status;
        var f_status;
        if (fees === "Yes")
            f_status = "Y";
        else
            f_status = "N";
        console.log(req.body);
        var qry = `SELECT * FROM student WHERE stud_id="${id}"`;
        con.query(qry, function(err, result, fields) {
            if (err)
                throw err;
            var regUpdate = `UPDATE student SET registration_phase='5',payment_received='${f_status}' WHERE stud_id="${id}";`;
            con.query(regUpdate, (err, result, fields) => {
                if (err)
                    throw err;
                var enrAdd = `UPDATE student set enrollment_id = "${req.body.enroll_id}" where stud_id="${id}";`;
                con.query(enrAdd, (err, results, field) => {
                    res.send("<form action='/studentList' method='post'><button type='submit'>Approved successfully</button></form>");
                    //res.send(racFile);
                });
            });
        });
    });

    app.post('/reject', urlencodedParser, function(req, res) {
        var id = req.body.stud_id;
        console.log(req.body);
        var qry = `SELECT * FROM student WHERE stud_id="${id}"`;
        con.query(qry, function(err, result, fields) {
            if (err)
                throw err;
            var regUpdate = `UPDATE student SET registration_phase='0' WHERE stud_id="${id}";`;
            con.query(regUpdate, (err, result, fields) => {
                if (err)
                    throw err;
                res.send("<h1><a href='/studentList' method='post'>Rejected Successfully</a><h1>");
            });
        });
    });

    app.get('/', function(req, res) {
        res.send(htmlFile);
    });

    var transporter = nodemailer.createTransport({
        service: 'gmail',

        auth: {
            user: 'ju.phdms2021@gmail.com',
            pass: 'Ju.phdms2021@'
        }
    });

    function sendEmail(email, id, password, type) {
        var mailOptions = {
            from: 'ju.phdms2021@gmail.com',
            to: 'notifyserver123@gmail.com', // REMEMBER TO CHANGE THIS LATER
            subject: 'Account Details from ju phdms',
            text: `Hello ${email}, Your Account ID is "${id}", Password is "${password}" and Access type is "${type}". Please dont share the password with anyone.`
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    app.post('/addAccount', (req, res) => {
        res.send(addAccountFile);
    });
    app.post('/addSelectedType', urlencodedParser, (req, res) => {
        //res.send(req.body.type)
        var type = req.body.type;
        var email = req.body.email;
        if (type == "supervisor") {
            var supFileTemp = supFile.replace("{%error%}", "");
            res.send(supFileTemp);
        } 
        else if (type == "prc") {
            var prcFileTemp = prcFile.replace("{%error%}", "");
            res.send(prcFileTemp);
        } else if (type == "dc") {
            var dcFileTemp = dcFile.replace("{%error%}", "");
            res.send(dcFileTemp);
        }
    });

    app.post('/addSupervisor', urlencodedParser, (req, res) => {
        var email = req.body.email;
        var psw = req.body.psw;
        var repeat_psw = req.body.repeat_psw;
        var name = req.body.name;
        var dept_id = req.body.dept_id;
        var id;
        var cnt;
        var q = `select count(*) as cnt from login where email = "${email}"`;
        con.query(q, (err, result, fields) => {
            if (err) {
                throw err;
            }
            count = result[0].cnt;
            if (count == 0) {
                var q1 = "Select count(*) as cnt from login;"
                con.query(q1, (err, result, fields) => {
                    if (err) {
                        throw err;
                    }
                    id = "sup" + (result[0].cnt + 1);
                    var type = 'sup'
                    var special_user = "N"
                    if (psw == repeat_psw) {
                        var stmt1 = `INSERT INTO login(id,email,password,type,special_user) VALUES("${id}","${email}","${encrypt(psw)}","${type}","${special_user}");`;
                        
                        var stmt = stmt1;
                        con.query(stmt, (err, result, fields) => {
                            if (err)
                                throw err;
                            sendEmail(email, id, psw, "Supervisor");
                            res.send(successFile);
                        });
                    } else {
                        var supFileEmail = supFile.replace("{%error%}", "Password and Repeat Password does not match");
                        res.send(supFileEmail);
                    }
                });
            } else {
                var supFileEmail = supFile.replace("{%error%}", "Email Already Registered")
                res.send(supFileEmail);
            }
        });
    });


    app.post('/addPRC', urlencodedParser, (req, res) => {
        var email = req.body.email;
        var psw = req.body.psw;
        var repeat_psw = req.body.repeat_psw;
        var dept_id = req.body.dept_id;
        var id;
        var cnt;
        var q = `select count(*) as cnt from login where email = "${email}"`;
        con.query(q, (err, result, fields) => {
            if (err) {
                throw err;
            }
            count = result[0].cnt;
            if (count == 0) {
                var q1 = "Select count(*) as cnt from prc;"
                con.query(q1, (err, result, fields) => {
                    if (err) {
                        throw err;
                    }
                    id = "prc" + (result[0].cnt + 1);
                    var type = 'prc';
                    var special_user = "N";
                    if (psw == repeat_psw) {
                        var stmt1 = `INSERT INTO login(id,email,password,type,special_user) VALUES("${id}","${email}","${encrypt(psw)}","${type}","${special_user}");`;
                        var stmt2 = `INSERT INTO prc(prc_id,dept_id) VALUES("${id}","${dept_id}");`;
                        var stmt = stmt1 + stmt2;
                        con.query(stmt1, (err, result, fields) => {
                            if (err)
                                throw err;
                            con.query(stmt2,(err, result, fields)=>{
                                if (err)
                                    throw err;
                                sendEmail(email, id, psw, "PRC");
                                res.send(successFile);
                            })
                            
                        });
                    } else {
                        var prcFileEmail = prcFile.replace("{%error%}", "Password and Repeat Password does not match");
                        res.send(prcFileEmail);
                    }
                });
            } else {
                var prcFileEmail = prcFile.replace("{%error%}", "Email Already Registered")
                res.send(prcFileEmail);
            }
        });
    });

    app.post('/addDC', urlencodedParser, (req, res) => {
        var email = req.body.email;
        var psw = req.body.psw;
        var repeat_psw = req.body.repeat_psw;
        var fac_id = req.body.fac_id;
        var id;
        var type = 'dc';
        var cnt;
        var q = `select count(*) as cnt from login where email = "${email}"`;
        con.query(q, (err, result, fields) => {
            if (err) {
                throw err;
            }
            count = result[0].cnt;
            if (count == 0) {
                var q1 = "Select count(*) as cnt from doctorate_committe;"
                con.query(q1, (err, result, fields) => {
                    if (err) {
                        throw err;
                    }
                    id = "dc" + (result[0].cnt + 1);
                    var special_user = "N"
                    if (psw == repeat_psw) {
                        var stmt1 = `INSERT INTO login(id,email,password,type,special_user) VALUES("${id}","${email}","${encrypt(psw)}","${type}","${special_user}");`;
                        var stmt2 = `INSERT INTO doctorate_committe(dc_id,fac_id) VALUES("${id}","${fac_id}");`;
                        var stmt = stmt1 + stmt2;
                        con.query(stmt1, (err, result, fields) => {
                            if (err)
                                throw err;
                            con.query(stmt2,(err, result, fields)=>{
                                if (err)
                                    throw err;
                                sendEmail(email, id, psw, "DC");
                                res.send(successFile);
                            })
                        });
                    } else {
                        var dcFileEmail = dcFile.replace("{%error%}", "Password and Repeat Password does not match");
                        res.send(dcFileEmail);
                    }
                });
            } else {
                var dcFileEmail = dcFile.replace("{%error%}", "Email Already Registered")
                res.send(dcFileEmail);
            }
        });
    });
    app.post('/addExaminer',urlencodedParser,(req,res) => {
        con.query('select * from student s left join department d on s.dept_id = d.dept_id left join faculty f on f.fac_id = d.fac_id where s.stud_id in (select distinct Student_ID from External);',(err,result,field) => {
            var htmlFile = fs.readFileSync('views/addExam.html','utf-8');
            var formText = "";
            for(var i=0;i<result.length;i++)
            {
                formText += `<form class="list" method='POST' action='/selectExams'>`;
                formText += `<img src="./student_photo/${result[i].stud_id}" alt="Couldn't Load Image" >`;
                formText += `<div class="g1">${result[i].name}</div>`;
                formText += `<div class="g2">${result[i].dept_name}</div>`;
                formText += `<div class="g3">${result[i].fac_name}</div>`;
                formText += `<input type="Submit" name="${result[i].stud_id}" value="Select Examiners">`;
                formText += `</form>`;
            }
            htmlFile = htmlFile.replace("{%forms%}",formText);
            res.send(htmlFile);
        });
    });
    app.post('/selectExams',urlencodedParser,(req,res) => {
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
            res.send(htmlFile);
        });
    });
    app.post('/examSelected',urlencodedParser,(req,res) => {
        var email1 = req.body.instate;
        var email2 = req.body.outstate;
        var email3;
        if(req.body.viva == 'null')
            email3 = req.body.Email;
        else
            email3 = req.body.viva;
        var email = [email1,email2,email3];
        for(var i=0;i<email.length;i++)	{
        	
    		var htmlFile = fs.readFileSync('main.html','utf-8');
			const { encrypt, decrypt } = require('./crypto');
			
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
				to: email[i], 
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
        res.send('Emails Sent Successfully');
    });
    app.get('/examAccepted',(req,res)=>{
    	const x = {
        	'iv':req.query.iv,
        	'content':req.query.content
    	}
    	console.log(x);
    	var text = decrypt(x);
    	//emailChecker = text.split(" ")[0];
    	//passChecker = text.split(" ")[1];
    	var html = fs.readFileSync('validate.html','utf-8');
    	html = html.replace("{%iv%}",req.query.iv);
    	html = html.replace("{%content%}",req.query.content);
    	html = html.replace('{%type%}','AC');
    	res.send(html);
	});
	app.get('/examRejected',(req,res)=>{
    	const x = {
        	'iv':req.query.iv,
        	'content':req.query.content
    	}
    	var text = decrypt(x);
    	//emailChecker = text.split(" ")[0];
    	//passChecker = text.split(" ")[1];
    	var html = fs.readFileSync('validate.html','utf-8');
    	html = html.replace("{%iv%}",req.query.iv);
    	html = html.replace("{%content%}",req.query.content);
    	html = html.replace('{%type%}','WA');
    	res.send(html);
	});
	app.post('/examCheck',urlencodedParser,(req,res)=>{
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
					res.send('<h1 style="color:green;">Successfully Accepted</h1>');
				});
			}
			else{
				var qry = `update External set phase = -1 where email = '${emailChecker}'`;
				con.query(qry,(err,result,fields)=>{
					res.send('<h1 style="color:green;">Successfully Accepted</h1>');
				});
			}
		}
		else{
			res.send('<h1 style="color:red">Failed!! Try Again</h1>');
		}
	});
    app.listen(port, () => {
        console.log("Server Created!");
        console.log("http://localhost:" + port + "/");
    });
});
