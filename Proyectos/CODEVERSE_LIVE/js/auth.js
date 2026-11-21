// CODEVERSE — Authentication & Admin Panel + AI Tunnel
// MultiSoftCreations

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  updateDoc,
  serverTimestamp,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import { auth, db } from "./firebase-config.js";

// Correos con privilegios de administrador (pueden generar códigos para IAs)
const ADMIN_EMAILS = [
  "ricardotorresgalvez005@gmail.com",
  "ricardotorresgalvez003@gmail.com",
  "multisoftcreations2025@gmail.com",
  "multisoftcreations.ricardo@gmail.com"
];

const googleProvider = new GoogleAuthProvider();

// ======================
// Helpers
// ======================

export function isAdmin(user) {
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}

export function getCurrentUser() {
  return auth.currentUser;
}

// ======================
// Auth actions
// ======================

export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(cred.user);
  return cred.user;
}

export async function registerWithEmail(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(cred.user);
  return cred.user;
}

export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  await ensureUserProfile(cred.user);
  return cred.user;
}

export async function logout() {
  await signOut(auth);
}

export function onUserChanged(callback) {
  return onAuthStateChanged(auth, callback);
}

async function ensureUserProfile(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      isAdmin: isAdmin(user),
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
  } else {
    await updateDoc(ref, {
      lastLogin: serverTimestamp(),
      isAdmin: isAdmin(user)
    });
  }
}

// ======================
// AI Access Codes
// El código de 8 dígitos ES el ID del documento → permite validación sin login
// ======================

/**
 * Genera un código de 8 dígitos único para una IA
 * Solo admins
 */
export async function generateAICode(label = "IA", hoursValid = 72) {
  const user = auth.currentUser;
  if (!user || !isAdmin(user)) {
    throw new Error("No tienes permisos de administrador");
  }

  // Generar código de 8 dígitos (será el ID del documento)
  let code;
  let exists = true;
  let attempts = 0;

  while (exists && attempts < 10) {
    code = String(Math.floor(10000000 + Math.random() * 90000000));
    const check = await getDoc(doc(db, "ai_access_codes", code));
    exists = check.exists();
    attempts++;
  }

  if (exists) throw new Error("No se pudo generar un código único. Intenta de nuevo.");

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + hoursValid);

  await setDoc(doc(db, "ai_access_codes", code), {
    code,
    label,
    createdBy: user.uid,
    createdByEmail: user.email,
    createdAt: serverTimestamp(),
    expiresAt: expiresAt,
    used: false,
    usedAt: null,
    usedBy: null
  });

  return { id: code, code, label, expiresAt };
}

/**
 * Lista los códigos (solo admin)
 */
export async function listAICodes(max = 20) {
  const user = auth.currentUser;
  if (!user || !isAdmin(user)) {
    throw new Error("No tienes permisos de administrador");
  }

  const q = query(
    collection(db, "ai_access_codes"),
    orderBy("createdAt", "desc"),
    limit(max)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Valida un código de IA (NO requiere estar logueado)
 * El código es el ID del documento
 */
export async function validateAICode(code) {
  if (!code || code.length !== 8 || !/^\d{8}$/.test(code)) {
    throw new Error("El código debe tener exactamente 8 dígitos");
  }

  const ref = doc(db, "ai_access_codes", code);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Código inválido");
  }

  const data = snap.data();

  if (data.used === true) {
    throw new Error("Este código ya fue utilizado");
  }

  // Verificar expiración
  let expiresAt = null;
  if (data.expiresAt) {
    expiresAt = data.expiresAt.toDate ? data.expiresAt.toDate() : new Date(data.expiresAt);
    if (expiresAt < new Date()) {
      throw new Error("El código ha expirado");
    }
  }

  // Marcar como usado
  await updateDoc(ref, {
    used: true,
    usedAt: serverTimestamp(),
    usedBy: "AI_TUNNEL"
  });

  // Guardar sesión de túnel (válida en esta pestaña del navegador)
  sessionStorage.setItem("ai_tunnel_access", JSON.stringify({
    code: code,
    label: data.label || "IA",
    grantedAt: Date.now(),
    expiresAt: expiresAt ? expiresAt.getTime() : null
  }));

  return { id: code, ...data };
}

/**
 * Verifica si hay sesión de túnel válida
 */
export function hasValidAITunnelSession() {
  try {
    const raw = sessionStorage.getItem("ai_tunnel_access");
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (data.expiresAt && data.expiresAt < Date.now()) {
      sessionStorage.removeItem("ai_tunnel_access");
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function clearAITunnelSession() {
  sessionStorage.removeItem("ai_tunnel_access");
}

export function getAITunnelInfo() {
  try {
    const raw = sessionStorage.getItem("ai_tunnel_access");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export { auth, db };
