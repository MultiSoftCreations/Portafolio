// CODEVERSE — Cloud UI (guardar / cargar proyectos en la nube)
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

function $(id) {
  return document.getElementById(id);
}

function getEditorState() {
  // live.js guarda el estado internamente; leemos del localStorage como fuente de verdad
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
  // Recargar para que live.js tome el proyecto
  window.location.reload();
}

function setStatus(msg) {
  const el = document.getElementById("live-status");
  if (el) el.textContent = msg;
}

function getCurrentCloudId() {
  return localStorage.getItem(CLOUD_CURRENT_KEY) || null;
}

async function saveToCloud() {
  const user = getCurrentUser();
  // Túnel IA sin cuenta: guarda en este dispositivo (no Firebase de usuarios)
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

  const state = getEditorState();
  // Forzar sync: disparar Ctrl+S local primero si existe el botón
  const btnLocal = $("btn-save");
  if (btnLocal) btnLocal.click();

  // Pequeña espera para que localStorage se actualice
  await new Promise((r) => setTimeout(r, 150));
  const fresh = getEditorState();

  let name = $("cloud-project-name")?.value?.trim();
  if (!name) {
    name = prompt("Nombre del proyecto:", "Mi proyecto") || "Mi proyecto";
  }

  try {
    setStatus("Guardando en la nube…");
    const id = getCurrentCloudId();
    const projectId = await saveProjectToCloud(id, {
      name,
      files: fresh.files,
      activeTab: fresh.activeTab
    });
    localStorage.setItem(CLOUD_CURRENT_KEY, projectId);
    if ($("cloud-project-name")) $("cloud-project-name").value = name;
    setStatus("Guardado en la nube ✓");
    console.info("[CODEVERSE] Proyecto guardado en la nube:", projectId);
  } catch (err) {
    console.error(err);
    setStatus("Error al guardar en la nube");
    alert(err.message || "No se pudo guardar en la nube");
  }
}

async function refreshProjectList() {
  const list = $("cloud-projects-list");
  if (!list) return;
  list.innerHTML = '<p class="cloud-empty">Cargando…</p>';
  try {
    const projects = await listProjects();
    if (!projects.length) {
      list.innerHTML = '<p class="cloud-empty">Aún no tienes proyectos en la nube. Pulsa «Nube» o «Nuevo».</p>';
      return;
    }
    const current = getCurrentCloudId();
    list.innerHTML = projects
      .map((p) => {
        const active = p.id === current ? " is-active" : "";
        const date = p.updatedAt?.toDate
          ? p.updatedAt.toDate().toLocaleString()
          : "";
        return `<div class="cloud-item${active}" data-id="${p.id}">
          <div class="cloud-item__main">
            <strong>${escapeHtml(p.name || "Sin título")}</strong>
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
    if (getCurrentCloudId() === id) localStorage.removeItem(CLOUD_CURRENT_KEY);
    await refreshProjectList();
  } catch (err) {
    alert(err.message || "No se pudo eliminar");
  }
}

async function createNew() {
  const user = getCurrentUser();
  if (!user) {
    alert("Inicia sesión para crear proyectos en la nube.");
    return;
  }
  const name = $("cloud-project-name")?.value?.trim() || prompt("Nombre del proyecto:", "Nuevo proyecto");
  if (!name) return;
  const state = getEditorState();
  try {
    const created = await createProject({
      name,
      files: state.files,
      activeTab: state.activeTab
    });
    localStorage.setItem(CLOUD_CURRENT_KEY, created.id);
    if ($("cloud-project-name")) $("cloud-project-name").value = name;
    await refreshProjectList();
    setStatus("Proyecto creado en la nube");
  } catch (err) {
    alert(err.message || "No se pudo crear");
  }
}

function bind() {
  const btnCloud = $("btn-save-cloud");
  const btnMy = $("btn-my-projects");
  const btnNew = $("btn-cloud-new");
  const modal = $("cloud-projects-modal");

  if (btnCloud) btnCloud.addEventListener("click", saveToCloud);
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

  // Atajo: Ctrl+Shift+S = guardar en nube
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "s") {
      e.preventDefault();
      saveToCloud();
    }
  });
}

// Esperar a que el DOM y auth estén listos
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    bind();
    onUserChanged(() => {});
  });
} else {
  bind();
  onUserChanged(() => {});
}
