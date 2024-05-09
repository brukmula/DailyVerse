const currentDay = document.getElementById('dateTime');

let verseOfTheDay; // Will store the verse of the day

// When page is loaded, call function that loads the data and updates the text
document.addEventListener("DOMContentLoaded", function() {
    updateVerse();
});

//Check schedule for today's verse of the day
function updateVerse(){
    fetch('/jsonFiles/schedule.json')
        .then(response => response.json())
        .then(data => {
            const currentDayData = data.find(item => item.date === currentDay.innerText);
           verseOfTheDay = currentDayData.verse;

           // Get the verse info and display onto website
            loadDataAndUpdateText();
        });
}


function loadDataAndUpdateText() {
    fetch('/jsonFiles/verses.json') // Adjust the path to your actual JSON file location
        .then(response => response.json())
        .then(data => {
            const difficulty = document.getElementById("difficulty").value;
            const reference = document.getElementById("reference");
            const peekVerse = document.getElementById('peekVerse');
            const peekRef = document.getElementById('peekRef');

            const modalVerseReference = document.getElementById('modalVerseReference');
            const modalVerseText = document.getElementById('modalVerseText');

            // Find the sentenceData with the matching reference
            const sentenceData = data.find(item => item.reference === verseOfTheDay);

            // Fill areas with verse and reference text
            reference.innerHTML = sentenceData.reference;
            peekVerse.innerText = sentenceData.sentence + "\n";
            peekRef.innerText = sentenceData.reference;

            //Set Modal content to today's verse
            modalVerseReference.innerText = "Today's Verse: " + sentenceData.reference;
            modalVerseText.innerText = sentenceData.sentence;

            updateText(sentenceData.sentence, difficulty);
        })
        .catch(error => {
            console.error('Error loading the JSON data: ', error);
        });
}

// Change where the blanks are
function updateText(sentence, difficulty) {
    const sentenceElement = document.getElementById("sentence");
    const words = sentence.split(' ');

    sentenceElement.innerHTML = ''; // Clear existing content

    if (difficulty === 'complete') {
        // Provide one large input box for the whole sentence
        const input = createCompleteVerseInput(sentence);
        sentenceElement.appendChild(input);
    } else {
        let numBlanks;
        if (difficulty === 'easy') {
            numBlanks = Math.floor(words.length / 4);
        } else if (difficulty === 'medium') {
            numBlanks = Math.floor(words.length / 2);
        } else if (difficulty === 'hard') {
            numBlanks = Math.floor(words.length); // Every word
        }

        let indexes = chooseIndexes(words, numBlanks); // Calculate indexes to hide based on difficulty

        //Create input boxes for each missing word
        words.forEach((word, index) => {
            if (indexes.includes(index)) {
                const input = createInput(word, 'blank', word.length);
                sentenceElement.appendChild(input);
                sentenceElement.appendChild(document.createTextNode(' '));
            } else {
                sentenceElement.appendChild(document.createTextNode(word + ' '));
            }
        });
    }
}

function createCompleteVerseInput(sentence){
    const textarea = document.createElement('textarea');
    textarea.setAttribute('data-answer', normalizeString(sentence));
    textarea.setAttribute('class', 'full-sentence');
    textarea.style.width = '100%'; // Full width
    textarea.style.height = 'auto'; // Start with minimal height, expand as needed
    textarea.style.minHeight = '20px'; // Minimum height
    textarea.style.resize = 'none'; // Disable manual resizing
    textarea.style.fontSize = '32px';
    textarea.placeholder = 'Enter complete Verse here...';
    textarea.addEventListener('input', function () {
        // Adjust the height to fit content
        this.style.backgroundColor = ''; // Always clear background on edit
        this.style.height = 'auto'; // Reset height to recalculate
        this.style.height = this.scrollHeight + 'px'; // Set height to scroll height to fit all content
    });

    return textarea;
}

// Create input boxes based on difficulty and verse length
function createInput(word, className, size) {
    const input = document.createElement('input');
    input.type = 'text';
    input.size = size;
    input.setAttribute('data-answer', normalizeString(word));
    input.setAttribute('class', className);

    // Create tooltip for spelling hints
    const tooltip = document.createElement('span');
    tooltip.textContent = 'Check your spelling!';
    tooltip.style.cssText = 'visibility: hidden; background-color: yellow; color: black; text-align: center; border-radius: 6px; padding: 5px; position: absolute; z-index: 1; top: -5px; right: 105%;';

    // Add event listener for input changes
    input.addEventListener('input', function () {
        this.style.backgroundColor = ''; // Always clear background on edit
        tooltip.style.visibility = 'hidden'; // Hide tooltip if visible
        if (this.style.backgroundColor === 'green') {
            this.readOnly = true; // Prevent changes if the answer is correct
        }
    });

    // Make sure to append the input to the DOM before adding the tooltip
    const container = document.createElement('div'); // Create a container for input and tooltip
    container.style.position = 'relative'; // Position relative for absolute positioning of the tooltip
    container.appendChild(input);
    container.appendChild(tooltip);

    return container;
}

// Set the indexes of each word
function chooseIndexes(words, numBlanks) {
    let indexes = new Set();
    while (indexes.size < numBlanks) {
        indexes.add(Math.floor(Math.random() * words.length));
    }
    return Array.from(indexes);
}

function checkAnswers() {
    // Check if there is a full-sentence textarea for the 'complete' difficulty
    const fullSentenceTextArea = document.querySelector("textarea.full-sentence");
    if (fullSentenceTextArea) {
        const inputVal = normalizeString(fullSentenceTextArea.value);
        const answer = fullSentenceTextArea.dataset.answer;

        if (inputVal === answer) {
            fullSentenceTextArea.style.backgroundColor = "#58fb50"; //Set to green
            fullSentenceTextArea.readOnly = true; // User can't change the value if it is correct
        } else {
            fullSentenceTextArea.style.backgroundColor = "#fb5750"; //Set to red
        }
        return; // Exit the function after checking the full sentence input
    }

    // For 'easy', 'medium', 'hard' where inputs are per word
    const inputs = document.querySelectorAll("input.blank");
    let allTrue = true;

    inputs.forEach(input => {
        const inputVal = normalizeString(input.value).replace(/ /g,'');
        const answer = input.dataset.answer;
        const nextSibling = input.nextSibling;

        if (inputVal === answer) {
            input.style.backgroundColor = "#58fb50";
            input.readOnly = true; // User can't change the value if it is correct
        } else if (isCloseMatch(inputVal, answer)) { // Ensure this function is defined or use an alternative check
            nextSibling.style.backgroundColor = "orange";
            nextSibling.style.visibility = "visible";
        } else {
            input.style.backgroundColor = "#fb5750";
            allTrue = false;
            console.log('FALSE - Individual words incorrect');
        }
    });

    if (allTrue) {
        allCorrect();
        console.log('TRUE - All individual words are correct');
    }
}

// Check if spelling of word is close to original
function isCloseMatch(input, answer){
    //Simple proximity check
    if (input.length === answer.length){
        let mismatches = 0;
        for (let i =0; i<input.length; i++){
            if (input[i] !== answer[i] && ++mismatches >1){
                return false;
            }
        }
        return mismatches;
    }
    return false;
}

// Function to empty inputs if user hits clear. Only clears non-green inputs
function clearInputs() {
    // Select all input elements you expect might be checked (those that are part of the quiz)
    const inputs = document.querySelectorAll('input');

    // Loop through each input element
    inputs.forEach(input => {
        // Check if the background color is not green
        if (input.style.backgroundColor !== "rgb(88, 251, 80)") {
            // Clear the input value
            input.value = '';
            // Optionally, reset other styles if needed
            input.style.backgroundColor = ''; // Reset background color
        }
    });
}


// Remove punctuation, spaces, and convert string lower case
function normalizeString(str){
    return str.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").toLowerCase();
}