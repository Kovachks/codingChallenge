// Requiring connection to database
const connection = require('../app/config/connection.js')

// Requiring mysql npm
const mysql = require('mysql')

// function to delete from root table
const deleteRoot = (data, res) => {

    // Setting dataabase query string
    let dbQuery = 'DELETE FROM ?? WHERE id = ?'

    // Creating array of variables to be used in query
    var inserts = ['root', data.id]

    // formatting query
    dbQuery = mysql.format(dbQuery, inserts)

    // query DB
    connection.query(dbQuery, function(err, result) {
        
        // if error throw error
        if (err) throw err;

        // Call delete child
        deleteChild(data, res)

    })

}

// Function to delete child nodes
const deleteLower = (data, res) => {

    // Set initial dbquery string
    let dbQuery = 'DELETE FROM ?? WHERE ?? = ?'

    // Create array of values used in query
    var inserts = ['childNode', 'parentId', data.id]

    // format database query
    dbQuery = mysql.format(dbQuery, inserts)

    // query DB
    connection.query(dbQuery, function(err, result) {
        
        // If error throw error
        if (err) throw err;

        // Call update child function
        updateChild(data, res)

    })

}

// Function to generate new numbers after range has been altered
const updateChild = (data, res) => {

    // Setting array to hold array of child values
    let mainArr = []

    // Parse out information needed from data object
    let insertId = parseInt(data.id)
    let high = parseInt(data.upper)
    let low = parseInt(data.lower)

    // Loop through the number of children data object says are needed
    for (let i = 0; i < parseInt(data.count); i++) {

        // Create placeholder array
        let arr = []

        // Generate random number between the low and high range
        let numGen = Math.round(Math.random() * (high - low) + low)    

        // Push parentId id to array
        arr.push(insertId)

        // Push randomly generated number to array
        arr.push(numGen)

        // push array to main array which will be used in query
        mainArr.push(arr)
    }

    // Set database query
    let dbQuery = 'INSERT INTO childNode (parentId, assignNum) VALUES ?'

    // query database inserting children from mainArr
    connection.query(dbQuery, [mainArr], function(err, result) {
        
        // if an error throw error
        if (err) throw err;

        // Call updateparent function
        updateParent(data, res)

    })

}

// Function to update the count of the parent to newly generated count
const updateParent = (data, res) => {
    
    // Set initial query string
    let dbQuery = 'UPDATE ?? SET ?? = ? WHERE ?? = ?'

    // Create array of values for use in the query
    let insert = ['parentNode', 'childNum', data.count, 'id', data.id]

    // Format query
    dbQuery = mysql.format(dbQuery, insert)

    // query database
    connection.query(dbQuery, function(err, result) {
        
        // If error throw error
        if (err) throw err

        // ending response to ping the server
        res.end()

    })

}

// Delete Children from childNode
const deleteChild = (data, res) => {

    // Set database query
    let dbQuery = 'DELETE FROM ?? WHERE ?? = ?'

    // Create array of values for use in query
    let inserts = ['childNode', 'parentID', data.id]

    // format database query
    dbQuery = mysql.format(dbQuery, inserts)

    // query database
    connection.query(dbQuery, function(err, result) {

        // throw error if error
        if (err) throw err;

        // send result to client
        res.send(result)

    })

}

// Post to parent Node Table
const postParent = (data, res) => {

    // set database query
    let dbQuery = 'INSERT INTO parentNode (parentName, childNum, upperBound, lowerBound) VALUES (?, ?, ?, ?);'

    // query database
    connection.query(dbQuery, [data.name, data.childNum, data.upperLim, data.lowerLim], function(err, result) {
        if (err) throw err;
        postChild(data, res, result)
    })
}

// Post to childNode table
const postChild = (data, res, result) => {

    // Create array to be used for holding random nums and id
    let mainArr = []

    // Create variables to be used later
    let insertId = result.insertId
    let high = parseInt(data.upperLim)
    let low = parseInt(data.lowerLim)

    // Loop through the number of children specified from the object sent from the client
    for (let i = 0; i < data.childNum; i++) {

        // Create placeholder array
        let arr = []

        // Generate random number in between the range
        let numGen = Math.round(Math.random() * (high - low) + low)    

        // Push parentId id to array
        arr.push(insertId)

        // Push randomly generated number to array
        arr.push(numGen)

        // push array to main array which will be used in query
        mainArr.push(arr)
    }

    // Query database
    let dbQuery = 'INSERT INTO childNode (parentId, assignNum) VALUES ?'

    // Query database
    connection.query(dbQuery, [mainArr], function(err, result) {
        if (err) throw err;
    })

    // End server portion of AJAX request
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

    // Set database query
    let dbQuery = 'SELECT ?? FROM ??'

    // Create array of values to be used
    let inserts = ['*', 'childNode']

    // Format query
    dbQuery = mysql.format(dbQuery, inserts)

    // query database
    connection.query(dbQuery, function(err, result) {
        
        // loop through parent nodes
        for (let i = 0; i < dataObj.parentNode.length; i++) {

            // reset child array
            let childArr =[]

            // loop through childnodes returned from database query
            for (let k = 0; k < result.length; k++) {

                // If database id = id of parent node push to placeholder array
                if (result[k].parentID === dataObj.parentNode[i].id) {

                    // Push to child array holder 
                    childArr.push(result[k])
                 
                }

            }

            // Set child array to specified parentnode object
            dataObj.parentNode[i].childNode = childArr

        }

        // Send created dataObj to client
        res.send(dataObj)
    
    })

 }

 
// Exporting all routes
module.exports = function(app) {

    // route for gathering all database information for display to the user
    app.post('/queryDb', function(req, res) {

        // Setting database query
        let dbQuery = 'SELECT * FROM ??';

        // Setting the variable values being used in query
        let inserts = ['parentNode']

        // using mysql npm to format query and protect against injection
        dbQuery = mysql.format(dbQuery, inserts)

        // querying the DB
        connection.query(dbQuery, function(err, result) {

            // throw error if error found
            if (err) throw err;

            // Begin dataObj for data
            let dataObj = {}
            
            // Setting the parentnode data inside of dataobj
            dataObj.parentNode = result

            // Calling query root to query the table
            queryRoot(dataObj, res)

        })
    })

    // route for updating factory child quantities
    app.post('/updateDb', function(req, res) {

        // Setting data object
        let data = req.body

        // Setting initial database query
        let dbQuery = 'DELETE FROM ?? WHERE ?? = ?'

        // Creating variable array
        var inserts = ['childNode', 'parentId', data.id]

        // Using mysql to format and validate DBquery
        dbQuery = mysql.format(dbQuery, inserts)

        // Query database
        connection.query(dbQuery, function(err, result) {
            
            // Throwing error if found
            if (err) throw err;

            // Calling update child function.  passing it data object and res object from ajax call
            updateChild(data, res)

        })

        
    })

    // Creating route for posting new factories
    app.post('/parentNode', function(req, res) {

        // Setting data object passed from client
        let data = req.body.data

        // Creating database query
        let dbQuery = 'INSERT INTO root SET ?;'

        // Query database and pass factory name 
        connection.query(dbQuery, {factoryName: data.name}, function(err, result) {
            
            // If error throw error
            if (err) throw err;

            // Call post parent to add to parentNode table
            postParent(data, res)

        })


    })

    // Creating route to delete factory/children from database
    app.post('/deleteDb', function(req, res) {

        // Grabbing data object sent from client
        let data = req.body

        // Setting query
        let dbQuery = 'DELETE FROM ?? WHERE id = ?'

        // Setting variables used in query
        var inserts = ['parentNode', data.id]

        // Formatting query using .format method of mysql
        dbQuery = mysql.format(dbQuery, inserts)

        // Query database
        connection.query(dbQuery, function(err, result) {
           
            // Throw error if error
            if (err) throw err;

            // Call delete root function.  passing data obj and res
            deleteRoot(data, res)

        })

    })

    // Establishing updateLower route to update the lower bound.
    app.post('/updateLower', function(req, res) {

        // Grabbing data object passed from client
        let data = req.body

        // Setting dbQuery string
        let dbQuery = 'UPDATE parentNode SET lowerBound = ? WHERE id = ?'

        // Creating array of values to be used in query
        let inserts = [data.updateNum, data.id]

        // formatting query using mysql.format method
        dbQuery = mysql.format(dbQuery, inserts)

        // query database passing formatted query
        connection.query(dbQuery, function(err, result) {

            // If err throw error
            if (err) throw err

            // Updating the lower value in the data obj to be the same as the updatenum.  only works if no error with the query
            data.lower = data.updateNum

            // Call delete lower function to delete out child nodes for a refresh
            deleteLower(data, res)

        })

    })

    // Establish updateUpper for updating the value of the high range
    app.post('/updateUpper', function(req, res) {

        // Grabbing data object passed from clieng
        let data = req.body

        // Set initial database query string
        let dbQuery = 'UPDATE parentNode SET upperBound = ? WHERE id = ?'

        // Creating array of values to be used in update
        let inserts = [data.updateNum, data.id]

        // formatting query
        dbQuery = mysql.format(dbQuery, inserts)

        // query database
        connection.query(dbQuery, function(err, result) {
            
            // if error throw error
            if (err) throw err

            // Setting upper limit to equal the updated number.  Only works if db query worked
            data.upper = data.updateNum

            // call delete lower
            deleteLower(data, res)
        })

    })
}
