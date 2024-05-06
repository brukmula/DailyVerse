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
    <div class="introContent">
      <h1>Welcome to the Daily Bible Quiz!</h1>
      <h2>Practice your scripture memorization skills.</h2>
      <button onclick="removeModal(); callInstructions();">Instructions</button>
      <button onclick="removeModal()">Get Started</button>
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

// When user gets it correct, change modal to display win screen
function allCorrect (){
   loadModal();

   modal.style.height = "50%";
   modal.style.width = "50%";

}

// Inner Text for Instructions window
function setInstructionsContent (){
   const instructionsContent = document.getElementById('instructionsContent');

   // HTML for instructions window
   instructionsContent.innerHTML = `
      <h1> Instructions</h1>
      <p>This is where the instructions will belong.</p>
   `;
}

