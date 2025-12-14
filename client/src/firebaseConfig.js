// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDakd4ZxZZkUtMbT7OK4epPeyhimzeUbKQ",
  authDomain: "group-study-63c7e.firebaseapp.com",
  projectId: "group-study-63c7e",
  storageBucket: "group-study-63c7e.firebasestorage.app",
  messagingSenderId: "382781408017",
  appId: "1:382781408017:web:26345ab40e88fb0c5802b0",
  measurementId: "G-TPNFSS7Q1E"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); 
const analytics = getAnalytics(app);