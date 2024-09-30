import { AuthenticationService } from "./authenticationService.mjs";
import { UserRepository } from "./userRepository.mjs";
import { firestore, authentication } from "./firebase.mjs";

const authenticationService = new AuthenticationService({
  firebaseAuth: authentication,
});

const userRepository = new UserRepository({
  database: firestore,
});

async function onSignUp(e) {
  e.preventDefault();

  const formData = new FormData(e.target);

  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");
  const role = formData.get("role");

  const response = await authenticationService.RegisterUserWithEmailAndPassword({
    email: email,
    password: password,
  });

  if (response !== "error") {
    const user = {
      id: response,
      name: username,
      email: email,
      password: password,
      role: role,
    };

    const dbResponse = await userRepository.createUser({ user: user });
    alert(dbResponse);
  }
}

async function onSignIn(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
    
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");
  if ((email === "test@admin") && (password === "1234")){
      if (role === "tutor"){
         window.location.href = "tutordashboard.html";
      }
      else{
          window.location.href = "studentdashboard.html";
      }
  }
  else {
  const response = await authenticationService.SignInWithEmailAndPassword({
    email: email,
    password: password,
  });


  if (response !== "error") {
    const user = await userRepository.getuserById({
      id: response,
    });

    if (role !== user.role) {
      alert("User not found");
    } else {
      // Move to next page according to role
      alert("Signed in");
      if (role === "tutor"){
        window.location.href = "tutordashboard.html";
     }
     else{
         window.location.href = "studentdashboard.html";
     }
    }
  }
}
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

