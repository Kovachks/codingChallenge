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
    const name = document.getElementById('name');
    const childNum = document.getElementById('childNum');
    const lowerLim = document.getElementById('lowerLim');
    const upperLim = document.getElementById('upperLim');

// Begin validating user inputs

    // Validate all inputs for content
    if (name.value === '' || childNum.value === '' || lowerLim.value === '' || upperLim.value === '') {

        alert('please fill out all fields to continue')

        return
    }

    console.log('continue')

    // Validate Child Num for whole integer and between 1-15
    // Regex used to validate a whole integer
    if (!/^\d+$/.test(childNum.value)) {
    
        childNum.style.borderColor = 'red'

        return

    // Validate between 1-15
    } else if (childNum.value < 1 || childNum.value > 15) {

        childNum.style.borderColor = 'red'

        return

    }

    // Validate Upper limit for whole integer between 1-999
    // Regex used to validate a whole integer
    if (!/^\d+$/.test(upperLim.value)) {

        upperLim.style.borderColor = 'red'

        return

        // between 1-999
    } else if (upperLim.value < 1 || upperLim.value > 999) {

        upperLim.style.borderColor = 'red'

        return

    } 


    // Validate lowerLim for whole integer between 1-999 and lower than Upper Limit
    // Regex used to validate a whole integer
    if (!/^\d+$/.test(lowerLim.value)) {

        lowerLim.style.borderColor = 'red'

        return

    // Between 1-999
    } else if (lowerLim.value < 1 || lowerLim.value > 999) {

        lowerLim.style.borderColor = 'red'

        return

    // lower limit needs to be less than upper lim
    } else if (lowerLim.value >= upperLim.value) {

        lowerLim.style.borderColor = 'red'
        
        upperLim.style.borderColor = 'red'

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
        let data = JSON.parse(request.response)

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
    }   

    // Send data to server
    request.send(JSON.stringify({
        data
    }))
}