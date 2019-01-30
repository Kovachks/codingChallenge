document.addEventListener('click', function(e) {

    // If factory name selected open the inputbox
    if (e.srcElement.className === 'factoryName') {

        // Hide other potential input boxes that might be open
        document.getElementById('lowerLimitBox').style.display = 'none';
        document.getElementById('upperLimitBox').style.display = 'none';

        // Create variables for use later
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
        childBtn.setAttribute('data-name', e.srcElement.dataset.name)
        childBtn.setAttribute('data-count', e.srcElement.dataset.count)
        document.getElementById('deleteBtn').setAttribute('data-id', e.srcElement.dataset.id)


        return

        // If lower bound was selected open lower update input
    } else if (e.srcElement.classList[1] === 'lower') {

        // Hide other potential iput boxes that might be open
        document.getElementById('inputBox').style.display = 'none';
        document.getElementById('upperLimitBox').style.display = 'none';

        // Create variables for use later
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
        updateLower.setAttribute('data-name', e.srcElement.dataset.name)
        

        // If upper bound was selected open upper update input
    } else if (e.srcElement.classList[1] === 'upper') {

        let upperBox = document.getElementById('upperLimitBox')

        // Hide other potential input boxes that may be open
        document.getElementById('inputBox').style.display = 'none';
        document.getElementById('lowerLimitBox').style.display = 'none';

        // Create variables for later
        let updateUpper = document.getElementById('updateUpper')
       
        // Display upper input update box
        upperBox.style.display = 'inline-block' 
        upperBox.style.top = `${e.clientY}px`
        upperBox.style.left = `${e.clientX - 250}px`

        // Assign value to update button
        updateUpper.setAttribute('data-id', e.srcElement.dataset.id)
        updateUpper.setAttribute('data-upperBound', e.srcElement.dataset.upper)
        updateUpper.setAttribute('data-lowerBound', e.srcElement.dataset.lower)
        updateUpper.setAttribute('data-count', e.srcElement.dataset.count)
        updateUpper.setAttribute('data-name', e.srcElement.dataset.name)

        // Keep input box open if selecting HTML elementing within box
    } else if (e.srcElement.className === 'btn btn-secondary generateBtn' || e.srcElement.className === 'form-control generateInput' ) {

        return

    } else {

        // Hide input boxes
        document.getElementById('inputBox').style.display = 'none'
        document.getElementById('lowerLimitBox').style.display = 'none'
        document.getElementById('upperLimitBox').style.display = 'none'

    } 
    
}, false);