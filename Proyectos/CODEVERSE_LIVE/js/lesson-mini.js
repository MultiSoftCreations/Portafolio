// CODEVERSE — Interactivos de lección: mini editor, quiz, examen
// MultiSoftCreations

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
      frame.srcdoc = code.value;
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

/**
 * Examen multi-pregunta.
 * Contenedor: [data-lesson-exam data-pass="70"]
 * Cada pregunta: [data-exam-q data-answer="b"]
 * Resultado: .lesson-exam__result
 * Habilita #btn-complete solo si aprueba.
 */
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
          q.querySelectorAll("[data-choice]").forEach((b) => {
            b.classList.remove("is-selected");
          });
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
          : `Obtuviste ${ok}/${total} (${pct}%). Necesitas al menos ${pass}% para continuar. Revisa el tema y reintenta recargando la página.`;
        result.className = "lesson-exam__result " + (passed ? "is-ok" : "is-bad");
      }
      exam.dataset.passed = passed ? "1" : "0";
      const completeBtn = document.getElementById("btn-complete");
      if (completeBtn) {
        completeBtn.disabled = !passed;
        if (passed) completeBtn.textContent = "Marcar como completada y continuar";
        else completeBtn.textContent = "Aprueba el examen para continuar";
      }
    }

    if (btnGrade) btnGrade.addEventListener("click", grade);

    // Por defecto bloquear completar hasta aprobar
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
