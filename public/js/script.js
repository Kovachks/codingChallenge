const loadNodes = () => {

    let request = new XMLHttpRequest();

    request.open('GET', '/parent');

    request.setRequestHeader('Content-Type', 'application/JSON');

    request.onload = function() {

        console.log(request)

        // let data = JSON.parse(request.response)

        console.log(request.response)
    }

    request.send(null)


}


const postNodes = () => {

    // Create variables used multiple times for ease of use later
    const name = document.getElementById('name').value;
    const childNum = document.getElementById('childNum').value;
    const lowerLim = document.getElementById('lowerLim').value;
    const upperLim = document.getElementById('upperLim').value;
    const nameBorder = document.getElementById('childNum').style.borderColor
    const childNumBorder = document.getElementById('childNum').style.borderColor
    const lowerLimBorder = document.getElementById('lowerLim').style.borderColor
    const upperLimBorder = document.getElementById('upperNum').style.borderColor

// Begin validating user inputs

    // Validate Child Num for whole integer and between 1-15
    // Regex used to validate a whole integer
    if (!/^\d+$/.test(childNum)) {
    
        childNumBorder = 'red'

        return

    // Validate between 1-15
    } else if (childNum < 1 || childNum > 15) {

        childNumBorder = 'red'

        return

    }

    // Validate Upper limit for whole integer between 1-999
    // Regex used to validate a whole integer
    if (!/^\d+$/.test(upperLim)) {

        upperLimBorder = 'red'

        return

        // between 1-999
    } else if (upperLim < 1 || upperLim > 999) {

        upperLimBorder = 'red'

        return

    } 


    // Validate lowerLim for whole integer between 1-999 and lower than Upper Limit
    // Regex used to validate a whole integer
    if (!/^\d+$/.test(lowerLim)) {

        lowerLimBorder = 'red'

        return

    // Between 1-999
    } else if (lowerLim < 1 || lowerLim > 999) {

        lowerLimBorder = 'red'

        return

    // lower limit needs to be less than upper lim
    } else if (lowerLim >= upperLim) {

        lowerLimBorder = 'red'
        
        upperLimBorder = 'red'

        return

    }


    // Reset borders for inputs if data was validated correctly
    nameBorder = 'black';
    childNumBorder = 'black';
    lowerLimBorder = 'black';
    upperLimBorder =  'black';


    // Create data object to send to server
    const data = {
        name: name,
        childNum: childNum,
        lowerLim: lowerLim,
        upperLim: upperLim
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
        let data = JSON.parse(request.response)

        console.log(data)
    }   

    // Send data to server
    request.send(JSON.stringify({
        data
    }))
}