// This script file updates the date and time

const currentDate = new Date();
const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const month = monthsOfYear[currentDate.getMonth()];
const day = currentDate.getDate();
const year = currentDate.getFullYear();

const formattedDate = `${month} ${day}, ${year}`;

//Insert Data into HTML
document.getElementById("dateTime").innerHTML = formattedDate;