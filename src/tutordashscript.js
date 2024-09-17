// tutordashscript.js

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Initialize the dashboard by loading saved data
    loadProfile();
    loadAvailability();
    loadUpcomingSessions();

    // Event Listeners for form submissions
    document.getElementById("profile-form").addEventListener("submit", saveProfile);
    document.getElementById("availability-form").addEventListener("submit", saveAvailability);
});

// Function to save the tutor's profile
function saveProfile(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const name = document.getElementById("name").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const bio = document.getElementById("bio").value.trim();
    const profilePicInput = document.getElementById("profile-pic");
    const profilePicFile = profilePicInput.files[0];

    if (!name || !subject || !bio) {
        alert("Please fill in all required fields.");
        return;
    }

    // Create a profile object
    const profile = {
        name: name,
        subject: subject,
        bio: bio,
        profilePic: ""
    };

    // Handle profile picture if uploaded
    if (profilePicFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profile.profilePic = e.target.result; // Base64 string

            // Save profile to localStorage
            localStorage.setItem("tutorProfile", JSON.stringify(profile));

            // Update profile picture in header
            document.querySelector(".profile-img").src = profile.profilePic;

            alert("Profile saved successfully!");
        };
        reader.readAsDataURL(profilePicFile);
    } else {
        // If no new picture is uploaded, retain existing picture
        const existingProfile = JSON.parse(localStorage.getItem("tutorProfile"));
        if (existingProfile && existingProfile.profilePic) {
            profile.profilePic = existingProfile.profilePic;
        }

        // Save profile to localStorage
        localStorage.setItem("tutorProfile", JSON.stringify(profile));

        // Update profile picture in header
        if (profile.profilePic) {
            document.querySelector(".profile-img").src = profile.profilePic;
        }

        alert("Profile saved successfully!");
    }
}

// Function to load the tutor's profile on page load
function loadProfile() {
    const profile = JSON.parse(localStorage.getItem("tutorProfile"));

    if (profile) {
        document.getElementById("name").value = profile.name || "";
        document.getElementById("subject").value = profile.subject || "";
        document.getElementById("bio").value = profile.bio || "";

        if (profile.profilePic) {
            document.querySelector(".profile-img").src = profile.profilePic;
        }
    }
}

// Function to save tutor availability
function saveAvailability(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const availableDate = document.getElementById("available-date").value;
    const startTime = document.getElementById("start-time").value;
    const endTime = document.getElementById("end-time").value;

    if (!availableDate || !startTime || !endTime) {
        alert("Please fill in all availability fields.");
        return;
    }

    // Validate that end time is after start time
    if (endTime <= startTime) {
        alert("End time must be after start time.");
        return;
    }

    // Create an availability slot object
    const availabilitySlot = {
        date: availableDate,
        startTime: startTime,
        endTime: endTime
    };

    // Retrieve existing availability from localStorage
    let availability = JSON.parse(localStorage.getItem("tutorAvailability")) || [];

    // Add the new availability slot
    availability.push(availabilitySlot);

    // Save updated availability back to localStorage
    localStorage.setItem("tutorAvailability", JSON.stringify(availability));

    // Update the availability display
    addAvailabilityToDOM(availabilitySlot);

    // Reset the availability form
    document.getElementById("availability-form").reset();

    alert("Availability set successfully!");
}

// Function to load and display all availability slots on page load
function loadAvailability() {
    const availability = JSON.parse(localStorage.getItem("tutorAvailability")) || [];

    // Clear existing availability display
    const availabilitySection = document.getElementById("availability");
    let availabilityList = document.createElement("div");
    availabilityList.id = "availability-list";

    if (availability.length === 0) {
        availabilityList.innerHTML = "<p>No availability set.</p>";
    } else {
        let listHTML = "<ul>";
        availability.forEach(slot => {
            listHTML += `<li>${formatDate(slot.date)}: ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}</li>`;
        });
        listHTML += "</ul>";
        availabilityList.innerHTML = listHTML;
    }

    // Remove existing list if any and append the new one
    const existingList = document.getElementById("availability-list");
    if (existingList) {
        existingList.remove();
    }
    availabilitySection.appendChild(availabilityList);
}

// Helper function to add a single availability slot to the DOM
function addAvailabilityToDOM(slot) {
    let availabilityList = document.getElementById("availability-list");

    if (!availabilityList) {
        availabilityList = document.createElement("div");
        availabilityList.id = "availability-list";
        const availabilitySection = document.getElementById("availability");
        availabilitySection.appendChild(availabilityList);
    }

    // If it's the first availability slot, create the list
    if (availabilityList.innerHTML === "" || availabilityList.innerHTML === "<p>No availability set.</p>") {
        availabilityList.innerHTML = "<ul></ul>";
    }

    const list = availabilityList.querySelector("ul");
    const listItem = document.createElement("li");
    listItem.textContent = `${formatDate(slot.date)}: ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;
    list.appendChild(listItem);
}

// Function to load upcoming sessions from localStorage and display them
function loadUpcomingSessions() {
    const sessions = JSON.parse(localStorage.getItem("tutorSessions")) || [];

    // Clear existing table body
    const tbody = document.querySelector("#upcoming-sessions tbody");
    tbody.innerHTML = "";

    if (sessions.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4'>No upcoming sessions.</td></tr>";
    } else {
        sessions.forEach(session => {
            const row = tbody.insertRow();
            row.insertCell(0).innerText = session.studentName;
            row.insertCell(1).innerText = formatDate(session.date);
            row.insertCell(2).innerText = formatTime(session.time);
            row.insertCell(3).innerText = session.subject;
        });
    }
}

// Example function to add a new upcoming session (can be triggered from another part of your app)
function addUpcomingSession(studentName, date, time, subject) {
    const session = {
        studentName: studentName,
        date: date,
        time: time,
        subject: subject
    };

    // Retrieve existing sessions from localStorage
    let sessions = JSON.parse(localStorage.getItem("tutorSessions")) || [];

    // Add the new session
    sessions.push(session);

    // Save updated sessions back to localStorage
    localStorage.setItem("tutorSessions", JSON.stringify(sessions));

    // Update the sessions table in the DOM
    const tbody = document.querySelector("#upcoming-sessions tbody");
    const row = tbody.insertRow();
    row.insertCell(0).innerText = session.studentName;
    row.insertCell(1).innerText = formatDate(session.date);
    row.insertCell(2).innerText = formatTime(session.time);
    row.insertCell(3).innerText = session.subject;
}

// Function to format date (YYYY-MM-DD to a more readable format)
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString(undefined, options);
}

// Function to format time (24-hour to 12-hour format with AM/PM)
function formatTime(timeStr) {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
