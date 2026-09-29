import "./styles.css";

type BusinessType = "local" | "ecommerce" | "saas" | "other";
type Goal = "ads" | "payments" | "both" | "clarity";
type AnswerMap = Record<string, string>;

type QuizOption = {
  value: string;
  label: string;
  note: string;
};

type QuizQuestion = {
  id: string;
  eyebrow: string;
  title: string;
  help: string;
  options: QuizOption[];
};

const questions: QuizQuestion[] = [
  {
    id: "business",
    eyebrow: "First, your model",
    title: "What kind of business are you building?",
    help: "Choose the closest match. Your result will adapt to this answer.",
    options: [
      { value: "local", label: "Local business", note: "Services, appointments, packages or memberships" },
      { value: "ecommerce", label: "Ecommerce brand", note: "One-time products, bundles or repeat buyers" },
      { value: "saas", label: "SaaS or software", note: "Subscriptions, usage access or a platform" },
      { value: "other", label: "Creator or other", note: "Community, education, agency or a hybrid model" },
    ],
  },
  {
    id: "goal",
    eyebrow: "Your first priority",
    title: "What do you need Whop to solve first?",
    help: "There is no wrong answer. This sets the order of your setup plan.",
    options: [
      { value: "ads", label: "Find more customers", note: "Launch and measure paid acquisition" },
      { value: "payments", label: "Get paid more cleanly", note: "Checkout, billing, payouts or subscriptions" },
      { value: "both", label: "Connect ads and payments", note: "Build one measurable revenue loop" },
      { value: "clarity", label: "I am not sure yet", note: "Diagnose the best first move" },
    ],
  },
  {
    id: "stage",
    eyebrow: "Your current traction",
    title: "How are customers paying you today?",
    help: "This helps separate a fresh launch from a migration or optimization project.",
    options: [
      { value: "none", label: "Not selling yet", note: "I am still shaping the offer" },
      { value: "manual", label: "Mostly manual", note: "Invoices, DMs, calls or bank transfers" },
      { value: "online", label: "Online checkout is live", note: "I already take one-time or recurring payments" },
      { value: "scale", label: "At meaningful scale", note: "I need stronger attribution, payouts or reliability" },
    ],
  },
  {
    id: "timeline",
    eyebrow: "Timing",
    title: "When do you want the first version live?",
    help: "A realistic timeline makes the recommendation more useful.",
    options: [
      { value: "now", label: "As soon as possible", note: "I can make decisions this week" },
      { value: "month", label: "Within 30 days", note: "I want a guided setup sprint" },
      { value: "quarter", label: "This quarter", note: "I am planning a controlled rollout" },
      { value: "research", label: "I am only researching", note: "I want the right architecture first" },
    ],
  },
  {
    id: "support",
    eyebrow: "How Lucas can help",
    title: "What kind of support would move you fastest?",
    help: "Your result will show the most useful setup path, not a generic score.",
    options: [
      { value: "done-with", label: "Build it with me", note: "Hands-on decisions and implementation support" },
      { value: "audit", label: "Audit what I have", note: "Find leaks in checkout, tracking and campaign structure" },
      { value: "roadmap", label: "Give me the roadmap", note: "A prioritized plan my team can execute" },
      { value: "learn", label: "Show me what is possible", note: "A clear, low-pressure starting point" },
    ],
  },
];

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing required element: ${selector}`);
  return element;
}

const dialog = requireElement<HTMLDialogElement>("#quiz-dialog");
const quizBody = requireElement<HTMLElement>("#quiz-body");
const progressBar = requireElement<HTMLElement>("#quiz-progress-bar");
const progressText = requireElement<HTMLElement>("#quiz-progress-text");
const backButton = requireElement<HTMLButtonElement>("#quiz-back");
const nextButton = requireElement<HTMLButtonElement>("#quiz-next");
const closeButton = requireElement<HTMLButtonElement>("#quiz-close");
const floatingCta = document.querySelector<HTMLElement>("#floating-cta");

let step = 0;
let answers: AnswerMap = {};
let lastTrigger: HTMLElement | null = null;
let completed = false;

function labelFor(questionId: string): string {
  const question = questions.find((item) => item.id === questionId);
  const answer = answers[questionId];
  return question?.options.find((option) => option.value === answer)?.label ?? "Not answered";
}

function resultFor(type: BusinessType, goal: Goal) {
  const paths: Record<BusinessType, { title: string; foundation: string; firstMove: string }> = {
    local: {
      title: "A local demand-to-deposit setup",
      foundation: "Start with a simple checkout link for deposits, packages or memberships, then connect campaign tracking to the payment event.",
      firstMove: "Lucas should map one high-intent offer, one conversion page and one compliant local campaign before adding complexity.",
    },
    ecommerce: {
      title: "A checkout-and-acquisition growth loop",
      foundation: "Start with the offer, checkout experience and attribution path, then use paid traffic and affiliate distribution around the highest-converting product.",
      firstMove: "Lucas should audit payment friction, campaign signals and your first repeatable acquisition angle before scaling spend.",
    },
    saas: {
      title: "A subscription and attribution foundation",
      foundation: "Start with recurring or one-time checkout, lifecycle webhooks and the events your product needs, then feed paid-acquisition conversions back into measurement.",
      firstMove: "Lucas should map plans, access rules, failed-payment recovery and the minimum tracking events before launch.",
    },
    other: {
      title: "A focused Whop launch plan",
      foundation: "Start with the smallest offer customers can understand and buy, then connect checkout, delivery and the first measurable acquisition channel.",
      firstMove: "Lucas should diagnose the business model first, then choose only the Whop components that remove the biggest constraint.",
    },
  };

  const focus: Record<Goal, string> = {
    ads: "Priority: acquisition. Build the tracking and offer foundation before increasing ad spend.",
    payments: "Priority: payments. Make checkout and billing reliable before adding more traffic.",
    both: "Priority: the full loop. Connect the ad click, checkout event and revenue feedback from day one.",
    clarity: "Priority: diagnosis. Validate the offer and customer journey before selecting tools.",
  };

  return { ...paths[type], focus: focus[goal] };
}

function renderQuestion() {
  completed = false;
  const question = questions[step];
  if (!question) return;

  const selected = answers[question.id];
  quizBody.innerHTML = `
    <div class="quiz-question" aria-labelledby="quiz-question-title">
      <p class="quiz-eyebrow">${question.eyebrow}</p>
      <h2 id="quiz-question-title">${question.title}</h2>
      <p class="quiz-help">${question.help}</p>
      <fieldset class="quiz-options">
        <legend class="sr-only">${question.title}</legend>
        ${question.options
          .map(
            (option) => `
              <label class="quiz-option${selected === option.value ? " is-selected" : ""}">
                <input type="radio" name="${question.id}" value="${option.value}" ${selected === option.value ? "checked" : ""} />
                <span class="quiz-option__mark" aria-hidden="true"></span>
                <span><strong>${option.label}</strong><small>${option.note}</small></span>
              </label>
            `,
          )
          .join("")}
      </fieldset>
      <p class="quiz-error" id="quiz-error" aria-live="polite"></p>
    </div>
  `;

  const percent = ((step + 1) / questions.length) * 100;
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `Question ${step + 1} of ${questions.length}`;
  backButton.hidden = step === 0;
  nextButton.hidden = false;
  nextButton.textContent = step === questions.length - 1 ? "See my result" : "Continue";

  quizBody.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", () => {
      answers[question.id] = input.value;
      quizBody.querySelectorAll(".quiz-option").forEach((option) => option.classList.remove("is-selected"));
      input.closest(".quiz-option")?.classList.add("is-selected");
      const error = quizBody.querySelector<HTMLElement>("#quiz-error");
      if (error) error.textContent = "";
      nextButton.disabled = false;
    });
  });

  nextButton.disabled = !selected;
  requestAnimationFrame(() => quizBody.querySelector<HTMLElement>("input:checked, input")?.focus());
}

function renderResult() {
  completed = true;
  const result = resultFor((answers.business || "other") as BusinessType, (answers.goal || "clarity") as Goal);
  progressBar.style.width = "100%";
  progressText.textContent = "Your Whop setup path";
  backButton.hidden = false;
  nextButton.hidden = true;

  quizBody.innerHTML = `
    <div class="quiz-result" aria-labelledby="quiz-result-title">
      <span class="result-badge">Likely fit</span>
      <p class="quiz-eyebrow">Your recommended path</p>
      <h2 id="quiz-result-title">${result.title}</h2>
      <p class="result-lead">${result.foundation}</p>
      <div class="result-plan">
        <span>01</span><p><strong>First move</strong>${result.firstMove}</p>
        <span>02</span><p><strong>System focus</strong>${result.focus}</p>
        <span>03</span><p><strong>Support mode</strong>${labelFor("support")} · ${labelFor("timeline")}</p>
      </div>
      <p class="result-note">This is an initial direction, not a promise of results. Lucas’s setup process starts by validating your offer, category eligibility and current stack.</p>
      <div class="result-actions">
        <button type="button" class="quiz-cta" id="copy-result">Copy my setup summary <span aria-hidden="true">↗</span></button>
        <button type="button" class="text-button" id="restart-quiz">Retake quiz</button>
      </div>
      <p class="copy-status" id="copy-status" aria-live="polite"></p>
    </div>
  `;

  document.querySelector<HTMLButtonElement>("#restart-quiz")?.addEventListener("click", () => {
    answers = {};
    step = 0;
    renderQuestion();
  });

  document.querySelector<HTMLButtonElement>("#copy-result")?.addEventListener("click", async () => {
    const summary = [
      `Whop setup recommendation: ${result.title}`,
      `Business: ${labelFor("business")}`,
      `Priority: ${labelFor("goal")}`,
      `Current setup: ${labelFor("stage")}`,
      `Timeline: ${labelFor("timeline")}`,
      `Support: ${labelFor("support")}`,
      `First move: ${result.firstMove}`,
    ].join("\n");
    const status = document.querySelector<HTMLElement>("#copy-status");
    try {
      await navigator.clipboard.writeText(summary);
      if (status) status.textContent = "Copied. Keep this summary for your setup conversation with Lucas.";
    } catch {
      if (status) status.textContent = "Copy is unavailable in this browser. Select the result text above to save it.";
    }
  });

  requestAnimationFrame(() => document.querySelector<HTMLButtonElement>("#copy-result")?.focus());
}

function openQuiz(trigger: HTMLElement) {
  lastTrigger = trigger;
  step = 0;
  answers = {};
  renderQuestion();
  dialog.showModal();
  document.body.classList.add("dialog-open");
}

function closeQuiz() {
  dialog.close();
}

document.querySelectorAll<HTMLElement>(".js-open-quiz").forEach((button) => {
  button.addEventListener("click", () => openQuiz(button));
});

closeButton.addEventListener("click", closeQuiz);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeQuiz();
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  lastTrigger?.focus();
});

backButton.addEventListener("click", () => {
  if (completed) {
    completed = false;
    step = questions.length - 1;
  } else if (step > 0) {
    step -= 1;
  }
  renderQuestion();
});

nextButton.addEventListener("click", () => {
  const question = questions[step];
  if (!question || !answers[question.id]) {
    const error = quizBody.querySelector<HTMLElement>("#quiz-error");
    if (error) error.textContent = "Choose one answer to continue.";
    quizBody.querySelector<HTMLElement>("input")?.focus();
    return;
  }
  if (step < questions.length - 1) {
    step += 1;
    renderQuestion();
  } else {
    renderResult();
  }
});

const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(index));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let target = index;
    if (event.key === "ArrowLeft") target = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") target = (index + 1) % tabs.length;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = tabs.length - 1;
    activateTab(target);
    tabs[target]?.focus();
  });
});

function activateTab(index: number) {
  tabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panelId = tab.getAttribute("aria-controls");
    if (panelId) document.getElementById(panelId)?.toggleAttribute("hidden", !selected);
  });
}

let ticking = false;
function updateFloatingCta() {
  floatingCta?.classList.toggle("is-visible", window.scrollY > 760 && !dialog.open);
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateFloatingCta);
    ticking = true;
  }
}, { passive: true });
updateFloatingCta();
