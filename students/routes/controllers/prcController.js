const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');
const multer  = require('multer');

const prcRegistrationApproval = (req, res) => {
    var sess = req.session;
    var qry = "select * from student s left join prc p on s.dept_id = p.dept_id join department d on s.dept_id = d.dept_id where prc_id = '" + sess.userid + "' and registration_phase = 2";
    con.query(qry, (err, results, fields) => {
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        res.render('PRC/prcRegistrationApproval', {name: sess.userid, results: results});
    });
};

const prcRegistrationApprovalSubmit = (req, res) => {
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
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        res.render('notification', {message : status_id, status: 'success', backLink : "/prc/registrationApproval", backText: "Back to PRC portal"});
    });
};

const prcReportApproval = (req,res) => {
    var sess = req.session;
    var qry = "select * from student s join six_monthly_report r on s.stud_id = r.stud_id join prc p on p.dept_id = s.dept_id join department d on s.dept_id = d.dept_id where approval_phase='1' and prc_id='" + sess.userid + "'";
    con.query(qry, (err, results, fields) => {
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        res.render('PRC/prcReportApproval', {name: sess.userid, results: results});
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
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        res.render('notification', {message : status_id, status: 'success', backLink : "/prc/reportApproval", backText: "Back to PRC portal"});
    });
};

const prcVivaReport = (req,res) => {
    var sess = req.session;
    var qry = "select * from student s join prc p on p.dept_id = s.dept_id where prc_id='" + sess.userid + "'";
    con.query(qry, (err, results, fields) => {
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        res.render('PRC/prcVivaReport', {name: sess.userid, results: results});
    });
};

const prcVivaReportSubmit = (req,res) => {
    var sess = req.session;
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/' + file.fieldname)
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + '.pdf');
        }
    });

    var upload = multer({ storage }).fields(
        [{ 
            name: 'viva_report', maxCount: 1 
        }]
    );

    upload(req, res, function (err) {
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
         else {
            const filename = req.files['viva_report'][0].filename;
            var qry = util.format(
                `update student set viva_report_filename = "%s" where stud_id = "%s"`,
                filename, req.body.stud_id
            );
            con.query(qry, (err, result, fields) => {
                if(err)
                {
                    res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
                    return
                }
                else {
                    console.log("Report submitted successfully");
                    res.render('notification', {message : 'Report submission successful', status: 'success', backLink : "/prc/vivaReport", backText: "Back to PRC portal"});
                }    
            })
        }
    });
};

const downloadVivaReport = (req,res) => {
    const filename = req.query.filename;
    const path = "uploads/viva_report/" + filename;

    res.download(path, function (err) {
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
         else {
            console.log("Success");
        }
    });
}
const prcTitleChange = (req,res) => {
    var sess = req.session;
    var qry = "select * from student s join prc p on p.dept_id = s.dept_id where prc_id='" + sess.userid + "'";
    con.query(qry, (err, results, fields) => {
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        res.render('PRC/prcTitleChange', {name: sess.userid, results: results});
    });
};

const prcTitleChangeSubmit = (req,res) => {
    var sess = req.session;
    var qry = util.format(
        `update student set new_title = '%s' where stud_id = "%s"`,
        req.body.new_title, req.body.stud_id
    );
    con.query(qry, (err, result, fields) => {
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        else {
            console.log("Title change request submitted successfully");
            res.render('notification', {message : 'Title change request submitted successfully', status: 'success', backLink : "/prc/titleChange", backText: "Back to PRC portal"});
        }    
    })
};

const prcRegistrationExtension = (req,res) => {
    var sess = req.session;
    var qry = `select * from student s join prc p on p.dept_id = s.dept_id where prc_id="${sess.userid}" and registration_validity <= 7 and extension_requested = "N"`;
    con.query(qry, (err, results, fields) => {
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        res.render('PRC/prcRegistrationExtension', {name: sess.userid, results: results});
    });
};

const prcRegistrationExtensionSubmit = (req,res) => {
    var sess = req.session;
    var qry = util.format(
        `update student set extension_requested = 'Y' where stud_id = "%s"`,
        req.body.stud_id
    );
    con.query(qry, (err, result, fields) => {
        if(err)
        {
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to Home page"});
            return
        }
        else {
            console.log("Extension request submitted successfully");
            res.render('notification', {message : 'Extension request submitted successfully', status: 'success', backLink : "/prc/registrationExtension", backText: "Back to DC portal"});
        }    
    })
};

module.exports = {
    prcRegistrationApproval,
    prcRegistrationApprovalSubmit,
    prcReportApproval,
    prcReportApprovalSubmit,
    prcVivaReport,
    prcVivaReportSubmit,
    downloadVivaReport,
    prcTitleChange,
    prcTitleChangeSubmit,
    prcRegistrationExtension,
    prcRegistrationExtensionSubmit
}