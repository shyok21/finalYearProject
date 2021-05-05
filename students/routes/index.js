const express = require('express');
const router = express.Router();
const auth = require('./../services/authorisation');

const { homePage, login, logout } = require('./controllers/loginController');
const { registerPage, validate, verify } = require('./controllers/registerController');
const { applicationFormPage, applicationFormSubmit, downloadPDF } = require('./controllers/applicationFormController');
const { studentPage, submitReport, downloadReport, removeReport } = require('./controllers/studentController');
const { supervisorPage, assignRAC, racSubmit } = require('./controllers/supervisorController');
const { supervisorApprovalController } = require('./controllers/supervisorApprovalController');
const { prcRegistrationApproval, prcRegistrationApprovalSubmit, prcReportApproval, prcReportApprovalSubmit, prcVivaReport, prcVivaReportSubmit, downloadVivaReport, prcTitleChange, prcTitleChangeSubmit, prcRegistrationExtension, prcRegistrationExtensionSubmit } = require('./controllers/prcController');
const { dcRegistrationApproval, dcRegistrationApprovalSubmit,dcReportApproval, dcReportApprovalSubmit, dcVivaReport, dcTitleChange, dcTitleChangeSubmit, dcRegistrationExtension, dcRegistrationExtensionSubmit, dcExaminerApproval, dcExaminersList, dcExaminerApprovalSubmit } = require('./controllers/dcController');
const { specialPage, specialSearchPage } = require('./controllers/specialController');
const getFaculties = require('./apis/getFaculties.js');
const getDepartments = require('./apis/getDepartments.js');
const getProfessors = require('./apis/getProfessors.js');
const getProfessorDesignation = require('./apis/getProfessorDesignation.js');
const { examinerPage,addExaminer,addExam } = require('./controllers/examinerController');
const { addExaminerVC, selectExams, examSelected, examAccepted, examRejected, examCheck} = require('./controllers/vcController');

/* URLs accessible to everyone */
router.get("/", homePage);
router.post("/login", login);
router.get("/logout", logout);
router.get("/registerPage", registerPage);
router.post("/validate", validate);
router.post("/verify", verify);
router.get("/examAccepted",  examAccepted);
router.get("/examRejected", examRejected);
router.post("/examCheck", examCheck);

/* URLs accessible to Vice chancellor only */
router.get("/vcPage", auth(["VC"]), addExaminerVC);
router.post("/selectExams", auth(["VC"]), selectExams);
router.post("/examSelected", auth(["VC"]), examSelected);

/* URLs accessible to students only */
router.get("/applicationFormPage", auth(["stud"]), applicationFormPage);
router.post("/applicationFormSubmit", auth(["stud"]), applicationFormSubmit);
router.get("/studentPage", auth(["stud"]), studentPage);
router.get("/removeReport", auth(["stud"]), removeReport);
router.get("/api/faculties", auth(["stud"]), getFaculties);
router.get("/api/departments", auth(["stud"]), getDepartments);
router.get("/api/professors", auth(["stud"]), getProfessors);
router.get("/api/designation", auth(["stud"]), getProfessorDesignation);
router.post("/submitReport", auth(["stud"]), submitReport);

/* URLs accessible to supervisor only */
router.get("/supervisorPage", auth(["sup", "hod"]), supervisorPage);
router.post("/supervisorApproval", auth(["sup", "hod"]), supervisorApprovalController);
router.get("/assignRAC.html", auth(["sup", "hod"]), assignRAC);
router.post("/racSubmit", auth(["sup", "hod"]), racSubmit);
router.get("/myStudents", auth(["sup", "hod"]), examinerPage);
router.post("/selectExaminer", auth(["sup", "hod"]), addExaminer);
router.post("/addedExaminer", auth(["sup", "hod"]), addExam);

/* URLs accessible to PRC only */
router.get("/prcRegistrationApproval", auth(["prc"]), prcRegistrationApproval);
router.post("/prcRegistrationApprovalSubmit", auth(["prc"]), prcRegistrationApprovalSubmit);
router.get("/prcReportApproval", auth(["prc"]), prcReportApproval);
router.post("/prcReportApprovalSubmit", auth(["prc"]), prcReportApprovalSubmit);
router.get("/prcVivaReport", auth(["prc"]), prcVivaReport);
router.post("/prcVivaReportSubmit", auth(["prc"]), prcVivaReportSubmit);
router.get("/prcTitleChange", auth(["prc"]), prcTitleChange);
router.post("/prcTitleChangeSubmit", auth(["prc"]), prcTitleChangeSubmit);
router.get("/prcRegistrationExtension", auth(["prc"]), prcRegistrationExtension);
router.post("/prcRegistrationExtensionSubmit", auth(["prc"]), prcRegistrationExtensionSubmit);

/* URLs accessible to DC only */
router.get("/dcRegistrationApproval", auth(["dc"]), dcRegistrationApproval);
router.post("/dcRegistrationApprovalSubmit", auth(["dc"]), dcRegistrationApprovalSubmit);
router.get("/dcReportApproval", auth(["dc"]), dcReportApproval);
router.post("/dcReportApprovalSubmit", auth(["dc"]), dcReportApprovalSubmit);
router.get("/dcVivaReport", auth(["dc"]), dcVivaReport);
router.get("/dcTitleChange", auth(["dc"]), dcTitleChange);
router.post("/dcTitleChangeSubmit", auth(["dc"]), dcTitleChangeSubmit);
router.get("/dcRegistrationExtension", auth(["dc"]), dcRegistrationExtension);
router.post("/dcRegistrationExtensionSubmit", auth(["dc"]), dcRegistrationExtensionSubmit);
router.get("/dcExaminerApproval", auth(["dc"]), dcExaminerApproval);
router.post("/dcExaminerApprovalSubmit",auth(["dc"]), dcExaminerApprovalSubmit);
router.get("/dcExaminersList", auth(["dc"]), dcExaminersList);
router.get("/downloadVivaReport", auth(["dc"]), downloadVivaReport);

/* URLs accessible to special supervisors only */
router.post("/specialDB", auth(["hod"]), specialPage);
router.post("/searchDB", auth(["hod"]), specialSearchPage);

/* URLs accessible to multiple user types */
router.get("/downloadReport", downloadReport);
router.get("/downloadPDF", downloadPDF);

module.exports = router;