import { evaluateAccess } from "./site-access.js";
// CODEVERSE — Mini editor de lecciones: HTML, HTML+CSS, HTML+JS, Python
// MultiSoftCreations

function workspaceKey(courseId) {
  return "codeverse_workspace_" + (courseId || "default");
}

export function loadCourseWorkspace(courseId) {
  try {
    const raw = localStorage.getItem(workspaceKey(courseId));
    if (!raw) return { html: "", css: "", js: "", python: "" };
    const data = JSON.parse(raw);
    return {
      html: typeof data.html === "string" ? data.html : "",
      css: typeof data.css === "string" ? data.css : "",
      js: typeof data.js === "string" ? data.js : "",
      python: typeof data.python === "string" ? data.python : ""
    };
  } catch {
    return { html: "", css: "", js: "", python: "" };
  }
}

export function saveCourseWorkspace(courseId, data) {
  const prev = loadCourseWorkspace(courseId);
  const payload = {
    html: data.html != null ? data.html : prev.html,
    css: data.css != null ? data.css : prev.css,
    js: data.js != null ? data.js : prev.js,
    python: data.python != null ? data.python : prev.python,
    updatedAt: new Date().toISOString()
  };
  try {
    localStorage.setItem(workspaceKey(courseId), JSON.stringify(payload));
  } catch (err) {
    console.warn("[CODEVERSE] No se pudo guardar workspace del curso", err);
  }
  return payload;
}

let pyodidePromise = null;
async function getPyodide() {
  if (window.loadPyodide) {
    if (!pyodidePromise) {
      pyodidePromise = window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"
      });
    }
    return pyodidePromise;
  }
  // Cargar script una vez
  if (!document.getElementById("cv-pyodide-script")) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.id = "cv-pyodide-script";
      s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
      s.onload = resolve;
      s.onerror = () => reject(new Error("No se pudo cargar Pyodide"));
      document.head.appendChild(s);
    });
  }
  if (!pyodidePromise) {
    pyodidePromise = window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"
    });
  }
  return pyodidePromise;
}

/**
 * data-mode: html | html-css | html-js | python
 * data-course: html|css|js|python
 * data-force-starter="1" solo aplica si no hay workspace
 * data-persist="1"
 */
export function mountLessonMinis(root = document) {
  const nodes = root.querySelectorAll("[data-lesson-mini]");
  nodes.forEach((box) => {
    if (box.dataset.ready === "1") return;

    const mode = (box.dataset.mode || "html").toLowerCase();
    const courseId = box.dataset.course || "";
    const forceStarter = box.dataset.forceStarter === "1";
    const persist = box.dataset.persist !== "0";

    const codeHtml = box.querySelector(".lesson-mini__code");
    const codeCss = box.querySelector(".lesson-mini__code-css");
    const codeJs = box.querySelector(".lesson-mini__code-js");
    const codePy = box.querySelector(".lesson-mini__code-python");
    const frame = box.querySelector(".lesson-mini__preview");
    const consoleEl = box.querySelector(".lesson-mini__console");
    const btnRun = box.querySelector(".lesson-mini__run");
    const btnReset = box.querySelector(".lesson-mini__reset");
    const tabs = box.querySelectorAll("[data-mini-tab]");

    const starterHtml = codeHtml ? codeHtml.value : "";
    const starterCss = codeCss ? codeCss.value : "";
    const starterJs = codeJs ? codeJs.value : "";
    const starterPy = codePy ? codePy.value : "";

    const ws = courseId ? loadCourseWorkspace(courseId) : { html: "", css: "", js: "", python: "" };
    const hasWorkspace = !!(ws.html || ws.css || ws.js || ws.python);
    const applyForce = forceStarter && !hasWorkspace;

    if (!applyForce && hasWorkspace) {
      if (codeHtml && (ws.html || mode.startsWith("html"))) codeHtml.value = ws.html || codeHtml.value;
      if (codeCss) codeCss.value = ws.css || "";
      if (codeJs) codeJs.value = ws.js || "";
      if (codePy) codePy.value = ws.python || "";
    } else {
      if (codeHtml) codeHtml.value = starterHtml;
      if (codeCss) codeCss.value = starterCss;
      if (codeJs) codeJs.value = starterJs;
      if (codePy) codePy.value = starterPy;
    }

    // Tabs
    if (tabs.length) {
      const map = {
        html: codeHtml,
        css: codeCss,
        js: codeJs,
        python: codePy
      };
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const which = tab.getAttribute("data-mini-tab");
          tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
          Object.keys(map).forEach((k) => {
            if (map[k]) map[k].hidden = k !== which;
          });
        });
      });
      // default first visible
      const first = tabs[0]?.getAttribute("data-mini-tab");
      Object.keys(map).forEach((k) => {
        if (map[k]) map[k].hidden = k !== first;
      });
    }

    function val(el) {
      return el ? el.value : "";
    }

    function persistNow() {
      if (!persist || !courseId) return;
      saveCourseWorkspace(courseId, {
        html: val(codeHtml),
        css: val(codeCss),
        js: val(codeJs),
        python: val(codePy)
      });
    }

    async function run(opts) {
      const fromUser = !!(opts && opts.fromUser);
      try {
        if (mode === "python") {
          if (consoleEl) {
            consoleEl.textContent = "Ejecutando Python…";
          }
          const py = await getPyodide();
          let stdout = "";
          py.setStdout({ batched: (s) => { stdout += s + "\n"; } });
          py.setStderr({ batched: (s) => { stdout += s + "\n"; } });
          try {
            await py.runPythonAsync(val(codePy));
            if (consoleEl) consoleEl.textContent = stdout.trim() || "(sin salida)";
          } catch (err) {
            if (consoleEl) consoleEl.textContent = String(err);
          }
        } else if (mode === "html-js") {
          if (!frame) return;
          let doc = val(codeHtml) || "<!DOCTYPE html><html><body></body></html>";
          const js = val(codeJs);
          const scriptTag = "<script>\ntry {\n" + js + "\n} catch(e){ document.body.insertAdjacentHTML('beforeend', '<pre style=color:red>'+e+'</pre>'); }\n<\/script>";
          if (/<\/body>/i.test(doc)) {
            doc = doc.replace(/<\/body>/i, scriptTag + "\n</body>");
          } else {
            doc = doc + scriptTag;
          }
          frame.srcdoc = doc;
        } else if (mode === "html-css") {
          if (!frame) return;
          let doc = val(codeHtml);
          const css = val(codeCss);
          const styleTag = "<style>\n" + css + "\n</style>";
          if (/<\/head>/i.test(doc)) {
            doc = doc.replace(/<\/head>/i, styleTag + "\n</head>");
          } else if (/<body/i.test(doc)) {
            doc = doc.replace(/<body/i, styleTag + "\n<body");
          } else {
            doc = styleTag + "\n" + doc;
          }
          frame.srcdoc = doc;
        } else {
          if (frame) frame.srcdoc = val(codeHtml);
        }
      } finally {
        if (fromUser) persistNow();
      }
    }

    if (btnRun) btnRun.addEventListener("click", () => run({ fromUser: true }));
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (codeHtml) codeHtml.value = starterHtml;
        if (codeCss) codeCss.value = starterCss;
        if (codeJs) codeJs.value = starterJs;
        if (codePy) codePy.value = starterPy;
        run({ fromUser: true });
      });
    }

    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        run({ fromUser: true });
      }
    };
    [codeHtml, codeCss, codeJs, codePy].forEach((el) => {
      if (el) el.addEventListener("keydown", onKey);
    });

    box.__getWorkspace = () => ({
      html: val(codeHtml),
      css: val(codeCss),
      js: val(codeJs),
      python: val(codePy)
    });
    box.__saveWorkspace = () => persistNow();

    run({ fromUser: false });
    box.dataset.ready = "1";
  });
}

export function mountLessonQuizzes(root = document) {
  root.querySelectorAll("[data-lesson-quiz]").forEach((quiz) => {
    if (quiz.dataset.ready === "1") return;
    const answer = (quiz.dataset.answer || "").toLowerCase();
    const feedback = quiz.querySelector(".lesson-quiz__feedback");
    quiz.querySelectorAll("[data-choice]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const choice = (btn.getAttribute("data-choice") || "").toLowerCase();
        const ok = choice === answer;
        quiz.querySelectorAll("[data-choice]").forEach((b) => {
          b.classList.remove("is-correct", "is-wrong");
          b.disabled = true;
        });
        btn.classList.add(ok ? "is-correct" : "is-wrong");
        if (feedback) {
          feedback.textContent = ok
            ? "¡Correcto!"
            : "No del todo. Revisa la explicación e inténtalo de nuevo mentalmente.";
          feedback.className = "lesson-quiz__feedback " + (ok ? "is-ok" : "is-bad");
        }
      });
    });
    quiz.dataset.ready = "1";
  });
}

export function mountLessonExams(root = document) {
  root.querySelectorAll("[data-lesson-exam]").forEach((exam) => {
    if (exam.dataset.ready === "1") return;
    const pass = Number(exam.dataset.pass || 70);
    const result = exam.querySelector(".lesson-exam__result");
    const btnGrade = exam.querySelector(".lesson-exam__grade");
    const questions = Array.from(exam.querySelectorAll("[data-exam-q]"));

    questions.forEach((q) => {
      q.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.addEventListener("click", () => {
          q.querySelectorAll("[data-choice]").forEach((b) => b.classList.remove("is-selected"));
          btn.classList.add("is-selected");
          q.dataset.selected = (btn.getAttribute("data-choice") || "").toLowerCase();
        });
      });
    });

    function grade() {
      let ok = 0;
      questions.forEach((q) => {
        const answer = (q.dataset.answer || "").toLowerCase();
        const selected = (q.dataset.selected || "").toLowerCase();
        if (selected && selected === answer) ok += 1;
        q.querySelectorAll("[data-choice]").forEach((b) => {
          const c = (b.getAttribute("data-choice") || "").toLowerCase();
          b.classList.remove("is-correct", "is-wrong", "is-selected");
          if (c === answer) b.classList.add("is-correct");
          else if (c === selected && selected !== answer) b.classList.add("is-wrong");
          b.disabled = true;
        });
      });
      const total = questions.length || 1;
      const pct = Math.round((ok / total) * 100);
      const passed = pct >= pass;
      if (result) {
        result.textContent = passed
          ? `Aprobaste: ${ok}/${total} (${pct}%). Ya puedes continuar.`
          : `Obtuviste ${ok}/${total} (${pct}%). Necesitas al menos ${pass}%. Revisa y recarga para reintentar.`;
        result.className = "lesson-exam__result " + (passed ? "is-ok" : "is-bad");
      }
      exam.dataset.passed = passed ? "1" : "0";
      const completeBtn = document.getElementById("btn-complete");
      if (completeBtn) {
        completeBtn.disabled = !passed;
        completeBtn.textContent = passed
          ? "Marcar como completada y continuar"
          : "Aprueba el examen para continuar";
      }
    }

    if (btnGrade) btnGrade.addEventListener("click", grade);
    const completeBtn = document.getElementById("btn-complete");
    if (completeBtn) {
      completeBtn.disabled = true;
      completeBtn.textContent = "Aprueba el examen para continuar";
    }
    exam.dataset.ready = "1";
  });
}

export async function initLessonInteractives(root = document) {
  const miniOk = await evaluateAccess("mini");
  if (!miniOk.ok) {
    root.querySelectorAll("[data-lesson-mini]").forEach((box) => {
      box.innerHTML = `<div class="lesson-callout"><strong>${miniOk.title || "Mini editor no disponible"}</strong><p>${miniOk.message || ""}</p></div>`;
    });
  } else {
    mountLessonMinis(root);
  }
  mountLessonQuizzes(root);
  mountLessonExams(root);
}

export function persistAllWorkspaces(root = document) {
  root.querySelectorAll("[data-lesson-mini]").forEach((box) => {
    if (typeof box.__saveWorkspace === "function") box.__saveWorkspace();
  });
}
