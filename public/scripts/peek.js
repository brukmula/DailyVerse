// Turn punctuation checker on and off
const peekButton = document.getElementById('peekButton');

// When peek button is clicked, display peek window
peekButton.addEventListener('click', () => {
    const peekWindow = document.getElementById('peekWindow');

    peekWindow.style.display = 'block';

    // DEV NOTE: The content is written to the Peek window in the loadAndUpdateData function in main.js

    // Prevent adding the event listener multiple times
    if(peekWindow.__peekWindowClickListenerAdded) return;

    // Delay the attachment of the click event listener to document
    setTimeout(() => {
        document.addEventListener('click', function (event) {
            const isClickedInsidePeekWindow =
                peekWindow.contains(event.target) ||
                peekButton.contains(event.target);
            if(!isClickedInsidePeekWindow) {
                peekWindow.style.display = 'none';

                // Remove the event listener if the window is not supposed to be reopened
                document.removeEventListener('click', this);
                peekWindow.__peekWindowClickListenerAdded = false;
            }
        });

        peekWindow.__peekWindowClickListenerAdded = true;
    }, 0); // Execute after the current call stack clears
});