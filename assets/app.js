const SCORING_RULES = {
  E_A: [3, 7, 10, 19, 23, 32, 62, 74, 79, 81, 83],
  I_B: [13, 16, 26, 38, 42, 57, 68, 77, 85, 91],
  S_A: [2, 9, 25, 30, 34, 39, 50, 52, 54, 60, 63, 73, 92],
  N_B: [5, 11, 18, 22, 27, 44, 46, 48, 65, 67, 69, 71, 82],
  T_A: [31, 33, 35, 43, 45, 47, 49, 56, 58, 61, 66, 75, 87],
  F_B: [6, 15, 21, 29, 37, 40, 51, 53, 70, 72, 89],
  J_A: [1, 4, 12, 14, 20, 28, 36, 41, 64, 76, 86],
  P_B: [8, 17, 24, 55, 59, 78, 80, 84, 88, 90, 93],
};

const DIMENSIONS = {
  IE: { name: "能量来源", left: "E", right: "I", leftName: "外向", rightName: "内向", total: 21 },
  SN: { name: "信息获取", left: "S", right: "N", leftName: "感觉", rightName: "直觉", total: 26 },
  TF: { name: "决策方式", left: "T", right: "F", leftName: "思考", rightName: "情感", total: 24 },
  JP: { name: "生活态度", left: "J", right: "P", leftName: "判断", rightName: "知觉", total: 22 },
};

const PAGE_SIZE = 10;
const STORAGE_KEY = "mbtiResearchStaticAnswers";
const TYPE_ORDER = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];

let page = 1;
let answers = loadAnswers();
let questions = [];
let profiles = {};

const form = document.getElementById("test-form");
const progressFill = document.getElementById("progress-fill");
const answeredCount = document.getElementById("answered-count");
const totalCount = document.getElementById("total-count");
const pageIndicator = document.getElementById("page-indicator");
const pageIndicatorBottom = document.getElementById("page-indicator-bottom");
const prevPage = document.getElementById("prev-page");
const nextPage = document.getElementById("next-page");
const prevPageBottom = document.getElementById("prev-page-bottom");
const nextPageBottom = document.getElementById("next-page-bottom");
const resultSection = document.getElementById("result");
const typeGrid = document.getElementById("type-grid");

document.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    const [questionResp, profileResp] = await Promise.all([
      fetch("data/questions.json"),
      fetch("data/profiles.json"),
    ]);
    questions = await questionResp.json();
    profiles = await profileResp.json();
  } catch (error) {
    form.innerHTML = "<p>数据加载失败。请通过 GitHub Pages 或本地静态服务器访问本目录。</p>";
    return;
  }

  totalCount.textContent = questions.length;
  bindActions();
  renderQuestions();
  renderTypeGrid();
  renderSharedResultFromUrl();
}

function bindActions() {
  [prevPage, prevPageBottom].forEach((btn) => btn.addEventListener("click", () => goPage(page - 1)));
  [nextPage, nextPageBottom].forEach((btn) => btn.addEventListener("click", () => goPage(page + 1)));
  document.getElementById("reset-page").addEventListener("click", resetCurrentPage);
  document.getElementById("submit-test").addEventListener("click", submitTest);
  document.querySelectorAll("[data-action='scroll-about']").forEach((btn) => btn.addEventListener("click", () => scrollToId("about")));
  document.querySelectorAll("[data-action='scroll-test']").forEach((btn) => btn.addEventListener("click", () => scrollToId("test")));
  document.querySelectorAll("[data-action='scroll-types']").forEach((btn) => btn.addEventListener("click", () => scrollToId("types")));
  document.querySelector("[data-action='reset-all']").addEventListener("click", resetAll);
}

function loadAnswers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAnswers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}

function renderQuestions() {
  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  page = Math.min(Math.max(page, 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  form.innerHTML = questions.slice(start, start + PAGE_SIZE).map(questionTemplate).join("");
  form.querySelectorAll(".option-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.questionId;
      answers[id] = card.dataset.value;
      saveAnswers();
      updateSelectedCards(id);
      updateProgress();
    });
  });
  const pageText = `第 ${page} / ${totalPages} 页`;
  pageIndicator.textContent = pageText;
  pageIndicatorBottom.textContent = pageText;
  [prevPage, prevPageBottom].forEach((btn) => { btn.disabled = page === 1; });
  [nextPage, nextPageBottom].forEach((btn) => { btn.disabled = page === totalPages; });
  updateProgress();
}

function questionTemplate(q) {
  const current = answers[q.id];
  return `<article class="question-card" data-q="${q.id}">
    <div class="question-top">
      <span class="question-number">${q.id}</span>
      <h3 class="question-title">${escapeHtml(q.question)}</h3>
    </div>
    <div class="option-grid">
      ${optionTemplate(q.id, "1", "A", q.optionA, current === "1")}
      ${optionTemplate(q.id, "2", "B", q.optionB, current === "2")}
    </div>
  </article>`;
}

function optionTemplate(id, value, letter, text, selected) {
  return `<label class="option-card${selected ? " selected" : ""}" data-question-id="${id}" data-value="${value}">
    <input type="radio" name="q_${id}" value="${value}" ${selected ? "checked" : ""}>
    <span class="option-letter">${letter}</span>
    <span class="option-text">${escapeHtml(text)}</span>
  </label>`;
}

function updateSelectedCards(questionId) {
  document.querySelectorAll(`[data-question-id="${questionId}"]`).forEach((card) => {
    const selected = answers[questionId] === card.dataset.value;
    card.classList.toggle("selected", selected);
    const input = card.querySelector("input");
    if (input) input.checked = selected;
  });
}

function updateProgress() {
  const done = Object.keys(answers).filter((id) => answers[id]).length;
  answeredCount.textContent = done;
  progressFill.style.width = `${Math.round((done / questions.length) * 100)}%`;
}

function goPage(next) {
  page = next;
  renderQuestions();
  scrollToId("test");
}

function resetCurrentPage() {
  const start = (page - 1) * PAGE_SIZE;
  questions.slice(start, start + PAGE_SIZE).forEach((q) => delete answers[q.id]);
  saveAnswers();
  renderQuestions();
  showToast("已清空本页答案");
}

function resetAll() {
  answers = {};
  saveAnswers();
  page = 1;
  renderQuestions();
  resultSection.classList.add("hidden");
  showToast("已清空全部答题进度");
}

function submitTest() {
  const missing = questions.filter((q) => !answers[q.id]).map((q) => q.id);
  const answered = questions.length - missing.length;
  if (!answered) {
    showToast("请至少完成 1 道题后再查看结果");
    return;
  }
  const result = calculateResult();
  if (missing.length) {
    showToast(`已基于 ${answered} 道题生成临时结果，答得越多越准确`);
  }
  renderResult(result);
  scrollToId("result");
}

function calculateResult() {
  const scored = {
    IE: scoreDimension(SCORING_RULES.E_A, SCORING_RULES.I_B),
    SN: scoreDimension(SCORING_RULES.S_A, SCORING_RULES.N_B),
    TF: scoreDimension(SCORING_RULES.T_A, SCORING_RULES.F_B),
    JP: scoreDimension(SCORING_RULES.J_A, SCORING_RULES.P_B),
  };

  const dims = {
    IE: { E: scored.IE.left, I: scored.IE.right, answered: scored.IE.answered },
    SN: { S: scored.SN.left, N: scored.SN.right, answered: scored.SN.answered },
    TF: { T: scored.TF.left, F: scored.TF.right, answered: scored.TF.answered },
    JP: { J: scored.JP.left, P: scored.JP.right, answered: scored.JP.answered },
  };
  const code = `${pickType(dims.IE, "E", "I")}${pickType(dims.SN, "S", "N")}${pickType(dims.TF, "T", "F")}${pickType(dims.JP, "J", "P")}`;
  const answeredCount = Object.keys(answers).filter((id) => answers[id]).length;
  return {
    code,
    dims,
    profile: profiles[code] || {},
    answeredCount,
    totalCount: questions.length,
    completeness: Math.round((answeredCount / questions.length) * 100),
  };
}

function scoreDimension(leftARules, rightBRules) {
  const output = { left: 0, right: 0, answered: 0 };
  for (const q of leftARules) {
    if (!answers[q]) continue;
    output.answered += 1;
    answers[q] === "1" ? output.left += 1 : output.right += 1;
  }
  for (const q of rightBRules) {
    if (!answers[q]) continue;
    output.answered += 1;
    answers[q] === "2" ? output.left += 1 : output.right += 1;
  }
  return output;
}

function pickType(dims, left, right) {
  if (dims[left] === dims[right]) return right;
  return dims[left] > dims[right] ? left : right;
}

function renderResult(result) {
  const p = result.profile;
  const shareUrl = buildShareUrl(result);
  const reliabilityLabel = result.completeness === 100 ? "完整结果" : "临时结果";
  const reliabilityText = result.completeness === 100
    ? "你已经完成全部题目，结果完整度较高。"
    : `当前完成 ${result.answeredCount}/${result.totalCount} 题。结果可先用于参考，继续答题会提升稳定性。`;
  resultSection.classList.remove("hidden");
  resultSection.innerHTML = `<div class="result-hero">
      <p class="eyebrow" style="color:white;opacity:.85">你的科研协作画像是</p>
      <div class="result-code">${result.code}</div>
      <div class="result-name">${escapeHtml(p.name || "待补充画像")}</div>
      <div class="result-badge">${reliabilityLabel} · 完整度 ${result.completeness}%</div>
    </div>
    <div class="result-notice">${escapeHtml(reliabilityText)}</div>
    <div class="result-grid">
      <div class="result-card"><h3>科研画像概述</h3><p>${escapeHtml(p.description || "暂无详细描述。")}</p></div>
      <div class="result-card"><h3>协作优势</h3><p>${escapeHtml(p.strengths || "暂无详细描述。")}</p></div>
      <div class="result-card"><h3>成长建议</h3><p>${escapeHtml(p.growth || "暂无详细描述。")}</p></div>
      <div class="result-card"><h3>科研角色建议</h3><p>${escapeHtml(p.career_suggestions || "暂无详细描述。")}</p></div>
    </div>
    <div class="result-card" style="margin-top:16px">
      <h3>四维度分析</h3>
      ${dimensionTemplates(result.dims)}
    </div>
    <div class="detail-grid">
      ${profileDetail("科研偏好特点", p.personality_traits)}
      ${profileDetail("研究工作风格", p.work_style)}
      ${profileDetail("团队协作方式", p.interpersonal_relations)}
      ${profileDetail("沟通风格", p.communication_style)}
      ${profileDetail("压力管理", p.stress_management)}
      ${profileDetail("学习方式", p.learning_style)}
    </div>
    <div class="share-panel" id="share">
      <div>
        <p class="eyebrow">Share</p>
        <h3>分享你的科研协作画像</h3>
        <p>这个链接会打开一个专属分享页，只展示你的类型、画像说明和完整度，不包含具体答题记录。</p>
      </div>
      <div class="share-actions">
        <input class="share-input" type="text" readonly value="${escapeHtml(shareUrl)}" aria-label="分享链接">
        <button class="secondary-button" type="button" id="copy-share-link">复制链接</button>
        <a class="primary-link" href="${escapeHtml(shareUrl)}" target="_blank" rel="noopener">打开分享页</a>
      </div>
    </div>`;
  document.getElementById("copy-share-link").addEventListener("click", () => copyShareLink(shareUrl));
}

function dimensionTemplates(dims) {
  return Object.entries(DIMENSIONS).map(([dim, meta]) => {
    const leftScore = dims[dim][meta.left];
    const rightScore = dims[dim][meta.right];
    const answered = dims[dim].answered || 0;
    const winner = pickType(dims[dim], meta.left, meta.right);
    const winnerName = winner === meta.left ? meta.leftName : meta.rightName;
    const confidence = answered ? Math.round((Math.abs(leftScore - rightScore) / answered) * 100) : 0;
    return `<div class="dimension-row">
      <div class="dimension-head"><span>${meta.name}</span><span>${meta.left} ${leftScore} / ${meta.right} ${rightScore}</span></div>
      <div class="dimension-bar">
        <div class="dimension-side dimension-left"><div class="dimension-fill-left" style="width:${answered ? (leftScore / answered) * 100 : 0}%"></div></div>
        <div class="dimension-mid"></div>
        <div class="dimension-side dimension-right"><div class="dimension-fill-right" style="width:${answered ? (rightScore / answered) * 100 : 0}%"></div></div>
      </div>
      <div class="dimension-meta">倾向：${winner}（${winnerName}），本维度已答 ${answered}/${meta.total}，差值 ${leftScore - rightScore >= 0 ? "+" : ""}${leftScore - rightScore}，稳定度 ${confidence}%</div>
    </div>`;
  }).join("");
}

function profileDetail(title, text) {
  if (!text) return "";
  return `<div class="profile-detail"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div>`;
}

function renderTypeGrid() {
  typeGrid.innerHTML = TYPE_ORDER.map((code) => {
    const p = profiles[code] || {};
    return `<article class="type-card" data-type="${code}">
      <h3>${escapeHtml(p.name || code)}</h3>
      <span class="type-code">${code}</span>
      <p>${escapeHtml(shortText(p.description || "", 72))}</p>
    </article>`;
  }).join("");
  typeGrid.querySelectorAll(".type-card").forEach((card) => card.addEventListener("click", () => expandType(card.dataset.type)));
}

function expandType(code) {
  const p = profiles[code] || {};
  const existing = document.querySelector(".type-detail-full");
  if (existing && existing.dataset.type === code) {
    existing.remove();
    return;
  }
  if (existing) existing.remove();
  const card = document.querySelector(`[data-type="${code}"]`);
  const detail = document.createElement("article");
  detail.className = "type-detail-full result-card";
  detail.dataset.type = code;
  detail.innerHTML = `<h3>${code} · ${escapeHtml(p.name || "")}</h3>
    <p>${escapeHtml(p.description || "")}</p>
    <p style="margin-top:10px"><strong>优势：</strong>${escapeHtml(p.strengths || "")}</p>
    <p style="margin-top:10px"><strong>建议：</strong>${escapeHtml(p.growth || "")}</p>`;
  card.insertAdjacentElement("afterend", detail);
}

function scrollToId(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildShareUrl(result) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("type", result.code);
  url.searchParams.set("done", result.answeredCount);
  url.searchParams.set("total", result.totalCount);
  return url.toString();
}

async function copyShareLink(url) {
  try {
    await navigator.clipboard.writeText(url);
    showToast("分享链接已复制");
  } catch {
    showToast("复制失败，请手动复制链接");
  }
}

function renderSharedResultFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const code = (params.get("type") || "").toUpperCase();
  if (!TYPE_ORDER.includes(code)) return;
  const done = Number(params.get("done") || 0);
  const total = Number(params.get("total") || questions.length);
  const completeness = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
  const p = profiles[code] || {};
  resultSection.classList.remove("hidden");
  resultSection.innerHTML = `<div class="result-hero shared-result">
      <p class="eyebrow" style="color:white;opacity:.85">分享的科研协作画像</p>
      <div class="result-code">${code}</div>
      <div class="result-name">${escapeHtml(p.name || "待补充画像")}</div>
      <div class="result-badge">分享页 · 完整度 ${completeness}%</div>
    </div>
    <div class="result-grid">
      <div class="result-card"><h3>科研画像概述</h3><p>${escapeHtml(p.description || "暂无详细描述。")}</p></div>
      <div class="result-card"><h3>协作优势</h3><p>${escapeHtml(p.strengths || "暂无详细描述。")}</p></div>
      <div class="result-card"><h3>成长建议</h3><p>${escapeHtml(p.growth || "暂无详细描述。")}</p></div>
      <div class="result-card"><h3>科研角色建议</h3><p>${escapeHtml(p.career_suggestions || "暂无详细描述。")}</p></div>
    </div>
    <div class="share-panel">
      <div>
        <p class="eyebrow">Try it</p>
        <h3>生成你自己的科研协作画像</h3>
        <p>分享页不包含对方的答题记录。你可以从头开始答题，得到自己的结果。</p>
      </div>
      <button class="primary-button" type="button" data-action="scroll-test">开始测评</button>
    </div>`;
  resultSection.querySelector("[data-action='scroll-test']").addEventListener("click", () => scrollToId("test"));
  scrollToId("result");
}

function shortText(text, limit) {
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>'"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[ch]));
}

function showToast(message) {
  const old = document.querySelector(".toast");
  if (old) old.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}
