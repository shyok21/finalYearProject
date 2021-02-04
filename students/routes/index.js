const express = require('express')
const router = express.Router()
const { homePage, login, logout } = require('./controllers/loginController');
const { registerPage, validate, verify } = require('./controllers/registerController');
const { applicationFormPage, applicationFormSubmit } = require('./controllers/applicationFormController');
const { studentPage } = require('./controllers/studentController');
const { supervisorPage } = require('./controllers/supervisorController');

router.get("/", homePage);
router.post("/login", login);
router.get("/logout", logout);
router.get("/registerPage", registerPage);
router.post("/validate", validate);
router.post("/verify", verify);
router.get("/applicationFormPage", applicationFormPage);
router.post("/applicationFormSubmit", applicationFormSubmit);
router.get("/studentPage", studentPage);
router.get("/supervisorPage", supervisorPage);

module.exports = router;