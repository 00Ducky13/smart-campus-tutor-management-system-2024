import {
    setDoc,
    doc,
    getDoc,
    deleteDoc,
    addDoc
  } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import {authentication,firestore} from "../firebase/firebase.js";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

let currentUser = null;

async function registerUser(email, password, username, role){
    let inHouseErrorCode = 0
    if (email.indexOf("wits.ac.za") === -1){
        inHouseErrorCode = 6;
    }
    else{
    await createUserWithEmailAndPassword(authentication, email, password)
    .then(async (userCredential) => {
      // Signed up 
      const user = userCredential.user;
      // ...
      currentUser = user;
      sessionStorage.setItem("currentUser",user.uid)
      const userRef = await setDoc(doc(firestore, "test-users", user.uid), {
        role: role,
        username: username
      },{merge: true});
    })
    .catch((error) => {
        
        switch (error.code) {
            case 'auth/email-already-in-use':
              inHouseErrorCode = 1
              break;
            case 'auth/invalid-email':
              inHouseErrorCode = 2
              break;
            case 'auth/operation-not-allowed':
              inHouseErrorCode = 3
              break;
            case 'auth/weak-password':
              inHouseErrorCode = 4
              break;
            default:
              console.log(error.message);
              inHouseErrorCode = 5
              break;
          }

    });
}
    return inHouseErrorCode
}

async function signInUser(email, password, role){
    let inHouseErrorCode = 0
    await signInWithEmailAndPassword(authentication, email, password)
    .then(async (userCredential) => {
        const user = userCredential.user;
        currentUser = user;
        sessionStorage.setItem("currentUser",user.uid)
        const docRef = doc(firestore, "test-users", user.uid);
        await getDoc(docRef).then(docSnap => {
            if (docSnap.data().role !== role){
                inHouseErrorCode = 2
                signOut(authentication);
            }
        });      
    })
    .catch((error) => {
        
        inHouseErrorCode = 1

    });   
    return inHouseErrorCode
}

function getCurrentUser(){
  return currentUser;
}
export {registerUser,signInUser,getCurrentUser}
