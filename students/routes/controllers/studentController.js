const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');
const multer  = require('multer');

const studentPage = (req, res) => {
    var sess = req.session;
    if (sess.email) {
        const userid = sess.userid;
        var studentFile = fs.readFileSync("views/student/student.html", "utf-8");
        var qrys = util.format("select * from student where stud_id='%s'", userid);
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
                    var photo = results[0].photo_filename;
                    console.log("Photo" + photo);
                    var enrollment = results[0].Enrollment_ID;
                    var name = results[0].name;
                    var gender = results[0].sex;
                    var supervisor_id = results[0].supervisor_id;
                    var dept_id = results[0].dept_id;
                    var theme = results[0].thesis_title;
                    var qry1 = `select prof_name from professor where prof_id = '${supervisor_id}'`;
                    con.query(qry1,(err,result1,field1) => {
                        var supervisor = result1[0].prof_name;
                        var qry2 = `select dept_name,fac_id from department where dept_id = "${dept_id}"`;
                        con.query(qry2,(err,result2,field2) => {
                            var department = result2[0].dept_name + " / " + result2[0].fac_id;
                            var studentMain = fs.readFileSync("views/student/studentMain.html","utf-8");
                            var studentMain = studentMain.replace("{%name%}",name);
                            var studentMain = studentMain.replace("{%enrollment%}",enrollment);
                            var studentMain = studentMain.replace("{%gender%}",gender);
                            var studentMain = studentMain.replace("{%department%}",department);
                            var studentMain = studentMain.replace("{%supervisor%}",supervisor);
                            var studentMain = studentMain.replace("{%theme%}",theme);
                            var studentMain = studentMain.replace("{%studentPhoto%}",photo);
                            var qry3 = `select * from six_monthly_report where stud_id = '${userid}' order by date_time DESC;`;
                            con.query(qry3,(err,result3,field3) => {
                               //  try{
                                    var rem_sems = [];
                                    var sems = [];
                                    for(var i=0;i<result3.length;i++)
                                        sems.push(result3[i].semester);
                                    console.log('sems:'+sems);
                                    var noOfSem = results[0].registration_validity * 2
                                    console.log('registration_phase:'+ results[0].registration_validity)
                                    console.log('noOfSem:'+noOfSem)
                                    for(var i=1;i<=noOfSem;i++)
                                    {
                                        var s = util.format("Semester%d",i);
                                        if(sems.includes(s) == false)
                                            rem_sems.push(i);
                                    }
                                    console.log('rem_sems:'+rem_sems)
                                    var options = "";
                                    var heading = "";
                                    //for(i=0;i<rem_sems.length;i++)
                                    if(rem_sems.length > 0)
                                    {   
                                        options = options + `<input type="hidden" value="Semester${rem_sems[0]}" name="semester" readonly>`;
                                        heading = `Semester ${rem_sems[0]}`;
                                    }
                                    else
                                    {
                                        options = options + `<input type="hidden" value="empty" name="semester" readonly>`;
                                        heading = `Report Upto Date`;
                                    }
                                    studentMain = studentMain.replace("{%semesterSelect%}",options);
                                    studentMain = studentMain.replace("{%semesterSelect%}",heading);
                                    var prev_reports = `<div class="heading">
                                    <p>Semester</p>
                                    <p>Status</p>
                                    <p>Remark</p>
                                    <p>Date of Submission</p>
                                    <p>Report</p></div>`;
                                    for(var i=0;i<result3.length;i++)
                                    {
                                        if(i%2==0)
                                            var prev = `<div class="details-sem12">\n`;
                                        else
                                            var prev = `<div class="details-sem21">\n`;
                                        prev += ` <p>${result3[i].semester}</p>\n`;
                                        if(result3[i].approval_phase == 0)
                                            prev += `<p style = "color:red;">&#x2716; Rejected</p>\n`;
                                        else if(result3[i].approval_phase == 3)
                                            prev += `<p style = "color:green;">&#x2714; Submitted</p>\n`;
                                        else
                                            prev += `<p style = "color:orange;">&#x26A0; In Progress</p>\n`;
                                        if(result3[i].approval_phase == 1)
                                            prev += `<p>&#x2780; On PRC Approval</p>`;
                                        else if(result3[i].approval_phase == 2)
                                            prev += `<p>&#x2781; On DC Approval</p>`;
                                        else
                                            prev += `<p>&#x2782; DC Approved</p>`;
                                        var d = result3[i].date_time.toString();
                                        console.log(d);
                                        var dd = d.split(" ");
                                        prev += `<p>${util.format("%s %s %s",dd[2],dd[1],dd[3])}</p>`;
                                        if(result3[i].approval_phase == 0)
                                            prev += `<a href="student/report/remove?sid=${userid}&sem=${result3[i].semester}&file=${result3[i].file_name}" target="_blank">Click Here to Re-Upload</a>`;
                                        else
                                            prev += `<a href="/downloadReport?stud_id=${result3[i].stud_id}&semester=${result3[i].semester}" target="_blank">Click Here to Download</a>`;
                                        prev += "</div>";
                                        prev_reports += prev;
                                    }
                                    studentMain = studentMain.replace("{%prevReport%}",prev_reports);
                                    res.send(studentMain);
                               // }
                                // catch(e){
                                //     var options = "";
                                //     var rem_sems = [1,2,3,4,5,6,7,8];
                                //     for(i=0;i<rem_sems.length;i++)
                                //         options = options + `<option value="Semester ${rem_sems[i]}">Semester ${rem_sems[i]}</option>\n`;
                                   
                                //     studentMain = studentMain.replace("{%semesterSelect%}",options);
                                //     studentMain = studentMain.replace("{%semesterSelect%}",options);
                                //     res.send(studentMain);
                                // }
                            });
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
                res.redirect('/student/applicationForm');
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
        if(err)
        {
            console.log(err);
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
         else {
            var qry = util.format(
                `insert into six_monthly_report (stud_id, date_time, file_name, semester, approval_phase)
                values ('%s', '%s', '%s', '%s', '%d')`,
                sess.userid, new Date(), sess.userid + '-' + req.body.semester, req.body.semester, 1
            );
            console.log(`Semester Console: ${req.body.semester}`);
            if(req.body.semester == 'empty')
            {
                res.render('notification', {message : 'No semesters left for you!', status: 'error', backLink : "/student", backText: "Back to Student page"});
                return;
            }
            con.query(qry, (err, result, fields) => {
                if(err)
                {
                    console.log(err);
                    res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                    return
                }
                else {
                    console.log("Report submitted successfully");
                    res.render('notification', {message : 'Report submitted successfully!', status: 'success', backLink : "/student", backText: "Back to student portal"});
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
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to student portal"});
        } else {
            console.log("Success");
        }
    });
}

const removeReport = (req,res) => {
    const stud_id = req.query.sid;
    const sem = req.query.sem;
    const file = req.query.file;
   // fs.unlinkSync(`uploads/report/${file}`);
    var qry = `delete from six_monthly_report where stud_id = "${stud_id}" and semester = "${sem}";`;
    con.query(qry,(err,result,field) => {
        if(err)
        {
            console.log(err);
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        res.render('notification', {message : 'Successfully removed the file!', status: 'success', backLink : "/student", backText: "Back to student portal"});
    });
}

module.exports = {
    studentPage,
    submitReport,
    downloadReport,
    removeReport
}