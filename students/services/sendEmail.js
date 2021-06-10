const { SENDER_EMAIL, SENDER_PASSWORD, TEST_EMAIL, TEST_MODE , MAIL_SERVICE } = require('./../config');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    pool: true,
    port: 465,
    host: "smtp.gmail.com",
    secure: true,
    tls: {
        rejectUnauthorized: false
    },
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
        console.log(info);
        if (typeof callback == "function")
            callback(error, info);
    });
}
module.exports = sendEmail;