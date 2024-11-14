import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRZL7itD7OpWoxjR67CByZUj59VQwf8Pg",
  authDomain: "fir-bloggingapp-45a37.firebaseapp.com",
  projectId: "fir-bloggingapp-45a37",
  storageBucket: "fir-bloggingapp-45a37.firebasestorage.app",
  messagingSenderId: "148343097404",
  appId: "1:148343097404:web:aeed01f623b64e56635b39"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
