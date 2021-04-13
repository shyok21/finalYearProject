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
    var qry = `select* from student where supervisor_id = '${sess.userid}';`;
    // console.log(qry);
    con.query(qry,(err,result,fields)=>{
        // res.send(result);
        var x = result[0].date_of_admission;
        var y = new Date();
        var z = monthDiff(x,y);
        console.log(z);
        try{
            var formText = "";
            for(var i=0;i<result.length;i++)
            {
                formText += `<form action="/selectExaminer" method="POST" class="form-class">`;
                formText += `<div class="details">`;
                formText += `<div class="image-content">`;
                formText += `<img src="student_photo/${result[i].stud_id}" alt="Image Not Available">`;
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
                formText += `<div class="rest-ans">${result[i].proposed_theme}</div>`;
                formText += `</div>`;
                formText += `<div class="data2">`;
                formText += `<div class="rest-heading">Current Year:</div>`;
                var z = monthDiff(result[i].date_of_admission,new Date());
                var year = Math.ceil(z/12);
                var sem = (z%12) > 6 ? "2nd" : "1st";
                formText += `<div class="rest-ans">${year} Year ${sem} Semester</div>`;
                formText += `</div>`;
                formText += `<div class="data1">`;
                formText += `<div class="rest-heading">Date of Admission:</div>`;
                var x = result[i].date_of_admission.toISOString().replace(/T/, ' ').split(" ")[0];
                formText += `<div class="rest-ans">${x}</div>`;
                formText += `</div>`;
                formText += `<div class="data2">`;
                formText += `<div class="rest-heading">Date of Passout (Expected):</div>`;
                formText += `<div class="rest-ans">${result[i].passout_date}</div>`;
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
    res.send(studentId);
}
module.exports = {
    examinerPage,
    addExaminer
}