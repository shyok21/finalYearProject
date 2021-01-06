const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');

const applicationFormPage = (req, res) => {
    var htmlFile = fs.readFileSync("views/applicationForm.html", "utf-8");
    var sess = req.session;
    if(sess.email) {
        htmlFile = htmlFile.replace("{%enrolment_no%}", sess.userid);
        htmlFile = htmlFile.replace("{%email%}", sess.email);
        res.send(htmlFile);
    }
    else {
        res.redirect('/');
    }
        
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
            res.redirect("/studentPage");
        }
        
    });
}

module.exports = {
    applicationFormPage,
    applicationFormSubmit
}
