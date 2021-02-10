const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');

const prcPage = (req, res) => {
    var htmlFile = fs.readFileSync("views/supervisor.html", "utf-8");
    var sess = req.session;
    htmlFile = htmlFile.replace("{%name%}", sess.userid);
    htmlFile = htmlFile.replace("{%action%}", "prcApproval");
    var qry = "select * from student s left join prc p on s.dept_id = p.dept_id where prc_id = '" + sess.userid + "' and registration_phase = 2";
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
                var listString = listString + `<div class="det1"><a href='/downloadPDF?stud_id=${results[i].stud_id}'>Check Form</a></div>`;
                //var listString = listString + "<div class='hide'><input type='hidden' name = 'studVal' value='" + results[i].stud_id + "'";
                var listString = listString + "<div class='det2'><input type='submit' name='" + results[i].stud_id + "_accept' value='Approve' class='approve'><input type='submit' name='" + results[i].stud_id + "_reject' value='Discard' class='discard'></div></div>";

            }
            htmlFile = htmlFile.replace("{%list%}", listString);
        }
        res.send(htmlFile);
    });
};
const prcApprovalController = (req, res) => {
    var str = Object.keys(req.body)[0];
    var n = str.indexOf("_");
    var stud_id = str.substring(0, n);
    var status = str.substring(n + 1, str.length);
    // console.log(n);
    // console.log(stud_id);
    // console.log(status);
    //res.send("Hello");
    var qry;
    var status_id;
    if (status === "reject") {
        qry = "UPDATE student SET registration_phase = 0 WHERE stud_id = '" + stud_id + "';";
        status_id = "Successfully Discared";
    } else {
        qry = "UPDATE student SET registration_phase = 3 WHERE stud_id = '" + stud_id + "';";
        status_id = "Successfully Approved";
    }
    con.query(qry, (err, results, fields) => {
        res.send("<h1><a href='/prcPage'>" + status_id + "</a><h1>");
    });
};
module.exports = {
    prcPage,
    prcApprovalController
}