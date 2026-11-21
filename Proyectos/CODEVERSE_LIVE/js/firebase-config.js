// CODEVERSE — Firebase Configuration
// MultiSoftCreations

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4Av1hN2j5B9HWGbnElz2Ql6XF2YPDtE0",
  authDomain: "codeverse-d2ee0.firebaseapp.com",
  projectId: "codeverse-d2ee0",
  storageBucket: "codeverse-d2ee0.firebasestorage.app",
  messagingSenderId: "108805963130",
  appId: "1:108805963130:web:9375332021a19a47c96ac3",
  measurementId: "G-17SPRVEB0Z"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios que vamos a usar
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
