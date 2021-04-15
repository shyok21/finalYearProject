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
        res.send("<h1><a href='/dcRegistrationApproval'>" + status_id + "</a><h1>");
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
        res.send("<h1><a href='/dcReportApproval'>" + status_id + "</a><h1>");
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
        qry = "UPDATE student SET proposed_theme = new_title, new_title = NULL WHERE stud_id = '" + stud_id + "';";
        status_id = "Successfully Approved";
    }
    con.query(qry, (err, results, fields) => {
        res.send("<h1><a href='/dcTitleChange'>" + status_id + "</a><h1>");
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
        qry = "UPDATE student SET extension_requested = NULL, passout_date = DATE_ADD(passout_date, INTERVAL 1 YEAR) WHERE stud_id = '" + stud_id + "';";
        status_id = "Successfully Approved";
    }
    con.query(qry, (err, results, fields) => {
        res.send("<h1><a href='/dcRegistrationExtension'>" + status_id + "</a><h1>");
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
    dcRegistrationExtensionSubmit
}