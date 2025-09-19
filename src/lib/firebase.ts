// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "studio-3607344020-df78a",
  "appId": "1:36825555311:web:82a6795f465bc1c6e4089a",
  "apiKey": "AIzaSyB6dPfUkwEXadOv5R55qoEq9MAvYgKYOWk",
  "authDomain": "studio-3607344020-df78a.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "36825555311"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
