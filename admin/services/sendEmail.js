const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { SENDER_EMAIL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN, TEST_EMAIL, TEST_MODE , MAIL_SERVICE } = require('./../config');

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const getTransporter = async () => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: MAIL_SERVICE,
            auth: {
                type: 'OAuth2',
                user: SENDER_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            }
        });
        return transporter;
    }
    catch(err) {
        console.log(err);
        throw err;
    }
}
    
const sendEmail = async (mailData, callback) => {
    try {
        const transporter = await getTransporter();
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
    catch(err) {
        console.log(err);
        if (typeof callback == "function")
            callback(err, null);
    }
    
}

module.exports = sendEmail;