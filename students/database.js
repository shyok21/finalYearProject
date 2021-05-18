const fs = require('fs');
var randomSentence = require('random-sentence');
// const con = require('./db');
const getFormat = (i) => {
	if(i<10)
		return "0"+i;
	return i;
}
const getEmail = (name,i) => {
	var names = name.split(" ");
	var email = `${names[0].toLowerCase()}${getFormat(i)}@gmail.com`;
	return email;
}
const getParentName = (name) => {
	var names = name.split(" ");
	return `Mr. ${names[1]}`;
}
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
randomSentence({min: 10, max: 20});

var student = fs.readFileSync('data.txt','utf-8');
var students = student.split("\n");
const password = '$2b$10$.yI0XU2ftyb7c5K3pNuJ7ezZ2ctl1LlnlEVNjVQOZ84DmpkgzlMmm';
var mainId = 'Stud0000';
//var sql = `INSERT INTO student (stud_id, name, nationality, dob, sex, marritial_status,parent_name, perm_address, addr_for_communication, mobile_no, category, present_emp_org, present_org_work, proposed_institute, thesis_title, registration_phase, supervisor_id, co_supervisor_id, dept_id, Enrollment_ID, payment_received, last_report_submitted, date_of_admission, passout_date,new_title, viva_report_filename, extension_requested, examiner_phase, photo_filename, registration_validity) VALUES`;
// for (var i=0;i<students.length;i++)
// {
// 	var dob = randomDate(new Date(1995,12,31),new Date(1999,12,31));
// 	var address = randomSentence({min: 5, max: 8});
// 	var thesis = randomSentence({min: 10, max: 20});
// 	if (i%2 ==0)
// 		sql += `('${mainId}${getFormat(i)}','${students[i]}','INDIAN','${dob}','M','unmarried','${getParentName(students[i])}','${address}','${address}','9386373474','general','Jadavpur','Student','JU','${thesis}',5,'CSE0403',NULL,'ENGG04', '0017105010${getFormat(i+1)}', 'Y', NULL, '2021-05-06', '2026-05-06', NULL, NULL, 'N', '0', 'pic1', 5),`;
// 	else
// 		sql += `('${mainId}${getFormat(i)}','${students[i]}','INDIAN','${dob}','M','unmarried','${getParentName(students[i])}','${address}','${address}','9386373474','general','Jadavpur','Student','JU','${thesis}',5,'CSE0400',NULL,'ENGG04', '0017105010${getFormat(i+1)}', 'Y', NULL, '2021-05-06', '2026-05-06', NULL, NULL, 'N', '0', 'pic1', 5),`;
// }
// console.log(sql);
var sql = `INSERT INTO login (id, email, password, type, special_user) VALUES`;
for (var i=0;i<students.length;i++)
{
	sql += `('${mainId}${getFormat(i)}','${getEmail(students[i],i)}','${password}','stud','N'),`;
}
console.log(sql);