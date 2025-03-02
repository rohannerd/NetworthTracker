import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkb4j_qS04IRQAKxSNjNgD2WKjLtlXgmk",
  authDomain: "networthtracker-32948.firebaseapp.com",
  projectId: "networthtracker-32948",
  storageBucket: "networthtracker-32948.firebasestorage.app",
  messagingSenderId: "92680772751",
  appId: "1:92680772751:web:58551b30ec518f0fee64fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;