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

        postParent(data, res)
    })


    })
    
}

const postParent = (data, res) => {

    // Insert into parent node
    let dbQuery = 'INSERT INTO parentNode (parentName, childNum, upperBound, lowerBound) VALUES (?, ?, ?, ?);'

    console.log(dbQuery)

    connection.query(dbQuery, [data.name, data.childNum, data.upperLim, data.lowerLim], function(err, result) {
        if (err) throw err;
        console.log('posted parentNode successfully')
        postChild(data, res, result)
    })
}

 const postChild = (data, res, result) => {

    // console.log('the result: ' + JSON.stringify(result))
    

    let mainArr = []

    let insertId = result.insertId

    let high = parseInt(data.upperLim)
    let low = parseInt(data.lowerLim)

    //  console.log(data)

    for (let i = 0; i < data.childNum; i++) {

        let arr = []

        let numGen = Math.floor(Math.random() * (high - low) + high)    

        // console.log(numGen)
        
        arr.push(insertId)
        arr.push(numGen)
        mainArr.push(arr)
    }

    console.log(mainArr)

    let dbQuery = 'INSERT INTO childNode (parentId, assignNum) VALUES ?'

    connection.query(dbQuery, [mainArr], function(err, result) {
        if (err) throw err;
        console.log(result)
    })

    res.end()
 }