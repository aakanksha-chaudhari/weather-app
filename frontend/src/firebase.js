// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiWXPp3bvKj8fBLgmcluE-x4PwLgMUmAk",
  authDomain: "weatherapp-26dab.firebaseapp.com",
  projectId: "weatherapp-26dab",
  storageBucket: "weatherapp-26dab.firebasestorage.app",
  messagingSenderId: "785366764870",
  appId: "1:785366764870:web:af389fe263553911e4a947",
  measurementId: "G-KTSZ4SB1DW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
