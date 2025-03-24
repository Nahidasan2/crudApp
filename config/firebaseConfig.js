// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { get } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUexZZ2UF2Ic-xCZgX5-NP_nelutaymUw",
  authDomain: "android-789fa.firebaseapp.com",
  projectId: "android-789fa",
  storageBucket: "android-789fa.firebasestorage.app",
  messagingSenderId: "86240075187",
  appId: "1:86240075187:web:b3e1073091f32628af3fc6",
  measurementId: "G-1955W1Z5YK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };