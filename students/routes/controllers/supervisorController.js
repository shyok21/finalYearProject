const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');

const supervisorPage = (req, res) => {
    var htmlFile = fs.readFileSync("views/supervisor.html", "utf-8");
    htmlFile = htmlFile.replace("{%prcDcTag%}","");
    htmlFile = htmlFile.replace("{%prcDcButton%}","");
    var sess = req.session;
    var qrys = "select prof_name from professor where prof_id = '" + sess.userid + "';";
    con.query(qrys, (err, ress, field) => {
        htmlFile = htmlFile.replace("{%name%}", ress[0].prof_name);
        htmlFile = htmlFile.replace("{%action%}", "supervisorApproval");
        if (sess.special == 'Y') {
            htmlFile += "<form class='special' action='/specialDB' method='post'>";
            htmlFile += "<b>Note:</b>You have the Special Access. Check status of all students."
            htmlFile += `<input type='hidden' name='check' value='Y'>`;
            htmlFile += `<input type='submit' value='Check!'>`;
            htmlFile += `</form>`;
        }
        var qry = "select * from student where supervisor_id = '" + sess.userid + "' and registration_phase = 1";
        con.query(qry, (err, results, fields) => {
            if (results.length == 0)
                htmlFile = htmlFile.replace("{%list%}", "No Approval List");
            else {
                var listString = "";
                for (var i = 0; i < results.length; i++) {
                    var listString = listString + "<div class='list1'>";
                    var listString = listString + "<div class='det1'>" + results[i].name + "</div>";
                    var listString = listString + "<div class='det1'>" + results[i].nationality + "</div>";
                    var listString = listString + "<div class='det1'>" + results[i].dob + "</div>";
                    var listString = listString + "<div class='det1'>" + results[i].sex + "</div>";
                    var listString = listString + "<div class='det1'>" + results[i].proposed_theme + "</div>";
                    // var listString = listString + "<div class='det1'>" + results[i].proposed_theme + "</div>";
                    var listString = listString + `<div class="det1"><a href='/downloadPDF?stud_id=${results[i].stud_id}'>Check Form</a></div>`;
                    var listString = listString + `<div class="det1"><a href='assignRAC.html?stud_id=${results[i].stud_id}'>Assign RAC</a></div>`;
                    //var listString = listString + "<div class='hide'><input type='hidden' name = 'studVal' value='" + results[i].stud_id + "'";
                    var listString = listString + "<div class='det2'><input type='submit' name='" + results[i].stud_id + "_accept' value='Approve' class='approve'><input type='submit' name='" + results[i].stud_id + "_reject' value='Discard' class='discard'></div></div>";
                }
                htmlFile = htmlFile.replace("{%list%}", listString);
            }
            res.send(htmlFile);
        });
    });

};

const assignRAC = (req, res) => {
    var htmlFile = fs.readFileSync("views/assignRAC.html", "utf-8");
    var sess = req.session;
    var studentID = req.query.stud_id;
    var qrys = "select prof_name from professor where prof_id = '" + sess.userid + "';";
    con.query(qrys, (err, ress, field) => {
        htmlFile = htmlFile.replace("{%name%}", ress[0].prof_name);
        htmlFile = htmlFile.replace("{%student_id%}", studentID);
        htmlFile = htmlFile.replace("{%student_id%}", studentID);
        var deptqry = `SELECT dept_id FROM student WHERE stud_id='${studentID}'`;
        con.query(deptqry, (err, result, field) => {
            var qry = `SELECT * FROM professor WHERE prof_dept='${result[0].dept_id}'`;
            con.query(qry, (err, results, field) => {
                var listString = "";
                console.log(results.length);
                for (var i = 0; i < results.length; i++) {
                    listString += "<label for='" + i + "'>";
                    listString += "<input type='checkbox' id='" + results[i].prof_id + "' name='" + results[i].prof_name + "'/>" + results[i].prof_name + "</label>";
                }
                htmlFile = htmlFile.replace("{%list%}", listString);
                res.send(htmlFile);
            });
        });
    });
}

const racSubmit = (req, res) => {
    var racMembers = req.body.prof_name;
    var studentID = req.body.stud_id;
    var profArray = racMembers.split(",");
    //var successPage = "<a href='assignRAC.html?stud_id=" + studentID + "'>Successful</a>";
    for (var i = 0; i < profArray.length - 1; i++) {
        var qry = `INSERT INTO rac_members (rac_id, member_id) VALUES ('${studentID}', '${profArray[i]}')`;
        con.query(qry, (err, results, field) => {
            console.log(profArray[i]);
        });
    }
    res.send("<h1><a href='/supervisorPage'>Assigned successfully</a><h1>");
}

module.exports = {
    supervisorPage,
    assignRAC,
    racSubmit
}