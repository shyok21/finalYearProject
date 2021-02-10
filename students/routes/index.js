const express = require('express')
const router = express.Router()
const { homePage, login, logout } = require('./controllers/loginController');
const { registerPage, validate, verify } = require('./controllers/registerController');
const { applicationFormPage, applicationFormSubmit, downloadPDF } = require('./controllers/applicationFormController');
const { studentPage } = require('./controllers/studentController');
const { supervisorPage } = require('./controllers/supervisorController');
const { supervisorApprovalController } = require('./controllers/supervisorApprovalController');
const { prcPage, prcApprovalController } = require('./controllers/prcController');
const { dcPage, dcApprovalController } = require('./controllers/dcController');
const getFaculties = require('./apis/getFaculties.js');
const getDepartments = require('./apis/getDepartments.js');
const getProfessors = require('./apis/getProfessors.js');
const getProfessorDesignation = require('./apis/getProfessorDesignation.js');

router.get("/", homePage);
router.post("/login", login);
router.get("/logout", logout);
router.get("/registerPage", registerPage);
router.post("/validate", validate);
router.post("/verify", verify);
router.get("/applicationFormPage", applicationFormPage);
router.post("/applicationFormSubmit", applicationFormSubmit);
router.get("/downloadPDF", downloadPDF);
router.get("/studentPage", studentPage);
router.get("/supervisorPage", supervisorPage);
router.post("/supervisorApproval", supervisorApprovalController);
router.get("/prcPage", prcPage);
router.post("/prcApproval", prcApprovalController);
router.get("/dcPage", dcPage);
router.post("/dcApproval", dcApprovalController);
router.get("/api/faculties", getFaculties);
router.get("/api/departments", getDepartments);
router.get("/api/professors", getProfessors);
router.get("/api/designation", getProfessorDesignation);

module.exports = router;