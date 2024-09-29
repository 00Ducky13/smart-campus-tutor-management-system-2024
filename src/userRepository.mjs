import {
  setDoc,
  doc,
  getDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

export class UserRepository {
  constructor({ database }) {
    this.database = database;
  }

  //add a new user to the user collection
  async createUser({ user }) {
    try {
      await setDoc(doc(this.database, "user", user.id), user, { merge: true });
      return "success";
    } catch (error) {
      return error;
    }
  }

  //update a user
  async updateUser({ user }) {
    try {
      await setDoc(doc(this.database, "user", user.id), user, { merge: true });
      return "success";
    } catch (error) {
      return "An error occured";
    }
  }

  //get user by id
  //if user is found return a json object of user data
  async getuserById({ id }) {
    try {
      const docSnap = await getDoc(doc(this.database, "user", id));
      if (docSnap.exists()) return docSnap.data();
      else return "User not found";
    } catch (error) {
      return "An error occured";
    }
  }

  async deleteuser({ id }) {
    try {
      await deleteDoc(doc(this.database, "user", id));
      return "success";
    } catch (error) {
      return "An error occured";
    }
  }
}
