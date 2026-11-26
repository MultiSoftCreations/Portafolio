// CODEVERSE — Panel de administración
// MultiSoftCreations

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
  serverTimestamp,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { db } from "./firebase-config.js";
import {
  onUserChanged,
  isAdmin,
  logout,
  generateAICode,
  listAICodes,
  getCurrentUser
} from "./auth.js";
import { defaultSiteAccess, clearSiteAccessCache } from "./site-access.js";

function $(id) {
  return document.getElementById(id);
}

function setStatus(msg, ok) {
  const el = $("admin-status");
  if (!el) return;
  el.textContent = msg || "";
  el.className = "admin-status" + (ok === true ? " is-ok" : ok === false ? " is-bad" : "");
}

function accordionBind() {
  document.querySelectorAll("[data-acc-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-acc-btn");
      const panel = document.querySelector(`[data-acc-panel="${id}"]`);
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      if (panel) panel.hidden = open;
    });
  });
}

async function loadAccessForm() {
  const snap = await getDoc(doc(db, "config", "siteAccess"));
  const data = snap.exists() ? { ...defaultSiteAccess(), ...snap.data() } : defaultSiteAccess();
  $("f-globalLock").checked = !!data.globalLock;
  $("f-globalMessage").value = data.globalMessage || "";
  $("f-lockCourses").checked = !!data.lockCourses;
  $("f-lockCoursesMessage").value = data.lockCoursesMessage || "";
  $("f-lockedCourseIds").value = (data.lockedCourseIds || []).join(", ");
  $("f-lockedLessons").value = JSON.stringify(data.lockedLessons || {}, null, 0);
  $("f-lockMiniEditor").checked = !!data.lockMiniEditor;
  $("f-lockLiveEditor").checked = !!data.lockLiveEditor;
  $("f-editorsMessage").value = data.editorsMessage || "";
  $("access-meta").textContent = data.updatedBy
    ? `Último cambio: ${data.updatedBy}${data.updatedAt?.toDate ? " · " + data.updatedAt.toDate().toLocaleString() : ""}`
    : "Aún no hay configuración guardada (se usarán valores por defecto).";
}

async function saveAccessForm() {
  const user = getCurrentUser();
  if (!user || !isAdmin(user)) throw new Error("No admin");

  let lockedLessons = {};
  const rawLessons = $("f-lockedLessons").value.trim();
  if (rawLessons) {
    try {
      lockedLessons = JSON.parse(rawLessons);
      if (typeof lockedLessons !== "object" || Array.isArray(lockedLessons)) throw new Error("formato");
    } catch {
      throw new Error("Lecciones bloqueadas: usa JSON válido, ej. {\"html\":[\"01-que-es-html\"]}");
    }
  }

  const lockedCourseIds = ($("f-lockedCourseIds").value || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const payload = {
    globalLock: !!$("f-globalLock").checked,
    globalMessage: $("f-globalMessage").value.trim(),
    lockCourses: !!$("f-lockCourses").checked,
    lockCoursesMessage: $("f-lockCoursesMessage").value.trim(),
    lockedCourseIds,
    lockedLessons,
    lockMiniEditor: !!$("f-lockMiniEditor").checked,
    lockLiveEditor: !!$("f-lockLiveEditor").checked,
    editorsMessage: $("f-editorsMessage").value.trim(),
    updatedAt: serverTimestamp(),
    updatedBy: user.email || user.uid
  };

  await setDoc(doc(db, "config", "siteAccess"), payload, { merge: true });
  clearSiteAccessCache();
  await loadAccessForm();
}

async function refreshCodes() {
  const list = $("ai-codes-list");
  list.innerHTML = "<p class='muted'>Cargando…</p>";
  try {
    const codes = await listAICodes(30);
    if (!codes.length) {
      list.innerHTML = "<p class='muted'>No hay códigos todavía.</p>";
      return;
    }
    list.innerHTML = codes
      .map((c) => {
        const exp = c.expiresAt?.toDate ? c.expiresAt.toDate().toLocaleString() : "—";
        const used = c.used ? "Usado" : "Disponible";
        return `<div class="admin-row">
          <div>
            <strong class="mono">${c.code || c.id}</strong>
            <span class="muted"> · ${c.label || "IA"} · ${used}</span>
            <div class="muted small">Expira: ${exp}</div>
          </div>
          <button type="button" class="btn btn--sm btn--ghost" data-del-code="${c.id}">Eliminar</button>
        </div>`;
      })
      .join("");
  } catch (err) {
    list.innerHTML = `<p class="is-bad">${err.message}</p>`;
  }
}

async function createCode() {
  const label = $("ai-label").value.trim() || "IA";
  const hours = Number($("ai-hours").value) || 72;
  const result = await generateAICode(label, hours);
  $("ai-last-code").textContent = `Código creado: ${result.code}`;
  await refreshCodes();
}

async function findUser() {
  const email = ($("user-email").value || "").trim().toLowerCase();
  if (!email) throw new Error("Escribe un correo");
  const q = query(collection(db, "users"), where("email", "==", email), limit(5));
  const snap = await getDocs(q);
  const box = $("user-result");
  if (snap.empty) {
    box.innerHTML = "<p class='muted'>No se encontró usuario con ese correo (debe haber iniciado sesión al menos una vez).</p>";
    return;
  }
  box.innerHTML = snap.docs
    .map((d) => {
      const u = d.data();
      return `<div class="admin-row" data-uid="${d.id}">
        <div>
          <strong>${u.email || d.id}</strong>
          <div class="muted small">uid: ${d.id}</div>
          <div class="muted small">Estado: <span class="mono">${u.status || "active"}</span></div>
          <div class="muted small">Motivo: ${u.blockReason || "—"}</div>
        </div>
        <div class="admin-row__actions">
          <button type="button" class="btn btn--sm btn--ghost" data-user-status="active" data-uid="${d.id}">Activar</button>
          <button type="button" class="btn btn--sm btn--ghost" data-user-status="suspended" data-uid="${d.id}">Suspender</button>
          <button type="button" class="btn btn--sm btn--ghost" data-user-status="banned" data-uid="${d.id}">Bloquear</button>
        </div>
      </div>`;
    })
    .join("");
}

async function setUserStatus(uid, status) {
  const reason = ($("user-reason").value || "").trim();
  await updateDoc(doc(db, "users", uid), {
    status,
    blockReason: reason || null,
    statusUpdatedAt: serverTimestamp(),
    statusUpdatedBy: getCurrentUser()?.email || null
  });
  setStatus(`Usuario ${uid.slice(0, 6)}… → ${status}`, true);
  await findUser();
}

function showApp(user) {
  $("admin-gate").hidden = true;
  $("admin-app").hidden = false;
  $("admin-user").textContent = user.email || user.uid;
  loadAccessForm().catch((e) => setStatus(e.message, false));
  refreshCodes().catch(() => {});
}

function showGate(msg) {
  $("admin-gate").hidden = false;
  $("admin-app").hidden = true;
  $("admin-gate-msg").textContent = msg || "Solo administradores.";
}

function bind() {
  accordionBind();

  $("btn-save-access")?.addEventListener("click", async () => {
    try {
      setStatus("Guardando…");
      await saveAccessForm();
      setStatus("Configuración de acceso guardada en la nube.", true);
    } catch (err) {
      setStatus(err.message || "Error al guardar", false);
    }
  });

  $("btn-reload-access")?.addEventListener("click", () => {
    loadAccessForm().then(() => setStatus("Recargado.", true)).catch((e) => setStatus(e.message, false));
  });

  $("btn-ai-create")?.addEventListener("click", async () => {
    try {
      setStatus("Generando código…");
      await createCode();
      setStatus("Código IA creado.", true);
    } catch (err) {
      setStatus(err.message, false);
    }
  });

  $("btn-ai-refresh")?.addEventListener("click", () => refreshCodes());

  $("ai-codes-list")?.addEventListener("click", async (e) => {
    const id = e.target.getAttribute("data-del-code");
    if (!id) return;
    if (!confirm("¿Eliminar este código?")) return;
    try {
      await deleteDoc(doc(db, "ai_access_codes", id));
      await refreshCodes();
      setStatus("Código eliminado.", true);
    } catch (err) {
      setStatus(err.message, false);
    }
  });

  $("btn-user-find")?.addEventListener("click", async () => {
    try {
      await findUser();
    } catch (err) {
      setStatus(err.message, false);
    }
  });

  $("user-result")?.addEventListener("click", async (e) => {
    const status = e.target.getAttribute("data-user-status");
    const uid = e.target.getAttribute("data-uid");
    if (!status || !uid) return;
    try {
      await setUserStatus(uid, status);
    } catch (err) {
      setStatus(err.message, false);
    }
  });

  $("btn-admin-logout")?.addEventListener("click", async () => {
    await logout();
    window.location.href = "login.html?redirect=admin.html";
  });
}

onUserChanged((user) => {
  if (!user) {
    window.location.replace("login.html?redirect=admin.html");
    return;
  }
  if (!isAdmin(user)) {
    showGate("Tu cuenta no tiene permisos de administrador.");
    return;
  }
  showApp(user);
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bind);
} else {
  bind();
}
