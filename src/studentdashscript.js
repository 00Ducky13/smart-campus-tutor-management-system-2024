import { getAllTutors } from './tutorapi.js';
import { authentication, firestore } from "./firebase/firebase.js";
import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Keep your existing star rating functionality
document.querySelectorAll('.star-rating input').forEach(star => {
    star.addEventListener('change', function() {
        const rating = this.value;
        const tutorName = this.name.split('-')[1];
        alert(`You rated ${tutorName} with ${rating} stars!`);
        localStorage.setItem(`${tutorName}-rating`, rating);
    });
});

// Function to create a single tutor card
function createTutorCard(tutor) {
    return `
        <figure class="tutor-card">
            <img src="${tutor.profilePic || 'images/userIcon.png'}" alt="Tutor Image" />
            <figcaption>
                <p><strong>Tutor Name:</strong> ${tutor.fullname}</p>
                <p><strong>Subjects:</strong> ${tutor.subjects.join(', ')}</p>
                <p><strong>Courses:</strong> ${tutor.courses.join(', ')}</p>
                <p><strong>Description:</strong> ${tutor.bio}</p>
                ${tutor.availability ? `
                    <div class="availability">
                        <p><strong>Available Times:</strong></p>
                        <ul>
                            ${tutor.availability.map(slot => 
                                `<li>${slot.day}: ${slot.starttime} - ${slot.endtime}</li>`
                            ).join('')}
                        </ul>
                    </div>
                ` : ''}
            </figcaption>
            <div class="star-rating">★ ★ ★ ★ ★</div>
        </figure>
    `;
}

// Function to load and display all tutors
async function loadTutors() {
    try {
        const tutorsContainer = document.getElementById('tutors-container');
        const tutors = await getAllTutors();
        
        if (!tutors.length) {
            tutorsContainer.innerHTML = '<p>No tutors available at the moment.</p>';
            return;
        }

        const tutorCards = tutors.map(tutor => createTutorCard(tutor)).join('');
        tutorsContainer.innerHTML = tutorCards;

        // Add event listeners to the newly created elements
        setupTutorCardListeners();
    } catch (error) {
        console.error('Error loading tutors:', error);
        document.getElementById('tutors-container').innerHTML = 
            '<p>Error loading tutors. Please try again later.</p>';
    }
}

// Function to set up event listeners for tutor cards
function setupTutorCardListeners() {
    // Add click listeners for scheduling
    document.querySelectorAll('.tutor-card').forEach(card => {
        card.addEventListener('click', function() {
            const tutorName = this.querySelector('figcaption p:first-child').textContent.split(':')[1].trim();
            populateSchedulingForm(tutorName);
        });
    });
}

// Function to populate the scheduling form
function populateSchedulingForm(tutorName) {
    const scheduleSelect = document.getElementById('tutor');
    if (scheduleSelect) {
        scheduleSelect.value = tutorName;
        // Scroll to scheduling section
        document.getElementById('schedule').scrollIntoView({ behavior: 'smooth' });
    }
}

// Modified version of your existing schedule form handler
document.getElementById('schedule-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const tutor = document.getElementById('tutor').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    // Validate form input
    if (!tutor || !date || !time) {
        alert("Please select a tutor, date, and time.");
        return;
    }

    try {
        // Save to Firebase instead of localStorage
        const sessionData = {
            tutor,
            date,
            time,
            studentId: sessionStorage.getItem('currentUser'),
            status: 'pending'
        };

        await addDoc(collection(firestore, "sessions"), sessionData);
        alert('Session scheduled successfully!');
        
        // Keep the localStorage functionality for compatibility
        localStorage.setItem('scheduledTutor', tutor);
        localStorage.setItem('scheduledDate', date);
        localStorage.setItem('scheduledTime', time);

        window.location.href = 'sessions.html';
    } catch (error) {
        console.error('Error scheduling session:', error);
        alert('Error scheduling session. Please try again.');
    }
});

// Keep your existing smooth scrolling functionality
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});

// Keep your existing profile picture click handler
document.querySelector('.profile-picture a').addEventListener('click', function(event) {
    event.preventDefault();
    alert('Navigating to profile page...');
    window.location.href = 'profile.html';
});

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTutors();
    
    // Keep your existing session details loading
    const scheduledTutor = localStorage.getItem('scheduledTutor');
    const scheduledDate = localStorage.getItem('scheduledDate');
    const scheduledTime = localStorage.getItem('scheduledTime');

    if (scheduledTutor && scheduledDate && scheduledTime) {
        alert(`Upcoming session with ${scheduledTutor} on ${scheduledDate} at ${scheduledTime}`);
    }
});