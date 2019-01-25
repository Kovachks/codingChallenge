// import { Socket } from "dgram";

// Enabling Websocket
var socket = io.connect('http://localhost');

document.addEventListener('click', function(e) {

    if (e.srcElement.className === 'factoryName') {

        document.getElementById('inputBox').style.display = 'inline-block' 
        document.getElementById('inputBox').style.top = `${e.clientY}px`
        document.getElementById('inputBox').style.left = `${e.clientX + 50}px`

    } else {

        return

    }  
    
}, false);

// Receiving the refresh data socket emit call in order to refresh data
socket.on('refreshData', function(data) {

    // Call getRoute to refresh client side data
    getRoute()

})

// Function to emit refresh to server side web socket
const dataRefresh = () => {

    socket.emit('refresh')

}

const generateNewNodes = () => {



}

const deleteParent = () => {



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

        console.log(resData)

        // Creating data string container
        let dataStr = ''

        // If root or parent don't exist then exit function
        if (!resData.childNode) {
            return
        }

        // Creating root section of list
        dataStr += `<li>Root</li><ul class='parentUl'>`

        // Loop through each factory and add to data string
        for (let i = 0; i < resData.parentNode.length; i++) {

            // Add factory data to list
            dataStr += `<li class='factoryName' value=${resData.parentNode[i].id}>${resData.parentNode[i].parentName}</li><ul class='childUl'>`

            // Loop through current factories and gather the generated numbers
            for (let k = 0; k < resData.parentNode[i].childNode.length; k++) {
                dataStr += `<li value=${resData.parentNode[i].childNode[k].parentID}>${resData.parentNode[i].childNode[k].assignNum}</li>`
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

const postNodes = () => {

    // Create variables used multiple times for ease of use later
    const name = document.getElementById('name');
    const childNum = document.getElementById('childNum');
    const lowerLim = document.getElementById('lowerLim');
    const upperLim = document.getElementById('upperLim');
    const error = document.getElementById('errorDisplay')

    // Resetting error display
    error.style.display = 'none'
    name.style.borderColor = 'black'
    childNum.style.borderColor = 'black'
    lowerLim.style.borderColor = 'black'
    upperLim.style.borderColor = 'black'

// Begin validating user inputs

    // Validate all inputs for content
    if (name.value === '' || childNum.value === '' || lowerLim.value === '' || upperLim.value === '') {
        
        error.style.display = 'inline-block'

        error.innerHTML = 'Please fill out all fields to continue'

        return

    }

    if (name.value.length > 30) {
        
        name.style.borderColor = 'red'

        error.style.display = 'inline-block'

        error.innerHTML = 'Factory Name must be 30 characters or less'

        return

    }

    console.log('continue')

    // Validate Child Num for whole integer and between 1-15
    // Regex used to validate a whole integer
    if (!/^\d+$/.test(childNum.value)) {
    
        childNum.style.borderColor = 'red'

        error.style.display = 'inline-block'

        error.innerHTML = 'Child Numbers must be a whole integer'

        return

    // Validate between 1-15
    } else if (childNum.value < 1 || childNum.value > 15) {

        childNum.style.borderColor = 'red'
        
        error.style.display = 'inline-block'

        error.innerHTML = 'Child Numbers must be between 1 and 15'

        return

    }

    // Validate Upper limit for whole integer between 1-999
    // Regex used to validate a whole integer
    if (!/^\d+$/.test(upperLim.value)) {

        upperLim.style.borderColor = 'red'

        error.style.display = 'inline-block'

        error.innerHTML = 'Upper Limit must be a whole integer'

        return

        // between 1-999
    } else if (upperLim.value < 1 || upperLim.value > 999) {

        upperLim.style.borderColor = 'red'

        error.style.display = 'inline-block'

        error.innerHTML = 'Upper Limit must be a whole integer between 1 and 999'

        return

    } 


    // Validate lowerLim for whole integer between 1-999 and lower than Upper Limit
    // Regex used to validate a whole integer
    if (!/^\d+$/.test(lowerLim.value)) {

        lowerLim.style.borderColor = 'red'

        error.style.display = 'inline-block'

        error.innerHTML = 'Lower Limit must be a whole integer'

        return

    // Between 1-999
    } else if (lowerLim.value < 1 || lowerLim.value > 999) {

        lowerLim.style.borderColor = 'red'

        error.style.display = 'inline-block'

        error.innerHTML = 'Lower Limit must be a whole integer between 1 and 999'

        return

    // lower limit needs to be less than upper lim
    } else if (parseInt(lowerLim.value) >= parseInt(upperLim.value)) {

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
        
        

        console.log(data)

        dataRefresh()
    }   

    // Send data to server
    request.send(JSON.stringify({
        data
    }))
}

getRoute()