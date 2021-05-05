const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');
function monthDiff(dateFrom, dateTo) {
 return dateTo.getMonth() - dateFrom.getMonth() + 
   (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
}
const examinerPage = (req,res) => {
    var htmlFile = fs.readFileSync('views/examiner.html','utf-8');
    var sess = req.session;
    var qry = `select * from student where supervisor_id = '${sess.userid}' and examiner_phase = '0';`;
    con.query(qry,(err,result,fields)=>{
        // res.send(result);
        console.log(z);
        try{
            var formText = "";
            for(var i=0;i<result.length;i++)
            {
                formText += `<form action="/selectExaminer" method="POST" class="form-class">`;
                formText += `<div class="details">`;
                formText += `<div class="image-content">`;
                formText += `<img src="student_photo/${result[i].photo_filename}" alt="Image Not Available">`;
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
                formText += `<div class="rest-heading">Date of Passout (Expected):</div>`;
                try{
                var y = result[i].passout_date.toISOString().replace(/T/, ' ').split(" ")[0];
                }
                catch(e)
                {
                    var y = "Unknown";
                }
                formText += `<div class="rest-ans">${y}</div>`;
                formText += `</div>`;
                formText += `</div>`;
                formText += `</div>`;
                formText += `<input type="submit" name="${result[i].stud_id}" value="Select Examiners">`;
                formText += `</form>`;
            }
            htmlFile = htmlFile.replace("{%forms%}",formText);
            res.send(htmlFile);
        }
        catch(e){
            htmlFile = htmlFile.replace("{%forms%}","No Students Available");
            res.send(htmlFile);
        }
    });
};
const addExaminer = (req,res) => {
    var studentId = Object.keys(req.body)[0];
    var htmlFile = fs.readFileSync('views/addExam.html','utf-8');
    con.query(`select* from External group by Email`,(err,result,field) => {
        console.log(result);
        var script = "var data = [";
        for(var i=0;i<result.length;i++)
        {
            if(result[i].Student_ID == studentId)
            {
                res.render('notification', {message : 'Examiner already selected for this Student!', status: 'error', backLink : "/supervisorPage", backText: "Back to supervisor portal"});
                return;
            }
            script += `['${result[i].Email}','${result[i].Name}','${result[i].Designation}','${result[i].Address}','${result[i].State}','${result[i].Mobile}']`;
            if(i != result.length-1)
                script += ',';
        }
        script += `];`;

        htmlFile = htmlFile.replace("{%studId%}",studentId);
        htmlFile = htmlFile.replace("{%studId%}",studentId);
        htmlFile = htmlFile.replace("{%data%}",script);
        res.send(htmlFile);
    });
}
const addExam = (req,res) => {
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
    qry += `("${x.name8}","${x.designation8}","${x.address8}","${x.email8}","${x.mobile8}","${studentId}",3,"${x.state8}","INDIA");`;
    qry += `update student set examiner_phase = '1' WHERE stud_id = "${studentId}";`;
    con.query(qry,(err,result,field) => {
        if (err)
        {
            res.render('notification', {message : 'Examiner already selected for this student!', status: 'error', backLink : "/supervisorPage", backText: "Back to supervisor portal"});
        }
        res.render('notification', {message : 'Examiner added successfully!', status: 'success', backLink : "/supervisorPage", backText: "Back to supervisor portal"});
    });
}
module.exports = {
    examinerPage,
    addExaminer,
    addExam
}