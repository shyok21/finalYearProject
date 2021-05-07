const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');

const dcRegistrationApproval = (req, res) => {
    var sess = req.session;
    var qry = "SELECT * FROM student s left join department d on s.dept_id = d.dept_id left join doctorate_committe dc on dc.fac_id = d.fac_id where dc.dc_id = '" + sess.userid + "' and registration_phase = 3";
    con.query(qry, (err, results, fields) => {
        res.render('DC/dcRegistrationApproval', {name: sess.userid, results: results});
    });
};

const dcRegistrationApprovalSubmit = (req, res) => {
    var str = Object.keys(req.body)[0];
    var n = str.indexOf("_");
    var stud_id = str.substring(0, n);
    var status = str.substring(n + 1, str.length);
    
    var qry;
    var status_id;
    if (status === "reject") {
        qry = "UPDATE student SET registration_phase = 0 WHERE stud_id = '" + stud_id + "';";
        status_id = "Successfully Discared";
    } else {
        qry = "UPDATE student SET registration_phase = 4 WHERE stud_id = '" + stud_id + "';";
        status_id = "Successfully Approved";
    }
    con.query(qry, (err, results, fields) => {
        res.render('notification', {message : status_id, status: 'success', backLink : "/dcRegistrationApproval", backText: "Back to DC portal"});
    });
};

const dcReportApproval = (req,res) => {
    var sess = req.session;
    var qry = "SELECT * FROM student s left join department d on s.dept_id = d.dept_id left join doctorate_committe dc on dc.fac_id = d.fac_id left join six_monthly_report r on s.stud_id = r.stud_id where dc.dc_id = '" + sess.userid + "' and approval_phase = '2'";
    con.query(qry, (err, results, fields) => {
        res.render('DC/dcReportApproval', {name: sess.userid, results: results});
    });
};

const dcReportApprovalSubmit = (req, res) => {
    var str = Object.keys(req.body)[0];
    var n = str.indexOf("_");
    var file_name = str.substring(0, n);
    var status = str.substring(n + 1, str.length);
    
    var qry;
    var status_id;
    if (status === "reject") {
        qry = "UPDATE six_monthly_report SET approval_phase = '0' WHERE file_name = '" + file_name + "';";
        status_id = "Successfully Discarded";
    } else {
        qry = "UPDATE six_monthly_report SET approval_phase = '3' WHERE file_name = '" + file_name + "';";
        status_id = "Successfully Approved";
    }
    con.query(qry, (err, results, fields) => {
        res.render('notification', {message : status_id, status: 'success', backLink : "/dcReportApproval", backText: "Back to DC portal"});
    });
};

const dcVivaReport = (req,res) => {
    var sess = req.session;
    var qry = "SELECT * FROM student s left join department d on s.dept_id = d.dept_id left join doctorate_committe dc on dc.fac_id = d.fac_id where dc.dc_id = '" + sess.userid + "' and s.viva_report_filename is not null";
    con.query(qry, (err, results, fields) => {
        res.render('DC/dcVivaReport', {name: sess.userid, results: results});
    });
};

const dcTitleChange = (req,res) => {
    var sess = req.session;
    var qry = "SELECT * FROM student s left join department d on s.dept_id = d.dept_id left join doctorate_committe dc on dc.fac_id = d.fac_id where dc.dc_id = '" + sess.userid + "' and s.new_title is not null";
    con.query(qry, (err, results, fields) => {
        res.render('DC/dcTitleChange', {name: sess.userid, results: results});
    });
};

const dcTitleChangeSubmit = (req, res) => {
    var str = Object.keys(req.body)[0];
    var n = str.indexOf("_");
    var stud_id = str.substring(0, n);
    var status = str.substring(n + 1, str.length);
    
    var qry;
    var status_id;
    if (status === "reject") {
        qry = "UPDATE student SET new_title = NULL WHERE stud_id = '" + stud_id + "';";
        status_id = "Successfully Discared";
    } else {
        qry = "UPDATE student SET thesis_title = new_title, new_title = NULL WHERE stud_id = '" + stud_id + "';";
        status_id = "Successfully Approved";
    }
    con.query(qry, (err, results, fields) => {
        res.render('notification', {message : status_id, status: 'success', backLink : "/dcTitleChange", backText: "Back to DC portal"});
    });
};

const dcRegistrationExtension = (req,res) => {
    var sess = req.session;
    var qry = "SELECT * FROM student s left join department d on s.dept_id = d.dept_id left join doctorate_committe dc on dc.fac_id = d.fac_id where dc.dc_id = '" + sess.userid + "' and s.extension_requested = 'Y'";
    con.query(qry, (err, results, fields) => {
        res.render('DC/dcRegistrationExtension', {name: sess.userid, results: results});
    });
};

const dcRegistrationExtensionSubmit = (req, res) => {
    var str = Object.keys(req.body)[0];
    var n = str.indexOf("_");
    var stud_id = str.substring(0, n);
    var status = str.substring(n + 1, str.length);
    
    var qry;
    var status_id;
    if (status === "reject") {
        qry = "UPDATE student SET extension_requested = NULL WHERE stud_id = '" + stud_id + "';";
        status_id = "Successfully Discared";
    } else {
        qry = "UPDATE student SET extension_requested = NULL, registration_validity = registration_validity + 1 WHERE stud_id = '" + stud_id + "';";
        status_id = "Successfully Approved";
    }
    con.query(qry, (err, results, fields) => {
        res.render('notification', {message : status_id, status: 'success', backLink : "/dcRegistrationExtension", backText: "Back to DC portal"});
    });
};

const dcExaminerApproval = (req,res) => {
    var sess = req.session;
    var qry = "SELECT * FROM student s where examiner_phase = '1'";
    con.query(qry, (err, results, fields) => {
        res.render('DC/dcExaminerApproval', {name: sess.userid, results: results});
    });
};

const dcExaminersList = (req,res) => {
    var sess = req.session;
    var stud_id = req.query.stud_id;
    var qry = "SELECT * FROM External where Student_ID ='" + stud_id + "'";
    con.query(qry, (err, results, fields) => {
        res.render('DC/dcExaminersList', {name: sess.userid, results: results});
    });
};

const dcExaminerApprovalSubmit = (req, res) => {
    var str = Object.keys(req.body)[0];
    var n = str.indexOf("_");
    var stud_id = str.substring(0, n);
    var status = str.substring(n + 1, str.length);
    
    var qry;
    var status_id;
    if (status === "reject") {
        qry = "UPDATE student SET examiner_phase = '0' WHERE stud_id = '" + stud_id + "'; DELETE from External where Student_ID = '" + stud_id + "';";
        status_id = "Successfully Discarded";
    } else {
        qry = "UPDATE student SET examiner_phase = '2' WHERE stud_id = '" + stud_id + "';";
        status_id = "Successfully Approved";
    }
    con.query(qry, (err, results, fields) => {
        res.render('notification', {message : status_id, status: 'success', backLink : "/dcExaminerApproval", backText: "Back to DC portal"});
    });
};

module.exports = {
    dcRegistrationApproval,
    dcRegistrationApprovalSubmit,
    dcReportApproval,
    dcReportApprovalSubmit,
    dcVivaReport,
    dcTitleChange,
    dcTitleChangeSubmit,
    dcRegistrationExtension,
    dcRegistrationExtensionSubmit,
    dcExaminerApproval,
    dcExaminersList,
    dcExaminerApprovalSubmit
}