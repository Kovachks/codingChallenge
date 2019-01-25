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

    let data = req.body.data

    let dbQuery = 'INSERT INTO root SET ?;'

    connection.query(dbQuery, {factoryName: data.name}, function(err, result) {
        if (err) throw err;
        console.log('posted to root successfully')

        postRoot(data, res)
    })


    })
    
}

const postRoot = (data, res) => {

    // Insert into parent node
    let dbQuery = 'INSERT INTO parentNode (parentName, childNum, upperBound, lowerBound) VALUES (?, ?, ?, ?);'

    console.log(dbQuery)

    connection.query(dbQuery, [data.name, data.childNum, data.upperLim, data.lowerLim], function(err, result) {
        if (err) throw err;
        console.log('posted parentNode successfully')
        postChild(data, res)
    })
}

 const postChild = (data, res) => {
    
    let arr = []

    let high = parseInt(data.upperLim)
    let low = parseInt(data.lowerLim)


     console.log(data)

    for (let i = 0; i < data.childNum; i++) {

     
        let numGen = Math.floor(Math.random() * (high - low) + high)    

        console.log(numGen)
        arr.push(numGen)
    }

    console.log(arr)

    res.end()
 }