import {authentication,firestore} from "../firebase/firebase.js";
import {
    setDoc,
    doc,
    getDoc,
    getDocs,
    deleteDoc,
    collection
  } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";


async function getAllTestResources(){
    const testResCol = collection(firestore, 'test-resources');
  const testResSnapshot = await getDocs(testResCol);
  //const testResList = testResSnapshot.docs.map(doc => doc.data());
  let tempResList = [];
  testResSnapshot.docs.forEach((doc) => {
    let tempResObj = {};
    tempResList.push(doc.data());
  });
  return tempResList;
}

export {getAllTestResources}