const con = require('./../../db.js');
const util = require('util');

const getFaculties = (req, res) => {

    console.log("Faculties API called");
    var qry = util.format("select * from faculty");
    return con.query(qry, (err, result, fields) => {
        if(err) {
            console.log(err);
            res.json(null);
            res.render('notification', {message : 'There seems to be a problem!', status: 'error', backLink : "/", backText: "Back to student portal"});
        }
        else {
            console.log(result);
            res.json(result);   
        }
    });
};

module.exports = getFaculties;