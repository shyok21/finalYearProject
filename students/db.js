const mysql = require('mysql');

const con = mysql.createConnection({
    host: "sql6.freesqldatabase.com",
    user: "sql6407671",
    password: "SfxDSFUXhK",
    database: "sql6407671",
    multipleStatements: true
});

con.connect(function(err) {
    if (err)
        console.log("Database error");
    else
        console.log("Connected to Database");
});

module.exports = con;
