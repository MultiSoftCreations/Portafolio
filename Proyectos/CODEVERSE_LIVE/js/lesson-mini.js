// CODEVERSE — Mini editor HTML embebido en lecciones (solo código + vista previa)
// MultiSoftCreations

/**
 * Monta un mini-LIVE en un contenedor.
 * HTML esperado:
 * <div class="lesson-mini" data-lesson-mini>
 *   <textarea class="lesson-mini__code">...</textarea>
 *   <iframe class="lesson-mini__preview" sandbox="allow-scripts"></iframe>
 * </div>
 */
export function mountLessonMinis(root = document) {
  const nodes = root.querySelectorAll("[data-lesson-mini]");
  nodes.forEach((box) => {
    if (box.dataset.ready === "1") return;
    const code = box.querySelector(".lesson-mini__code");
    const frame = box.querySelector(".lesson-mini__preview");
    const btnRun = box.querySelector(".lesson-mini__run");
    const btnReset = box.querySelector(".lesson-mini__reset");
    if (!code || !frame) return;

    const initial = code.value;

    function run() {
      const html = code.value;
      // Documento aislado en iframe
      frame.srcdoc = html;
    }

    if (btnRun) btnRun.addEventListener("click", run);
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        code.value = initial;
        run();
      });
    }
    code.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        run();
      }
    });

    run();
    box.dataset.ready = "1";
  });
}

/**
 * Monta quizzes simples:
 * <div data-lesson-quiz data-answer="b">
 *   <button data-choice="a">...</button>
 * </div>
 */
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
            : "No del todo. Revisa la explicación de arriba e inténtalo mentalmente otra vez.";
          feedback.className = "lesson-quiz__feedback " + (ok ? "is-ok" : "is-bad");
        }
      });
    });
    quiz.dataset.ready = "1";
  });
}

export function initLessonInteractives(root = document) {
  mountLessonMinis(root);
  mountLessonQuizzes(root);
}
