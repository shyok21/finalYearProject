const express = require('express')
const router = express.Router()
const { homePage, login } = require('./controllers/loginController');
const { registerPage, validate, verify } = require('./controllers/registerController');
const { applicationFormPage, applicationFormSubmit } = require('./controllers/applicationFormController');

router.get("/", homePage);
router.post("/login", login);
router.get("/registerPage", registerPage);
router.post("/validate", validate);
router.post("/verify", verify);
router.get("/applicationFormPage", applicationFormPage);
router.post("/applicationFormSubmit", applicationFormSubmit);

module.exports = router;
