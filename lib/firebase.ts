// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtef_MzpJL4vo4Qp-Q9DzsOJ6KY528xRo",
  authDomain: "alexandra-rizou.firebaseapp.com",
  projectId: "alexandra-rizou",
  storageBucket: "alexandra-rizou.firebasestorage.app",
  messagingSenderId: "376493505342",
  appId: "1:376493505342:web:20a5ae7537a42269e14a6f",
  measurementId: "G-XZFZQLMST6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics only in browser
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;

