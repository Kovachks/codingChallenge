// Create socket variable
var socket = io();

// Receiving the refresh data socket emit call in order to refresh data
socket.on('refreshData', function(data) {

    // Clear out data currently on the page
    document.getElementById('listView').innerHTML = ''

    // Call getRoute to refresh client side data
    getRoute()

})


const isEmptyOrSpaces = str => {
    return str === null || str.match(/^ *$/) !== null;
}

const htmlScriptCheck = str => {
 return /[!@#$%^&*(),.?":{}|<>]/g.test(str)  
}

// Function to emit refresh to server side web socket
const dataRefresh = () => {

    // Emit refresh to the server
    socket.emit('refresh')

}

// Function to create new child nodes
const generateNewNodes = () => {

    // Create variables for use later
    let btn = document.getElementById('generateChildBtn')
    let id = btn.getAttribute('data-id')
    let upper = btn.getAttribute('data-upperbound')
    let lower = btn.getAttribute('data-lowerbound')
    let name = btn.getAttribute('data-name')
    let updateName = document.getElementById('generateInput')
    let count = btn.getAttribute('data-count')

    // Validate lenght is less than 31 characters
    if (updateName.value.length > 30) {

        console.log('fired') 
        
        alert('please enter a name which is between 1 and 30 characters')

        updateName.value = ''
        
        return

    }


    // Validate if there is whitespace in user input
    if (isEmptyOrSpaces(updateName.value)) {
        
        alert(`new Factory name can't be all white space`)
        
        return
    }

    // Validate against possible html/script injection
    if (htmlScriptCheck(updateName.value)) {
        
        // Alert user name can't contain any special characters
        alert(`Name can't contain any special characters`)
        
        return
    
    }

    // Create data object
    let data = {
        id: id,
        updateName: updateName.value,
        upper: upper,
        lower: lower,
        count: count,
        name: name
    }

    // Create request variable for use in AJAX request
    const request = new XMLHttpRequest();

    // Open route to post at /parentNode url
    request.open('POST', '/updateDb');

    // Set Request header to receive JSON
    request.setRequestHeader('Content-Type', 'application/JSON');

    // Begin function when data is returned from server
    request.onload = function(data) {

        // Alert the user of their failed attack if found
        if (data.srcElement.response === 'not so fast my friend') {
            
            alert(data.srcElement.response)
        
            return

        }

        // Hide input box after return from server
        document.getElementById('inputBox').style.display = 'none'

        // Call dataRefresh to emit socket message
        dataRefresh()        

        // Reset input
        document.getElementById('generateInput').value = ''

    }

    // Send data object to server
    request.send(JSON.stringify(data))

}

// Funciton to update the lower bound
const updateLower = () => {

    // Create variables for use later
    let updateNum = parseInt(document.getElementById('generateLower').value)
    let updateBtn = document.getElementById('updateLower')
    let id = parseInt(updateBtn.getAttribute('data-id'))
    let lower = parseInt(updateBtn.getAttribute('data-lowerbound'))
    let upper = parseInt(updateBtn.getAttribute('data-upperbound'))
    let count = updateBtn.getAttribute('data-count')
    let name = updateBtn.getAttribute('data-name')

    // Validate that the user entered number is lower than the upper limit
    if (updateNum >= upper) {

        // alert user of error
        alert ('Updated number must be lower than upper range')

        // Return function 
        return

    } else {
        
        // Create data object to send to server
        let data = {
            updateNum: updateNum,
            count: count,
            id: id,
            lower: lower,
            upper: upper,
            updateName: name
        }

        // Create request variable for use in AJAX request
        const request = new XMLHttpRequest();

        // Open route to post at /parentNode url
        request.open('POST', '/updateLower');

        // Set Request header to receive JSON
        request.setRequestHeader('Content-Type', 'application/JSON');

        // Begin function when data is returned from server
        request.onload = function(data) {

            // Alert the user of their failed attack if found
            if (data.srcElement.response === 'not so fast my friend') {

                alert(data.srcElement.response)
            
                return

            }
    
        
            // Calling refresh function
            dataRefresh()

            // Reset value of input
            document.getElementById('generateLower').value = ''
            document.getElementById('lowerLimitBox').style.display = 'none'

        }
        
        // Send data to server
        request.send(JSON.stringify(data))

    }


}

// Function to update the upper bound
const updateUpper = () => {

    // Create variables for use later
    let updateNum = parseInt(document.getElementById('generateUpper').value)
    let updateBtn = document.getElementById('updateUpper')
    let id = parseInt(updateBtn.getAttribute('data-id'))
    let lower = parseInt(updateBtn.getAttribute('data-lowerbound'))
    let upper = parseInt(updateBtn.getAttribute('data-upperbound'))
    let count = updateBtn.getAttribute('data-count')
    let name = updateBtn.getAttribute('data-name')

    // Validate the update number is higher than the lower limit
    if (updateNum <= lower) {

        // alert user of error
        alert ('Updated number must be higher than lower end of range')
        
        // return from function
        return

    } else {

        // Create data object to send to the serve
        let data = {
            updateNum: updateNum,
            count: count,
            id: id,
            lower: lower,
            upper: upper,
            updateName: name
        }

        // Create request variable for use in AJAX request
        const request = new XMLHttpRequest();

        // Open route to post at /parentNode url
        request.open('POST', '/updateUpper');

        // Set Request header to receive JSON
        request.setRequestHeader('Content-Type', 'application/JSON');

        // Begin function when data is returned from server
        request.onload = function(data) {

        // Alert the user of their failed attack if found
        if (data.srcElement.response === 'not so fast my friend') {
            
            alert(data.srcElement.response)
        
            return

        }
        
            // Call refresh data
            dataRefresh()

            // Reset value of input
            document.getElementById('generateUpper').value = ''
            document.getElementById('upperLimitBox').style.display = 'none'

        }
        
        // Send data to server
        request.send(JSON.stringify(data))

    }
}

// Deletes the parent
const deleteParent = () => {

    // Gather data attributes
    let btn = document.getElementById('deleteBtn')
    let id = btn.getAttribute('data-id')
    let upper = btn.getAttribute('data-upperbound')
    let lower = btn.getAttribute('data-lowerbound')
    let name = btn.getAttribute('data-name')
    let count = btn.getAttribute('data-count')

    // Set data object
    let data = {
        id: id,
        upper: upper,
        lower: lower,
        count: count,
        name: name
    }

    console.log(data)

    // Create request variable for use in AJAX request
    const request = new XMLHttpRequest();

    // Open route to post at /parentNode url
    request.open('POST', '/deleteDb');

    // Set Request header to receive JSON
    request.setRequestHeader('Content-Type', 'application/JSON');

    // Begin function when data is returned from server
    request.onload = function(data) {

        // Alert the user of their failed attack if found
        if (data.srcElement.response === 'not so fast my friend') {

            alert(data.srcElement.response)
        
            return

        }

        // Hide input box when messaged received from server
        document.getElementById('inputBox').style.display = 'none'

        // Call data refresh
        dataRefresh()        

        // Reset value of input
        document.getElementById('generateInput').value = ''

    }

    // Send data to server
    request.send(JSON.stringify(data))

}

// Function to streamline calling of a refresh
const getRoute = () => {

    // Create request variable for use in AJAX request
    const request = new XMLHttpRequest();

    // Open route to post at /parentNode url
    request.open('POST', '/queryDb');

    // Set Request header to receive JSON
    request.setRequestHeader('Content-Type', 'application/JSON');

    // Begin function when data is returned from server
    request.onload = function(data) {

        // Parsing  out response
        let resData = JSON.parse(request.response)

        // Creating data string container
        let dataStr = ''

        // If root or parent don't exist then exit function
        if (resData.parentNode[0] === undefined || !resData.parentNode[0] ) {
            return
        }

        // Creating root section of list
        dataStr += `<li>Root</li><ul class='parentUl'>`

        // Loop through each factory and add to data string
        for (let i = 0; i < resData.parentNode.length; i++) {

            // Add factory data to list
            dataStr += `<li class='factoryName' data-id=${resData.parentNode[i].id} data-name=${resData.parentNode[i].parentName} data-count=${resData.parentNode[i].childNum} data-upperBound=${resData.parentNode[i].upperBound} data-lowerBound=${resData.parentNode[i].lowerBound}>${resData.parentNode[i].parentName}</li>
            <li class='treeLi'></li><li class='range upper' data-name=${resData.parentNode[i].parentName} data-id=${resData.parentNode[i].id} data-count=${resData.parentNode[i].childNum} data-lower=${resData.parentNode[i].lowerBound} data-upper=${resData.parentNode[i].upperBound}>${resData.parentNode[i].upperBound}</li>
            <li class='range'>  -  </li><li class='range lower' data-name=${resData.parentNode[i].parentName} data-id=${resData.parentNode[i].id} data-count=${resData.parentNode[i].childNum} data-lower=${resData.parentNode[i].lowerBound} data-upper=${resData.parentNode[i].upperBound}>${resData.parentNode[i].lowerBound}</li>
            <ul class='childUl'>`

            // Loop through current factories and gather the generated numbers
            for (let k = 0; k < resData.parentNode[i].childNode.length; k++) {
                
                // Check if childNode is the last in the list.  If so add the End class as opposed to the standard class
                if (k === resData.parentNode[i].childNode.length - 1) {
                    dataStr += `<li class='childLiTreeEnd'></li><li class='' value=${resData.parentNode[i].childNode[k].parentID}>${resData.parentNode[i].childNode[k].assignNum}</li>`
                } else {
                    dataStr += `<li class='childLiTree'></li><li class='childTreeLi' value=${resData.parentNode[i].childNode[k].parentID}>${resData.parentNode[i].childNode[k].assignNum}</li>`
                }

            }

            // Close out children unordered list
            dataStr += '</ul>'

        }

        // Close out factory unordered list
        dataStr += '</ul>'

        // Set HTML content to be the above concatenated dataStr
        document.getElementById('listView').innerHTML = dataStr

    }

    // Send data to server
    request.send()

}

// Post New Factories
const postNodes = () => {

    // Create variables used multiple times for ease of use later
    const name = document.getElementById('name');
    const childNum = document.getElementById('childNum');
    const lowerLim = document.getElementById('lowerLim');
    const upperLim = document.getElementById('upperLim');
    const error = document.getElementById('errorDisplay');

    // Validate against possible html/script injection
    if (htmlScriptCheck(name.value)) {
            
        // Alert user name can't contain any special characters
        alert(`Name can't contain any special characters`)
        
        return

    }

    if (isEmptyOrSpaces(name.value)) {
        
        // display error
        error.style.display = 'inline-block'
        error.innerHTML = `Factory Name can't be all white space` 
        return
    
    }

    // Resetting error display
    error.style.display = 'none'
    name.style.borderColor = 'black'
    childNum.style.borderColor = 'black'
    lowerLim.style.borderColor = 'black'
    upperLim.style.borderColor = 'black'

    // Begin validating user inputs
    // Validate all inputs for content
    if (name.value === '' || childNum.value === '' || lowerLim.value === '' || upperLim.value === '') {
        
        // display error
        error.style.display = 'inline-block'
        error.innerHTML = 'Please fill out all fields to continue'

        return

    }



    // validate name length to be less than or equal to 30
    if (name.value.length > 30) {
        
        // Display error
        name.style.borderColor = 'red'
        error.style.display = 'inline-block'
        error.innerHTML = 'Factory Name must be 30 characters or less'

        return

    }

    // Validate Child Num for whole integer and between 1-15
    // Regex used to validate a whole integer
    if (!/^\d+$/.test(childNum.value)) {
    
        // Display error
        childNum.style.borderColor = 'red'
        error.style.display = 'inline-block'
        error.innerHTML = 'Child Numbers must be a whole integer'

        return

    // Validate between 1-15
    } else if (childNum.value < 1 || childNum.value > 15) {

        // Display error
        childNum.style.borderColor = 'red'
        error.style.display = 'inline-block'
        error.innerHTML = 'Child Numbers must be between 1 and 15'

        return

    }

    // Validate Upper limit for whole integer between 1-999
    // Regex used to validate a whole integer
    if (!/^\d+$/.test(upperLim.value)) {

        // Display error
        upperLim.style.borderColor = 'red'
        error.style.display = 'inline-block'
        error.innerHTML = 'Upper Limit must be a whole integer'

        return

        // between 1-999
    } else if (upperLim.value < 1 || upperLim.value > 999) {

        // Display error
        upperLim.style.borderColor = 'red'
        error.style.display = 'inline-block'
        error.innerHTML = 'Upper Limit must be a whole integer between 1 and 999'

        return

    } 

    // Validate lowerLim for whole integer between 1-999 and lower than Upper Limit
    // Regex used to validate a whole integer
    if (!/^\d+$/.test(lowerLim.value)) {

        // Display error
        lowerLim.style.borderColor = 'red'
        error.style.display = 'inline-block'
        error.innerHTML = 'Lower Limit must be a whole integer'

        return

    // Between 1-999
    } else if (lowerLim.value < 1 || lowerLim.value > 999) {

        // Display error
        lowerLim.style.borderColor = 'red'
        error.style.display = 'inline-block'
        error.innerHTML = 'Lower Limit must be a whole integer between 1 and 999'

        return

    // lower limit needs to be less than upper lim
    } else if (parseInt(lowerLim.value) >= parseInt(upperLim.value)) {

        // Display error
        lowerLim.style.borderColor = 'red'        
        upperLim.style.borderColor = 'red'
        error.style.display = 'inline-block'
        error.innerHTML = 'Lower Limit value must be lower than Upper Limit'

        return

    }

    // Create data object to send to server
    const data = {
        name: name.value,
        childNum: childNum.value,
        lowerLim: lowerLim.value,
        upperLim: upperLim.value
    }

    // Create request variable for use in AJAX request
    const request = new XMLHttpRequest();

    // Open route to post at /parentNode url
    request.open('POST', '/parentNode');

    // Set Request header to receive JSON
    request.setRequestHeader('Content-Type', 'application/JSON');

    // Begin function when data is returned from server
    request.onload = function() {

        // Set data object
        let data = request.response

        // Reset input borders and values for another entry on successful entry
        name.style.borderColor = 'black';
        name.value = '';
        childNum.style.borderColor = 'black';
        childNum.value = '';
        lowerLim.style.borderColor = 'black';
        lowerLim.value = '';
        upperLim.style.borderColor =  'black';
        upperLim.value = '';

        // Call refresh function
        dataRefresh()
    }   

    // Send data to server
    request.send(JSON.stringify({
        data
    }))
}

// Load the page with data from the server
getRoute()