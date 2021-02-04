const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');

const supervisorPage = (req, res) => {
    var htmlFile = fs.readFileSync("views/supervisor.html", "utf-8");
    var sess = req.session;
    var qry = "select * from student where supervisor_id = '" + sess.userid + "' and registration_phase = 1";
    con.query(qry, (err, results, fields) => {
        if (results.length == 0)
            var htmlFile = htmlFile.replace("{%list%}", "No Approval List");
        else {
            var listString = "";
            for (var i = 0; i < results.length; i++) {
                var listString = listString + "<div class='list1'>";
                var listString = listString + "<div class='det1'>" + results[i].name + "</div>";
                var listString = listString + "<div class='det1'>" + results[i].nationality + "</div>";
                var listString = listString + "<div class='det1'>" + results[i].dob + "</div>";
                var listString = listString + "<div class='det1'>" + results[i].sex + "</div>";
                var listString = listString + "<div class='det1'>" + results[i].category + "</div>";
                var listString = listString + "<div class='det1'>" + results[i].proposed_theme + "</div>";
                var listString = listString + "<div class='det2'><input type='submit' name='stud1_accept' value='Approve' class='approve'><input type='submit' name='stud1_reject' value='Discard' class='discard'></div></div>";

            }
            var htmlFile = htmlFile.replace("{%list%}", listString);
        }
        res.send(htmlFile);
    });
};
module.exports = {
    supervisorPage
}