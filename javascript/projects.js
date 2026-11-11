/**
 * MultiSoftCreations Portfolio — Projects loader
 * Reads data/projects.json → individual project.json files
 * Renders cards safely (no innerHTML for user-controlled text)
 */

(function () {
  "use strict";

  const STATUS_LABELS = {
    released: "Disponible",
    early_access: "Acceso anticipado",
    demo: "Demostración",
    development: "En desarrollo",
    private: "Privado",
    restricted: "Acceso restringido",
  };

  /**
   * Resolve base path depending on current page depth.
   * index.html → ""
   * html/proyectos.html → "../"
   */
  function getBasePath() {
    const path = window.location.pathname;
    if (path.includes("/html/") || path.endsWith("/html")) {
      return "../";
    }
    return "";
  }

  function isAbsoluteUrl(str) {
    if (!str || typeof str !== "string") return false;
    const trimmed = str.trim();
    if (!trimmed) return false;
    try {
      const u = new URL(trimmed);
      return u.protocol === "https:" || u.protocol === "http:" || u.protocol === "mailto:";
    } catch {
      return false;
    }
  }

  function isValidUrl(str) {
    if (!str || typeof str !== "string") return false;
    const trimmed = str.trim();
    if (!trimmed) return false;
    if (isAbsoluteUrl(trimmed)) return true;
    // Local relative path (no scheme)
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return true;
    return false;
  }

  function resolveLink(url, basePath) {
    const trimmed = (url || "").trim();
    if (!trimmed) return "";
    if (isAbsoluteUrl(trimmed)) return trimmed;
    return (basePath || "") + trimmed.replace(/^\//, "");
  }

  function safeText(value, fallback = "") {
    if (value == null) return fallback;
    const s = String(value).trim();
    return s || fallback;
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null && text !== "") el.textContent = text;
    return el;
  }

  function createProjectCard(project, basePath) {
    const card = createEl("article", "project-card");

    // Image
    const imgWrap = createEl("div", "project-card-image");
    const imgPath = safeText(project.image);
    if (imgPath) {
      const img = document.createElement("img");
      img.alt = safeText(project.name, "Proyecto");
      img.loading = "lazy";
      // Resolve relative to project folder when possible
      const projectFolder = project._folder || "";
      img.src = projectFolder ? basePath + projectFolder + imgPath : basePath + imgPath;
      img.onerror = () => {
        img.remove();
        const ph = createEl("div", "placeholder", safeText(project.name, "?").slice(0, 3).toUpperCase());
        imgWrap.appendChild(ph);
      };
      imgWrap.appendChild(img);
    } else {
      const ph = createEl("div", "placeholder", safeText(project.name, "?").slice(0, 3).toUpperCase());
      imgWrap.appendChild(ph);
    }
    card.appendChild(imgWrap);

    // Body
    const body = createEl("div", "project-card-body");

    // Meta badges
    const meta = createEl("div", "project-card-meta");
    if (safeText(project.category)) {
      meta.appendChild(createEl("span", "badge badge-category", project.category));
    }
    const status = safeText(project.status, "development");
    if (status !== "private") {
      const statusLabel = STATUS_LABELS[status] || status;
      const statusBadge = createEl("span", `badge badge-status ${status}`, statusLabel);
      meta.appendChild(statusBadge);
    }
    body.appendChild(meta);

    // Title & brand
    body.appendChild(createEl("h3", null, safeText(project.name, "Proyecto sin nombre")));
    if (safeText(project.brand)) {
      body.appendChild(createEl("p", "brand", project.brand));
    }

    // Description
    const desc = safeText(project.description);
    if (desc) {
      body.appendChild(createEl("p", "desc", desc));
    }

    // Technologies
    const techs = Array.isArray(project.technologies) ? project.technologies.filter((t) => safeText(t)) : [];
    if (techs.length) {
      const techWrap = createEl("div", "project-tech");
      techs.forEach((t) => techWrap.appendChild(createEl("span", "tech-tag", t)));
      body.appendChild(techWrap);
    }

    // Actions
    const actions = createEl("div", "project-card-actions");
    const links = project.links || {};
    const release = project.release || {};

    if (isValidUrl(links.demo)) {
      const a = createEl("a", "btn btn-primary", safeText(release.label, "Ver demo"));
      a.href = resolveLink(links.demo, basePath);
      if (isAbsoluteUrl(links.demo)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      actions.appendChild(a);
    }

    if (isValidUrl(links.repository)) {
      const a = createEl("a", "btn btn-secondary", "Repositorio");
      a.href = resolveLink(links.repository, basePath);
      if (isAbsoluteUrl(links.repository)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      actions.appendChild(a);
    }

    // Offline / fuera de servicio (no demo nor repository)
    if (!isValidUrl(links.demo) && !isValidUrl(links.repository)) {
      const label = safeText(release.label, "Fuera de servicio");
      const offline = createEl("span", "btn btn-secondary", label);
      offline.style.opacity = "0.7";
      offline.style.cursor = "not-allowed";
      offline.setAttribute("aria-disabled", "true");
      actions.appendChild(offline);
    }

    // Detail page link (if project has its own folder with index.html)
    if (project.id && project._hasDetail) {
      const detailPath = basePath + "html/proyectos/" + project.id + "/index.html";
      const a = createEl("a", "btn btn-secondary", "Detalles");
      a.href = detailPath;
      actions.appendChild(a);
    }

    if (actions.children.length) {
      body.appendChild(actions);
    }

    card.appendChild(body);
    return card;
  }

  async function loadProject(path, basePath) {
    try {
      const res = await fetch(basePath + path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data || typeof data !== "object") throw new Error("JSON inválido");
      // Derive folder from path: "html/proyectos/space-strike/project.json" → "html/proyectos/space-strike/"
      const folder = path.replace(/project\.json$/i, "");
      data._folder = folder;
      data._hasDetail = true; // assume detail page exists if folder structure is used
      return data;
    } catch (err) {
      console.warn("[projects] No se pudo cargar:", path, err.message);
      return null;
    }
  }

  async function loadAllProjects(basePath) {
    const indexUrl = basePath + "data/projects.json";
    let index;
    try {
      const res = await fetch(indexUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      index = await res.json();
    } catch (err) {
      console.error("[projects] Error cargando índice:", err.message);
      return [];
    }

    const paths = Array.isArray(index.projects) ? index.projects : [];
    if (!paths.length) return [];

    const results = await Promise.all(paths.map((p) => loadProject(p, basePath)));
    return results.filter((p) => p && p.visibility !== "private" && p.status !== "private");
  }

  function renderCards(container, projects, basePath, featuredOnly) {
    container.innerHTML = "";
    let list = projects;
    if (featuredOnly) {
      list = projects.filter((p) => p.featured === true);
      if (!list.length) list = projects.slice(0, 3);
    }

    if (!list.length) {
      container.appendChild(createEl("p", "empty-msg", "No hay proyectos para mostrar todavía."));
      return;
    }

    list.forEach((p) => container.appendChild(createProjectCard(p, basePath)));
  }

  function setupFilters(projects, container, basePath) {
    const filters = document.getElementById("project-filters");
    if (!filters) return;

    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      filters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter || "all";
      const filtered =
        filter === "all"
          ? projects
          : projects.filter((p) => safeText(p.category).toLowerCase() === filter.toLowerCase());

      renderCards(container, filtered, basePath, false);
    });
  }

  async function init() {
    const basePath = getBasePath();
    const catalog = document.getElementById("projects-catalog");
    const featured = document.getElementById("featured-projects");

    if (!catalog && !featured) return;

    const projects = await loadAllProjects(basePath);

    if (featured) {
      renderCards(featured, projects, basePath, true);
    }

    if (catalog) {
      renderCards(catalog, projects, basePath, false);
      setupFilters(projects, catalog, basePath);
    }
  }

  // Services (optional, same pattern)
  async function loadServices(basePath) {
    const el = document.getElementById("services-list");
    if (!el) return;

    try {
      const res = await fetch(basePath + "data/services.json");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const services = Array.isArray(data.services) ? data.services : [];

      el.innerHTML = "";
      if (!services.length) {
        el.appendChild(createEl("p", "empty-msg", "Servicios por definir."));
        return;
      }

      services.forEach((s) => {
        const card = createEl("div", "service-card");
        card.appendChild(createEl("h3", null, safeText(s.name, "Servicio")));
        if (safeText(s.description)) {
          card.appendChild(createEl("p", null, s.description));
        }
        const contactUrl =
          "https://wa.me/525624944382?text=" +
          encodeURIComponent(
            "Hola, Ricardo. Me interesa solicitar información sobre el servicio: " + safeText(s.name)
          );
        const btn = createEl("a", "btn btn-whatsapp", "Solicitar info");
        btn.href = contactUrl;
        btn.target = "_blank";
        btn.rel = "noopener noreferrer";
        card.appendChild(btn);
        el.appendChild(card);
      });
    } catch (err) {
      console.warn("[services]", err.message);
      el.innerHTML = "";
      el.appendChild(createEl("p", "empty-msg", "No se pudieron cargar los servicios."));
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    init();
    loadServices(getBasePath());
  });
})();
