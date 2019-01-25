const connection = require('../app/config/connection.js')

var io = require("socket.io")(80);

io.on('connection', function (socket) {

    console.log('a user has connected')

    socket.on('refresh', function(data) {

        io.emit('refreshData')
    })


  });

module.exports = function(app) {
    app.post('/queryDb', function(req, res) {
        let dbQuery = 'SELECT * FROM parentNode';

        connection.query(dbQuery, function(err, result) {
            if (err) throw err;

            let dataObj = {}
            
            dataObj.parentNode = result

            queryRoot(dataObj, res)
        })
    })

    app.post('/root', function(req, res){
        
        let dbQuery = 'INSERT INTO root factoryName VALUE ?;'
        
        let data = req.body.data

        connection.query(dbQuery, data.factoryName, function(err, result) {
            if (err) throw err;
            res.send(result)
        })

    })

    app.post('/parentNode', function(req, res) {

    let data = req.body.data

    let dbQuery = 'INSERT INTO root SET ?;'

    connection.query(dbQuery, {factoryName: data.name}, function(err, result) {
        if (err) throw err;

        postParent(data, res)
    })


    })
    
}

const postParent = (data, res) => {

    // Insert into parent node
    let dbQuery = 'INSERT INTO parentNode (parentName, childNum, upperBound, lowerBound) VALUES (?, ?, ?, ?);'

    connection.query(dbQuery, [data.name, data.childNum, data.upperLim, data.lowerLim], function(err, result) {
        if (err) throw err;
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

        let numGen = Math.floor(Math.random() * (high - low) + low)    

        // console.log(numGen)
        
        arr.push(insertId)
        arr.push(numGen)
        mainArr.push(arr)
    }

    let dbQuery = 'INSERT INTO childNode (parentId, assignNum) VALUES ?'

    connection.query(dbQuery, [mainArr], function(err, result) {
        if (err) throw err;
    })

    res.end()
 };

 const queryRoot = (dataObj, res) => {

    let dbQuery = 'SELECT * FROM root'

    connection.query(dbQuery, function(err, result) {

        dataObj.rootNode = result

        childRoot(dataObj, res)

    })

 }

 const childRoot = (dataObj, res) => {

    let dbQuery = 'SELECT * FROM childNode'

    connection.query(dbQuery, function(err, result) {
        
        for (let i = 0; i < dataObj.parentNode.length; i++) {
            let childArr =[]
            for (let k = 0; k < result.length; k++) {

                if (result[k].parentID === dataObj.parentNode[i].id) {

                    childArr.push(result[k])
                 
                }

            }

            dataObj.parentNode[i].childNode = childArr

        }

        res.send(dataObj)
    
    })

 }