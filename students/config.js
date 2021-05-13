const config = {
    PORT: process.env.PORT || 8000,
    ROOT_URL: process.env.ROOT_URL || 'http://localhost:8000',
    DB_HOST: "sql6.freemysqlhosting.net",
    DB_NAME: "sql6411032",
    DB_USERNAME: "sql6411032",
    DB_PASSWORD: "9BRLUkJyrr",
    DB_PORT: "3306",
    SENDER_EMAIL: 'ju.notifyserver@gmail.com',
    TEST_EMAIL: "ju.phdms2021@gmail.com",
    TEST_MODE: true,
    MAIL_SERVICE: 'gmail',
    CLIENT_ID : '284672905667-s38jh6jcjp5sepf9rtbs1hfghtuut1di.apps.googleusercontent.com',
    CLIENT_SECRET : 'cTb991ifri5Ss2B65NyPBWCJ',
    REDIRECT_URI : 'https://developers.google.com/oauthplayground',
    REFRESH_TOKEN : '1//041xKSK58C07iCgYIARAAGAQSNwF-L9Ir5otJkKajS4LgZMBAmFj87E5yW31HW3Fd9XxEHpqBYMDt6MQPmEwz8hFGA6iK7GW7zUQ'
};

module.exports = config;