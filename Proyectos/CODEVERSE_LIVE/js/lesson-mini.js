// CODEVERSE — Interactivos de lección: mini editor HTML/CSS, quiz, examen, workspace
// MultiSoftCreations

function workspaceKey(courseId) {
  return "codeverse_workspace_" + (courseId || "default");
}

export function loadCourseWorkspace(courseId) {
  try {
    const raw = localStorage.getItem(workspaceKey(courseId));
    if (!raw) return { html: "", css: "" };
    const data = JSON.parse(raw);
    return {
      html: typeof data.html === "string" ? data.html : "",
      css: typeof data.css === "string" ? data.css : ""
    };
  } catch {
    return { html: "", css: "" };
  }
}

export function saveCourseWorkspace(courseId, html, css) {
  const payload = {
    html: html || "",
    css: css || "",
    updatedAt: new Date().toISOString()
  };
  try {
    localStorage.setItem(workspaceKey(courseId), JSON.stringify(payload));
  } catch (err) {
    console.warn("[CODEVERSE] No se pudo guardar workspace del curso", err);
  }
  return payload;
}

/**
 * Mini editor.
 * data-lesson-mini
 * data-mode="html" | "html-css"  (default html)
 * data-course="css"
 * data-starter-html="..." (opcional; si hay workspace se prefiere el guardado salvo data-force-starter="1")
 * data-starter-css="" 
 * data-persist="1" guarda al ejecutar y expone API
 */
export function mountLessonMinis(root = document) {
  const nodes = root.querySelectorAll("[data-lesson-mini]");
  nodes.forEach((box) => {
    if (box.dataset.ready === "1") return;

    const mode = (box.dataset.mode || "html").toLowerCase();
    const courseId = box.dataset.course || "";
    const forceStarter = box.dataset.forceStarter === "1";
    const persist = box.dataset.persist !== "0";

    let code = box.querySelector(".lesson-mini__code");
    let codeCss = box.querySelector(".lesson-mini__code-css");
    const frame = box.querySelector(".lesson-mini__preview");
    const btnRun = box.querySelector(".lesson-mini__run");
    const btnReset = box.querySelector(".lesson-mini__reset");
    const tabs = box.querySelectorAll("[data-mini-tab]");

    // Starters from textarea initial values
    const starterHtml = (box.dataset.starterHtml != null)
      ? box.dataset.starterHtml
      : (code ? code.value : "");
    const starterCss = (box.dataset.starterCss != null)
      ? box.dataset.starterCss
      : (codeCss ? codeCss.value : "");

    // Workspace progresivo: si ya hay trabajo guardado, NO pisarlo con la plantilla
    // (data-force-starter solo aplica la primera vez, cuando el workspace está vacío)
    let skipPersistOnLoad = false;
    if (courseId && mode === "html-css") {
      const ws = loadCourseWorkspace(courseId);
      const hasWorkspace = !!(ws.html || ws.css);
      const applyForce = forceStarter && !hasWorkspace;
      if (!applyForce && hasWorkspace) {
        if (code) code.value = ws.html || starterHtml || code.value;
        if (codeCss) codeCss.value = ws.css || "";
      } else {
        if (code) code.value = starterHtml || code.value || "";
        if (codeCss) codeCss.value = starterCss || "";
        // Primera visita con plantilla: no guardar el CSS vacío sobre un futuro trabajo
        skipPersistOnLoad = true;
      }
    } else {
      if (code && starterHtml && !code.value) code.value = starterHtml;
      if (codeCss) codeCss.value = starterCss;
    }

    // Tabs HTML / CSS
    if (tabs.length && code && codeCss) {
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const which = tab.getAttribute("data-mini-tab");
          tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
          code.hidden = which !== "html";
          codeCss.hidden = which !== "css";
        });
      });
      // default HTML tab
      code.hidden = false;
      codeCss.hidden = true;
    }

    function currentHtml() {
      return code ? code.value : "";
    }
    function currentCss() {
      return codeCss ? codeCss.value : "";
    }

    function run(opts) {
      const fromUser = !!(opts && opts.fromUser);
      if (!frame) return;
      const html = currentHtml();
      const css = currentCss();
      if (mode === "html-css") {
        let doc = html;
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
        frame.srcdoc = html;
      }
      // Solo persistir por acción del usuario (Ejecutar / atajo / reiniciar),
      // no al cargar la página (evita borrar workspace al repasar plantillas)
      if (persist && courseId && mode === "html-css" && fromUser) {
        saveCourseWorkspace(courseId, currentHtml(), currentCss());
      }
    }

    if (btnRun) btnRun.addEventListener("click", () => run({ fromUser: true }));
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (code) code.value = starterHtml;
        if (codeCss) codeCss.value = starterCss;
        run({ fromUser: true });
      });
    }

    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        run({ fromUser: true });
      }
    };
    if (code) code.addEventListener("keydown", onKey);
    if (codeCss) codeCss.addEventListener("keydown", onKey);

    box.__getWorkspace = () => ({ html: currentHtml(), css: currentCss() });
    box.__saveWorkspace = () => {
      if (courseId) saveCourseWorkspace(courseId, currentHtml(), currentCss());
    };

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
        quiz.dataset.answered = ok ? "1" : "0";
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
        const correct = selected && selected === answer;
        if (correct) ok += 1;
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

export function initLessonInteractives(root = document) {
  mountLessonMinis(root);
  mountLessonQuizzes(root);
  mountLessonExams(root);
}

/** Guarda todos los mini-editores persistentes del documento */
export function persistAllWorkspaces(root = document) {
  root.querySelectorAll("[data-lesson-mini]").forEach((box) => {
    if (typeof box.__saveWorkspace === "function") box.__saveWorkspace();
  });
}
