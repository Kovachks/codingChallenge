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

    app.post('/root', function(req, res){
        
        let dbQuery = 'INSERT INTO root factoryName VALUE ?;'
        
        let data = req.body.data

        connection.query(dbQuery, data.factoryName, function(err, result) {
            if (err) throw err;
            console.log('posted to root successfully')
            res.send(result)
        })

    })

    app.post('/parentNode', function(req, res) {
        console.log('parentNode fired')
        
        console.log(req.body)


        // // Insert into root
        // let dbQuery = 'INSERT INTO root factoryName VALUE ?; '

        // Insert into parent node
        let dbQuery = 'INSERT INTO parentNode (parentName, childNum, upperBound, lowerBound) VALUES (?, ?, ?, ?);'

        console.log(dbQuery)

        let data = req.body.data

        connection.query(dbQuery, [data.name, data.childNum, data.upperLim, data.lowerLim], function(err, result) {
            if (err) throw err;
            console.log('posted parentNode successfully')
            postRoot(data, res)
        })
    })
    
}

const postRoot = (data, res) => {
            
    console.log(data)

    let dbQuery = 'INSERT INTO root SET ?;'

    connection.query(dbQuery, {factoryName: data.name}, function(err, result) {
        if (err) throw err;
        console.log('posted to root successfully')
        res.send(result)
    })
}

// const postChild = (data, res) => {
    
//     console.log(data)



// }