const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(express.static(__dirname + '/public'));
var htmlFile = fs.readFileSync("./index.html", "utf-8");
var htmlFileSend = htmlFile.replace("{%Login Error%}", "");
var x = fs.readFileSync('../tempDatabase/Student.txt', 'utf-8');
var students = x.split("\n");
var tempStudent = [];
for (var i = 0; i < students.length; i++) {
    var t = students[i].split(",");
    tempStudent.push(t);
}
var tempPRC = [
    ['shyok.m', 'shyokju', 'Shyok Mutsuddi', 'CE'],
    ['shubham.g', 'shubhamju', 'Shubham Goel', 'ME'],
    ['abhishek.d', 'abhishekju', 'Abhishek De', 'CSE'],
    ['roopkatha.s', 'roopkathaju', 'Roopkatha Samanta', 'EE']
];
var tempDC = ['abhishek.g', 'abhishekju', 'Abhishek Goel'];
isExist = (usr, psw) => {
    for (var i = 0; i < tempStudent.length; i++) {
        if (usr === tempStudent[i][0] && psw === tempStudent[i][1])
            return i;
    }
    return -1;
}
isExistDC = (usr, psw) => {
    if (usr === tempDC[0] && psw === tempDC[1])
        return 1;
    return 0;
}
getDept = (usr, psw) => {
    for (var i = 0; i < tempPRC.length; i++) {
        if (usr === tempPRC[i][0] && psw === tempPRC[i][1])
            return tempPRC[i][3];
    }
    return -1;
}
getStudents = (dept) => {

    var str = "";
    for (var i = 0; i < tempStudent.length; i++) {
        if (tempStudent[i][5] == 0) {
            if (tempStudent[i][3] === dept)
                str = str + tempStudent[i][2] + "&nbsp;&nbsp;" + tempStudent[i][4] + "<br>";
        }
    }
    return str;
}
getStudentDC = (phase) => {
    var str = "";
    for (var i = 0; i < tempStudent.length; i++) {
        if (phase == tempStudent[i][5]) {
            str = str + tempStudent[i][2] + "&nbsp;&nbsp;" + tempStudent[i][4] + "<br>";
        }
    }
    return str;
}
app.get("/", (req, res) => {
    res.send(htmlFileSend);
});
app.post("/login", urlencodedParser, (req, res) => {
    console.log(req.body);
    var isEmpty = 0;
    if (req.body.username == '' || req.body.password == '') {
        var htmlNewFile = htmlFile.replace("{%Login Error%}", "&#9888; Username & Password Can't be Empty!");
        var htmlNewFile = htmlNewFile.replace("{%error-type%}", "login-invalid");
        isEmpty = 1;
        res.send(htmlNewFile);
    }
    if (isEmpty == 0) {
        var log = req.body.logintype;
        if (log === 'Student') {
            var flag = isExist(req.body.username, req.body.password);
            if (flag == -1) {
                var htmlNewFile = htmlFile.replace("{%Login Error%}", "&#9746; Invalid Username or Password!");
                var htmlNewFile = htmlNewFile.replace("{%error-type%}", "login-cross");
                res.send(htmlNewFile);
            } else {
                res.send('Hello');
            }
        } else if (log === 'PRC') {
            var dept = getDept(req.body.username, req.body.password);
            if (dept == -1) {
                var htmlNewFile = htmlFile.replace("{%Login Error%}", "&#9746; Invalid Username or Password!");
                var htmlNewFile = htmlNewFile.replace("{%error-type%}", "login-cross");
                res.send(htmlNewFile);
            } else {
                console.log(dept);
                var str = getStudents(dept);
                res.send(str);
            }

        } else if (log === 'DC') {
            var flag = isExistDC(req.body.username, req.body.password);
            if (flag == 0) {
                var htmlNewFile = htmlFile.replace("{%Login Error%}", "&#9746; Invalid Username or Password!");
                var htmlNewFile = htmlNewFile.replace("{%error-type%}", "login-cross");
                res.send(htmlNewFile);
            } else {
                var str = getStudentDC(1);
                res.send(str);
            }
        } else {
            res.send('Link Broken');
        }
    }

});
var port = 8000;
app.listen(port, () => {
    console.log("Server Created!");
    console.log("https://localhost:" + port + "/");
});