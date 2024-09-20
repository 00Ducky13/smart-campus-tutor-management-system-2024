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
            let tutors = JSON.parse(localStorage.getItem("tutors")) || [];
            tutors = tutors.filter(t => t.name !== profile.name); // Remove old profile if exists
            tutors.push(profile);
            localStorage.setItem("tutors", JSON.stringify(tutors));

            // Update profile picture in header
            document.querySelector(".profile-img").src = profile.profilePic;

            alert("Profile saved successfully!");
        };
        reader.readAsDataURL(profilePicFile);
    } else {
        // If no new picture is uploaded, retain existing picture
        const existingProfile = JSON.parse(localStorage.getItem("tutors")).find(t => t.name === profile.name);
        if (existingProfile && existingProfile.profilePic) {
            profile.profilePic = existingProfile.profilePic;
        }

        // Save profile to localStorage
        let tutors = JSON.parse(localStorage.getItem("tutors")) || [];
        tutors = tutors.filter(t => t.name !== profile.name); // Remove old profile if exists
        tutors.push(profile);
        localStorage.setItem("tutors", JSON.stringify(tutors));

        // Update profile picture in header
        if (profile.profilePic) {
            document.querySelector(".profile-img").src = profile.profilePic;
        }

        alert("Profile saved successfully!");
    }
}
