let mysql = require('mysql');

//Set up mysql connection
const connection = mysql.createConnection({
    port: 3306,
    host: 'localhost',
    user: 'root',
    password: process.env.databasePass,
    database: 'codingChallenge'
})

connection.connect(function(err) {
    if (err) {
        console.log('error connecting: ' + err.stack);
        return
    }
    console.log('connected as id ' + connection.threadId)
})

module.exports =  connection