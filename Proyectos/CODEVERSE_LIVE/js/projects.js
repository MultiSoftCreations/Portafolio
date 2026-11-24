// CODEVERSE — Cloud Projects & Folders (Firestore)
// MultiSoftCreations

import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import { auth, db } from "./firebase-config.js";

function requireUser() {
  const user = auth.currentUser;
  if (!user) throw new Error("Debes iniciar sesión para usar el guardado en la nube");
  return user;
}

function projectsCol(uid) {
  return collection(db, "users", uid, "projects");
}

function foldersCol(uid) {
  return collection(db, "users", uid, "folders");
}

// ======================
// FOLDERS
// ======================

export async function createFolder(name) {
  const user = requireUser();
  const ref = await addDoc(foldersCol(user.uid), {
    name: (name || "Nueva carpeta").trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return { id: ref.id, name: (name || "Nueva carpeta").trim() };
}

export async function listFolders() {
  const user = requireUser();
  const q = query(foldersCol(user.uid), orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function renameFolder(folderId, name) {
  const user = requireUser();
  await updateDoc(doc(db, "users", user.uid, "folders", folderId), {
    name: name.trim(),
    updatedAt: serverTimestamp()
  });
}

export async function deleteFolder(folderId) {
  const user = requireUser();
  // Opcional: mover proyectos de la carpeta a "sin carpeta"
  const projects = await listProjects(folderId);
  for (const p of projects) {
    await updateDoc(doc(db, "users", user.uid, "projects", p.id), {
      folderId: null,
      updatedAt: serverTimestamp()
    });
  }
  await deleteDoc(doc(db, "users", user.uid, "folders", folderId));
}

// ======================
// PROJECTS
// ======================

/**
 * Crea un proyecto nuevo en la nube
 * @param {object} data
 * @param {string} data.name
 * @param {string|null} data.folderId
 * @param {object} data.files  { html, css, js, python }
 * @param {string} data.activeTab
 */
export async function createProject({ name = "Sin título", folderId = null, files = {}, activeTab = "html", languages = null } = {}) {
  const user = requireUser();
  const payload = {
    name: name.trim() || "Sin título",
    folderId: folderId || null,
    files: {
      html: files.html || "",
      css: files.css || "",
      js: files.js || "",
      python: files.python || ""
    },
    activeTab: activeTab || "html",
    languages: Array.isArray(languages) ? languages : [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const ref = await addDoc(projectsCol(user.uid), payload);
  return { id: ref.id, ...payload };
}

/**
 * Actualiza un proyecto existente
 */
export async function updateProject(projectId, { name, folderId, files, activeTab, languages } = {}) {
  const user = requireUser();
  const data = { updatedAt: serverTimestamp() };
  if (name !== undefined) data.name = name.trim() || "Sin título";
  if (folderId !== undefined) data.folderId = folderId || null;
  if (activeTab !== undefined) data.activeTab = activeTab;
  if (languages !== undefined) data.languages = Array.isArray(languages) ? languages : [];
  if (files !== undefined) {
    data.files = {
      html: files.html || "",
      css: files.css || "",
      js: files.js || "",
      python: files.python || ""
    };
  }
  await updateDoc(doc(db, "users", user.uid, "projects", projectId), data);
  return { id: projectId, ...data };
}

/**
 * Guarda (crea o actualiza). Si hay projectId actualiza, si no crea.
 */
export async function saveProjectToCloud(projectId, payload) {
  if (projectId) {
    await updateProject(projectId, payload);
    return projectId;
  }
  const created = await createProject(payload);
  return created.id;
}

export async function getProject(projectId) {
  const user = requireUser();
  const snap = await getDoc(doc(db, "users", user.uid, "projects", projectId));
  if (!snap.exists()) throw new Error("Proyecto no encontrado");
  return { id: snap.id, ...snap.data() };
}

/**
 * Lista proyectos. Si folderId es null lista todos.
 * Si folderId es string, solo esa carpeta.
 * Si folderId es "__none__", solo los que no tienen carpeta.
 */
export async function listProjects(folderId) {
  const user = requireUser();
  let q;
  if (folderId === undefined || folderId === null) {
    q = query(projectsCol(user.uid), orderBy("updatedAt", "desc"));
  } else if (folderId === "__none__") {
    q = query(projectsCol(user.uid), where("folderId", "==", null), orderBy("updatedAt", "desc"));
  } else {
    q = query(projectsCol(user.uid), where("folderId", "==", folderId), orderBy("updatedAt", "desc"));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteProject(projectId) {
  const user = requireUser();
  await deleteDoc(doc(db, "users", user.uid, "projects", projectId));
}

/**
 * Progreso de cursos (para más adelante)
 * users/{uid}/progress/{courseId}
 */
export async function saveCourseProgress(courseId, data) {
  const user = requireUser();
  await setDoc(
    doc(db, "users", user.uid, "progress", courseId),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function getCourseProgress(courseId) {
  const user = requireUser();
  const snap = await getDoc(doc(db, "users", user.uid, "progress", courseId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
