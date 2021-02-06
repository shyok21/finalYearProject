const con = require('./../../db.js');
const util = require('util');

const getDepartments = (req, res) => {
    const fac_id = req.query.fac_id;
    var qry = util.format("select * from department where fac_id='%s'", fac_id);
    return con.query(qry, (err, result, fields) => {
        if(err) {
            console.log(err);
            res.json(null);
        }
        else {
            res.json(result);    
        }
    });
};

module.exports = getDepartments;