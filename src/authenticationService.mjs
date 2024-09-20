import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

export class AuthenticationService {
  constructor({ firebaseAuth }) {
    this.firebaseAuth = firebaseAuth;
  }

  RegisterUserWithEmailAndPassword = async ({ email, password }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password
      );
      return userCredential.user.uid;
    } catch (error) {
      const errorMessage = error.message.split("/")[1].replace(")", "");

      alert(errorMessage);
      return "error";
    }
  };

  SignInWithEmailAndPassword = async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password
      );

      return userCredential.user.uid;
    } catch (error) {
      const errorMessage = error.message.split("/")[1].replace(")", "");

      alert(errorMessage);
      return "error";
    }
  };
}
