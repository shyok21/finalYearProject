const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');

const supervisorApprovalPage = (req, res) => {
    var htmlFile = fs.readFileSync("views/supervisor/supervisor.html", "utf-8");
    htmlFile = htmlFile.replace("{%supTag%}",`<a href="/supervisor/studentsList" style="text-decoration:none;color:black;background-color:#6dd5ed;height:2rem;width:20rem;margin-right:3rem;font-weight:normal;border-color:#2193b0;border-style:solid;border-radius:6px;text-align:center;border-width:2px;">Assign Examiner</a>`);
    var sess = req.session;
    var qrys = "select prof_name from professor where prof_id = '" + sess.userid + "';";
    con.query(qrys, (err, ress, field) => {
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        htmlFile = htmlFile.replace("{%name%}", ress[0].prof_name);
        if (sess.special == 'Y') {
            htmlFile += "<form class='special' action='/hod/specialDB' method='post'>";
            htmlFile += "<b>Note:</b>You have the Special Access. Check status of all students."
            htmlFile += `<input type='hidden' name='check' value='Y'>`;
            htmlFile += `<input type='submit' value='Check!'>`;
            htmlFile += `</form>`;
        }
        var qry = "select * from student s left join department d on s.dept_id = d.dept_id where supervisor_id = '" + sess.userid + "' and registration_phase = 1";
        console.log(qry);
        con.query(qry, (err, results, fields) => {
            if(err)
            {
                res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                return
            }
            if (results.length == 0){
                htmlFile = htmlFile.replace("{%list%}", "No Approval List");
            }
            else {
                var listString = "";
                for (var i = 0; i < results.length; i++) {
                    if (i%2 == 0)
                        listString += `<div class="list345">`;
                    else
                        listString += `<div class="list456">`;
                    listString += `<img src='/student_photo/${results[i].photo_filename}' class="img-list">`;
                    listString += `<div class="ted1">`;
                    listString += `<div class="ted3">`;
                    listString += `<p><b>Name: </b> ${results[i].name} </p>`;
                    listString += `</div>`;
                    listString += `<div class="ted3">`;
                    listString += `<p><b>Department: </b> ${results[i].dept_name} / ${results[i].fac_id}</p>`;
                    listString += `</div>`;
                    listString += `<div class="ted3">`;
                    listString += `<p><b>Thesis Title:</b> ${results[i].thesis_title} </p>`;
                    listString += `</div>`;
                    listString += `<div class="ted3"><p><a href='/downloadPDF?stud_id=${results[i].stud_id}'>Check Form</a></p></div>`;
                    listString += `<div class="ted3"><p><a href='/supervisor/assignRAC?stud_id=${results[i].stud_id}'>Assign RAC</a></p></div>`;
                    listString += "<div class='hide'><input type='hidden' value='" + results[i].stud_id + "'>";
                    listString += `</div></div>`;
                    listString += "<div class='ted2'><input type='submit' name='" + results[i].stud_id + "_accept' value='Approve' class='approve'><input type='submit' name='" + results[i].stud_id + "_reject' value='Discard' class='discard'></div>";

                    
                  //   var listString = listString + "<div class='list1'>";
                  //   var listString = listString + "<div class='ted1'>" + results[i].name + "</div>";
                  //   var listString = listString + "<div class='ted1'>" + results[i].nationality + "</div>";
                  //   var listString = listString + "<div class='ted1'>" + results[i].dob + "</div>";
                  //   var listString = listString + "<div class='ted1'>" + results[i].sex + "</div>";
                  //   // var listString = listString + "<div class='ted1'>" + results[i].thesis_title + "</div>";
                  //   var listString = listString + `<div class="ted1"><a href='/downloadPDF?stud_id=${results[i].stud_id}'>Check Form</a></div>`;
                  //   var listString = listString + `<div class="ted1"><a href='assignRAC.html?stud_id=${results[i].stud_id}'>Assign RAC</a></div>`;
                  //   //var listString = listString + "<div class='hide'><input type='hidden' name = 'studVal' value='" + results[i].stud_id + "'";
                  //   var listString = listString + "<div class='ted2'><input type='submit' name='" + results[i].stud_id + "_accept' value='Approve' class='approve'><input type='submit' name='" + results[i].stud_id + "_reject' value='Discard' class='discard'></div></div>";
                  // //  var listString = listString + `</div>`;
                  //   var listString = listString + "<div class='ted1'><b>Thesis Title: &nbsp;</b>" + results[i].thesis_title + "</div>";
                    listString = listString + "</div>";
                }
                htmlFile = htmlFile.replace("{%list%}", listString);
            }
            res.send(htmlFile);
        });
    });

};

const supervisorApprovalSubmit = (req, res) => {
    var str = Object.keys(req.body)[0];
    var n = str.indexOf("_");
    var stud_id = str.substring(0, n);
    var status = str.substring(n + 1, str.length);
    console.log(n);
    console.log("stud_id" + stud_id);
    console.log("status" + status);
    var qry;
    var status_id;
    if (status === "reject") {
        qry = "UPDATE student SET registration_phase = 0 WHERE stud_id = '" + stud_id + "';";
        status_id = "Successfully Discared";
    } else {
        qry = "UPDATE student SET registration_phase = 2 WHERE stud_id = '" + stud_id + "';";
        status_id = "Successfully Approved";
    }
    con.query(qry, (err, results, fields) => {
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        res.render('notification', {message : status_id, status: 'success', backLink : "/supervisor", backText: "Back to supervisor portal"});
    });
};

const assignRAC = (req, res) => {
    var htmlFile = fs.readFileSync("views/supervisor/assignRAC.html", "utf-8");
    var sess = req.session;
    var studentID = req.query.stud_id;
    var qrys = "select prof_name from professor where prof_id = '" + sess.userid + "';";
    con.query(qrys, (err, ress, field) => {
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        htmlFile = htmlFile.replace("{%name%}", ress[0].prof_name);
        htmlFile = htmlFile.replace("{%student_id%}", studentID);
        htmlFile = htmlFile.replace("{%student_id%}", studentID);
        var deptqry = `SELECT dept_id FROM student WHERE stud_id='${studentID}'`;
        con.query(deptqry, (err, result, field) => {
            if(err)
            {
                res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                return
            }
            var qry = `SELECT * FROM professor WHERE prof_dept='${result[0].dept_id}'`;
            con.query(qry, (err, results, field) => {
                if(err)
                {
                    res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                    return
                }
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
            if(err)
            {
                res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                return
            }
            console.log(profArray[i]);
        });
    }
    res.render('notification', {message : 'RAC assigned successfully!', status: 'success', backLink : "/supervisor", backText: "Back to supervisor portal"});
}

function monthDiff(dateFrom, dateTo) {
    return dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));
}

const supervisorStudentsList = (req,res) => {
    var htmlFile = fs.readFileSync('views/supervisor/examiner.html','utf-8');
    var sess = req.session;
    var qry = `select * from student s left join professor p on s.supervisor_id = p.prof_id where s.supervisor_id = '${sess.userid}' and s.examiner_phase = '0' and registration_phase = '5';`;
    con.query(qry,(err,result,fields)=>{
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        // res.send(result);
        console.log(z);
        try{
            var formText = "";
            for(var i=0;i<result.length;i++)
            {
                formText += `<form action="/supervisor/addExaminer" method="POST" class="form-class">`;
                formText += `<div class="details">`;
                formText += `<div class="image-content">`;
                formText += `<img src="/student_photo/${result[i].photo_filename}" alt="Image Not Available">`;
                formText += `</div>`;
                formText += `<div class="rest-content">`;
                formText += `<div class="data1">`;
                formText += `<div class="rest-heading">Enrollment ID:</div>`;
                formText += `<div class="rest-ans">${result[i].Enrollment_ID}</div>`;
                formText +=  `</div>`;
                formText += `<div class="data2">`;
                formText += `<div class="rest-heading">Name:</div>`;
                formText += `<div class="rest-ans">${result[i].name}</div>`;
                formText += `</div>`;
                formText += `<div class="data1">`;
                formText += `<div class="rest-heading">Proposed Theme:</div>`;
                formText += `<div class="rest-ans">${result[i].thesis_title}</div>`;
                formText += `</div>`;
                formText += `<div class="data2">`;
                formText += `<div class="rest-heading">Current Year:</div>`;
                try{
                    var z = monthDiff(result[i].date_of_admission,new Date());
                }
                catch(e){
                    var z = 35;
                }
                var year = Math.ceil(z/12);
                var sem = (z%12) > 6 ? "2nd" : "1st";
                formText += `<div class="rest-ans">${year} Year ${sem} Semester</div>`;
                formText += `</div>`;
                formText += `<div class="data1">`;
                formText += `<div class="rest-heading">Date of Admission:</div>`;
                try{
                    var x = result[i].date_of_admission.toISOString().replace(/T/, ' ').split(" ")[0];
                }
                catch(e)
                {
                    var x = "Unknown";
                }
                formText += `<div class="rest-ans">${x}</div>`;
                formText += `</div>`;
                formText += `<div class="data2">`;
                formText += `<div class="rest-heading">Registration validity</div>`;
                formText += `<div class="rest-ans">${result[i].registration_validity + ' years'}</div>`;
                formText += `</div>`;
                formText += `</div>`;
                formText += `</div>`;
                formText += `<input type="submit" name="${result[i].stud_id}" value="Select Examiners">`;
                formText += `</form>`;
            }
            htmlFile = htmlFile.replace("{%forms%}",formText);
            htmlFile = htmlFile.replace("{%name%}",result[0].prof_name.toUpperCase());
            res.send(htmlFile);
        }
        catch(e){
            htmlFile = htmlFile.replace("{%forms%}","No Students Available");
            res.send(htmlFile);
        }
    });
};
const supervisorAddExaminer = (req,res) => {
    var studentId = Object.keys(req.body)[0];
    var htmlFile = fs.readFileSync('views/supervisor/addExam.html','utf-8');
    con.query(`select* from External group by Email`,(err,result,field) => {
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        console.log(result);
        var script1 = "var data = [];";
        var script2 = "var forData = [];";
        for(var i=0;i<result.length;i++)
        {
            if(result[i].Student_ID == studentId)
            {
                res.render('notification', {message : 'Examiner already selected for this Student!', status: 'error', backLink : "/supervisor", backText: "Back to supervisor portal"});
                return;
            }
            if(result[i].Type == 4)
                script2 += `\nforData.push(['${result[i].Email}','${result[i].Name}','${result[i].Designation}','${result[i].Address}','${result[i].State}','${result[i].Mobile}']);`;
            else
                script1 += `\ndata.push(['${result[i].Email}','${result[i].Name}','${result[i].Designation}','${result[i].Address}','${result[i].State}','${result[i].Mobile}']);`;
        }

        htmlFile = htmlFile.replace("{%studId%}",studentId);
        htmlFile = htmlFile.replace("{%studId%}",studentId);
        htmlFile = htmlFile.replace("{%data%}",script1);
        htmlFile = htmlFile.replace("{%forData%}",script2);
        res.send(htmlFile);
    });
}
const supervisorAddExaminerSubmit = (req,res) => {
    var x = req.body;
    var studentId = x.student;
    var qry = `insert into External (Name,Designation,Address,Email,Mobile,Student_ID,Type,State,Country) values`;
    qry += `("${x.name1}","${x.designation1}","${x.address1}","${x.email1}","${x.mobile1}","${studentId}",1,"West Bengal","INDIA"),`;
    qry += `("${x.name2}","${x.designation2}","${x.address2}","${x.email2}","${x.mobile2}","${studentId}",1,"West Bengal","INDIA"),`;
    qry += `("${x.name3}","${x.designation3}","${x.address3}","${x.email3}","${x.mobile3}","${studentId}",1,"West Bengal","INDIA"),`;
    qry += `("${x.name4}","${x.designation4}","${x.address4}","${x.email4}","${x.mobile4}","${studentId}",2,"${x.state4}","INDIA"),`;
    qry += `("${x.name5}","${x.designation5}","${x.address5}","${x.email5}","${x.mobile5}","${studentId}",2,"${x.state5}","INDIA"),`;
    qry += `("${x.name6}","${x.designation6}","${x.address6}","${x.email6}","${x.mobile6}","${studentId}",2,"${x.state6}","INDIA"),`;
    qry += `("${x.name7}","${x.designation7}","${x.address7}","${x.email7}","${x.mobile7}","${studentId}",3,"${x.state7}","INDIA"),`;
    qry += `("${x.name8}","${x.designation8}","${x.address8}","${x.email8}","${x.mobile8}","${studentId}",3,"${x.state8}","INDIA"),`;
    qry += `("${x.name9}","${x.designation9}","${x.address9}","${x.email9}","${x.mobile9}","${studentId}",4,"${x.state9}","${x.state9}"),`;
    qry += `("${x.name10}","${x.designation10}","${x.address10}","${x.email10}","${x.mobile10}","${studentId}",4,"${x.state10}","${x.state10}"),`;
    qry += `("${x.name11}","${x.designation11}","${x.address11}","${x.email11}","${x.mobile11}","${studentId}",4,"${x.state11}","${x.state11}");`;
    qry += `update student set examiner_phase = '1' WHERE stud_id = "${studentId}";`;
    //console.log(qry);
    con.query(qry,(err,result,field) => {
        if (err)
        {
            console.log(err);
            res.render('notification', {message : 'Examiner already selected for this student!', status: 'error', backLink : "/supervisor", backText: "Back to supervisor portal"});
        }
        res.render('notification', {message : 'Examiner added successfully!', status: 'success', backLink : "/supervisor", backText: "Back to supervisor portal"});
    });
}

module.exports = {
    supervisorApprovalPage,
    supervisorApprovalSubmit,
    assignRAC,
    racSubmit,
    supervisorStudentsList,
    supervisorAddExaminer,
    supervisorAddExaminerSubmit
}