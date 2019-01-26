const connection = require('../app/config/connection.js')
const mysql = require('mysql')

module.exports = function(app) {

    app.post('/queryDb', function(req, res) {

        let dbQuery = 'SELECT * FROM ??';

        let inserts = ['parentNode']

        dbQuery = mysql.format(dbQuery, inserts)

        connection.query(dbQuery, function(err, result) {
            if (err) throw err;

            let dataObj = {}
            
            console.log(result)

            dataObj.parentNode = result

            queryRoot(dataObj, res)
        })
    })

    app.post('/root', function(req, res){

        let data = req.body.data

        let dbQuery = 'INSERT INTO ?? ?? VALUE ?'

        var inserts = ['root', 'factoryName', data.id]

        dbQuery = mysql.format(dbQuery, inserts)

        connection.query(dbQuery, function(err, result) {
            if (err) throw err;
            res.send(result)
        })

    })

    app.post('/updateDb', function(req, res) {

        let data = req.body

        console.log(data.id)

        let dbQuery = 'DELETE FROM ?? WHERE ?? = ?'

        var inserts = ['childNode', 'parentId', data.id]

        dbQuery = mysql.format(dbQuery, inserts)

        connection.query(dbQuery, function(err, result) {
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

        console.log('THIS IS DATA ID: ' + data.id)

        let dbQuery = 'DELETE FROM ?? WHERE id = ?'

        var inserts = ['parentNode', data.id]

        dbQuery = mysql.format(dbQuery, inserts)


        connection.query(dbQuery, function(err, result) {
            if (err) throw err;

            console.log(result)

            deleteRoot(data, res)

        })

    })

    app.post('/updateLower', function(req, res) {

        let data = req.body

        console.log(data)

        let dbQuery = 'UPDATE parentNode SET lowerBound = ? WHERE id = ?'

        let inserts = [data.updateNum, data.id]

        dbQuery = mysql.format(dbQuery, inserts)

        connection.query(dbQuery, function(err, result) {
            if (err) throw err

            console.log(result)

            data.lower = data.updateNum

            deleteLower(data, res)

            // res.end()
        })

    })

    app.post('/updateUpper', function(req, res) {

        let data = req.body

        console.log(data)

        let dbQuery = 'UPDATE parentNode SET upperBound = ? WHERE id = ?'

        let inserts = [data.updateNum, data.id]

        dbQuery = mysql.format(dbQuery, inserts)

        connection.query(dbQuery, function(err, result) {
            if (err) throw err

            console.log(result)

            data.upper = data.updateNum

            deleteLower(data, res)
        })

    })
}

// Delete from
const deleteRoot = (data, res) => {

    let dbQuery = 'DELETE FROM ?? WHERE id = ?'

    var inserts = ['root', data.id]

    dbQuery = mysql.format(dbQuery, inserts)

    connection.query(dbQuery, function(err, result) {
        if (err) throw err;

        deleteChild(data, res)

    })

}

const deleteLower = (data, res) => {

    let dbQuery = 'DELETE FROM ?? WHERE ?? = ?'

    var inserts = ['childNode', 'parentId', data.id]

    dbQuery = mysql.format(dbQuery, inserts)

    connection.query(dbQuery, function(err, result) {
        if (err) throw err;

        console.log('result from delete update: ' + JSON.stringify(result))

        updateChild(data, res)

    })

}

const updateChild = (data, res) => {


    console.log('this is the data: ' + JSON.stringify(data))

    console.log(data)

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

    console.log('this is the main arr: ' + mainArr)

    let dbQuery = 'INSERT INTO childNode (parentId, assignNum) VALUES ?'

    connection.query(dbQuery, [mainArr], function(err, result) {
        if (err) throw err;

        console.log(result)

        updateParent(data, res)

        // res.end()

    })

}

const updateParent = (data, res) => {
    
    console.log('data for update' + JSON.stringify(data))

    let dbQuery = 'UPDATE ?? SET ?? = ? WHERE ?? = ?'

    let insert = ['parentNode', 'childNum', data.count, 'id', data.id]

    dbQuery = mysql.format(dbQuery, insert)

    connection.query(dbQuery, function(err, result) {
        if (err) throw err

        res.end()

    })

}

// Delete Children from childNode
const deleteChild = (data, res) => {

    let dbQuery = 'DELETE FROM ?? WHERE ?? = ?'

    let inserts = ['childNode', 'parentID', data.id]

    dbQuery = mysql.format(dbQuery, inserts)

    connection.query(dbQuery, function(err, result) {

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

    let dbQuery = 'SELECT ?? FROM ??'

    let inserts = ['*', 'root']

    dbQuery = mysql.format(dbQuery, inserts)

    connection.query(dbQuery, function(err, result) {

        dataObj.rootNode = result

        childRoot(dataObj, res)

    })

 }

//  Query childNode for Child data to add to result object
 const childRoot = (dataObj, res) => {

    let dbQuery = 'SELECT ?? FROM ??'

    let inserts = ['*', 'childNode']

    dbQuery = mysql.format(dbQuery, inserts)

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