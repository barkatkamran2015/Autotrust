import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Hardcoded Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH5FUrUT4ISSp5EfLCLnkRwyhUP2SlSOc",
  authDomain: "auto-sell-6c1b7.firebaseapp.com",
  projectId: "auto-sell-6c1b7",
  storageBucket: "auto-sell-6c1b7.appspot.com",
  messagingSenderId: "452521354217",
  appId: "1:452521354217:web:072bff74d2eb1428296178",
  measurementId: "G-6YGLTDEPMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };