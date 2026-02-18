const ASSESSMENT_MINUTES = 30;
const RESULTS_STORAGE_KEY = "restaurant_gma_results";
const EMAIL_CONFIG_STORAGE_KEY = "restaurant_gma_email_config";

const SECTION_WEIGHTS = {
  Numerical: 0.3,
  Verbal: 0.3,
  Logical: 0.4
};

const COMPETENCY_META = {
  fb: { label: "F&B Knowledge", weight: 0.25, minRatio: 0.5 },
  systems: { label: "Systems Design", weight: 0.45, minRatio: 0.6 },
  execution: { label: "Execution Ownership", weight: 0.3, minRatio: 0.5 }
};

const PASS_MODEL = {
  label: "Management (F&B Systems)",
  rawPass: 15,
  weightedPass: 70
};

const QUESTIONS = [
  { id: 1, section: "Numerical", competency: "fb", prompt: "Weekly sales were $28,000, food COGS was $8,400, and labor was $7,000. Prime cost % =", options: ["52%", "53%", "55%", "57%"], answer: "C" },
  { id: 2, section: "Numerical", competency: "fb", prompt: "An 80 lb fish order yields 60 lb usable product. Yield % =", options: ["70%", "75%", "80%", "85%"], answer: "B" },
  { id: 3, section: "Numerical", competency: "systems", prompt: "Five stations each save 6 minutes per hour after a workflow redesign. Over a 4-hour service, total minutes saved =", options: ["90", "100", "120", "140"], answer: "C" },
  { id: 4, section: "Numerical", competency: "fb", prompt: "A cocktail sells for $14 with a $3.50 ingredient cost. Beverage cost % =", options: ["20%", "25%", "30%", "35%"], answer: "B" },
  { id: 5, section: "Numerical", competency: "execution", prompt: "A project has three phases requiring 12, 18, and 10 hours. If one manager has 8 hours/week to dedicate, minimum weeks needed =", options: ["4", "4.5", "5", "6"], answer: "C" },
  { id: 6, section: "Numerical", competency: "fb", prompt: "Inventory variance improved from 6% to 3.5% on a $40,000 inventory base. Dollar improvement =", options: ["$800", "$1,000", "$1,200", "$1,400"], answer: "B" },
  { id: 7, section: "Numerical", competency: "execution", prompt: "Each close checklist takes 45 minutes. Six checklists must be completed tonight. Minimum combined labor hours =", options: ["4.0", "4.5", "5.0", "5.5"], answer: "B" },
  { id: 8, section: "Numerical", competency: "fb", prompt: "Average ticket time dropped from 14 to 11 minutes across 120 tickets after a line-system change. Total line-minutes saved =", options: ["180", "240", "300", "360"], answer: "D" },

  { id: 9, section: "Verbal", competency: "execution", prompt: "Choose the strongest project kickoff brief:", options: ["Fix onboarding soon.", "By May 30, reduce manager onboarding from 21 to 14 days; owner: Sam; weekly milestone reviews.", "Team should improve processes.", "We will figure it out as we go."], answer: "B" },
  { id: 10, section: "Verbal", competency: "fb", prompt: "Policy: discard any hot-held item below 135F for more than 4 hours. Soup was at 131F for 2.5 hours, then reheated to 165F. Based on policy:", options: ["Must discard", "Can keep", "Must cool first", "Cannot determine"], answer: "B" },
  { id: 11, section: "Verbal", competency: "systems", prompt: "Choose the strongest root-cause statement:", options: ["Team is lazy.", "Peak ticket times spike when expo calls are inconsistent and station setup is delayed.", "Everyone needs to try harder.", "Guests are impatient."], answer: "B" },
  { id: 12, section: "Verbal", competency: "systems", prompt: "After adding a pre-shift checklist, late opens dropped from 18% to 6%. Best inference:", options: ["The checklist likely improved opening reliability.", "Labor costs definitely increased.", "Sales likely doubled.", "Guest volume likely dropped."], answer: "A" },
  { id: 13, section: "Verbal", competency: "execution", prompt: "Choose the strongest status update:", options: ["Project is on track.", "Phase 1 complete; vendor delay risks week-3 target; mitigation: temporary supplier approved today.", "Need help maybe.", "Everything is hard right now."], answer: "B" },
  { id: 14, section: "Verbal", competency: "systems", prompt: "Best synonym for bottleneck:", options: ["reward", "shortcut", "constraint", "forecast"], answer: "C" },
  { id: 15, section: "Verbal", competency: "fb", prompt: "Menu mix shifted toward low-margin items while sales stayed flat. Best immediate action:", options: ["Cut staff on all shifts.", "Increase discounts on low-margin items.", "Rebalance promotions toward high-margin items and retrain upselling.", "Wait until month-end before acting."], answer: "C" },
  { id: 16, section: "Verbal", competency: "execution", prompt: "Best rewrite: The project plan that Jordan wrote it missed dependencies.", options: ["The project plan Jordan wrote missed dependencies.", "Jordan project plan wrote it missed dependencies.", "The plan was Jordan dependencies missed wrote.", "Jordan wrote it, the project plan dependencies missed."], answer: "A" },

  { id: 17, section: "Logical", competency: "systems", prompt: "Dependency order: define KPI before pilot, pilot before SOP rollout, SOP rollout before training. What must be second?", options: ["Define KPI", "Pilot", "SOP rollout", "Training"], answer: "B" },
  { id: 18, section: "Logical", competency: "execution", prompt: "Rule: if a project risk is flagged, a mitigation owner must be assigned within 24 hours. A risk was flagged and no owner assigned. What follows?", options: ["Rule followed", "Rule violated", "Risk was not real", "Cannot determine"], answer: "B" },
  { id: 19, section: "Logical", competency: "systems", prompt: "Odd one out:", options: ["Runbook", "SOP", "Post-mortem", "Ladle"], answer: "D" },
  { id: 20, section: "Logical", competency: "execution", prompt: "Constraint: Mia cannot close Thursday. Leo must close Thursday. Who closes Thursday?", options: ["Mia", "Leo", "Either one", "Neither"], answer: "B" },
  { id: 21, section: "Logical", competency: "fb", prompt: "All TCS cooling logs require timestamps. A chili cooling log has no timestamps. Conclusion:", options: ["Log is valid", "Log is noncompliant", "Only manager sign-off is missing", "Cannot determine"], answer: "B" },
  { id: 22, section: "Logical", competency: "systems", prompt: "If all projects with clear milestones finish on time, and Project Atlas finished on time, which must be true?", options: ["Atlas definitely had clear milestones", "Atlas may or may not have had clear milestones", "Atlas finished late", "Milestones are irrelevant"], answer: "B" },
  { id: 23, section: "Logical", competency: "systems", prompt: "Sequence: 3, 7, 13, 21, 31, ?", options: ["41", "42", "43", "44"], answer: "C" },
  { id: 24, section: "Logical", competency: "execution", prompt: "Rule: candidates must meet all three competency minimums. A candidate passes raw and weighted scores but misses Execution minimum. Decision:", options: ["Advance", "Do not advance", "Advance with referral", "Re-score only"], answer: "B" }
];

const state = {
  endAt: null,
  timerId: null,
  startedAt: null,
  currentResult: null,
  submitStatus: ""
};

const setupEl = document.querySelector("#setup");
const testEl = document.querySelector("#test");
const formEl = document.querySelector("#testForm");
const resultsEl = document.querySelector("#results");
const timerEl = document.querySelector("#timer");
const startBtn = document.querySelector("#startBtn");
const submitBtn = document.querySelector("#submitBtn");

startBtn.addEventListener("click", startTest);
submitBtn.addEventListener("click", () => submitTest(false));
resultsEl.addEventListener("click", handleResultsClick);
loadEmailConfig();

function startTest() {
  const name = valueOf("#candidateName");
  if (!name) {
    alert("Please enter candidate name.");
    return;
  }

  state.startedAt = Date.now();
  state.endAt = state.startedAt + ASSESSMENT_MINUTES * 60 * 1000;

  renderQuestions();
  setupEl.classList.add("hidden");
  testEl.classList.remove("hidden");
  resultsEl.classList.add("hidden");
  tick();
  state.timerId = setInterval(tick, 1000);
}

function renderQuestions() {
  formEl.innerHTML = "";
  const sections = ["Numerical", "Verbal", "Logical"];

  sections.forEach((section) => {
    const header = document.createElement("h3");
    header.textContent = section;
    formEl.appendChild(header);

    QUESTIONS.filter((q) => q.section === section).forEach((q) => {
      const wrapper = document.createElement("fieldset");
      wrapper.className = "question";

      const legend = document.createElement("p");
      legend.innerHTML = `<strong>${q.id}.</strong> ${q.prompt}`;
      wrapper.appendChild(legend);

      const choices = document.createElement("div");
      choices.className = "choices";

      q.options.forEach((opt, idx) => {
        const code = ["A", "B", "C", "D"][idx];
        const id = `q${q.id}_${code}`;
        const label = document.createElement("label");
        label.className = "choice";
        label.setAttribute("for", id);
        label.innerHTML = `<input id="${id}" type="radio" name="q${q.id}" value="${code}"> ${code}) ${opt}`;
        choices.appendChild(label);
      });

      wrapper.appendChild(choices);
      formEl.appendChild(wrapper);
    });
  });
}

function tick() {
  const msLeft = Math.max(0, state.endAt - Date.now());
  const totalSec = Math.floor(msLeft / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  timerEl.textContent = `${mm}:${ss}`;

  if (msLeft <= 0) {
    clearInterval(state.timerId);
    submitTest(true);
  }
}

async function submitTest(autoSubmitted) {
  clearInterval(state.timerId);
  const emailConfig = getEmailConfig();
  const answers = {};

  QUESTIONS.forEach((q) => {
    const checked = document.querySelector(`input[name=\"q${q.id}\"]:checked`);
    answers[q.id] = checked ? checked.value : "";
  });

  const score = scoreCandidate(answers);
  const payload = {
    candidateName: valueOf("#candidateName"),
    candidateEmail: valueOf("#candidateEmail"),
    resultsRecipient: valueOf("#resultsRecipient"),
    backendUrl: emailConfig.backendUrl,
    role: "management_systems",
    roleLabel: PASS_MODEL.label,
    submittedAt: new Date().toISOString(),
    durationMinutes: Math.round((Date.now() - state.startedAt) / 60000),
    autoSubmitted,
    answers,
    ...score
  };

  state.submitStatus = "";
  saveResult(payload);
  localStorage.setItem("restaurant_gma_last_result", JSON.stringify(payload));

  if (emailConfig.backendUrl) {
    const outcome = await sendResultToBackend(payload, emailConfig);
    state.submitStatus = outcome.ok
      ? "Auto-email sent by backend."
      : `Auto-email failed: ${outcome.error}`;
  }

  testEl.classList.add("hidden");
  renderResults(payload);
}

function scoreCandidate(answers) {
  let raw = 0;

  const sectionTotals = {
    Numerical: { correct: 0, total: 0 },
    Verbal: { correct: 0, total: 0 },
    Logical: { correct: 0, total: 0 }
  };

  const competencyTotals = {
    fb: { label: COMPETENCY_META.fb.label, correct: 0, total: 0 },
    systems: { label: COMPETENCY_META.systems.label, correct: 0, total: 0 },
    execution: { label: COMPETENCY_META.execution.label, correct: 0, total: 0 }
  };

  QUESTIONS.forEach((q) => {
    const isCorrect = answers[q.id] === q.answer;
    sectionTotals[q.section].total += 1;
    competencyTotals[q.competency].total += 1;

    if (isCorrect) {
      raw += 1;
      sectionTotals[q.section].correct += 1;
      competencyTotals[q.competency].correct += 1;
    }
  });

  let sectionWeightedScore = 0;
  Object.keys(sectionTotals).forEach((section) => {
    const ratio = sectionTotals[section].correct / sectionTotals[section].total;
    sectionWeightedScore += ratio * SECTION_WEIGHTS[section] * 100;
  });

  let competencyWeightedScore = 0;
  Object.keys(competencyTotals).forEach((key) => {
    const ratio = competencyTotals[key].correct / competencyTotals[key].total;
    competencyWeightedScore += ratio * COMPETENCY_META[key].weight * 100;
  });

  const competencyPass = Object.keys(competencyTotals).every((key) => {
    const ratio = competencyTotals[key].correct / competencyTotals[key].total;
    return ratio >= COMPETENCY_META[key].minRatio;
  });

  const weightedScore = Math.round((sectionWeightedScore * 0.4) + (competencyWeightedScore * 0.6));
  const pass = raw >= PASS_MODEL.rawPass && weightedScore >= PASS_MODEL.weightedPass && competencyPass;

  return {
    rawScore: raw,
    weightedScore,
    sectionWeightedScore: Math.round(sectionWeightedScore),
    competencyWeightedScore: Math.round(competencyWeightedScore),
    sectionTotals,
    competencyTotals,
    competencyPass,
    pass
  };
}

function renderResults(result) {
  state.currentResult = result;
  resultsEl.classList.remove("hidden");

  const recommendation = result.pass ? "Advance to structured interview" : "Do not advance";
  const competencyFlag = result.competencyPass ? "All competency minimums met" : "One or more competency minimums missed";

  resultsEl.innerHTML = `
    <h2>Result Summary</h2>
    <p>
      <span class="kpi"><strong>Candidate:</strong> ${escapeHtml(result.candidateName)}</span>
      <span class="kpi"><strong>Track:</strong> ${escapeHtml(result.roleLabel)}</span>
      <span class="kpi"><strong>Raw:</strong> ${result.rawScore}/24</span>
      <span class="kpi"><strong>Weighted:</strong> ${result.weightedScore}/100</span>
    </p>
    <p>
      <span class="kpi"><strong>Recommendation:</strong> ${recommendation}</span>
      <span class="kpi"><strong>Competency Gate:</strong> ${competencyFlag}</span>
      <span class="kpi"><strong>Submitted:</strong> ${new Date(result.submittedAt).toLocaleString()}</span>
    </p>
    <table class="result-table">
      <thead><tr><th>Section</th><th>Correct</th><th>Total</th></tr></thead>
      <tbody>
        <tr><td>Numerical</td><td>${result.sectionTotals.Numerical.correct}</td><td>${result.sectionTotals.Numerical.total}</td></tr>
        <tr><td>Verbal</td><td>${result.sectionTotals.Verbal.correct}</td><td>${result.sectionTotals.Verbal.total}</td></tr>
        <tr><td>Logical</td><td>${result.sectionTotals.Logical.correct}</td><td>${result.sectionTotals.Logical.total}</td></tr>
      </tbody>
    </table>
    <table class="result-table">
      <thead><tr><th>Competency</th><th>Correct</th><th>Total</th><th>Minimum</th></tr></thead>
      <tbody>
        <tr><td>${COMPETENCY_META.fb.label}</td><td>${result.competencyTotals.fb.correct}</td><td>${result.competencyTotals.fb.total}</td><td>${Math.round(COMPETENCY_META.fb.minRatio * 100)}%</td></tr>
        <tr><td>${COMPETENCY_META.systems.label}</td><td>${result.competencyTotals.systems.correct}</td><td>${result.competencyTotals.systems.total}</td><td>${Math.round(COMPETENCY_META.systems.minRatio * 100)}%</td></tr>
        <tr><td>${COMPETENCY_META.execution.label}</td><td>${result.competencyTotals.execution.correct}</td><td>${result.competencyTotals.execution.total}</td><td>${Math.round(COMPETENCY_META.execution.minRatio * 100)}%</td></tr>
      </tbody>
    </table>
    <div class="actions">
      <button id="downloadCsvBtn" type="button">Download Results CSV</button>
      <button id="emailDraftBtn" type="button">Draft Email</button>
      <button id="feedbackBtn" type="button">Send Feedback</button>
    </div>
    ${state.submitStatus ? `<p class="small"><strong>Email Status:</strong> ${escapeHtml(state.submitStatus)}</p>` : ""}
    <p class="small">Copy data for ATS notes:</p>
    <pre>${escapeHtml(JSON.stringify(result, null, 2))}</pre>
  `;
}

async function handleResultsClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.id === "downloadCsvBtn") {
    downloadResultsCsv();
  }
  if (target.id === "emailDraftBtn" && state.currentResult) {
    openEmailDraft(state.currentResult);
  }
  if (target.id === "feedbackBtn" && state.currentResult) {
    await submitFeedback(state.currentResult);
  }
}

function saveResult(payload) {
  const existing = loadResults();
  existing.push(payload);
  localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(existing));
}

function loadResults() {
  try {
    const raw = localStorage.getItem(RESULTS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function downloadResultsCsv() {
  const rows = loadResults();
  if (!rows.length) {
    alert("No saved results yet.");
    return;
  }

  const header = [
    "candidate_name",
    "candidate_email",
    "results_recipient",
    "track",
    "raw_score",
    "weighted_score",
    "section_weighted_score",
    "competency_weighted_score",
    "competency_gate_pass",
    "pass",
    "numerical_correct",
    "verbal_correct",
    "logical_correct",
    "fb_correct",
    "systems_correct",
    "execution_correct",
    "duration_minutes",
    "submitted_at"
  ];

  const csvRows = [header.join(",")];
  rows.forEach((r) => {
    csvRows.push(toCsvRow([
      r.candidateName,
      r.candidateEmail,
      r.resultsRecipient || "",
      r.roleLabel,
      r.rawScore,
      r.weightedScore,
      r.sectionWeightedScore,
      r.competencyWeightedScore,
      r.competencyPass ? "Yes" : "No",
      r.pass ? "Yes" : "No",
      r.sectionTotals?.Numerical?.correct ?? "",
      r.sectionTotals?.Verbal?.correct ?? "",
      r.sectionTotals?.Logical?.correct ?? "",
      r.competencyTotals?.fb?.correct ?? "",
      r.competencyTotals?.systems?.correct ?? "",
      r.competencyTotals?.execution?.correct ?? "",
      r.durationMinutes,
      r.submittedAt
    ]));
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "management_systems_gma_results.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function toCsvRow(values) {
  return values
    .map((value) => {
      const safe = String(value ?? "").replace(/"/g, "\"\"");
      return `"${safe}"`;
    })
    .join(",");
}

function openEmailDraft(result) {
  const recipient = String(result.resultsRecipient || "").trim();
  const recommendation = result.pass ? "Advance to structured interview" : "Do not advance";
  const competencyGate = result.competencyPass ? "Met" : "Not met";

  const subject = `GMA Result - ${result.candidateName} - ${result.roleLabel}`;
  const body = [
    `Candidate: ${result.candidateName}`,
    `Candidate Email: ${result.candidateEmail || "N/A"}`,
    `Track: ${result.roleLabel}`,
    `Raw Score: ${result.rawScore}/24`,
    `Weighted Score: ${result.weightedScore}/100`,
    `Recommendation: ${recommendation}`,
    `Competency Gate: ${competencyGate}`,
    `Section Scores: Numerical ${result.sectionTotals.Numerical.correct}/8, Verbal ${result.sectionTotals.Verbal.correct}/8, Logical ${result.sectionTotals.Logical.correct}/8`,
    `Competency Scores: F&B ${result.competencyTotals.fb.correct}/8, Systems ${result.competencyTotals.systems.correct}/8, Execution ${result.competencyTotals.execution.correct}/8`,
    `Submitted At: ${new Date(result.submittedAt).toLocaleString()}`
  ].join("\n");

  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}

function getEmailConfig() {
  const config = {
    backendUrl: valueOf("#backendUrl"),
    apiKey: valueOf("#backendApiKey")
  };
  localStorage.setItem(EMAIL_CONFIG_STORAGE_KEY, JSON.stringify(config));
  return config;
}

function loadEmailConfig() {
  try {
    const raw = localStorage.getItem(EMAIL_CONFIG_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);

    const backendEl = document.querySelector("#backendUrl");
    const keyEl = document.querySelector("#backendApiKey");
    if (backendEl && parsed?.backendUrl) backendEl.value = parsed.backendUrl;
    if (keyEl && parsed?.apiKey) keyEl.value = parsed.apiKey;
  } catch {
    // Ignore malformed localStorage values.
  }
}

async function sendResultToBackend(payload, config) {
  try {
    const headers = { "Content-Type": "application/json" };
    if (config.apiKey) headers["x-api-key"] = config.apiKey;

    const response = await fetch(config.backendUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.ok === false) {
      return { ok: false, error: data?.error || `HTTP ${response.status}` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unknown network error" };
  }
}

function getFeedbackEndpoint(result) {
  const source = String(result.backendUrl || "").trim();
  if (!source) return "";
  return source.replace(/\/api\/results\/email\/?$/, "/api/feedback/email");
}

async function submitFeedback(result) {
  const comment = window.prompt("Enter beta feedback to send:");
  if (!comment || !comment.trim()) return;

  const endpoint = getFeedbackEndpoint(result);
  if (!endpoint) {
    alert("No backend URL set. Add Backend URL in setup first.");
    return;
  }

  const apiKey = valueOf("#backendApiKey");
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers["x-api-key"] = apiKey;

  const body = {
    candidateName: result.candidateName,
    candidateEmail: result.candidateEmail,
    roleLabel: result.roleLabel,
    submittedAt: result.submittedAt,
    feedback: comment.trim()
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.ok === false) {
      alert(`Feedback send failed: ${data?.error || `HTTP ${response.status}`}`);
      return;
    }
    alert("Feedback sent.");
  } catch (error) {
    alert(`Feedback send failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

function valueOf(selector) {
  const el = document.querySelector(selector);
  return el ? el.value.trim() : "";
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
