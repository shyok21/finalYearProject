const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');
var htmlFile = fs.readFileSync("views/applicationForm.html", "utf-8");

const applicationFormPage = (req, res) => {
    res.send(htmlFile);
}

const applicationFormSubmit = (req, res) => { 
    const { student_name,
            enrolment_number,
            student_email,
            dep_id,
            address1,
            address2,
            supervisor_id,
            cosupervisor_id,
            title }  = req.body;

    const address = address1 + ' ' + address2;
    const registration_phase = 1;
    var query = util.format(
        "insert into student values('%s','%s','%s','%s','%s','%d','%s','%s','%s');", 
        enrolment_number,
        student_name,
        student_email,
        address,
        title,
        registration_phase,
        supervisor_id,
        cosupervisor_id,
        dep_id
    );
    con.query(query, (err, results, fields) => {
        if(err) {
            console.log(err.message);
        }
        else {
            console.log("Student Added to Student Database");
            console.log(results);
            res.send("<h1>Waiting for approval<h1>");
        }
        
    });
}

module.exports = {
    applicationFormPage,
    applicationFormSubmit
}
