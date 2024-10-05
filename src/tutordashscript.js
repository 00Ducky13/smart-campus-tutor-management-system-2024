import { getCurrentUser } from "./api/user-api.js";
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

async function addAvailability(event){
    event.preventDefault();
    const availableDay = document.getElementById("available-date").value.trim();
    const availableStartTime = document.getElementById("start-time").value.trim();
    const availableEndTime = document.getElementById("end-time").value.trim();
    let tempObj = {
        day: availableDay,
        starttime: availableStartTime,
        endtime: availableEndTime
    }
    await getTutorFromID(currentUser).then(async (userData)=>{
        let availabilityArray = userData.availability;
        if (availabilityArray === undefined){
            availabilityArray = []
            
        }
        availabilityArray.push(tempObj);
        const tempObj2 = {
            availability: availabilityArray
        }
        await updateUserWithID(currentUser,tempObj2).then((res)=>{
            if (res != "error"){
                alert("Success")
            }
            else{
                alert("An error occured");
            }
        })
    })
}
// Attach the saveProfile function to the form submission
document.getElementById("profile-form").addEventListener("submit", saveProfile);
document.getElementById("availability-form").addEventListener("submit", addAvailability);