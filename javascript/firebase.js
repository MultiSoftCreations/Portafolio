/**
 * Firebase — MultiSoftCreations Portafolio
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  arrayUnion,
  increment,
  limit,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAg5KEvbbo6MFBQ2Kd46ujlZ6SxTROMm94",
  authDomain: "multisoft-portafolio.firebaseapp.com",
  projectId: "multisoft-portafolio",
  storageBucket: "multisoft-portafolio.firebasestorage.app",
  messagingSenderId: "1046337084057",
  appId: "1:1046337084057:web:1e870db225b70837943608",
  measurementId: "G-DPM2NK6RCN",
};

/** Correos admin (panel + asignar rangos). Debe coincidir con reglas Firestore. */
export const ADMIN_EMAILS = [
  "ricardotorresgalvez005@gmail.com",
  "yocepliliamurguia@gmail.com",
];

/** Rangos del equipo: muestran logo verificado */
export const TEAM_RANGOS = ["creador", "co-creador", "colaborador"];

export const RANGOS = [
  { id: "creador", label: "Creador", className: "rank-creador", team: true },
  { id: "co-creador", label: "Co-creador/a", className: "rank-cocreador", team: true },
  { id: "colaborador", label: "Colaborador", className: "rank-colaborador", team: true },
  { id: "cliente-frecuente", label: "Cliente frecuente", className: "rank-cliente-frecuente", team: false },
  { id: "cliente", label: "Cliente", className: "rank-cliente", team: false },
  { id: "usuario", label: "Usuario", className: "rank-usuario", team: false },
];

export function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.map((x) => x.toLowerCase().trim()).includes(String(email).toLowerCase().trim());
}

export function isTeamRango(rango) {
  return TEAM_RANGOS.includes(rango);
}

export function rangoLabel(id) {
  return RANGOS.find((r) => r.id === id)?.label || "Usuario";
}

export function rangoClass(id) {
  return RANGOS.find((r) => r.id === id)?.className || "rank-usuario";
}

/** Username: 3–20 chars, letras números _ - */
export function normalizeUsername(raw) {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");
}

export function validUsername(u) {
  return /^[a-z0-9_-]{3,20}$/.test(u);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
  app,
  db,
  auth,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  arrayUnion,
  increment,
  limit,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
};
