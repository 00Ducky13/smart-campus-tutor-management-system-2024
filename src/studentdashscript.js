import {getTutorFromID,updateUserWithID,getAllTutors} from "./tutorapi.js";

let master_tutor_list = [];
let fullFilterList = [];
async function populateTutorList(){
    let results = await getAllTutors();
    for(let i=0;i<results.length;i++){
        let tempObj = results[i];
        master_tutor_list.push(tempObj);
    }
}
// Handle star rating for tutors
document.querySelectorAll('.star-rating input').forEach(star => {
    star.addEventListener('change', function() {
        const rating = this.value;
        const tutorName = this.name.split('-')[1];
        alert(`You rated ${tutorName} with ${rating} stars!`);
        localStorage.setItem(`${tutorName}-rating`, rating);
    });
});

// Handle schedule session form submission
document.getElementById('schedule-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const tutor = document.getElementById('tutor').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    // Validate form input
    if (!tutor || !date || !time) {
        alert("Please select a tutor, date, and time.");
        return;
    }

    // Save data to localStorage
    localStorage.setItem('scheduledTutor', tutor);
    localStorage.setItem('scheduledDate', date);
    localStorage.setItem('scheduledTime', time);

    alert(`Session scheduled with ${tutor} on ${date} at ${time}`);
    
    // Redirect to sessions.html (you can change this as needed)
    window.location.href = 'sessions.html';
});

// Load stored session details on page load
window.addEventListener('DOMContentLoaded', function() {
    const scheduledTutor = localStorage.getItem('scheduledTutor');
    const scheduledDate = localStorage.getItem('scheduledDate');
    const scheduledTime = localStorage.getItem('scheduledTime');

    if (scheduledTutor && scheduledDate && scheduledTime) {
        alert(`Upcoming session with ${scheduledTutor} on ${scheduledDate} at ${scheduledTime}`);
    }

    console.log("Content Loaded");
    populateTutorList().then(res =>{
        fullFilterList = [].concat(master_tutor_list);
        console.log(master_tutor_list);
        removeTutorCards();
        drawTutorCards(master_tutor_list);
    }); 
});


function drawTutorCards(tutor_list){
    const tutorGrid = document.getElementById("tutorGrid");
    for (let i=0;i<master_tutor_list.length;i++){
        //console.log("Item found");    
        let tutorCard = document.createElement("a");
        tutorCard.setAttribute("class","tutor-item");
        tutorCard.setAttribute("href",tutor_list[i].link);
        tutorCard.setAttribute("id","tutorCard-"+i.toString())
        tutorCard.setAttribute("display","");
        let tutorName = document.createElement("p");
        tutorName.innerHTML = "<strong>" + tutor_list[i].fullname + "</strong>";
        tutorCard.appendChild(tutorName);
        /* let tutorSubject = document.createElement("p");
        tutorSubject.innerHTML = "<strong>Subject:</strong> " + tutor_list[i].subject;
        tutorCard.appendChild(tutorSubject);
        let tutorCourse = document.createElement("p");
        tutorCourse.innerHTML = "<strong>Course:</strong> " + tutor_list[i].course;
        tutorCard.appendChild(tutorCourse);
        let tutorOwner = document.createElement("p");
        tutorOwner.innerHTML = "<strong>Uploader:</strong> " + tutor_list[i].owner; */
       // tutorCard.appendChild(tutorOwner);
        tutorGrid.appendChild(tutorCard);
    }    
}
function removeTutorCards(){
    for (let i=0;i<master_tutor_list.length;i++){
        let tempCard = document.getElementById("tutorCard-"+i.toString());
        if (tempCard !== null){
            tempCard.remove();
        }
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});

// Handle profile picture click
document.querySelector('.profile-picture a').addEventListener('click', function(event) {
    event.preventDefault();
    alert('Navigating to profile page...');
    window.location.href = 'profile.html';
});