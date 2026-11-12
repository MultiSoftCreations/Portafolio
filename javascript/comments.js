/**
 * Comentarios + respuestas + likes + usernames únicos + badge de equipo
 */
import {
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
  where,
  orderBy,
  serverTimestamp,
  increment,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  rangoLabel,
  rangoClass,
  isTeamRango,
  normalizeUsername,
  validUsername,
} from "./firebase.js";

const LOGO_SRC = (() => {
  const path = window.location.pathname;
  if (path.includes("/html/proyectos/")) return "../../../assets/img/logo.png";
  if (path.includes("/html/")) return "../assets/img/logo.png";
  return "assets/img/logo.png";
})();

const root = document.getElementById("comments-root");
if (root) initComments(root, root.dataset.projectId || "unknown");

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(ts) {
  if (!ts) return "";
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return "";
  }
}

async function ensurePerfil(user) {
  const ref = doc(db, "perfiles", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const data = {
      displayName: user.displayName || "Usuario",
      username: null,
      email: user.email || null,
      rango: "usuario",
      createdAt: serverTimestamp(),
    };
    await setDoc(ref, data);
    return data;
  }
  return snap.data();
}

async function getPerfil(uid) {
  try {
    const snap = await getDoc(doc(db, "perfiles", uid));
    if (snap.exists()) return snap.data();
  } catch (_) {}
  return { rango: "usuario", displayName: "Usuario" };
}

function badgeHtml(perfil) {
  const rango = perfil.rango || "usuario";
  const name = escapeHtml(perfil.displayName || perfil.username || "Usuario");
  const uname = perfil.username ? `<span class="comment-username">@${escapeHtml(perfil.username)}</span>` : "";
  const team = isTeamRango(rango)
    ? `<img src="${LOGO_SRC}" alt="" class="team-verify" width="22" height="22" title="Equipo MultiSoftCreations">`
    : "";
  return `
    <span class="comment-identity">
      ${team}
      <strong>${name}</strong>
      ${uname}
      <span class="rank-badge ${rangoClass(rango)}">${escapeHtml(rangoLabel(rango))}</span>
    </span>`;
}

function initComments(root, projectId) {
  root.innerHTML = `
    <section class="comments-section" aria-labelledby="comments-title">
      <h2 id="comments-title" class="section-title" style="font-size:1.35rem">Comentarios</h2>
      <p class="comments-note">Cuenta requerida para comentar. Nombres de usuario únicos. Comentarios y respuestas son públicos.
        <a href="../../terminos.html">Términos</a> · <a href="../../privacidad.html">Privacidad</a>.</p>
      <div id="auth-box" class="comments-auth"></div>
      <div id="comment-form-wrap" hidden>
        <form id="comment-form" class="contact-form comment-form">
          <label>Comentario
            <textarea name="texto" rows="3" maxlength="1000" required placeholder="Máx. 1000 caracteres."></textarea>
          </label>
          <p id="comment-status" class="form-status" hidden></p>
          <button type="submit" class="btn btn-primary btn-sm">Publicar</button>
        </form>
      </div>
      <div id="comments-list" class="comments-list"><p class="loading-msg">Cargando…</p></div>
    </section>
  `;

  const authBox = root.querySelector("#auth-box");
  const formWrap = root.querySelector("#comment-form-wrap");
  const listEl = root.querySelector("#comments-list");
  const form = root.querySelector("#comment-form");
  const statusEl = root.querySelector("#comment-status");
  const perfilCache = {};

  function setStatus(msg, type) {
    statusEl.textContent = msg || "";
    statusEl.className = "form-status " + (type || "");
    statusEl.hidden = !msg;
  }

  function renderAuth(user) {
    if (user) {
      formWrap.hidden = false;
      authBox.innerHTML = `
        <p class="comments-user">Conectado como <strong>${escapeHtml(user.displayName || user.email)}</strong>
          <button type="button" class="btn-link" id="btn-logout">Cerrar sesión</button></p>`;
      authBox.querySelector("#btn-logout").onclick = () => signOut(auth);
      ensurePerfil(user).catch(console.error);
    } else {
      formWrap.hidden = true;
      let captcha = authMakeCaptcha();

      function paintAuthForms(prefEmail) {
        const emailVal = prefEmail || "";
        const needCap = authNeedsCaptcha(emailVal);
        authBox.innerHTML = `
        <div class="comments-auth-forms">
          <details open>
            <summary>Iniciar sesión</summary>
            <form id="c-login" class="contact-form comment-form" autocomplete="on">
              <label>Correo <input type="email" name="email" required autocomplete="username" value="${emailVal.replace(/"/g, "&quot;")}"></label>
              <label>Contraseña <input type="password" name="password" required autocomplete="current-password"></label>
              <div id="c-captcha-wrap" ${needCap ? "" : "hidden"}>
                <label>CAPTCHA: ¿cuánto es <strong id="c-captcha-q">${captcha.question}</strong>?
                  <input type="text" name="captcha" inputmode="numeric" autocomplete="off" ${needCap ? "required" : ""}>
                </label>
              </div>
              <p class="form-status error" id="c-login-err" hidden></p>
              <p class="form-hint" style="font-size:0.8rem;opacity:0.75;margin:0.35rem 0 0">Por seguridad, el acceso espera ~1 s y limita intentos fallidos.</p>
              <button type="submit" class="btn btn-secondary btn-sm" id="c-login-btn">Entrar</button>
            </form>
          </details>
          <details>
            <summary>Crear cuenta</summary>
            <form id="c-register" class="contact-form comment-form">
              <label>Nombre visible <input type="text" name="nombre" maxlength="40" required placeholder="Ej. Ricardo"></label>
              <label>Usuario único (@) <input type="text" name="username" maxlength="20" required placeholder="ej. ricardo_t" pattern="[A-Za-z0-9_\\-]{3,20}"></label>
              <label>Correo <input type="email" name="email" required autocomplete="email"></label>
              <label>Contraseña (mín. 6) <input type="password" name="password" minlength="6" required autocomplete="new-password"></label>
              <label class="check-label">
                <input type="checkbox" name="acepto" required>
                <span>Acepto <a href="../../privacidad.html">privacidad</a> y <a href="../../terminos.html">términos</a>.</span>
              </label>
              <p class="form-status error" id="c-reg-err" hidden></p>
              <button type="submit" class="btn btn-primary btn-sm">Registrarme</button>
            </form>
          </details>
        </div>`;

        const loginForm = authBox.querySelector("#c-login");
        loginForm.onsubmit = async (e) => {
          e.preventDefault();
          const err = authBox.querySelector("#c-login-err");
          const btn = authBox.querySelector("#c-login-btn");
          err.hidden = true;
          const email = e.target.email.value.trim();
          const password = e.target.password.value;
          const captchaAns = e.target.captcha ? e.target.captcha.value : "";

          const lock = authIsLocked(email);
          if (lock.locked) {
            err.textContent = `Cuenta bloqueada temporalmente. Espera ${lock.minutes} min.`;
            err.hidden = false;
            authClearPasswords(e.target);
            return;
          }

          if (authNeedsCaptcha(email)) {
            const wrap = authBox.querySelector("#c-captcha-wrap");
            if (wrap) wrap.hidden = false;
            if (String(captchaAns).trim() !== captcha.answer) {
              err.textContent = "CAPTCHA incorrecto.";
              err.hidden = false;
              captcha = authMakeCaptcha();
              const q = authBox.querySelector("#c-captcha-q");
              if (q) q.textContent = captcha.question;
              authClearPasswords(e.target);
              return;
            }
          }

          btn.disabled = true;
          btn.textContent = "Verificando…";
          try {
            await authDelay(AUTH_DELAY_MS);
            await signInWithEmailAndPassword(auth, email, password);
            authRecordSuccess(email);
          } catch (ex) {
            const s = authRecordFailure(email);
            let msg = "No se pudo iniciar sesión.";
            if (ex && ex.code === "auth/too-many-requests") msg = "Demasiados intentos. Espera un momento.";
            if (s.fails >= AUTH_LOCK_AFTER) {
              msg = "Demasiados intentos fallidos. Cuenta bloqueada 15 minutos.";
            } else if (s.fails >= AUTH_CAPTCHA_AFTER) {
              msg = msg + " Se requiere CAPTCHA.";
              captcha = authMakeCaptcha();
              paintAuthForms(email);
              const err2 = authBox.querySelector("#c-login-err");
              if (err2) { err2.textContent = msg; err2.hidden = false; }
              return;
            }
            err.textContent = msg;
            err.hidden = false;
          } finally {
            authClearPasswords(e.target);
            if (btn) {
              btn.disabled = false;
              btn.textContent = "Entrar";
            }
          }
        };

        authBox.querySelector("#c-register").onsubmit = async (e) => {
          e.preventDefault();
          const err = authBox.querySelector("#c-reg-err");
          err.hidden = true;
          const nombre = e.target.nombre.value.trim();
          const username = normalizeUsername(e.target.username.value);
          const email = e.target.email.value.trim();
          const password = e.target.password.value;
          if (nombre.length < 2) {
            err.textContent = "Nombre demasiado corto.";
            err.hidden = false;
            return;
          }
          if (!validUsername(username)) {
            err.textContent = "Usuario: 3–20 caracteres (letras, números, _ o -).";
            err.hidden = false;
            return;
          }
          try {
            await authDelay(AUTH_DELAY_MS);
            const unameRef = doc(db, "usernames", username);
            const exists = await getDoc(unameRef);
            if (exists.exists()) {
              err.textContent = "Ese nombre de usuario ya está en uso.";
              err.hidden = false;
              authClearPasswords(e.target);
              return;
            }
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            authClearPasswords(e.target);
            await updateProfile(cred.user, { displayName: nombre });
            await setDoc(unameRef, { uid: cred.user.uid, createdAt: serverTimestamp() });
            await setDoc(doc(db, "perfiles", cred.user.uid), {
              displayName: nombre,
              username,
              email,
              rango: "usuario",
              createdAt: serverTimestamp(),
            });
            authRecordSuccess(email);
          } catch (ex) {
            console.error(ex);
            let msg = "No se pudo crear la cuenta.";
            if (ex.code === "auth/email-already-in-use") msg = "Ese correo ya tiene una cuenta.";
            if (ex.code === "auth/weak-password") msg = "Contraseña mínimo 6 caracteres.";
            if (ex.code === "auth/invalid-email") msg = "Correo no válido.";
            err.textContent = msg;
            err.hidden = false;
            authClearPasswords(e.target);
          }
        };
      }

      paintAuthForms("");
    }
  }

  async function loadComments() {
    listEl.innerHTML = "<p class='loading-msg'>Cargando…</p>";
    try {
      const q = query(
        collection(db, "comentarios"),
        where("projectId", "==", projectId),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        listEl.innerHTML = "<p class='empty-msg'>Sé el primero en comentar.</p>";
        return;
      }
      listEl.innerHTML = "";
      const uid = auth.currentUser?.uid;
      const items = [];
      for (const d of snap.docs) {
        const data = d.data();
        if (!perfilCache[data.uid]) perfilCache[data.uid] = await getPerfil(data.uid);
        items.push({ id: d.id, ...data });
      }
      // roots: no parentId
      const roots = items.filter((c) => !c.parentId);
      const children = (parentId) => items.filter((c) => c.parentId === parentId);

      function renderOne(c, depth) {
        const perfil = perfilCache[c.uid] || {};
        const el = document.createElement("article");
        el.className = "comment-card" + (depth ? " comment-reply" : "");
        if (depth) el.style.marginLeft = Math.min(depth * 1.25, 3) + "rem";
        el.innerHTML = `
          <div class="comment-head">
            <div>${badgeHtml(perfil)}</div>
            <span class="admin-meta">${formatDate(c.createdAt)}</span>
          </div>
          <p class="comment-body">${escapeHtml(c.texto || "")}</p>
          <div class="comment-actions">
            <button type="button" class="btn-link" data-like>👍 ${Number(c.likes) || 0}</button>
            ${auth.currentUser ? '<button type="button" class="btn-link" data-reply-btn>Responder</button>' : ""}
            ${uid && uid === c.uid ? '<button type="button" class="btn-link" data-del>Eliminar</button>' : ""}
          </div>
          <form class="reply-form" data-inline-reply hidden>
            <textarea name="texto" rows="2" maxlength="1000" required placeholder="Tu respuesta…"></textarea>
            <button type="submit" class="btn btn-primary btn-sm">Enviar respuesta</button>
          </form>
          <div data-children></div>
        `;
        el.querySelector("[data-like]").onclick = async () => {
          if (!auth.currentUser) {
            alert("Inicia sesión para dar like.");
            return;
          }
          try {
            await updateDoc(doc(db, "comentarios", c.id), { likes: increment(1) });
            loadComments();
          } catch (e) {
            console.error(e);
          }
        };
        const replyBtn = el.querySelector("[data-reply-btn]");
        const replyForm = el.querySelector("[data-inline-reply]");
        if (replyBtn) {
          replyBtn.onclick = () => {
            replyForm.hidden = !replyForm.hidden;
          };
          replyForm.onsubmit = async (e) => {
            e.preventDefault();
            const texto = e.target.texto.value.trim();
            if (texto.length < 2) return;
            const user = auth.currentUser;
            try {
              await addDoc(collection(db, "comentarios"), {
                projectId,
                parentId: c.id,
                uid: user.uid,
                displayName: user.displayName || "Usuario",
                texto,
                createdAt: serverTimestamp(),
                likes: 0,
              });
              loadComments();
            } catch (err) {
              console.error(err);
              alert("No se pudo responder.");
            }
          };
        }
        const del = el.querySelector("[data-del]");
        if (del) {
          del.onclick = async () => {
            if (!confirm("¿Eliminar?")) return;
            try {
              await deleteDoc(doc(db, "comentarios", c.id));
              loadComments();
            } catch (e) {
              console.error(e);
            }
          };
        }
        const ch = el.querySelector("[data-children]");
        children(c.id).forEach((child) => ch.appendChild(renderOne(child, depth + 1)));
        return el;
      }

      roots.forEach((c) => listEl.appendChild(renderOne(c, 0)));
    } catch (e) {
      console.error(e);
      listEl.innerHTML = "<p class='empty-msg'>Error al cargar comentarios (reglas o índice).</p>";
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("");
    const user = auth.currentUser;
    if (!user) return;
    const texto = form.texto.value.trim();
    if (texto.length < 3 || texto.length > 1000) {
      setStatus("Entre 3 y 1000 caracteres.", "error");
      return;
    }
    try {
      await ensurePerfil(user);
      await addDoc(collection(db, "comentarios"), {
        projectId,
        parentId: null,
        uid: user.uid,
        displayName: user.displayName || "Usuario",
        texto,
        createdAt: serverTimestamp(),
        likes: 0,
      });
      form.reset();
      setStatus("Publicado.", "ok");
      loadComments();
    } catch (err) {
      console.error(err);
      setStatus("No se pudo publicar.", "error");
    }
  });

  onAuthStateChanged(auth, (user) => {
    renderAuth(user);
    loadComments();
  });
}
