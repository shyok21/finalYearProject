const express = require('express')
const router = express.Router()
const { homePage, login, logout } = require('./controllers/loginController');
const { registerPage, validate, verify } = require('./controllers/registerController');
const { applicationFormPage, applicationFormSubmit, downloadPDF } = require('./controllers/applicationFormController');
const { studentPage, submitReport, downloadReport, removeReport } = require('./controllers/studentController');
const { supervisorPage, assignRAC, racSubmit } = require('./controllers/supervisorController');
const { supervisorApprovalController } = require('./controllers/supervisorApprovalController');
const { prcPage, prcApprovalController,prcReportApproval, prcReportApprovalSubmit } = require('./controllers/prcController');
const { dcPage, dcApprovalController,dcReportApproval, dcReportApprovalSubmit } = require('./controllers/dcController');
const { specialPage, specialSearchPage } = require('./controllers/specialController');
const getFaculties = require('./apis/getFaculties.js');
const getDepartments = require('./apis/getDepartments.js');
const getProfessors = require('./apis/getProfessors.js');
const getProfessorDesignation = require('./apis/getProfessorDesignation.js');

router.get("/", homePage);
router.post("/login", login);
router.get("/logout", logout);
router.get("/registerPage", registerPage);
router.get("/removeReport",removeReport);
router.post("/validate", validate);
router.post("/verify", verify);
router.get("/applicationFormPage", applicationFormPage);
router.post("/applicationFormSubmit", applicationFormSubmit);
router.get("/downloadPDF", downloadPDF);
router.get("/studentPage", studentPage);
router.get("/supervisorPage", supervisorPage);
router.get("/assignRAC.html", assignRAC);
router.post("/racSubmit", racSubmit);
router.post("/supervisorApproval", supervisorApprovalController);
router.get("/prcPage", prcPage);
router.post("/prcApproval", prcApprovalController);
router.get("/prcPageReport",prcReportApproval);
router.post("/prcReportApprovalSubmit",prcReportApprovalSubmit);
router.get("/dcPage", dcPage);
router.post("/dcApproval", dcApprovalController);
router.get("/dcPageReport",dcReportApproval);
router.post("/dcReportApprovalSubmit",dcReportApprovalSubmit);
router.post("/specialDB", specialPage);
router.post("/searchDB", specialSearchPage);
router.post("/submitReport", submitReport);
router.get("/downloadReport", downloadReport);
router.get("/api/faculties", getFaculties);
router.get("/api/departments", getDepartments);
router.get("/api/professors", getProfessors);
router.get("/api/designation", getProfessorDesignation);

module.exports = router;