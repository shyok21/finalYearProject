const fs = require('fs');
const con = require('./../../db.js');
const util = require('util');
const specialPage = (req, res) => {
    if (req.body.check == 'Y') {

        var htmlFile = fs.readFileSync('views/dbshow.html', 'utf-8');
        var qry = "select * from student s left join professor p on s.supervisor_id = p.prof_id left join department d on d.dept_id = s.dept_id where registration_phase = '5';";
        con.query(qry, (err, result, fil) => {
            var listField = "";

            for (var i = 0; i < result.length; i++) {
                listField += `<div class="det1">`;
                listField += `<div class="dets">${result[i].Enrollment_ID}</div>`;
                listField += `<div class="dets">${result[i].name}</div>`;
                listField += `<div class="dets">${result[i].prof_name}</div>`;
                listField += `<div class="dets">${result[i].dept_name}</div>`;
                listField += `</div>`;
            }

            var reshtmlFile = htmlFile.replace("{%studentlist%}", listField);
            res.send(reshtmlFile);
        });
    } else
        res.render('notification', {message : 'Access Denied!', status: 'error', backLink : "/supervisorPage", backText: "Back to supervisor portal"});
        
}
const specialSearchPage = (req, res) => {
    var htmlFile = fs.readFileSync('views/dbshow.html', 'utf-8');
    if (req.body.faculty == "") {
        var htmlFile = fs.readFileSync('views/dbshow.html', 'utf-8');
        var qry = "select * from student s left join professor p on s.supervisor_id = p.prof_id left join department d on d.dept_id = s.dept_id where registration_phase = '5';";
        con.query(qry, (err, result, fil) => {
            var listField = "";

            for (var i = 0; i < result.length; i++) {
                listField += `<div class="det1">`;
                listField += `<div class="dets">${result[i].Enrollment_ID}</div>`;
                listField += `<div class="dets">${result[i].name}</div>`;
                listField += `<div class="dets">${result[i].prof_name}</div>`;
                listField += `<div class="dets">${result[i].dept_name}</div>`;
                listField += `</div>`;
            }

            var reshtmlFile = htmlFile.replace("{%studentlist%}", listField);
            res.send(reshtmlFile);
        });
    } else {
        if (req.body.department == "") {
            var qry = `select* from student s left join professor p on s.supervisor_id = p.prof_id left join department d on s.dept_id = d.dept_id where registration_phase = '5' and fac_id='${req.body.faculty}'`;
            con.query(qry, (err, result, fil) => {
                var listField = "";

                for (var i = 0; i < result.length; i++) {
                    listField += `<div class="det1">`;
                    listField += `<div class="dets">${result[i].Enrollment_ID}</div>`;
                    listField += `<div class="dets">${result[i].name}</div>`;
                    listField += `<div class="dets">${result[i].prof_name}</div>`;
                    listField += `<div class="dets">${result[i].dept_name}</div>`;
                    listField += `</div>`;
                }

                var reshtmlFile = htmlFile.replace("{%studentlist%}", listField);
                console.log(req.body);
                res.send(reshtmlFile);
            });
        } else {
            var qry = `select * from student s left join professor p on s.supervisor_id = p.prof_id left join department d on s.dept_id = d.dept_id where registration_phase = '5' and s.dept_id='${req.body.department}';`;
            con.query(qry, (err, result, fil) => {
                var listField = "";
                try {
                    for (var i = 0; i < result.length; i++) {
                        listField += `<div class="det1">`;
                        listField += `<div class="dets">${result[i].Enrollment_ID}</div>`;
                        listField += `<div class="dets">${result[i].name}</div>`;
                        listField += `<div class="dets">${result[i].prof_name}</div>`;
                        listField += `<div class="dets">${result[i].dept_name}</div>`;
                        listField += `</div>`;
                    }

                    var reshtmlFile = htmlFile.replace("{%studentlist%}", listField);
                } catch (e) {
                    var reshtmlFile = htmlFile.replace("{%studentlist%}", "");
                }
                console.log(req.body);
                res.send(reshtmlFile);

            });
        }
    }

}
module.exports = {
    specialPage,
    specialSearchPage
}