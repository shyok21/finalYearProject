const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');

const supervisorApprovalController = (req, res) => {
    res.send(req.body);
};
module.exports = {
    supervisorApprovalController
}