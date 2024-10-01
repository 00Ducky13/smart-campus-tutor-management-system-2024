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
});

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