import {authentication,firestore} from "../firebase/firebase.js";
import {
    setDoc,
    doc,
    getDoc,
    getDocs,
    addDoc,
    deleteDoc,
    collection
  } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";


async function getAllTestResources(){
    const testResCol = collection(firestore, 'test-resources');
  const testResSnapshot = await getDocs(testResCol);
  //const testResList = testResSnapshot.docs.map(doc => doc.data());
  let tempResList = [];
  testResSnapshot.docs.forEach((doc) => {
    //console.log("In forEach");
    let tempResObj = doc.data();
    tempResList.push(tempResObj);
  });
  return tempResList;
}

async function uploadTestResource(resourceObj){
    let response = await addDoc(collection(firestore,'test-resources'),resourceObj);
    return response;
}

export {getAllTestResources,uploadTestResource}