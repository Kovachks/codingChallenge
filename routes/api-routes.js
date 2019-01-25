const connection = require('../app/config/connection.js')

module.exports = function(app) {
    app.get('/parent', function(req, res) {
         console.log('fired')
        let dbQuery = 'SELECT * FROM parentNode';

        connection.query(dbQuery, function(err, res) {
            if (err) throw err;

            console.log('this is a test:' + res)

            res.json(result)
        })
    })

    app.post('/parentNode', function(req, res) {
        console.log('parentNode fired')
        
        console.log(req.body)

        let dbQuery = 'INSERT INTO parentNode (parentName, childNum, upperBound, lowerBound) VALUES (?, ?, ?, ?);'

        let data = req.body.data

        connection.query(dbQuery, [data.name, data.childNum, data.upperLim, data.lowerLim], function(err, result) {
            if (err) throw err;
            console.log('posted parentNode successfully')
            res.send(result)
        })



    })
    
}