const con = require('./../../db.js');
const util = require('util');

const getFaculties = (req, res) => {

    console.log("Faculties API called");
    var qry = util.format("select * from faculty");
    return con.query(qry, (err, result, fields) => {
        if(err) {
            console.log(err);
            res.json(null);
        }
        else {
            console.log(result);
            res.json(result);   
        }
    });
};

module.exports = getFaculties;