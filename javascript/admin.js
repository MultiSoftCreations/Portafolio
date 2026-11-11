/**
 * Panel admin — solicitudes + asignación de rangos
 */
import {
  db,
  auth,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  arrayUnion,
  increment,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  isAdminEmail,
  RANGOS,
  rangoLabel,
} from "./firebase.js";

const loginView = document.getElementById("login-view");
const panelView = document.getElementById("panel-view");
const loginForm = document.getElementById("login-form");
const loginStatus = document.getElementById("login-status");
const listEl = document.getElementById("solicitudes-list");
const ranksEl = document.getElementById("ranks-list");
const logoutBtn = document.getElementById("logout-btn");

function showLogin() {
  if (loginView) loginView.hidden = false;
  if (panelView) panelView.hidden = true;
  if (logoutBtn) logoutBtn.hidden = true;
}

function showPanel() {
  if (loginView) loginView.hidden = true;
  if (panelView) panelView.hidden = false;
  if (logoutBtn) logoutBtn.hidden = false;
  loadSolicitudes();
  loadRanks();
}

function setLoginStatus(msg, isError) {
  if (!loginStatus) return;
  loginStatus.textContent = msg || "";
  loginStatus.className = "form-status " + (isError ? "error" : "ok");
  loginStatus.hidden = !msg;
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoginStatus("");
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!isAdminEmail(cred.user.email)) {
        await signOut(auth);
        setLoginStatus(
          "Esta cuenta no tiene permiso de administrador.",
          true
        );
      }
    } catch (err) {
      console.error(err);
      setLoginStatus("No se pudo iniciar sesión. Revisa correo y contraseña.", true);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => signOut(auth));
}

onAuthStateChanged(auth, (user) => {
  if (user && isAdminEmail(user.email)) showPanel();
  else {
    if (user && !isAdminEmail(user.email)) {
      signOut(auth);
    }
    showLogin();
  }
});

function formatDate(ts) {
  if (!ts) return "—";
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return "—";
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function loadSolicitudes() {
  if (!listEl) return;
  listEl.innerHTML = "<p class='loading-msg'>Cargando…</p>";
  try {
    const q = query(collection(db, "solicitudes"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    if (snap.empty) {
      listEl.innerHTML = "<p class='empty-msg'>No hay solicitudes todavía.</p>";
      return;
    }
    listEl.innerHTML = "";
    snap.forEach((docSnap) => {
      listEl.appendChild(renderCard(docSnap.id, docSnap.data()));
    });
  } catch (err) {
    console.error(err);
    listEl.innerHTML =
      "<p class='empty-msg'>Error al cargar. No se pudieron cargar los datos. Comprueba la sesión y las reglas de seguridad.</p>";
  }
}

function renderCard(id, data) {
  const card = document.createElement("article");
  card.className = "admin-card" + (data.leido ? " is-read" : "");
  const respuestas = Array.isArray(data.respuestas) ? data.respuestas : [];

  card.innerHTML = `
    <div class="admin-card-head">
      <div>
        <strong>${escapeHtml(data.nombre || "Sin nombre")}</strong>
        <span class="admin-meta">${formatDate(data.createdAt)}</span>
      </div>
      <div class="admin-badges">
        ${data.leido ? '<span class="badge badge-status released">Leído</span>' : '<span class="badge badge-status early_access">Nuevo</span>'}
        <span class="badge badge-category">${escapeHtml(data.motivo || "consulta")}</span>
      </div>
    </div>
    <p class="admin-msg">${escapeHtml(data.mensaje || "")}</p>
    <p class="admin-contact">
      ${data.email ? "Correo: " + escapeHtml(data.email) : "Sin correo"} · ${data.telefono ? "Tel: " + escapeHtml(data.telefono) + " ·" : ""}
      Medio: ${escapeHtml(data.medio || "—")} ·
      👍 ${Number(data.likes) || 0}
    </p>
    <div class="admin-replies" data-replies></div>
    <div class="admin-actions">
      <button type="button" class="btn btn-secondary btn-sm" data-action="like">👍 Me gusta</button>
      <button type="button" class="btn btn-secondary btn-sm" data-action="toggle-read">${data.leido ? "Marcar no leído" : "Marcar leído"}</button>
      <button type="button" class="btn btn-secondary btn-sm" data-action="delete">Eliminar</button>
    </div>
    <form class="reply-form" data-reply>
      <textarea name="respuesta" rows="2" placeholder="Escribe una respuesta…" required maxlength="2000"></textarea>
      <button type="submit" class="btn btn-primary btn-sm">Responder</button>
    </form>
  `;

  const repliesEl = card.querySelector("[data-replies]");
  respuestas.forEach((r, idx) => {
    const div = document.createElement("div");
    div.className = "admin-reply";
    div.innerHTML = `
      <p>${escapeHtml(r.texto || "")}</p>
      <div class="admin-reply-meta">
        <span>${escapeHtml(r.autor || "admin")} · ${formatDate(r.createdAt)}</span>
        <button type="button" class="btn-link" data-like-reply="${idx}">👍 ${Number(r.likes) || 0}</button>
      </div>
    `;
    repliesEl.appendChild(div);
  });

  card.querySelector('[data-action="like"]').addEventListener("click", async () => {
    try {
      await updateDoc(doc(db, "solicitudes", id), { likes: increment(1) });
      loadSolicitudes();
    } catch (e) {
      console.error(e);
    }
  });

  card.querySelector('[data-action="toggle-read"]').addEventListener("click", async () => {
    try {
      await updateDoc(doc(db, "solicitudes", id), { leido: !data.leido });
      loadSolicitudes();
    } catch (e) {
      console.error(e);
    }
  });

  card.querySelector('[data-action="delete"]').addEventListener("click", async () => {
    if (!confirm("¿Eliminar esta solicitud?")) return;
    try {
      await deleteDoc(doc(db, "solicitudes", id));
      loadSolicitudes();
    } catch (e) {
      console.error(e);
    }
  });

  card.querySelectorAll("[data-like-reply]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const idx = Number(btn.dataset.likeReply);
      const next = respuestas.map((r, i) =>
        i === idx ? { ...r, likes: (Number(r.likes) || 0) + 1 } : r
      );
      try {
        await updateDoc(doc(db, "solicitudes", id), { respuestas: next });
        loadSolicitudes();
      } catch (e) {
        console.error(e);
      }
    });
  });

  card.querySelector("[data-reply]").addEventListener("submit", async (e) => {
    e.preventDefault();
    const texto = e.target.respuesta.value.trim();
    if (!texto) return;
    try {
      await updateDoc(doc(db, "solicitudes", id), {
        respuestas: arrayUnion({
          texto,
          autor: "Ricardo",
          createdAt: new Date().toISOString(),
          likes: 0,
        }),
        leido: true,
      });
      e.target.reset();
      loadSolicitudes();
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar la respuesta.");
    }
  });

  return card;
}

async function loadRanks() {
  if (!ranksEl) return;
  ranksEl.innerHTML = "<p class='loading-msg'>Cargando perfiles…</p>";
  try {
    const snap = await getDocs(collection(db, "perfiles"));
    if (snap.empty) {
      ranksEl.innerHTML =
        "<p class='empty-msg'>Aún no hay perfiles. Se crean cuando alguien se registra para comentar.</p>";
      return;
    }
    ranksEl.innerHTML = "";
    const opts = RANGOS.map(
      (r) => `<option value="${r.id}">${r.label}</option>`
    ).join("");

    snap.forEach((d) => {
      const data = d.data();
      const row = document.createElement("div");
      row.className = "admin-card rank-row";
      row.innerHTML = `
        <div class="admin-card-head">
          <div>
            <strong>${escapeHtml(data.displayName || "Sin nombre")}</strong>
            <span class="admin-meta">${escapeHtml(data.email || d.id)}</span>
          </div>
          <span class="badge badge-category">${escapeHtml(rangoLabel(data.rango || "usuario"))}</span>
        </div>
        <div class="admin-actions">
          <label class="rank-select-label">
            Asignar rango
            <select data-rank-select>
              ${opts}
            </select>
          </label>
          <button type="button" class="btn btn-primary btn-sm" data-save-rank>Guardar</button>
        </div>
      `;
      const sel = row.querySelector("[data-rank-select]");
      sel.value = data.rango || "usuario";
      row.querySelector("[data-save-rank]").onclick = async () => {
        try {
          await setDoc(
            doc(db, "perfiles", d.id),
            {
              displayName: data.displayName || "Usuario",
              email: data.email || null,
              rango: sel.value,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
          loadRanks();
        } catch (e) {
          console.error(e);
          alert("No se pudo guardar el rango. Revisa reglas y ADMIN_EMAILS.");
        }
      };
      ranksEl.appendChild(row);
    });
  } catch (e) {
    console.error(e);
    ranksEl.innerHTML = "<p class='empty-msg'>Error al cargar perfiles.</p>";
  }
}
