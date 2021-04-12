const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');

const prcPage = (req, res) => {
    var htmlFile = fs.readFileSync("views/supervisor.html", "utf-8");
    var sess = req.session;
    htmlFile = htmlFile.replace("{%prcDcTag%}",`<div style="height:12rem;width:100rem;z-index:-1;position:fixed;background-color:#efefef;"></div>`);
    htmlFile = htmlFile.replace("{%prcDcButton%}",`<div class="button-class">
    <a href="/prcPage" class="active">Registration Approval</a>
    <a href="/prcPageReport" class="nactive">Report Submit Approval</a>
</div>`);
    htmlFile = htmlFile.replace("{%supTag%}","");
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
const prcReportApproval = (req,res) => {
    var htmlFile = fs.readFileSync("views/reportView.html", "utf-8");
    var sess = req.session;
    htmlFile = htmlFile.replace("{%name%}", sess.userid);
    for(var i=0;i<3;i++)
        htmlFile = htmlFile.replace("{%prcodc%}","prc");
    var qry = "select * from student s join six_monthly_report r join prc p on s.stud_id = r.stud_id and p.dept_id = s.dept_id where approval_phase='1' and prc_id='" + sess.userid + "'";
    con.query(qry, (err, results, fields) => {
        if (results.length == 0)
            htmlFile = htmlFile.replace("{%list%}", "No Approval List");
        else {
            var listString = "";
            
            for (var i = 0; i < results.length; i++) {
                var listString = listString + "<div class='list1'>";
                var listString = listString + "<div class='det1'>" + results[i].name + "</div>";
                var listString = listString + "<div class='det1'>" + results[i].proposed_theme + "</div>";
                var listString = listString + "<div class='det1'>" + results[i].semester + "</div>";
                var listString = listString + `<div class="det1"><a href='/downloadReport?stud_id=${results[i].stud_id}&semester=${results[i].semester}'>View Report</a></div>`;
                //var listString = listString + "<div class='hide'><input type='hidden' name = 'studVal' value='" + results[i].stud_id + "'";
                var listString = listString + "<div class='det2'><input type='submit' name='" + results[i].file_name + "_accept' value='Approve' class='approve'><input type='submit' name='" + results[i].file_name + "_reject' value='Discard' class='discard'></div></div>";

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

const prcReportApprovalSubmit = (req, res) => {
    var str = Object.keys(req.body)[0];
    var n = str.indexOf("_");
    var file_name = str.substring(0, n);
    var status = str.substring(n + 1, str.length);
    // console.log(n);
    // console.log(stud_id);
    // console.log(status);
    //res.send("Hello");
    var qry;
    var status_id;
    if (status === "reject") {
        qry = "UPDATE six_monthly_report SET approval_phase = '0' WHERE file_name = '" + file_name + "';";
        status_id = "Successfully Discarded";
    } else {
        qry = "UPDATE six_monthly_report SET approval_phase = '2' WHERE file_name = '" + file_name + "';";
        status_id = "Successfully Approved";
    }
    con.query(qry, (err, results, fields) => {
        res.send("<h1><a href='/prcPageReport'>" + status_id + "</a><h1>");
    });
};

module.exports = {
    prcPage,
    prcApprovalController,
    prcReportApproval,
    prcReportApprovalSubmit
}