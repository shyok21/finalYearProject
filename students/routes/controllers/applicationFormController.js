const fs = require('fs');
const con = require('./../../db.js');
const createPDF = require('./../../services/createPDF');
const mergePDF = require('./../../services/mergePDF');
const util = require('util');
const multer  = require('multer');
const { ROOT_URL } = require('./../../config');

const applicationFormPage = (req, res) => {
    var sess = req.session;
    if(sess.email) {
        res.render('student/applicationForm', { email: sess.email, ROOT_URL: ROOT_URL });
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
          cb(null, sess.userid + '-' + Date.now());
        }
    });
    var upload = multer({ storage }).fields(
        [{ 
            name: 'student_photo', maxCount: 1 
        }, { 
            name: 'sop', maxCount: 1 
        }, {
            name: 'qualified-docs', maxCount: 4
        }, , {
            name: 'marksheets', maxCount: 12
        }]
    );

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
        } else {
            
            const data  = req.body;
            data.photoPath = req.files['student_photo'][0].path;
            console.log(data.photoPath);
            const html = "views/applicationPDF.ejs";
            const path = "uploads/student_pdf/" + sess.userid + ".pdf";
            // Create student PDF
            createPDF(html, data, path, (err, path) => {
                if(err) {
                    console.log(err);
                    res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                    return
                } else {
                    const sop = req.files['sop'][0].path;
                    const marksheets = req.files['marksheets'].map(doc => doc.path);
                    const qualified_docs = req.files['qualified-docs'].map(doc => doc.path);
                    const pdfs = [path, sop].concat(marksheets).concat(qualified_docs);
                    // Merge pdf with SOP and certificates
                    mergePDF(pdfs, path, function (err) {
                        if (err) {
                            console.log(err);
                            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                        } else {
                            console.log('Successfully merged pdfs');
                            const { 
                                student_name, nationality, dob, sex, marital_status, parent_name, category, 
                                mobile_no, dep_id, address1, address2, org_name, nature_of_work, 
                                proposed_institute,title, sop, supervisor_id,
                            } = req.body;
                        
                            const photo_filename = req.files['student_photo'][0].filename;
                            const registration_phase = 1;
                            const date_of_admission = new Date();
                            const registration_validity = 5;
                            console.log(date_of_admission);
                            var query = util.format(
                                `insert into student 
                                (stud_id, name, nationality, dob, sex, marritial_status, parent_name, perm_address, addr_for_communication, mobile_no, category, present_emp_org, present_org_work, thesis_title, proposed_institute, registration_phase, supervisor_id, dept_id, date_of_admission, registration_validity, photo_filename )
                                values('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s', '%s', '%d','%s','%s', '%s', %d, '%s');`, 
                                sess.userid, student_name, nationality, dob, sex, marital_status, parent_name, 
                                address1, address2, mobile_no, category, org_name, nature_of_work, title, 
                                proposed_institute, registration_phase, supervisor_id, dep_id, date_of_admission, 
                                registration_validity, photo_filename
                            );
                            con.query(query, (err, results, fields) => {
                                if(err) {
                                    console.log(err);
                                    res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                                    return
                                }
                                else {
                                    console.log("Student Added to Student Database");
                                    console.log(results);
                                    res.redirect("/student");
                                }
                                
                            });
                        }
                        
                    });
                }
                
            });
        }
    
    });

}

const downloadPDF = (req, res) => {
    const stud_id = req.query.stud_id;
    const path = "uploads/student_pdf/" + stud_id + ".pdf";
    res.download(path, function (err) {
        if (err) {
            console.log("Error");
            console.log(err);
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to student portal"});
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
