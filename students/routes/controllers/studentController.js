const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');
const multer  = require('multer');

const studentPage = (req, res) => {
    var sess = req.session;
    if (sess.email) {
        const userid = sess.userid;
        var studentFile = fs.readFileSync("views/student.html", "utf-8");
        var qrys = util.format("select name,registration_phase,enrollment_id,supervisor_id,proposed_theme,sex,dept_id from student where stud_id='%s'", userid);
        con.query(qrys, (err, results, fields) => {
            try {
                var studentName = results[0].name;
                var studentPhase = results[0].registration_phase;

                if (studentPhase == 0) {
                    var htmlNewFile = studentFile.replace("{%StudentName%}", studentName);
                    var htmlNewFile = htmlNewFile.replace("{%studentMessage%}", "your Application Gets Rejected.");
                    for (var i = 1; i <= 5; i++)
                        htmlNewFile = htmlNewFile.replace("{%trackClass%}", "main-track-rejected")
                    res.send(htmlNewFile);
                } else if (studentPhase == 5) {
                    var photo = userid;
                    var enrollment = results[0].enrollment_id;
                    var name = results[0].name;
                    var gender = results[0].sex;
                    var supervisor_id = results[0].supervisor_id;
                    var dept_id = results[0].dept_id;
                    var theme = results[0].proposed_theme;
                    var qry1 = `select prof_name from professor where prof_id = '${supervisor_id}'`;
                    con.query(qry1,(err,result1,field1) => {
                        var supervisor = result1[0].prof_name;
                        var qry2 = `select dept_name,fac_id from department where dept_id = "${dept_id}"`;
                        con.query(qry2,(err,result2,field2) => {
                            var department = result2[0].dept_name + " / " + result2[0].fac_id;
                            var studentMain = fs.readFileSync("views/studentMain.html","utf-8");
                            var studentMain = studentMain.replace("{%name%}",name);
                            var studentMain = studentMain.replace("{%enrollment%}",enrollment);
                            var studentMain = studentMain.replace("{%gender%}",gender);
                            var studentMain = studentMain.replace("{%department%}",department);
                            var studentMain = studentMain.replace("{%supervisor%}",supervisor);
                            var studentMain = studentMain.replace("{%theme%}",theme);
                            var studentMain = studentMain.replace("{%studentPhoto%}",photo);
                            res.send(studentMain);
                        });
                    });
                    //res.send("<h1>Congratulations, your registration is completed</h1><h2>Your Enrollment ID:" + results[0].enrollment_id + "</h2>");
                } else {
                    var htmlNewFile = studentFile.replace("{%StudentName%}", studentName);
                    var htmlNewFile = htmlNewFile.replace("{%studentMessage%}", "your registration is in Under Process. We will notify you once your Registration gets Complete. You can track your Registration Phase here.");
                    for (var i = 1; i <= 5; i++) {
                        if (studentPhase > i)
                            htmlNewFile = htmlNewFile.replace("{%trackClass%}", "main-track-accepted");
                        else
                            htmlNewFile = htmlNewFile.replace("{%trackClass%}", "main-track-process");
                    }
                    res.send(htmlNewFile);
                }
            } catch (e) {
                res.redirect('/applicationFormPage');
            }
        });
    } else {
        res.redirect('/');
    }
}

const submitReport = (req, res) => {
    var sess = req.session;

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/' + file.fieldname)
        },
        filename: function (req, file, cb) {
          cb(null, sess.userid + '-' + req.body.semester);
        }
    });

    var upload = multer({ storage }).fields(
        [{ 
            name: 'report', maxCount: 1 
        }]
    );

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            var qry = util.format(
                `insert into six_monthly_report (stud_id, date_time, file_name, semester, approval_phase)
                values ('%s', '%s', '%s', '%s', '%d')`,
                sess.userid, new Date(), sess.userid + '-' + req.body.semester, req.body.semester, 1
            );
            con.query(qry, (err, result, fields) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                else {
                    console.log("Report submitted successfully");
                    res.send('<h1>Report submission successful</h1><a href="/studentPage">Go to main page</a>');
                }    
            })
        }
    });
}

const downloadReport = (req, res) => {
    const stud_id = req.query.stud_id;
    const semester = req.query.semester;
    const path = "uploads/report/" + stud_id + "-" + semester;
    res.download(path, function (err) {
        if (err) {
            console.log("Error");
            console.log(err);
        } else {
            console.log("Success");
        }
    });
}
module.exports = {
    studentPage,
    submitReport,
    downloadReport
}