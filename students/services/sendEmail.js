const { SENDER_EMAIL, SENDER_PASSWORD, TEST_EMAIL, TEST_MODE } = require('./../config');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD
    }
});

const sendEmail = (mailData, callback) => {
    var mailOptions = {
        from: SENDER_EMAIL,
        to: TEST_MODE ? TEST_EMAIL : mailData.email,
        subject: mailData.subject,
        html: mailData.html
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (typeof callback == "function")
            callback(error, info);
    });
}

module.exports = sendEmail;

