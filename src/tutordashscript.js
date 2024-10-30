import { getCurrentUser } from "./user-api.js";
import {getTutorFromID,updateUserWithID} from "./tutorapi.js"
import {authentication,firestore} from "./firebase/firebase.js";
import {
    setDoc,
    doc,
    getDoc,
    deleteDoc,
    addDoc,
    updateDoc
  } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";


const currentUser = sessionStorage.getItem("currentUser");
async function populateFields(){
    if (currentUser) {
        const uid = currentUser;
        await getTutorFromID(uid).then((userData)=>{
          console.log(userData)

        if (userData != null){
          document.getElementById("tutorDashHeader").innerText = "Welcome, " + userData.username;
          document.getElementById("name").value = userData.fullname;
          if (userData.profilePic == undefined){
            document.getElementById("tutorProfilePic").src = "images/userIcon.png"; 
          }
          else{
            document.getElementById("tutorProfilePic").src = userData.profilePic;  
          }
          document.getElementById("bio").value = userData.bio;
            const subjectList = document.getElementById('subjects');
          for (let i=0;i<userData.subjects.length;i++){
            const li = document.createElement('li');
            li.textContent = userData.subjects[i];
            subjectList.appendChild(li);  
          }
          const courseList = document.getElementById('courses');
          for (let i=0;i<userData.courses.length;i++){
            const li = document.createElement('li');
            li.textContent = userData.courses[i];
            courseList.appendChild(li);  
          }

        }  
        }); 
      }
         else {
            document.getElementById("tutorDashHeader").innerText = "Welcome, Tutor";
      }
}
document.addEventListener('DOMContentLoaded', async function () {
    console.log(currentUser);
    document.getElementById("tutorDashHeader").innerHTML = "Welcome, Tutor";
    populateFields();
    const userData = await getTutorFromID(currentUser);
    if (userData && userData.availabilitySchedule) {
        displayCurrentAvailability(userData.availabilitySchedule);
    }   
});

document.getElementById('add-subject').addEventListener('click', function() {
    const subjectInput = document.getElementById('subject-input');
    const subjectList = document.getElementById('subjects');

    if (subjectInput.value.trim()) {
        const li = document.createElement('li');
        li.textContent = subjectInput.value;
        subjectList.appendChild(li);
        subjectInput.value = '';
    }
});

document.getElementById('add-course').addEventListener('click', function() {
    const subjectInput = document.getElementById('course-input');
    const subjectList = document.getElementById('courses');

    if (subjectInput.value.trim()) {
        const li = document.createElement('li');
        li.textContent = subjectInput.value;
        subjectList.appendChild(li);
        subjectInput.value = '';
    }
});

// Function to save the tutor's profile
async function saveProfile(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const name = document.getElementById("name").value.trim();
    const bio = document.getElementById("bio").value.trim();
    const profilePicInput = document.getElementById("profile-pic");
    const profilePicFile = profilePicInput.files[0];

    // Gather all subjects from the list
    const subjectListItems = document.querySelectorAll('#subjects li');
    const subjects = Array.from(subjectListItems).map(li => li.textContent.trim());

    const courseListItems = document.querySelectorAll('#courses li');
    const course = Array.from(courseListItems).map(li => li.textContent.trim());

    if (!name || subjects.length === 0 || !bio|| courses.length === 0) {
        alert("Please fill in all required fields.");
        return;
    }

    // Create a profile object
    const profile = {
        fullname: name,
        subjects: subjects,
        courses: course, // Save the array of subjects
        bio: bio,
        profilePic: "images/userIcon.png" // To be updated if there's a profile picture
    };
        // Handle profile picture if uploaded
       /* if (profilePicFile) {
            const storageRef = storage.ref(`profile-pictures/${name}`);
            const snapshot = await storageRef.put(profilePicFile);
            profile.profilePic = await snapshot.ref.getDownloadURL(); // Get the URL of the uploaded image
        } else {
            // If no new picture is uploaded, retain existing picture from Firestore
            const existingDoc = await firestore.collection('test-users').doc(currentUser).get();
            if (existingDoc.exists) {
                profile.profilePic = existingDoc.data().profilePic || "";
            }
        }*/

        // Save profile to Firestore
        await updateUserWithID(currentUser,profile).then((res)=>{
            if (res != "error"){
                alert("Success")
                populateFields();
            }
            else{
                alert("An error occured");
            }
        })

        // Update profile picture in the header
        if (profile.profilePic) {
            document.querySelector(".profile-img").src = profile.profilePic;
        }


    } 

    async function addAvailability(event) {
        event.preventDefault();
        const availableDay = document.getElementById("available-date").value.trim();
        const availableStartTime = document.getElementById("start-time").value.trim();
        const availableEndTime = document.getElementById("end-time").value.trim();
    
        // Validate input
        if (!availableDay || !availableStartTime || !availableEndTime) {
            alert("Please fill in all availability fields");
            return;
        }
    
        await getTutorFromID(currentUser).then(async (userData) => {
            let availabilityArray = userData.availabilitySchedule || {};
            
            // If this day doesn't exist in the schedule yet, create it
            if (!availabilityArray[availableDay]) {
                availabilityArray[availableDay] = [];
            }
    
            // Check for time slot overlap
            const timeOverlap = availabilityArray[availableDay].some(slot => {
                return (availableStartTime >= slot.starttime && availableStartTime < slot.endtime) ||
                       (availableEndTime > slot.starttime && availableEndTime <= slot.endtime);
            });
    
            if (timeOverlap) {
                alert("This time slot overlaps with an existing availability. Please choose different hours.");
                return;
            }
    
            // Add new time slot
            availabilityArray[availableDay].push({
                starttime: availableStartTime,
                endtime: availableEndTime
            });
    
            // Sort time slots for this day
            availabilityArray[availableDay].sort((a, b) => 
                a.starttime.localeCompare(b.starttime)
            );
    
            const tempObj = {
                availabilitySchedule: availabilityArray
            };
    
            await updateUserWithID(currentUser, tempObj).then((res) => {
                if (res != "error") {
                    alert("Availability added successfully");
                    displayCurrentAvailability(availabilityArray);
                    // Clear the form
                    document.getElementById("available-date").value = "";
                    document.getElementById("start-time").value = "";
                    document.getElementById("end-time").value = "";
                } else {
                    alert("An error occurred while saving availability");
                }
            });
        });
    }
    
    // Function to display current availability
    function displayCurrentAvailability(availabilitySchedule) {
        const availabilityContainer = document.getElementById("current-availability");
        if (!availabilityContainer) {
            // Create container if it doesn't exist
            const container = document.createElement('div');
            container.id = 'current-availability';
            container.className = 'mt-4';
            document.getElementById('availability').appendChild(container);
        }
    
        let availabilityHTML = '<h3>Current Availability Schedule</h3>';
        
        if (Object.keys(availabilitySchedule).length === 0) {
            availabilityHTML += '<p>No availability set yet</p>';
        } else {
            availabilityHTML += '<div class="availability-grid">';
            
            // Sort days
            const sortedDays = Object.keys(availabilitySchedule).sort();
            
            sortedDays.forEach(day => {
                availabilityHTML += `
                    <div class="day-schedule">
                        <h4>${new Date(day).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                        <ul>
                `;
                
                availabilitySchedule[day].forEach((slot, index) => {
                    availabilityHTML += `
                        <li>
                            ${slot.starttime} - ${slot.endtime}
                            <button onclick="removeTimeSlot('${day}', ${index})" class="delete-slot">×</button>
                        </li>
                    `;
                });
                
                availabilityHTML += `
                        </ul>
                    </div>
                `;
            });
            
            availabilityHTML += '</div>';
        }
    
        document.getElementById("current-availability").innerHTML = availabilityHTML;
    }
    
    // Function to remove a time slot
    async function removeTimeSlot(day, slotIndex) {
        const confirmed = confirm("Are you sure you want to remove this time slot?");
        if (!confirmed) return;
    
        await getTutorFromID(currentUser).then(async (userData) => {
            let availabilitySchedule = userData.availabilitySchedule || {};
            
            if (availabilitySchedule[day]) {
                availabilitySchedule[day].splice(slotIndex, 1);
                
                // Remove the day if no more slots
                if (availabilitySchedule[day].length === 0) {
                    delete availabilitySchedule[day];
                }
    
                const tempObj = {
                    availabilitySchedule: availabilitySchedule
                };
    
                await updateUserWithID(currentUser, tempObj).then((res) => {
                    if (res != "error") {
                        displayCurrentAvailability(availabilitySchedule);
                    } else {
                        alert("Error removing time slot");
                    }
                });
            }
        });
    }


// Attach the saveProfile function to the form submission
document.getElementById("profile-form").addEventListener("submit", saveProfile);
document.getElementById("availability-form").addEventListener("submit", addAvailability);
