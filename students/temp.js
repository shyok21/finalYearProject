const fs = require('fs');
var x = fs.readFileSync('../tempDatabase/Student.txt', 'utf-8');
var students = x.split("\n");
var tempStudent = []
for (var i = 0; i < students.length; i++) {
    var t = students[i].split(",");
    tempStudent.push(t);
}
console.log(tempStudents[0]);