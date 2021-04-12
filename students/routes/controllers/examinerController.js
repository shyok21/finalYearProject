const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');

const examinerPage = (req,res) => {
    var sess = req.session;
    var qry = `select* from student where supervisor_id = '${sess.userid}';`;
    // console.log(qry);
    con.query(qry,(err,result,fields)=>{
        res.send(result);
    });
};
module.exports = {
    examinerPage
}