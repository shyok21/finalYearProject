const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(express.static(__dirname + '/public'));
var htmlFile = fs.readFileSync("./index.html", "utf-8");
var htmlFileSend = htmlFile.replace("{%Login Error%}", "");
var tempStudent = [
    ['shubham', 'shubhamju', 'Shubham Goel', 'CSE01'],
    ['abhishek', 'abhishekju', 'Abhishek De', 'CSE02'],
    ['roopkatha', 'roopkathaju', 'Roopkatha Samanta', 'CSE03'],
    ['shyok', 'shyokju', 'Shyok Mutsuddi', 'CSE04']
];
isExist = (usr, psw) => {
    for (var i = 0; i < tempStudent.length; i++) {
        if (usr === tempStudent[i][0] && psw === tempStudent[i][1])
            return i;
    }
    return -1;
}
app.get("/", (req, res) => {
    res.send(htmlFileSend);
});
app.post("/login", urlencodedParser, (req, res) => {
    console.log(req.body);
    if (req.body.login === 'Log In') {
        var flag = isExist(req.body.username, req.body.password);
        if (req.body.username == '' || req.body.password == '') {
            var htmlNewFile = htmlFile.replace("{%Login Error%}", "&#9888; Username & Password Can't be Empty!");
            var htmlNewFile = htmlNewFile.replace("{%error-type%}", "login-invalid");
            res.send(htmlNewFile);
        } else if (flag >= 0) {
            res.send("<h1>Hello " + tempStudent[flag][2] + "</h1>" + "<h2>Your Register ID is " + tempStudent[flag][3] + "</h2>");
        } else {
            var htmlNewFile = htmlFile.replace("{%Login Error%}", "&#9746; Invalid Username or Password!");
            var htmlNewFile = htmlNewFile.replace("{%error-type%}", "login-cross");
            res.send(htmlNewFile);
        }
    } else {
        res.send("<h1>Registration Link will be Available Soon!</h1>");
    }
});
var port = 5500;
app.listen(port, () => {
    console.log("Server Created!");
    console.log("https://localhost:" + port + "/");
});