const config = {
    PORT: process.env.PORT || 8020,
    ROOT_URL: process.env.ROOT_ADMIN_URL || "http://localhost:8020",
    DB_HOST: "sql6.freemysqlhosting.net",
    DB_NAME: "sql6417204",
    DB_USERNAME: "sql6417204",
    DB_PASSWORD: "k9zrSl9n7y",
    DB_PORT: "3306",
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