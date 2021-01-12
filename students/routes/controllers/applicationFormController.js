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
    const { 
        student_name,
        enrolment_number,
        nationality,
        dob,
        sex,
        marital_status,
        parent_name,
        category,
        mobile_no,
        dep_id,
        address1,
        address2,
        org_name,
        nature_of_work,
        title,
        sop,
        supervisor_id,
    }  = req.body;

    const registration_phase = 1;
    var query = util.format(
        `insert into student 
        (stud_id, name, nationality, dob, sex, marritial_status, parent_name, perm_address, addr_for_communication, mobile_no, category, present_emp_org, present_org_work, proposed_theme, proposed_statement_of_purpose, registration_phase, supervisor_id, dept_id )
        values('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%d','%s','%s');`, 
        enrolment_number,
        student_name,
        nationality,
        dob,
        sex,
        marital_status,
        parent_name,
        address1,
        address2,
        category,
        mobile_no,
        org_name,
        nature_of_work,
        title,
        sop,
        registration_phase,
        supervisor_id,
        dep_id
    );
    con.query(query, (err, results, fields) => {
        if(err) {
            console.log(err.message);
            console.log(results);
            res.redirect("/");
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
