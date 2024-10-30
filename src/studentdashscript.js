import { getAllTutors } from './tutorapi.js';
import { authentication, firestore } from "./firebase/firebase.js";
import {
    collection,
    addDoc,
    getDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { app } from "./firebase/firebase.js"; // Adjust the path as needed

// Initialize Firebase Authentication
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.getElementById('google-sign-in').addEventListener('click', async function() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log('User signed in:', user);
        
        // Optional: Display a welcome message or redirect
        alert(`Welcome, ${user.displayName}!`);
        
        // Redirect to another page if needed
        // window.location.href = "dashboard.html";
    } catch (error) {
        console.error('Error signing in with Google:', error);
        alert('Failed to sign in. Please try again.');
    }
});


const GOOGLE_API_CONFIG = {
    API_KEY: 'AIzaSyCuFkSqyeT1_waMrLxxZuXNj3UDqfrokMM',  // Use your API key here
    CLIENT_ID: '327568585216-ek5dhddona5smuvo5g8mg3q499hvqiso.apps.googleusercontent.com',  // Use your client ID here
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    SCOPES: 'https://www.googleapis.com/auth/calendar.events'
};

async function initializeGoogleCalendar() {
    try {
        await gapi.load('client:auth2');
        await gapi.client.init({
            apiKey: "AIzaSyDHTkeo6lS8oYdvJvb0aE50_6iDw7EUOgc",
            clientId: "280280197401-imvqlfsjrgqf3sqmp2l4hc63uosf8l97.apps.googleusercontent.com",
            scope: 'https://www.googleapis.com/auth/calendar.events',
        });
        gapi.auth2.getAuthInstance().signIn();
    } catch (error) {
        console.error('Error initializing Google Calendar:', error);
        throw error;
    }
}

async function addToGoogleCalendar(sessionDetails) {
    try {
        const event = {
            'summary': `Tutoring Session - ${sessionDetails.subject}`,
            'description': `Tutoring session with ${sessionDetails.tutorName}`,
            'start': {
                'dateTime': sessionDetails.startDateTime,
                'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            'end': {
                'dateTime': sessionDetails.endDateTime,
                'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            'attendees': [
                {'email': sessionDetails.studentEmail},
                {'email': sessionDetails.tutorEmail}
            ],
            'reminders': {
                'useDefault': false,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 30}
                ]
            }
        };

        const request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event,
            'sendUpdates': 'all'
        });

        return await request.execute();
    } catch (error) {
        console.error('Error adding to Google Calendar:', error);
        throw error;
    }
}

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
        const tutorDropdown = document.getElementById('tutor'); // Select the dropdown element
        const tutors = await getAllTutors();

        // Check if tutors are available
        if (!tutors.length) {
            tutorsContainer.innerHTML = '<p>No tutors available at the moment.</p>';
            tutorDropdown.innerHTML = '<option value="" disabled selected>No tutors available</option>';
            return;
        }

        // Create tutor cards and populate tutors container
        const tutorCards = tutors.map(tutor => createTutorCard(tutor)).join('');
        tutorsContainer.innerHTML = tutorCards;

        // Populate dropdown with tutor names
        tutorDropdown.innerHTML = '<option value="" disabled selected>Select a tutor</option>';
        tutors.forEach(tutor => {
            const option = document.createElement('option');
            option.value = tutor.id; // Assuming each tutor has a unique `id`
            option.textContent = tutor.fullname;
            tutorDropdown.appendChild(option);
        });

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

document.getElementById('schedule-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const tutorSelect = document.getElementById('tutor');
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const tutorId = tutorSelect.value;

    if (!tutorId || !date || !time) {
        alert("Please select a tutor, date, and time.");
        return;
    }

    try {
        // Initialize Google Calendar
        await initializeGoogleCalendar();

        // Get tutor details
        const tutorDoc = await getDoc(doc(firestore, "tutors", tutorId));
        const tutorData = tutorDoc.data();

        // Get student details
        const studentId = sessionStorage.getItem('currentUser');
        const studentDoc = await getDoc(doc(firestore, "students", studentId));
        const studentData = studentDoc.data();

        // Calculate session times
        const startDateTime = new Date(`${date}T${time}`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour session

        // Prepare session data
        const sessionData = {
            tutorId,
            tutorName: tutorData.fullname,
            tutorEmail: tutorData.email,
            studentId,
            studentName: studentData.fullname,
            studentEmail: studentData.email,
            date,
            time,
            status: 'pending',
            /* subject: tutorData.subjects[0] */ // You might want to add subject selection
        };

        // Save to Firebase
        const sessionRef = await addDoc(collection(firestore, "sessions"), sessionData);

        // Add to Google Calendar
        await addToGoogleCalendar({
            tutorName: tutorData.fullname,
            tutorEmail: tutorData.email,
            studentEmail: studentData.email,
           /*  subject: tutorData.subjects[0], */
            startDateTime: startDateTime.toISOString(),
            endDateTime: endDateTime.toISOString()
        });

        // Update local storage
        localStorage.setItem('scheduledTutor', tutorData.fullname);
        localStorage.setItem('scheduledDate', date);
        localStorage.setItem('scheduledTime', time);

        alert('Session scheduled successfully and added to your Google Calendar!');
        window.location.href = 'sessions.html';
    } catch (error) {
        console.error('Error scheduling session:', error);
        alert('Error scheduling session. Please try again.');
    }
});


// Function to populate the scheduling form
function populateSchedulingForm(tutorName) {
    const scheduleSelect = document.getElementById('tutor');
    if (scheduleSelect) {
        scheduleSelect.value = tutorName;
        // Scroll to scheduling section
        document.getElementById('schedule').scrollIntoView({ behavior: 'smooth' });
    }
}

// Keep your existing smooth scrolling functionality
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});

// Keep your existing profile picture click handler
/* document.querySelector('.profile-picture a').addEventListener('click', function(event) {
    event.preventDefault();
    alert('Navigating to profile page...');
    window.location.href = 'profile.html';
}); */

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        //await initializeGoogleCalendar(); // Initialize Google Calendar when page loads
        await loadTutors();
        
        // Keep your existing session details loading
        const scheduledTutor = localStorage.getItem('scheduledTutor');
        const scheduledDate = localStorage.getItem('scheduledDate');
        const scheduledTime = localStorage.getItem('scheduledTime');

        if (scheduledTutor && scheduledDate && scheduledTime) {
            alert(`Upcoming session with ${scheduledTutor} on ${scheduledDate} at ${scheduledTime}`);
        }
    } catch (error) {
        console.error('Error initializing:', error);
    }
});
