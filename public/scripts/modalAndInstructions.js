const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');

document.addEventListener('DOMContentLoaded', () => {
   loadModal();
});


// When webpage is loaded
function loadModal (){
   modal.style.display = 'block'; // Display Modal when window is loaded
   modalIntro();

   // prevent adding the listener multiple times
   if(modal.__modalClickListenerAdded) return;

   // Delay the attachment of the click event listener to the document
   setTimeout(() => {
      document.addEventListener('click', function (event){
         const isClickedInsideModal = modal.contains(event.target);

         if(!isClickedInsideModal){
            modal.style.display = 'none';

            //Remove the event listener
            document.removeEventListener('click', this);
            modal.__modalClickListenerAdded = false;
         }
      });

      modal.__modalClickListenerAdded = true;
   }, 0);
}

// Remove modal from screen
function removeModal(){
   modal.style.display = 'none';
}

// Modal content when the user first opens the website
function modalIntro(){

   // Set Modal HTML
   modalContent.innerHTML =   `
    <div class="modalContent">
    <h1>Welcome to the Daily Bible Quiz!</h1>
    <p>Enhance your understanding and memorization of scriptures with our fun and interactive daily quiz.</p>
    <div>
        <button onclick="removeModal(); callInstructions();">Instructions</button>
        <button onclick="removeModal()">Get Started</button>
    </div>
    <!-- The text is set in the main.js file-->
    <h2 id ="modalVerseReference"></h2>
    <p id="modalVerseText" class="modalVerseText"></p>
    
</div>
   `
}

// Function that displays instructions screen
function callInstructions() {
   const instructions = document.getElementById('instructions');

   // Make instructions visible
   instructions.style.display = 'block';
   setInstructionsContent();

   // Prevent adding the listener multiple times
   if (instructions.__instructionsListenerAdded) return;

   // Define the callback function
   const instructionsClickListener = function (event) {
      const isClickedInsideInstructions = instructions.contains(event.target);

      if (!isClickedInsideInstructions) {
         instructions.style.display = 'none';

         // Remove the event listener
         document.removeEventListener('click', instructionsClickListener);
         instructions.__instructionsListenerAdded = false;
      }
   };

   // Delay the attachment of the click listener to the document
   setTimeout(() => {
      document.addEventListener('click', instructionsClickListener);

      instructions.__instructionsListenerAdded = true;
   }, 0); // Execute after the current call stack clears
}

// Inner Text for Instructions window
function setInstructionsContent (){
   const instructionsContent = document.getElementById('instructionsContent');

   // HTML for instructions window
   instructionsContent.innerHTML = `
      <h1> Instructions</h1>
      <p>Complete the Bible Verse to win!</p>
      <p>There are 4 levels of difficulty, the harder the difficulty the more words that need to be filled.
      </p>
      
      <ul>
        <li><b>Easy:</b> A third of the words </li>
        <li><b>Medium:</b> Half of the words </li>
        <li><b>Hard:</b> All the words </li>
        <li><b>Complete:</b> The entire verse</li>
      </ul>
     
      <p>The default difficulty is set to <b>Hard</b> ,but you can adjust this by clicking on the select menu that looks
       like this 
         <select>
         <option>Easy</option>
         <option>Medium</option>
         <option selected = "selected">Hard</option>
         <option>Complete</option>
         </select>
      </p>
      
      <p>Once you selected your difficulty level, you can begin typing in your answer.</p>
      <p>The verse of the day's reference will appear above the input area, but if you need to look at it before 
      starting just hit this button: <button>Look At Verse</button> </p>
      
      <p>This will reveal today's verse in a popup window, feel free to click on it whenever you get stuck</p>
      
      <p>If you are playing <b>Easy,</b> <b>Medium,</b> or <b>Hard</b> difficulty, you will have to enter each missing word one by one.</p>
      <p>To save you
      some time (especially on the Hard difficulty) there is a small box at the bottom of the screen that will let you 
      type the words one at a time, just click the button next to it or hit enter to see if the word is in the sentence.
      </p>
      
      <p> The <b>Complete</b> difficulty is the only one that requires you to enter the entire verse instead of one word
      at a time. </p>
      
      <p>To see if you are correct, click on the <button>Check</button> button</p>
      
      <p>This button will show you all the correct and incorrect responses in your boxes.</p>
      
      <p>All the correct input's will turn green like so: 
      <input style="background-color: #58fb50; width: 70px; ">
      </p>
      
      <p>All the incorrect input's will turn red like so: 
      <input style="background-color: #fb5750; width: 70px; ">
      </p>
      
      <p>To clear all the incorrect or empty inputs, click on the <button>Clear</button> button</p>
      
      <p>On the <b>Complete</b> difficulty setting, you must have the entire verse correct to get a green box. Punctuation 
      and capitalization are not checked.
      </p>
      
   `;
}

// Set HTML elements for win screen
function callWinScreen(){
   const winScreen = document.getElementById('winScreen');
   const winScreenContent = document.getElementById('winContent');

   winScreen.style.display = 'block';

   winScreenContent.innerHTML = `
      <p> You Got it! </p>
      <p class="winMessage">Try a different difficulty to challenge yourself, or come back tomorrow for a new verse!</p>
   `

   // Prevent adding the listener multiple times
   if(winScreen.__winScreenClickListenerAdded) return;

   // Delay the attachment of the click listener to the document
   setTimeout(() => {
      document.addEventListener('click', function (event){
         const isClickedInsideWinScreen = winScreen.contains(event.target);

         if(!isClickedInsideWinScreen){
            winScreen.style.display ='none';

            // Remove the event listener
            document.removeEventListener('click', this);
            winScreen.__winScreenClickListenerAdded = false;
         }
      });

      winScreen.__winScreenClickListenerAdded = true;
   }, 0);
}

