document.addEventListener('click', function(e) {

    console.log(e.srcElement.className)

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
        childBtn.setAttribute('data-id', e.srcElement.dataset.id)
        childBtn.setAttribute('data-upperBound', e.srcElement.dataset.upperbound)
        childBtn.setAttribute('data-lowerBound', e.srcElement.dataset.lowerbound)
        document.getElementById('deleteBtn').setAttribute('data-id', e.srcElement.dataset.id)


        return

    } else if (e.srcElement.classList[1] === 'lower') {

        document.getElementById('inputBox').style.display = 'none';
        document.getElementById('upperLimitBox').style.display = 'none';

        console.log(e.srcElement.dataset)

        let updateLower = document.getElementById('updateLower')
        let lowerBox = document.getElementById('lowerLimitBox')

        // Set lower box near clicked lower limit item
        lowerBox.style.display = 'inline-block' 
        lowerBox.style.top = `${e.clientY}px`
        lowerBox.style.left = `${e.clientX - 250}px`

        // Assign value to update button
        updateLower.setAttribute('data-id', e.srcElement.dataset.id)
        updateLower.setAttribute('data-upperBound', e.srcElement.dataset.upper)
        updateLower.setAttribute('data-lowerBound', e.srcElement.dataset.lower)
        updateLower.setAttribute('data-count', e.srcElement.dataset.count)
        

    } else if (e.srcElement.classList[1] === 'upper') {

        let upperBox = document.getElementById('upperLimitBox')

        document.getElementById('inputBox').style.display = 'none';
        document.getElementById('lowerLimitBox').style.display = 'none';

        let updateUpper = document.getElementById('updateUpper')
        // let upperBox = document.getElementById('upperLimitBox')

        upperBox.style.display = 'inline-block' 
        upperBox.style.top = `${e.clientY}px`
        upperBox.style.left = `${e.clientX - 250}px`

        // Assign value to update button
        updateUpper.setAttribute('data-id', e.srcElement.dataset.id)
        updateUpper.setAttribute('data-upperBound', e.srcElement.dataset.upper)
        updateUpper.setAttribute('data-lowerBound', e.srcElement.dataset.lower)
        updateUpper.setAttribute('data-count', e.srcElement.dataset.count)

    } else if (e.srcElement.className === 'btn btn-secondary generateBtn' || e.srcElement.className === 'form-control generateInput' ) {

        return

    } else {

        document.getElementById('inputBox').style.display = 'none'
        document.getElementById('lowerLimitBox').style.display = 'none'
        document.getElementById('upperLimitBox').style.display = 'none'

    } 
    
}, false);