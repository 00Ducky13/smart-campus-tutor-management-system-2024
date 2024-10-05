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

    if (!name || subjects.length === 0 || !bio) {
        alert("Please fill in all required fields.");
        return;
    }

    // Create a profile object
    const profile = {
        name: name,
        subjects: subjects, // Save the array of subjects
        bio: bio,
        profilePic: "" // To be updated if there's a profile picture
    };

    try {
        // Handle profile picture if uploaded
        if (profilePicFile) {
            const storageRef = storage.ref(`profile-pictures/${name}`);
            const snapshot = await storageRef.put(profilePicFile);
            profile.profilePic = await snapshot.ref.getDownloadURL(); // Get the URL of the uploaded image
        } else {
            // If no new picture is uploaded, retain existing picture from Firestore
            const existingDoc = await db.collection('tutors').doc(name).get();
            if (existingDoc.exists) {
                profile.profilePic = existingDoc.data().profilePic || "";
            }
        }

        // Save profile to Firestore
        await db.collection('tutors').doc(name).set(profile);

        // Update profile picture in the header
        if (profile.profilePic) {
            document.querySelector(".profile-img").src = profile.profilePic;
        }

        alert("Profile saved successfully!");

    } catch (error) {
        console.error("Error saving profile: ", error);
        alert("Failed to save profile.");
    }
}

// Attach the saveProfile function to the form submission
document.getElementById("profile-form").addEventListener("submit", saveProfile);
