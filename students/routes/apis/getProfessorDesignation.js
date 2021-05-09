const con = require('./../../db.js');
const util = require('util');

const getProfessorDesignation = (req, res) => {
    const prof_id = req.query.prof_id;
    var qry = util.format("select * from professor where prof_id='%s'", prof_id);
    return con.query(qry, (err, result, fields) => {
        if(err) {
            console.log(err);
            res.json(null);
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to student portal"});
        }
        else {
            res.json(result[0]);    
        }
    });
};

module.exports = getProfessorDesignation;