let mysql = require('mysql');

//Set up mysql connection
const connection = mysql.createConnection({
    port: process.env.port || 3306,
    host: process.env.host || 'localhost',
    user: process.env.user || 'root',
    password: process.env.pass || process.env.databasePass,
    database: process.env.database || 'codingChallenge'
})

connection.connect(function(err) {
    if (err) {
        console.log('error connecting: ' + err.stack);
        return
    }
    console.log('connected as id ' + connection.threadId)
})

module.exports =  connection