// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBNfhSkNPYmog0D4uXDVQfEOOrNbC9IKNI",
  authDomain: "vghames-275fb.firebaseapp.com",
  projectId: "vghames-275fb",
  storageBucket: "vghames-275fb.firebasestorage.app",
  messagingSenderId: "656462521354",
  appId: "1:656462521354:web:6c383acd6e5868a78eabf3"
};

// Backend URL - usa variável de ambiente ou fallback padrão
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (
  import.meta.env.DEV 
    ? 'http://localhost:3001'
    : 'https://vghames.onrender.com'
);
