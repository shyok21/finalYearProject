const fs = require('fs');
const con = require('./../../db.js');
const createPDF = require('./../../services/createPDF');
const util = require('util');
var multer  = require('multer')

const applicationFormPage = (req, res) => {
    var sess = req.session;
    if(sess.email) {
        res.render('applicationForm', { email: sess.email });
    }
    else {
        res.redirect('/');
    }
        
}

const applicationFormSubmit = (req, res) => { 
    var sess = req.session;

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/' + file.fieldname)
        },
        filename: function (req, file, cb) {
          cb(null, sess.userid);
        }
    });
    var upload = multer({ storage }).fields([{ name: 'student_photo', maxCount: 1 }, { name: 'sop', maxCount: 1 }]);
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            
            // PDF creation
            const data  = req.body;
            data.stud_id = sess.userid;
            const html = "views/applicationPDF.ejs";
            const path = "uploads/student_pdf/" + sess.userid + ".pdf";
            createPDF(html, data, path);
            console.log("hiii");
            //res.render('applicationPDF', {data : data});
            const { 
                student_name, nationality, dob, sex, marital_status, parent_name, category, 
                mobile_no, dep_id, address1, address2, org_name, nature_of_work, 
                proposed_institute,title, sop, supervisor_id,
            } = req.body;
        
            
            const registration_phase = 1;
            var query = util.format(
                `insert into student 
                (stud_id, name, nationality, dob, sex, marritial_status, parent_name, perm_address, addr_for_communication, mobile_no, category, present_emp_org, present_org_work, proposed_theme, proposed_statement_of_purpose, proposed_institute, registration_phase, supervisor_id, dept_id )
                values('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s', '%s', '%d','%s','%s');`, 
                sess.userid, student_name, nationality, dob, sex, marital_status, parent_name, 
                address1, address2, mobile_no, category, org_name, nature_of_work, title, sop, 
                proposed_institute, registration_phase, supervisor_id, dep_id
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
    
    });
    

    /*
    
    */
}

const downloadPDF = (req, res) => {
    const stud_id = req.query.stud_id;
    const path = "uploads/student_pdf/" + stud_id + ".pdf";
    res.download(path, function (err) {
        if (err) {
            console.log("Error");
            console.log(err);
        } else {
            console.log("Success");
        }
    });
}
module.exports = {
    applicationFormPage,
    applicationFormSubmit,
    downloadPDF
}
