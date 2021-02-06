const con = require('./../../db.js');
const util = require('util');

const getProfessorDesignation = (req, res) => {
    const prof_id = req.query.prof_id;
    var qry = util.format("select * from professor where prof_id='%s'", prof_id);
    return con.query(qry, (err, result, fields) => {
        if(err) {
            console.log(err);
            res.json(null);
        }
        else {
            res.json(result[0]);    
        }
    });
};

module.exports = getProfessorDesignation;