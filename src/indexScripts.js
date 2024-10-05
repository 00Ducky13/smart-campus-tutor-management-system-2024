//import { AuthenticationService } from "./authenticationService.mjs";
//import { UserRepository } from "./userRepository.mjs";
//import { firestore, authentication } from "./firebase.mjs";
import { registerUser,signInUser } from "./user-api.js";


async function onSignUp(e) {
  e.preventDefault();

  const formData = new FormData(e.target);

  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");
  const role = formData.get("role");

  await registerUser(email,password,username,role).then(res =>{
    if (res == 0){
      console.log("success");
      if (role === "tutor"){
        window.location.href = "tutordashboard.html";
    }
    else{
        window.location.href = "studentdashboard.html";
    }
  }
  else{
    if (res == 1){
      alert("Email already in use. Sign In instead?");
    }
    else if (res == 6){
      alert("Please use your Wits email.");
    }
  }
  });
}
  

async function onSignIn(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
    
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");
  await signInUser(email,password,role).then(res =>{
    if (res == 0){
      console.log("success");
      if (role === "tutor"){
        window.location.href = "tutordashboard.html";
    }
    else{
        window.location.href = "studentdashboard.html";
    } 
    }
    else{
      if (res == 1){
        alert("An error occured during sign in");
      }
      if (res == 2){
        alert("User does not exist.")
      }
    }
  });

}

document.addEventListener('DOMContentLoaded', function () {
    console.log("Content Loaded");
  const signUpLink = document.getElementById("sign-up");
  const loginLink = document.getElementById("login");
  const loginForm = document.getElementById("login-form");
  const signUpForm = document.getElementById("signup-form");

  if (signUpLink && loginLink && loginForm && signUpForm) {
    console.log("Links made");
    signUpLink.addEventListener("click", (event) => {
      event.preventDefault();
      loginForm.style.display = "none";
      signUpForm.style.display = "block";
    });

    loginLink.addEventListener("click", (event) => {
      event.preventDefault();
      loginForm.style.display = "block";
      signUpForm.style.display = "none";
    });

    signUpForm.addEventListener("submit", (e) => {onSignUp(e)});
    loginForm.addEventListener("submit", (e) => {
        console.log("In Sign In");
        onSignIn(e);});
  } else {
    console.error("One or more elements are missing.");
  }
});

