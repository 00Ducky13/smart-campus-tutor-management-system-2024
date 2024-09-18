 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
 import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyDdG4b8bSCU_O9aFzV4DIY3MdOqDr3qWgs",
   authDomain: "tutoring-app-2e2a8.firebaseapp.com",
   databaseURL: "https://tutoring-app-2e2a8-default-rtdb.firebaseio.com/",
   projectId: "tutoring-app-2e2a8",
   storageBucket: "tutoring-app-2e2a8.appspot.com",
   messagingSenderId: "311046591355",
   appId: "1:311046591355:web:0d3ba804d13317c2fb63de"
 };
 



 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const authentication = getAuth(app);
const firestore = getFirestore(app);

export { authentication, firestore };