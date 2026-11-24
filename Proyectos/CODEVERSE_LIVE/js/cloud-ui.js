// CODEVERSE — Cloud UI (guardar / cargar / actualizar proyectos)
// MultiSoftCreations

import { onUserChanged, getCurrentUser, hasValidAITunnelSession } from "./auth.js";
import {
  listProjects,
  createProject,
  updateProject,
  getProject,
  deleteProject,
  saveProjectToCloud
} from "./projects.js";

const CLOUD_CURRENT_KEY = "codeverse_live_cloud_project_id";
const CLOUD_CURRENT_NAME = "codeverse_live_cloud_project_name";

function $(id) {
  return document.getElementById(id);
}

function getEditorState() {
  try {
    const raw = localStorage.getItem("codeverse_live_project_v2");
    if (!raw) return { files: { html: "", css: "", js: "", python: "" }, activeTab: "html" };
    const data = JSON.parse(raw);
    return {
      files: data.files || { html: "", css: "", js: "", python: "" },
      activeTab: data.activeTab || "html"
    };
  } catch {
    return { files: { html: "", css: "", js: "", python: "" }, activeTab: "html" };
  }
}

/** Detecta lenguajes con contenido real (no vacío) */
export function detectLanguages(files = {}, activeTab = "html") {
  const langs = [];
  const f = files || {};
  if ((f.html || "").trim()) langs.push("HTML");
  if ((f.css || "").trim()) langs.push("CSS");
  if ((f.js || "").trim()) langs.push("JS");
  if ((f.python || "").trim()) langs.push("Python");
  if (!langs.length && activeTab) {
    const map = { html: "HTML", css: "CSS", js: "JS", python: "Python" };
    langs.push(map[activeTab] || activeTab.toUpperCase());
  }
  return langs;
}

function applyToEditor(project) {
  const files = project.files || {};
  const payload = {
    version: 2,
    files: {
      html: files.html || "",
      css: files.css || "",
      js: files.js || "",
      python: files.python || ""
    },
    activeTab: project.activeTab || "html",
    savedAt: new Date().toISOString()
  };
  localStorage.setItem("codeverse_live_project_v2", JSON.stringify(payload));
  localStorage.setItem(CLOUD_CURRENT_KEY, project.id);
  if (project.name) localStorage.setItem(CLOUD_CURRENT_NAME, project.name);
  window.location.reload();
}

function setStatus(msg) {
  const el = document.getElementById("live-status");
  if (el) el.textContent = msg;
}

function getCurrentCloudId() {
  return localStorage.getItem(CLOUD_CURRENT_KEY) || null;
}

function getCurrentCloudName() {
  return localStorage.getItem(CLOUD_CURRENT_NAME) || "";
}

function updateCurrentLabel() {
  const label = $("cloud-current-label");
  if (!label) return;
  const id = getCurrentCloudId();
  const name = getCurrentCloudName();
  if (id && name) {
    label.textContent = "Proyecto actual: " + name;
    label.hidden = false;
  } else if (id) {
    label.textContent = "Proyecto actual cargado";
    label.hidden = false;
  } else {
    label.textContent = "Ningún proyecto de nube cargado";
    label.hidden = false;
  }
  const btnUpdate = $("btn-update-cloud");
  if (btnUpdate) btnUpdate.disabled = !id;
}

async function syncLocalFromEditor() {
  const btnLocal = $("btn-save");
  if (btnLocal) btnLocal.click();
  await new Promise((r) => setTimeout(r, 150));
  return getEditorState();
}

async function saveToCloud({ asNew = false } = {}) {
  const user = getCurrentUser();
  if (!user && hasValidAITunnelSession()) {
    const btnLocal = $("btn-save");
    if (btnLocal) btnLocal.click();
    setStatus("Guardado local (sesión IA)");
    return;
  }
  if (!user) {
    alert("Inicia sesión para guardar en la nube.");
    window.location.href = "login.html?redirect=live.html";
    return;
  }

  const fresh = await syncLocalFromEditor();
  const langs = detectLanguages(fresh.files, fresh.activeTab);
  let id = asNew ? null : getCurrentCloudId();

  let name = $("cloud-project-name")?.value?.trim() || getCurrentCloudName();
  if (!name || asNew) {
    name = prompt(asNew ? "Nombre del proyecto nuevo:" : "Nombre del proyecto:", name || "Mi proyecto") || "";
  }
  if (!name.trim()) {
    setStatus("Guardado cancelado");
    return;
  }
  name = name.trim();

  try {
    setStatus(id ? "Actualizando proyecto en la nube…" : "Creando proyecto en la nube…");
    const projectId = await saveProjectToCloud(id, {
      name,
      files: fresh.files,
      activeTab: fresh.activeTab,
      languages: langs
    });
    // saveProjectToCloud may not pass languages — update explicitly
    try {
      await updateProject(projectId, {
        name,
        files: fresh.files,
        activeTab: fresh.activeTab,
        languages: langs
      });
    } catch (_) {}

    localStorage.setItem(CLOUD_CURRENT_KEY, projectId);
    localStorage.setItem(CLOUD_CURRENT_NAME, name);
    if ($("cloud-project-name")) $("cloud-project-name").value = name;
    updateCurrentLabel();
    setStatus(id ? "Proyecto actualizado en la nube ✓" : "Proyecto nuevo guardado en la nube ✓");
  } catch (err) {
    console.error(err);
    setStatus("Error al guardar en la nube");
    alert(err.message || "No se pudo guardar en la nube");
  }
}

function langBadges(langs) {
  if (!langs || !langs.length) return '<span class="cloud-lang cloud-lang--unk">—</span>';
  return langs
    .map((l) => `<span class="cloud-lang cloud-lang--${String(l).toLowerCase()}">${escapeHtml(l)}</span>`)
    .join(" ");
}

function langsFromProject(p) {
  if (Array.isArray(p.languages) && p.languages.length) return p.languages;
  return detectLanguages(p.files || {}, p.activeTab || "html");
}

async function refreshProjectList() {
  const list = $("cloud-projects-list");
  if (!list) return;
  list.innerHTML = '<p class="cloud-empty">Cargando…</p>';
  try {
    const projects = await listProjects();
    if (!projects.length) {
      list.innerHTML = '<p class="cloud-empty">Aún no tienes proyectos en la nube.</p>';
      return;
    }
    const current = getCurrentCloudId();
    list.innerHTML = projects
      .map((p) => {
        const active = p.id === current ? " is-active" : "";
        const date = p.updatedAt?.toDate ? p.updatedAt.toDate().toLocaleString() : "";
        const langs = langsFromProject(p);
        return `<div class="cloud-item${active}" data-id="${p.id}">
          <div class="cloud-item__main">
            <strong>${escapeHtml(p.name || "Sin título")}</strong>
            <span class="cloud-item__langs">${langBadges(langs)}</span>
            <span class="cloud-item__date">${escapeHtml(date)}</span>
          </div>
          <div class="cloud-item__actions">
            <button type="button" class="btn btn--sm btn--primary" data-open="${p.id}">Abrir</button>
            <button type="button" class="btn btn--sm btn--ghost" data-delete="${p.id}">Eliminar</button>
          </div>
        </div>`;
      })
      .join("");
  } catch (err) {
    list.innerHTML = `<p class="cloud-empty">Error: ${escapeHtml(err.message)}</p>`;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function openModal() {
  const modal = $("cloud-projects-modal");
  if (!modal) return;
  modal.hidden = false;
  if ($("cloud-project-name") && getCurrentCloudName()) {
    $("cloud-project-name").value = getCurrentCloudName();
  }
  refreshProjectList();
}

function closeModal() {
  const modal = $("cloud-projects-modal");
  if (modal) modal.hidden = true;
}

async function openProject(id) {
  try {
    setStatus("Cargando proyecto…");
    const project = await getProject(id);
    applyToEditor(project);
  } catch (err) {
    alert(err.message || "No se pudo abrir el proyecto");
  }
}

async function removeProject(id) {
  if (!confirm("¿Eliminar este proyecto de la nube? No se puede deshacer.")) return;
  try {
    await deleteProject(id);
    if (getCurrentCloudId() === id) {
      localStorage.removeItem(CLOUD_CURRENT_KEY);
      localStorage.removeItem(CLOUD_CURRENT_NAME);
      updateCurrentLabel();
    }
    await refreshProjectList();
  } catch (err) {
    alert(err.message || "No se pudo eliminar");
  }
}

async function createNew() {
  await saveToCloud({ asNew: true });
  await refreshProjectList();
}

function bind() {
  const btnCloud = $("btn-save-cloud");
  const btnUpdate = $("btn-update-cloud");
  const btnSaveAs = $("btn-save-cloud-as");
  const btnMy = $("btn-my-projects");
  const btnNew = $("btn-cloud-new");
  const modal = $("cloud-projects-modal");

  if (btnCloud) btnCloud.addEventListener("click", () => saveToCloud({ asNew: !getCurrentCloudId() }));
  if (btnUpdate) btnUpdate.addEventListener("click", () => {
    if (!getCurrentCloudId()) {
      alert("No hay un proyecto de nube cargado. Ábrelo desde «Mis proyectos» o guárdalo como nuevo.");
      return;
    }
    saveToCloud({ asNew: false });
  });
  if (btnSaveAs) btnSaveAs.addEventListener("click", () => saveToCloud({ asNew: true }));
  if (btnMy) {
    btnMy.addEventListener("click", () => {
      if (!getCurrentUser()) {
        if (hasValidAITunnelSession()) {
          alert("La sesión IA usa guardado local del editor. Los proyectos en la nube Firebase son solo para cuentas de usuario.");
          return;
        }
        alert("Inicia sesión para ver tus proyectos.");
        window.location.href = "login.html?redirect=live.html";
        return;
      }
      openModal();
    });
  }
  if (btnNew) btnNew.addEventListener("click", createNew);

  if (modal) {
    modal.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });
    modal.addEventListener("click", (e) => {
      const openId = e.target.getAttribute("data-open");
      const delId = e.target.getAttribute("data-delete");
      if (openId) openProject(openId);
      if (delId) removeProject(delId);
    });
  }

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "s") {
      e.preventDefault();
      saveToCloud({ asNew: !getCurrentCloudId() });
    }
  });

  updateCurrentLabel();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    bind();
    onUserChanged(() => updateCurrentLabel());
  });
} else {
  bind();
  onUserChanged(() => updateCurrentLabel());
}
