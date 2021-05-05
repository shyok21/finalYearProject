const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');

const supervisorApprovalController = (req, res) => {
    var str = Object.keys(req.body)[0];
    var n = str.indexOf("_");
    var stud_id = str.substring(0, n);
    var status = str.substring(n + 1, str.length);
    // console.log(n);
    // console.log(stud_id);
    // console.log(status);
    var qry;
    var status_id;
    if (status === "reject") {
        qry = "UPDATE student SET registration_phase = 0 WHERE stud_id = '" + stud_id + "';";
        status_id = "Successfully Discared";
    } else {
        qry = "UPDATE student SET registration_phase = 2 WHERE stud_id = '" + stud_id + "';";
        status_id = "Successfully Approved";
    }
    con.query(qry, (err, results, fields) => {
        res.render('notification', {message : status_id, status: 'success', backLink : "/supervisorPage", backText: "Back to supervisor portal"});
    });
};
module.exports = {
    supervisorApprovalController
}