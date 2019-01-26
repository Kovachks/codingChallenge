// import { Socket } from "dgram";

// Enabling Websocket
if (window.location.hostname !== 'localhost') {
    var socket = io.connect('https://boiling-beyond-83726.herokuapp.com/:80')
} else {
    var socket = io.connect('http://' + window.location.hostname);
}

console.log(window.location)

document.addEventListener('click', function(e) {

    if (e.srcElement.className === 'factoryName') {

        document.getElementById('lowerLimitBox').style.display = 'none';
        document.getElementById('upperLimitBox').style.display = 'none';

        let inputBox = document.getElementById('inputBox')
        let childBtn = document.getElementById('generateChildBtn')

        // set input box near clicked factory list item
        inputBox.style.display = 'inline-block' 
        inputBox.style.top = `${e.clientY}px`
        inputBox.style.left = `${e.clientX + 50}px`
        
        // adding id value to generate/delete buttons
        childBtn.setAttribute('data-id', e.srcElement.attributes[1].value)
        childBtn.setAttribute('data-upperBound', e.srcElement.attributes[2].value)
        childBtn.setAttribute('data-lowerBound', e.srcElement.attributes[3].value)
        document.getElementById('deleteBtn').setAttribute('data-id', e.srcElement.attributes[1])


        return

    } else if (e.srcElement.classList[1] === 'lower') {

        document.getElementById('inputBox').style.display = 'none';
        document.getElementById('upperLimitBox').style.display = 'none';

        let lowerBox = document.getElementById('lowerLimitBox')

        lowerBox.style.display = 'inline-block' 
        lowerBox.style.top = `${e.clientY}px`
        lowerBox.style.left = `${e.clientX + 70}px`

        // Set lower box near clicked lower limit item
        

    } else if (e.srcElement.classList[1] === 'upper') {

        let upperBox = document.getElementById('upperLimitBox')

        document.getElementById('inputBox').style.display = 'none';
        document.getElementById('lowerLimitBox').style.display = 'none';

        upperBox.style.display = 'inline-block' 
        upperBox.style.top = `${e.clientY}px`
        upperBox.style.left = `${e.clientX + 70}px`

    } else if (e.srcElement.className === 'btn btn-secondary generateBtn' || e.srcElement.id === 'generateInput' ) {

        return

    } else {

        document.getElementById('inputBox').style.display = 'none'
        document.getElementById('lowerLimitBox').style.display = 'none'
        document.getElementById('upperLimitBox').style.display = 'none'

    } 
    
}, false);

// Receiving the refresh data socket emit call in order to refresh data
socket.on('refreshData', function(data) {

    console.log('socket received the refreshdata command')

    document.getElementById('listView').innerHTML = ''

    // Call getRoute to refresh client side data
    getRoute()

})

// Function to emit refresh to server side web socket
const dataRefresh = () => {

    console.log('the socket emitted the refresh')

    socket.emit('refresh')

}

const generateNewNodes = () => {

    let btn = document.getElementById('generateChildBtn')

    let id = btn.getAttribute('data-id')

    let upper = btn.getAttribute('data-upperbound')

    let lower = btn.getAttribute('data-lowerbound')

    let count = parseInt(document.getElementById('generateInput').value)

    if (count > 15 || count < 1) {
        
        alert('new count must be between 1 and 15')
        
        return
    }



    let data = {
        id: id,
        count: count,
        upper: upper,
        lower: lower
    }

    // Create request variable for use in AJAX request
    const request = new XMLHttpRequest();

    // Open route to post at /parentNode url
    request.open('POST', '/updateDb');

    // Set Request header to receive JSON
    request.setRequestHeader('Content-Type', 'application/JSON');

    // Begin function when data is returned from server
    request.onload = function(data) {
        // console.log(data)

        console.log('----------------------------------------------------------------------')

    console.log(request.response)

    dataRefresh()        

    }

    request.send(JSON.stringify(data))

}

const deleteParent = () => {

    let id = parseInt(document.getElementById('deleteBtn').value)

    let data = {
        id: id
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
        // console.log(data)

        console.log('----------------------------------------------------------------------')

    console.log(request.response)

    dataRefresh()        

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

        console.log(resData)

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
            dataStr += `<li class='factoryName' data-id=${resData.parentNode[i].id} data-upperBound=${resData.parentNode[i].upperBound} data-lowerBound=${resData.parentNode[i].lowerBound}}>${resData.parentNode[i].parentName}</li><li class='treeLi'></li><li class='range upper' data-id=${resData.parentNode[i].id} data-lower=${resData.parentNode[i].lowerBound} data-upper=${resData.parentNode[i].upperBound}>${resData.parentNode[i].upperBound}</li><li class='range'>  -  </li><li class='range lower' data-id=${resData.parentNode[i].id} data-lower=${resData.parentNode[i].lowerBound} data-upper=${resData.parentNode[i].upperBound}>${resData.parentNode[i].lowerBound}</li></li><ul class='childUl'>`

            // Loop through current factories and gather the generated numbers
            for (let k = 0; k < resData.parentNode[i].childNode.length; k++) {
                dataStr += `<li class='childLiTree'></li><li value=${resData.parentNode[i].childNode[k].parentID}>${resData.parentNode[i].childNode[k].assignNum}</li>`
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

        dataRefresh()
    }   

    // Send data to server
    request.send(JSON.stringify({
        data
    }))
}

getRoute()