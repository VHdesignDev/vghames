// Firebase config - MUDE ESSES VALORES COM OS DADOS DO SEU PROJETO
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Backend URL
export const BACKEND_URL = import.meta.env.DEV 
  ? 'http://localhost:3001'
  : 'https://seu-backend.onrender.com';
