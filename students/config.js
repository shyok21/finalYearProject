const config = {
    PORT: process.env.PORT || 8000,
    ROOT_URL: process.env.ROOT_URL || 'http://localhost:8000',
    DB_HOST: "sql6.freemysqlhosting.net",
    DB_NAME: "sql6414114",
    DB_USERNAME: "sql6414114",
    DB_PASSWORD: "bxmu1Pw6yZ",
    DB_PORT: "3306",
    MIN_PASSWORD_LENGTH: 5,
    SENDER_EMAIL: 'ju.notifyserver@gmail.com',
    TEST_EMAIL: "ju.phdms2021@gmail.com",
    TEST_MODE: true,
    MAIL_SERVICE: 'gmail',
    CLIENT_ID : '284672905667-s38jh6jcjp5sepf9rtbs1hfghtuut1di.apps.googleusercontent.com',
    CLIENT_SECRET : 'cTb991ifri5Ss2B65NyPBWCJ',
    REDIRECT_URI : 'https://developers.google.com/oauthplayground',
    REFRESH_TOKEN : '1//04jHrY6JZwVYOCgYIARAAGAQSNwF-L9Iri6OUeov7gUKhL_QCuxVMR1WzAnpKDKkUfmz-B0Z_42P9ifTNKD7xs3sDLoDkhmjcqkA'
};

module.exports = config;