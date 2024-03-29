const con = require('./../../db.js');
const util = require('util');

const getProfessors = (req, res) => {
    const dept_id = req.query.dept_id;
    var qry = util.format("select * from professor where prof_dept='%s'", dept_id);
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

module.exports = getProfessors;