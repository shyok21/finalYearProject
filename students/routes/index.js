const express = require('express');
const router = express.Router();
const auth = require('./../services/authorisation');

const { homePage, login, logout, forgetPassword,sendActivation,checkActivation,checkPassword } = require('./controllers/loginController');
const { registerPage, validate, verify } = require('./controllers/registerController');
const { applicationFormPage, applicationFormSubmit, downloadPDF } = require('./controllers/applicationFormController');
const { studentPage, submitReport, downloadReport, removeReport } = require('./controllers/studentController');
const { supervisorApprovalPage, supervisorApprovalSubmit, assignRAC, racSubmit, supervisorStudentsList, supervisorAddExaminer, supervisorAddExaminerSubmit } = require('./controllers/supervisorController');
const { prcRegistrationApproval, prcRegistrationApprovalSubmit, prcReportApproval, prcReportApprovalSubmit, prcVivaReport, prcVivaReportSubmit, downloadVivaReport, prcTitleChange, prcTitleChangeSubmit, prcRegistrationExtension, prcRegistrationExtensionSubmit } = require('./controllers/prcController');
const { dcRegistrationApproval, dcRegistrationApprovalSubmit,dcReportApproval, dcReportApprovalSubmit, dcVivaReport, dcTitleChange, dcTitleChangeSubmit, dcRegistrationExtension, dcRegistrationExtensionSubmit, dcExaminerApproval, dcExaminersList, dcExaminerApprovalSubmit } = require('./controllers/dcController');
const { vcPage, vcSelectExaminer, vcSelectExaminerSubmit } = require('./controllers/vcController');
const { examAccepted, examRejected, examCheck } = require('./controllers/examinerController');
const { specialPage, specialSearchPage } = require('./controllers/specialController');
const getFaculties = require('./apis/getFaculties.js');
const getDepartments = require('./apis/getDepartments.js');
const getProfessors = require('./apis/getProfessors.js');
const getProfessorDesignation = require('./apis/getProfessorDesignation.js');

/* URLs accessible to everyone */
router.get("/", homePage);
router.post("/login", login);
router.get("/logout", logout);
router.get("/forgetPassword",forgetPassword);
router.post("/sendActivation",sendActivation);
router.post("/checkActivation",checkActivation);
router.post("/checkPassword",checkPassword);
router.get("/registerPage", registerPage);
router.post("/validate", validate);
router.post("/verify", verify);
router.get("/examAccepted",  examAccepted);
router.get("/examRejected", examRejected);
router.post("/examCheck", examCheck);

/* URLs accessible to Vice chancellor only */
router.use("/vc", auth(["VC"]));
router.get("/vc", vcPage);
router.post("/vc/selectExaminer", vcSelectExaminer);
router.post("/vc/selectExaminer/submit", vcSelectExaminerSubmit);

/* URLs accessible to students only */
router.use("/student", auth(["stud"]));
router.get("/student/applicationForm", applicationFormPage);
router.post("/student/applicationForm/submit", applicationFormSubmit);
router.get("/student", studentPage);
router.get("/student/report/remove", removeReport);
router.post("/student/report/submit", submitReport);

/* URLs accessible to supervisor only */
router.use("/supervisor", auth(["sup", "hod"]));
router.get("/supervisor", supervisorApprovalPage);
router.post("/supervisor/approval/submit", supervisorApprovalSubmit);
router.get("/supervisor/assignRAC", assignRAC);
router.post("/supervisor/assignRAC/submit", racSubmit);
router.get("/supervisor/studentsList", supervisorStudentsList);
router.post("/supervisor/addExaminer", supervisorAddExaminer);
router.post("/supervisor/addExaminer/submit", supervisorAddExaminerSubmit);

/* URLs accessible to PRC only */
router.use("/prc", auth(["prc"]));
router.get("/prc/registrationApproval", prcRegistrationApproval);
router.post("/prc/registrationApproval/submit", prcRegistrationApprovalSubmit);
router.get("/prc/reportApproval", prcReportApproval);
router.post("/prc/reportApproval/submit", prcReportApprovalSubmit);
router.get("/prc/vivaReport", prcVivaReport);
router.post("/prc/vivaReport/submit", prcVivaReportSubmit);
router.get("/prc/titleChange", prcTitleChange);
router.post("/prc/titleChange/submit", prcTitleChangeSubmit);
router.get("/prc/registrationExtension", prcRegistrationExtension);
router.post("/prc/registrationExtension/submit", prcRegistrationExtensionSubmit);

/* URLs accessible to DC only */
router.use("/dc", auth(["dc"]));
router.get("/dc/registrationApproval", dcRegistrationApproval);
router.post("/dc/registrationApproval/submit", dcRegistrationApprovalSubmit);
router.get("/dc/reportApproval", dcReportApproval);
router.post("/dc/reportApproval/submit", dcReportApprovalSubmit);
router.get("/dc/vivaReport", dcVivaReport);
router.get("/dc/titleChange", dcTitleChange);
router.post("/dc/titleChange/submit", dcTitleChangeSubmit);
router.get("/dc/registrationExtension", dcRegistrationExtension);
router.post("/dc/registrationExtension/submit", dcRegistrationExtensionSubmit);
router.get("/dc/examinerApproval", dcExaminerApproval);
router.post("/dc/examinerApproval/submit", dcExaminerApprovalSubmit);
router.get("/dc/examinersList", dcExaminersList);
router.get("/dc/downloadVivaReport", downloadVivaReport);

/* URLs accessible to special supervisors only */
router.use("/hod", auth(["hod"]));
router.post("/hod/specialDB", specialPage);
router.post("/hod/searchDB", specialSearchPage);

/* URLs accessible to multiple user types */
router.get("/downloadReport", downloadReport);
router.get("/downloadPDF", downloadPDF);
router.get("/api/faculties", getFaculties);
router.get("/api/departments", getDepartments);
router.get("/api/professors", getProfessors);
router.get("/api/designation", getProfessorDesignation);

module.exports = router;