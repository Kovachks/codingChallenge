const connection = require('../app/config/connection.js')

var express = require('express')
  , http = require('http');
//make sure you keep this order
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

//... 

server.listen(80);

io.on('connection', function (socket) {

    console.log('a user has connected' )

    socket.on('refresh', function(data) {


        console.log('socket received the refresh message')

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

    app.post('/updateDb', function(req, res) {

        let data = req.body



        console.log(data.id)

        let dbQuery = 'DELETE FROM childNode WHERE parentId = ?'

        connection.query(dbQuery, data.id, function(err, result) {
            if (err) throw err;

            console.log('result from delete update: ' + JSON.stringify(result))

            updateChild(data, res)

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

    app.post('/deleteDb', function(req, res) {

        let data = req.body

        let dbQuery = 'DELETE FROM parentNode WHERE id = ?'

        connection.query(dbQuery, data.id, function(err, result) {
            if (err) throw err;

            console.log(result)

            deleteRoot(data, res)

        })

    })
}

// Delete from
const deleteRoot = (data, res) => {

    let dbQuery = 'DELETE FROM root WHERE id = ?'

    connection.query(dbQuery, data.id, function(err, result) {
        if (err) throw err;

        deleteChild(data, res)

    })

}

const updateChild = (data, res) => {

    console.log('this is the data: ' + JSON.stringify(data))

    let mainArr = []

    let insertId = parseInt(data.id)

    let high = parseInt(data.upper)
    let low = parseInt(data.lower)

    for (let i = 0; i < parseInt(data.count); i++) {

        let arr = []

        let numGen = Math.floor(Math.random() * (high - low) + low)    

        arr.push(insertId)
        arr.push(numGen)
        mainArr.push(arr)
    }

    let dbQuery = 'INSERT INTO childNode (parentId, assignNum) VALUES ?'

    connection.query(dbQuery, [mainArr], function(err, result) {
        if (err) throw err;

        res.end()

    })

    






}

// Delete Children from childNode
const deleteChild = (data, res) => {

    let dbQuery = 'DELETE FROM childNode WHERE parentID = ?'

    connection.query(dbQuery, data.id, function(err, result) {

        if (err) throw err;

        res.send(result)

    })

}

// Post to parent Node Table
const postParent = (data, res) => {

    // Insert into parent node
    let dbQuery = 'INSERT INTO parentNode (parentName, childNum, upperBound, lowerBound) VALUES (?, ?, ?, ?);'

    connection.query(dbQuery, [data.name, data.childNum, data.upperLim, data.lowerLim], function(err, result) {
        if (err) throw err;
        postChild(data, res, result)
    })
}

// Post to childNode table
const postChild = (data, res, result) => {
    
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

//  Query the root table to gather root data
 const queryRoot = (dataObj, res) => {

    let dbQuery = 'SELECT * FROM root'

    connection.query(dbQuery, function(err, result) {

        dataObj.rootNode = result

        childRoot(dataObj, res)

    })

 }

//  Query choldNode for Child data to add to result object
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