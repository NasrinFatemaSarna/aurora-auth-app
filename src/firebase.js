import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtyKXIOy4cwgzS1ZHv1QaYhHBmFtbEYrw",
  authDomain: "aurora-auth-54f92.firebaseapp.com",
  projectId: "aurora-auth-54f92",
  storageBucket: "aurora-auth-54f92.firebasestorage.app",
  messagingSenderId: "1023758901087",
  appId: "1:1023758901087:web:5c1418a963bcd55cf4a0ea",
  measurementId: "G-ZP8EG0TV4S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
