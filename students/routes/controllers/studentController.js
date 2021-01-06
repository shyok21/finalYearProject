const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');

const studentPage = (req, res) => {
    var sess = req.session;
    if (sess.email) {
        const userid = sess.userid;
        var studentFile = fs.readFileSync("views/student.html", "utf-8");
        var qrys = util.format("select name,registration_phase from student where stud_id='%s'", userid);
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

module.exports = {
    studentPage
}