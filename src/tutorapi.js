
import {authentication,firestore} from "./firebase/firebase.js";
import {
    setDoc,
    doc,
    getDoc,
    updateDoc,
    getDocs,
    addDoc,
    deleteDoc,
    collection,
    query,
    where
  } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

  

async function getAllTutors(){
    var tutorList = []
    const q = query(collection(firestore, "test-users"), where("role", "==", "tutor"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    let tempResObj = doc.data();
    tutorList.push(tempResObj);
    });
    return tutorList
}
async function getTutorFromID(userID){
    var tempObj = null;
    const docRef = doc(firestore, "test-users", userID);
        await getDoc(docRef).then(docSnap => {
            
            tempObj = docSnap.data();
            console.log(tempObj);
          })
        return tempObj;
        }

        async function updateUserWithID(userID,profileObj){
            var returnMes = "error"
            const docRef = doc(firestore, "test-users", userID);
                await updateDoc(docRef, profileObj).then((res)=>{
                        returnMes = "success"
                
                });
                return returnMes
                }
export {getTutorFromID,updateUserWithID,getAllTutors}