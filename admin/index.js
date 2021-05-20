const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
var nodemailer = require('nodemailer');
app.use(bodyParser.urlencoded({ extended: true }));
const encryption  = require('./services/encrypt');
const sendEmail = require('./services/sendEmail');
const { encrypt, decrypt } = require('./services/emailEncrypt');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
const { PORT, ROOT_URL, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, SENDER_EMAIL, SENDER_PASSWORD, TEST_EMAIL, TEST_MODE, MAIL_SERVICE } = require('./config');

const con = mysql.createConnection({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true
});

var connectWithRetry = function(attempt) {
    con.connect(function(err) {
        if (err)
        {
            console.log("Database error");
            if(attempt>0)
            {
                setTimeout(()=>{connectWithRetry(attempt-1)},2000);
            }
        }
        else
            console.log("Connected to Database");
    });
};

connectWithRetry(10);

var htmlFile = fs.readFileSync("views/index.html", "utf-8");
var html = fs.readFileSync("views/studentList.html", "utf-8");
var htmlStudentDetails = fs.readFileSync("views/studentDetails.html", "utf-8");
var addAccountFile = fs.readFileSync("views/admin_add.html", "utf-8");
var supFile = fs.readFileSync("views/add_supervisor.html", "utf-8");
var prcFile = fs.readFileSync("views/add_prc.html", "utf-8");
var dcFile = fs.readFileSync("views/add_dc.html", "utf-8");
var successFile = fs.readFileSync("views/successPage.html", "utf-8");

app.post("/studentList", function(req, res) {
    var qry = "SELECT * FROM student s left join professor p on s.supervisor_id = p.prof_id WHERE registration_phase='4'";
    con.query(qry, function(err, result, fields) {
        if (err) {
            res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
            return;
        }
        var sendRes = "";
        for (var i = 0; i < result.length; i++) {
            //console.log(result)
            var crypt_id = encrypt(result[i].stud_id);
            console.log(result);
            sendRes += "<tr>";
            sendRes += "<td>" + (result[i].stud_id).toUpperCase() + "</td>";
            sendRes += "<td>" + result[i].name.toUpperCase() + "</td>";
            //sendRes += "<td>" + result[i].email + "</td>";
            //sendRes += "<td>" + result[i].perm_address.toUpperCase() + "</td>";
            // var supervisor_name = "";
            // var sup_qry = `select * from professor where prof_id = "${result[i].supervisor_id}"`;
            // con.query(sup_qry, function(err, sup_result, fields) {
            //     if (err) {
            //         res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
            //         return;
            //     }
            //     console.log(sup_result[0].prof_name)
            //     supervisor_name += sup_result[0].prof_name
            //     // sendRes += "<td>" + sup_result[0].prof_name + "</td>";
            // });
            sendRes += "<td>" + result[i].prof_name + "</td>";
            //sendRes += "<td>" + result[i].supervisor_id.toUpperCase() + "</td>";
            sendRes += "<td>" + result[i].thesis_title + "</td>";
            sendRes += "<td><a href='studentDetails.html?stud_id=" + crypt_id.iv + "&stud_id_c="+ crypt_id.content +"'>View Details</a></td>";
            sendRes += "</tr>";
        }
        var newHtml = html.replace("{%sqlContent%}", sendRes);
        res.send(newHtml);
    });
});

app.get("/studentDetails.html", function(req, res) {
    var c_id = {"iv" : req.query.stud_id,
                "content" : req.query.stud_id_c
            };
    try{
    var id = decrypt(c_id);
    }
    catch(e){
        res.send(404);
        return;
    }
    console.log(id);
    var qry = `SELECT * FROM student WHERE stud_id="${id}"`;
    con.query(qry, function(err, result, fields) {
        if (err) {
            res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
            return;
        }
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
            sendRes += "<br>Proposed Theme: " + result[i].thesis_title.toUpperCase();
        }
        var newHtml = htmlStudentDetails.replace("{%listContent%}", sendRes);
        newHtml = newHtml.replace("{%student_value%}", id);
        if(result.length == 0)
            res.send(404);
        else
            res.send(newHtml);
    });
});

app.post('/approve', function(req, res) {
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
        if (err) {
            res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
            return;
        }
        var regUpdate = `UPDATE student SET registration_phase='5',payment_received='${f_status}' WHERE stud_id="${id}";`;
        con.query(regUpdate, (err, result, fields) => {
            if (err) {
                res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
                return;
            }
            var enrAdd = `UPDATE student set enrollment_id = "${req.body.enroll_id}" where stud_id="${id}";`;
            con.query(enrAdd, (err, results, field) => {
                res.send("<form action='/studentList' method='post'><button type='submit'>Approved successfully</button></form>");
                //res.send(racFile);
            });
        });
    });
});

app.post('/reject', function(req, res) {
    var id = req.body.stud_id;
    console.log(req.body);
    var qry = `SELECT * FROM student WHERE stud_id="${id}"`;
    con.query(qry, function(err, result, fields) {
        if (err) {
            res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
            return;
        }
        var regUpdate = `UPDATE student SET registration_phase='0' WHERE stud_id="${id}";`;
        con.query(regUpdate, (err, result, fields) => {
            if (err) {
                res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
                return;
            }
            res.send("<h1><a href='/studentList' method='post'>Rejected Successfully</a><h1>");
        });
    });
});

app.get('/', function(req, res) {
    res.send(htmlFile);
});

var transporter = nodemailer.createTransport({
    pool: true,
    service: MAIL_SERVICE,
    port: 587,
    secure: false,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD
    }
});

function getMailData(email, id, password, type) {
    var mailData = {
        to: email,
        subject: 'Account Details from ju phdms',
        html: `Hello ${email}, Your Account ID is "${id}", Password is "${password}" and Access type is "${type}". Please dont share the password with anyone.`
    };
    
    return mailData;
}

app.post('/addAccount', (req, res) => {
    res.send(addAccountFile);
});
app.post('/addSelectedType', (req, res) => {
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

app.post('/addSupervisor', (req, res) => {
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
            res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
            return;
        }
        count = result[0].cnt;
        if (count == 0) {
            var q1 = "Select count(*) as cnt from login;"
            con.query(q1, (err, result, fields) => {
                if (err) {
                    res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
                    return;
                }
                id = "sup" + (result[0].cnt + 1);
                var type = 'sup'
                var special_user = "N"
                if (psw == repeat_psw) {
                    var stmt1 = `INSERT INTO login(id,email,password,type,special_user) VALUES("${id}","${email}","${encryption.encrypt(psw)}","${type}","${special_user}");`;
                    
                    var stmt = stmt1;
                    con.query(stmt, (err, result, fields) => {
                        if (err) {
                            res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
                            return;
                        }
                        const mailData = getMailData(email, id, psw, "Supervisor");
                        sendEmail(mailData, function(err, info){
                            if(err) {
                                console.log(err);
                                res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
                                return;
                            }
                            res.send(successFile);
                        })
                        
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


app.post('/addPRC', (req, res) => {
    var email = req.body.email;
    var psw = req.body.psw;
    var repeat_psw = req.body.repeat_psw;
    var dept_id = req.body.dept_id;
    var id;
    var cnt;
    var q = `select count(*) as cnt from login where email = "${email}"`;
    con.query(q, (err, result, fields) => {
        if (err) {
            res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
            return;
        }
        count = result[0].cnt;
        if (count == 0) {
            var q1 = "Select count(*) as cnt from prc;"
            con.query(q1, (err, result, fields) => {
                if (err) {
                    res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
                    return;
                }
                id = "prc" + (result[0].cnt + 1);
                var type = 'prc';
                var special_user = "N";
                if (psw == repeat_psw) {
                    var stmt1 = `INSERT INTO login(id,email,password,type,special_user) VALUES("${id}","${email}","${encryption.encrypt(psw)}","${type}","${special_user}");`;
                    var stmt2 = `INSERT INTO prc(prc_id,dept_id) VALUES("${id}","${dept_id}");`;
                    var stmt = stmt1 + stmt2;
                    con.query(stmt1, (err, result, fields) => {
                        if (err) {
                            res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
                            return;
                        }
                        con.query(stmt2,(err, result, fields)=>{
                            if (err) {
                                res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
                                return;
                            }
                            const mailData = getMailData(email, id, psw, "PRC");
                            sendEmail(mailData, function(err, info){
                                if(err) {
                                    console.log(err);
                                    res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
                                    return;
                                }
                                res.send(successFile);
                            })
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

app.post('/addDC', (req, res) => {
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
            res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
            return;
        }
        count = result[0].cnt;
        if (count == 0) {
            var q1 = "Select count(*) as cnt from doctorate_committe;"
            con.query(q1, (err, result, fields) => {
                if (err) {
                    res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
                    return;
                }
                id = "dc" + (result[0].cnt + 1);
                var special_user = "N"
                if (psw == repeat_psw) {
                    var stmt1 = `INSERT INTO login(id,email,password,type,special_user) VALUES("${id}","${email}","${encryption.encrypt(psw)}","${type}","${special_user}");`;
                    var stmt2 = `INSERT INTO doctorate_committe(dc_id,fac_id) VALUES("${id}","${fac_id}");`;
                    var stmt = stmt1 + stmt2;
                    con.query(stmt1, (err, result, fields) => {
                        if (err) {
                            res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
                            return;
                        }
                        con.query(stmt2,(err, result, fields)=>{
                            if (err) {
                                res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
                                return;
                            }
                            const mailData = getMailData(email, id, psw, "DC");
                            sendEmail(mailData, function(err, info){
                                if(err) {
                                    console.log(err);
                                    res.render('notification', {message : 'Error...try again!', status: 'error', backLink : "/", backText: "Back to admin portal"});
                                    return;
                                }
                                res.send(successFile);
                            })
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
app.listen(PORT, () => {
    console.log("Server Created!");
    console.log(ROOT_URL);
});