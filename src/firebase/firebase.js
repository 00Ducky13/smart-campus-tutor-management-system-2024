// with Commonjs syntax (if using Node)
//const firebase = require("firebase/app");
//require("firebase/firestore");

// with ES Modules (if using client-side JS, like React)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAWh-Qb5yO6knnHTScmjISsUMt-ofs1RdM",
    authDomain: "witstutoring-3d624.firebaseapp.com",
    projectId: "witstutoring-3d624",
    storageBucket: "witstutoring-3d624.appspot.com",
    messagingSenderId: "261185278289",
    appId: "1:261185278289:web:29e063158454a0c3a60370"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
 const authentication = getAuth(app);
const firestore = getFirestore(app);

export { authentication, firestore, app };