/* ═════════ 工具 ═════════ */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const strip = s => String(s).replace(/<[^>]+>/g, "");
const idle = fn => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 900 }) : setTimeout(fn, 24));
const store = {
  get(k, d){ try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
};

/* ═════════ 数据装配 ═════════ */
const BOOKS = BOOKS_OT.concat(BOOKS_NT).map((b, i) => {
  const x = BOOK_EXTRA[i] || { s: "", c: "" };
  b.story = x.s; b.cov = x.c; return b;
});
const DIV_COLOR = {
  "律法书":"var(--gold)", "历史书":"var(--olive)", "诗歌智慧":"var(--teal)",
  "大先知":"var(--burg)", "小先知":"var(--rust)", "福音书":"var(--navy)",
  "教会历史":"var(--green)", "保罗书信":"var(--violet)", "普通书信":"var(--brown)",
  "启示文学":"var(--plum)"
};
const ERA_MAP = {}; ERAS.forEach(e => ERA_MAP[e.k] = e);

/* ═════════ 自动目录 ═════════ */
(function toc(){
  const ul = $("#toc");
  const parts = $$("section.part, header.hero");
  const html = parts.map(sec => {
    const isHero = sec.tagName === "HEADER";
    const title = isHero ? "扉页" : strip($("h2", sec).innerHTML);
    const subs = $$("h3[id]", sec);
    const sid = sec.id;
    if(!subs.length) return '<li><div class="grp"><a href="#' + sid + '">' + esc(title) + "</a></div></li>";
    return '<li data-open="0"><div class="grp"><a href="#' + sid + '">' + esc(title) +
      '</a><button class="tg" type="button" aria-label="展开子目录"></button></div><ul class="sub">' +
      subs.map(h => '<li><a href="#' + h.id + '">' + esc(strip(h.innerHTML)) + "</a></li>").join("") +
      "</ul></li>";
  }).join("");
  ul.innerHTML = html;
  ul.addEventListener("click", e => {
    const t = e.target.closest(".tg");
    if(!t) return;
    const li = t.closest("li");
    li.dataset.open = li.dataset.open === "1" ? "0" : "1";
  });
})();

/* ═════════ 目录显隐 ═════════ */
(function tocToggle(){
  const wrap = $("#wrap"), sb = $("#sidebar"), btn = $("#tocBtn"), close = $("#tocClose"), sc = $("#scrim");
  const mobile = () => window.innerWidth <= 920;
  let on = store.get("bible2-toc", true);
  function paint(){
    if(mobile()) return;
    wrap.dataset.toc = on ? "on" : "off";
    btn.setAttribute("aria-expanded", on ? "true" : "false");
  }
  function drawer(v){
    sb.classList.toggle("open", v);
    sc.classList.toggle("show", v);
    sc.hidden = !v;
    btn.setAttribute("aria-expanded", v ? "true" : "false");
    document.body.style.overflow = v ? "hidden" : "";
  }
  btn.addEventListener("click", () => {
    if(mobile()){ drawer(!sb.classList.contains("open")); return; }
    on = !on; store.set("bible2-toc", on); paint();
  });
  close.addEventListener("click", () => {
    if(mobile()){ drawer(false); return; }
    on = false; store.set("bible2-toc", false); paint();
  });
  sc.addEventListener("click", () => drawer(false));
  sb.addEventListener("click", e => { if(e.target.closest("a") && mobile()) drawer(false); });
  window.addEventListener("resize", () => { if(!mobile()){ drawer(false); paint(); } });
  paint();
  window.__toc = { open(){ if(mobile()) drawer(true); else { on = true; store.set("bible2-toc", true); paint(); } } };
})();

/* ═════════ 时间线 ═════════ */
(function timeline(){
  const bar = $("#eraBar"), tl = $("#timeline");
  if(!bar) return;
  bar.innerHTML = '<button class="era" data-e="all" aria-pressed="true">全部 ' + EVENTS.length + "</button>" +
    ERAS.map(e => '<button class="era" data-e="' + e.k + '" style="--ec:' + e.c + '" aria-pressed="false">' + e.n + "</button>").join("");
  tl.innerHTML = EVENTS.map(v => {
    const c = (ERA_MAP[v.e] || {}).c || "var(--gold)";
    return '<div class="ev" data-e="' + v.e + '" style="--ec:' + c + '">' +
      '<div><span class="yr">' + esc(v.y) + '</span><span class="ti">' + esc(v.t) + "</span></div>" +
      '<div class="de">' + v.d + "</div>" +
      '<div class="mt"><span>' + esc(v.r) + "</span><span>" + esc(v.w) + "</span></div></div>";
  }).join("");
  bar.addEventListener("click", e => {
    const b = e.target.closest(".era"); if(!b) return;
    const k = b.dataset.e;
    $$(".era", bar).forEach(o => o.setAttribute("aria-pressed", o === b ? "true" : "false"));
    $$(".ev", tl).forEach(v => v.classList.toggle("hide", k !== "all" && v.dataset.e !== k));
  });
})();

/* ═════════ 正典网格 ═════════ */
const canonEl = $("#canon"), panelEl = $("#bkpanel");
let curFilter = "all", curQuery = "";
(function legend(){
  const el = $("#legend"); if(!el) return;
  const seen = [];
  BOOKS.forEach(b => { if(seen.indexOf(b.dv) < 0) seen.push(b.dv); });
  el.innerHTML = seen.map(d => '<span><i style="background:' + DIV_COLOR[d] + '"></i>' + d +
    '<b class="cnt">' + BOOKS.filter(b => b.dv === d).length + "</b></span>").join("");
})();
if(canonEl){
  canonEl.innerHTML = BOOKS.map(b =>
    '<button class="bk" type="button" role="listitem" data-n="' + b.n + '" style="--dv:' + DIV_COLOR[b.dv] +
    '" aria-expanded="false"><span class="ch">' + b.ch + '</span><span class="nm">' + esc(b.nm) +
    '</span><span class="en">' + esc(b.en) + "</span></button>").join("");
}
function matches(b){
  if(curFilter !== "all" && curFilter !== b.tt && curFilter !== b.dv) return false;
  if(!curQuery) return true;
  const q = curQuery.toLowerCase();
  return [b.nm, b.en, b.dv, b.tg, b.st, b.ct, b.cr, b.ap, b.key, b.au, b.dt, b.story, b.cov]
    .join(" ").toLowerCase().indexOf(q) >= 0;
}
function applyFilter(){
  let shown = 0;
  $$(".bk", canonEl).forEach(t => {
    const ok = matches(BOOKS[+t.dataset.n - 1]);
    t.classList.toggle("hide", !ok);
    if(ok) shown++;
  });
  if(shown === 0){
    panelEl.className = "bp empty";
    panelEl.innerHTML = "没有匹配的经卷。试试更短的关键词，例如「圣约」「被掳」「称义」。";
  }
}
function fld(l, v, c){ return v ? "<dt>" + l + "</dt><dd" + (c ? ' class="' + c + '"' : "") + ">" + v + "</dd>" : ""; }
function showBook(n){
  const b = BOOKS[n - 1]; if(!b) return;
  $$(".bk", canonEl).forEach(t => t.setAttribute("aria-expanded", (+t.dataset.n === n) ? "true" : "false"));
  panelEl.className = "bp";
  panelEl.style.setProperty("--dv", DIV_COLOR[b.dv]);
  const p = n > 1 ? BOOKS[n - 2] : null, x = n < 66 ? BOOKS[n] : null;
  panelEl.innerHTML = "<h4>" + esc(b.nm) + "</h4>" +
    '<div class="bm">' + esc(b.en) + " · " + b.dv + " · 共 " + b.ch + " 章 · 正典第 " + b.n + " 卷</div><dl>" +
    fld("作者", b.au) + fld("年代", b.dt) + fld("故事线位置", b.story) + fld("圣约期", b.cov) +
    fld("为何而写", b.st) + fld("写了什么", b.ct) + fld("指向基督", b.cr) + fld("怎样应用", b.ap) +
    fld("关键经文", b.key, "key") + "</dl>" +
    '<div class="bnav no-print">' +
    (p ? '<button class="btn" type="button" data-go="' + p.n + '">← ' + esc(p.nm) + "</button>" : "<span></span>") +
    (x ? '<button class="btn" type="button" data-go="' + x.n + '">' + esc(x.nm) + " →</button>" : "<span></span>") +
    "</div>";
}
if(canonEl){
  canonEl.addEventListener("click", e => {
    const t = e.target.closest(".bk"); if(!t) return;
    showBook(+t.dataset.n);
    if(panelEl.scrollIntoView) panelEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
  panelEl.addEventListener("click", e => {
    const g = e.target.closest("[data-go]"); if(!g) return;
    showBook(+g.dataset.go);
    if(panelEl.scrollIntoView) panelEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
  $$(".filters .chip[data-f]").forEach(c => c.addEventListener("click", () => {
    curFilter = c.dataset.f;
    $$(".filters .chip[data-f]").forEach(o => o.setAttribute("aria-pressed", o === c ? "true" : "false"));
    applyFilter();
  }));
  const si = $("#bkSearch");
  let deb;
  si.addEventListener("input", () => {
    clearTimeout(deb);
    deb = setTimeout(() => { curQuery = si.value.trim(); applyFilter(); }, 110);
  });
}

/* ═════════ 附录表 ═════════ */
idle(function(){
  const qb = $("#quickBody");
  if(qb) qb.innerHTML = BOOKS.map(b =>
    "<tr><td>" + b.n + '</td><td class="k">' + esc(b.nm) + "</td><td>" + b.dv + "</td><td>" + b.ch +
    "</td><td>" + esc(b.dt.split("；")[0].slice(0, 20)) + "</td><td>" + esc(b.story) + "</td><td>" + esc(b.cov) + "</td></tr>").join("");
  const gb = $("#glossBody");
  if(gb) gb.innerHTML = GLOSS.map(g =>
    '<tr><td class="k">' + esc(g[0]) + '</td><td class="lat">' + esc(g[1]) + "</td><td>" + esc(g[2]) + "</td></tr>").join("");
});

/* ═════════ 五十二主日 ═════════ */
(function lords(){
  const grid = $("#ldGrid"), pane = $("#ldPanel"); if(!grid) return;
  grid.innerHTML = LDS.map(l => '<button class="ld" type="button" data-d="' + l.d + '" data-sec="' + l.sec +
    '" aria-pressed="false">' + l.d + "<small>" + l.q + "</small></button>").join("");
  const SECN = { 0:"导论", 1:"一 · 惨况", 2:"二 · 拯救", 3:"三 · 感恩" };
  grid.addEventListener("click", e => {
    const t = e.target.closest(".ld"); if(!t) return;
    const l = LDS[+t.dataset.d - 1];
    $$(".ld", grid).forEach(o => o.setAttribute("aria-pressed", o === t ? "true" : "false"));
    pane.innerHTML = "<h4>主日 " + l.d + " · " + esc(l.t) + "</h4>" +
      '<div style="font-family:var(--disp);font-size:.78rem;letter-spacing:.08em;color:var(--gold)">第 ' +
      l.q + " 问　｜　" + SECN[l.sec] + '</div><p style="font-size:.9rem;margin:.4rem 0 0">' + esc(l.k) + "</p>";
  });
})();

/* ═════════ 闪卡 ═════════ */
(function flash(){
  const wrap = $("#flashwrap"), bar = $("#fcBar"); if(!wrap) return;
  const CATS = []; CARDS.forEach(c => { if(CATS.indexOf(c.c) < 0) CATS.push(c.c); });
  let order = CARDS.map((_, i) => i), cat = "全部", hint = false;
  let done = store.get("bible2-cards", []);
  if(!Array.isArray(done)) done = [];
  const doneSet = {}; done.forEach(i => doneSet[i] = 1);
  bar.innerHTML = '<button class="chip" data-c="全部" aria-pressed="true">全部 ' + CARDS.length + "</button>" +
    CATS.map(c => '<button class="chip" data-c="' + c + '" aria-pressed="false">' + c + " " +
      CARDS.filter(x => x.c === c).length + "</button>").join("") +
    '<button class="chip" id="fcHint" aria-pressed="false">首字提示</button>' +
    '<button class="chip" id="fcShuffle">打乱</button>' +
    '<button class="chip" id="fcFlipBack">全部翻回</button>' +
    '<button class="chip" id="fcClear">清除进度</button>';
  function firstChars(t){
    return strip(t).split(/[，。；：、？！]/).filter(s => s.trim()).slice(0, 9)
      .map(s => { const v = s.trim(); return v[0] + "○".repeat(Math.min(v.length - 1, 3)); }).join(" ");
  }
  function stat(){
    const n = Object.keys(doneSet).length;
    $("#fcBarFill").style.width = (n / CARDS.length * 100).toFixed(1) + "%";
    $("#fcStat").textContent = "已标记背熟 " + n + " / " + CARDS.length + " 张" + (n === CARDS.length ? "　——全部完成。" : "");
  }
  function render(){
    wrap.innerHTML = order.filter(i => cat === "全部" || CARDS[i].c === cat).map(i => {
      const c = CARDS[i], d = doneSet[i] ? " done" : "";
      return '<button class="fc' + d + '" type="button" data-i="' + i + '" aria-pressed="false">' +
        '<span class="mark" role="button" data-mark="' + i + '" aria-pressed="' + (doneSet[i] ? "true" : "false") + '">熟</span>' +
        '<span class="in"><span class="fa"><span class="qn">' + esc(c.c) + " · " + esc(c.n) + '</span><span class="q">' + c.q + "</span>" +
        (hint ? '<span class="hint">' + esc(firstChars(c.a)) + "</span>" : '<span class="cue">点击翻面</span>') +
        '</span><span class="fa bkf"><span class="qn">' + esc(c.n) + '</span><span class="a">' + c.a + "</span></span></span></button>";
    }).join("");
    stat();
  }
  wrap.addEventListener("click", e => {
    const m = e.target.closest("[data-mark]");
    if(m){
      e.stopPropagation();
      const i = +m.dataset.mark;
      if(doneSet[i]) delete doneSet[i]; else doneSet[i] = 1;
      store.set("bible2-cards", Object.keys(doneSet).map(Number));
      m.setAttribute("aria-pressed", doneSet[i] ? "true" : "false");
      m.closest(".fc").classList.toggle("done", !!doneSet[i]);
      stat();
      return;
    }
    const f = e.target.closest(".fc"); if(!f) return;
    f.setAttribute("aria-pressed", f.getAttribute("aria-pressed") === "true" ? "false" : "true");
  });
  bar.addEventListener("click", e => {
    const b = e.target.closest(".chip"); if(!b) return;
    if(b.dataset.c){
      cat = b.dataset.c;
      $$(".chip[data-c]", bar).forEach(o => o.setAttribute("aria-pressed", o === b ? "true" : "false"));
      render(); return;
    }
    if(b.id === "fcHint"){ hint = !hint; b.setAttribute("aria-pressed", hint ? "true" : "false"); render(); return; }
    if(b.id === "fcShuffle"){
      for(let i = order.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t; }
      render(); return;
    }
    if(b.id === "fcFlipBack"){ $$(".fc", wrap).forEach(f => f.setAttribute("aria-pressed", "false")); return; }
    if(b.id === "fcClear"){
      Object.keys(doneSet).forEach(k => delete doneSet[k]);
      store.set("bible2-cards", []); render();
    }
  });
  render();
})();

/* ═════════ 自测 ═════════ */
(function quiz(){
  const wrap = $("#quizwrap"); if(!wrap) return;
  const answered = {};
  wrap.innerHTML = QUIZ.map((q, i) =>
    '<div class="quiz" data-q="' + i + '"><div class="qh">第 ' + (i + 1) + " 题 / " + QUIZ.length + " · 出处 " + esc(q.src) +
    '</div><div class="qq">' + q.q + '</div><ul class="opts">' +
    q.o.map((o, j) => '<li><button type="button" data-o="' + j + '">' + esc(o) + "</button></li>").join("") +
    '</ul><div class="qex"><strong>解析：</strong>' + q.e + "</div></div>").join("");
  function stat(){
    const n = Object.keys(answered).length;
    let ok = 0; Object.keys(answered).forEach(k => { if(answered[k]) ok++; });
    $("#quizStat").textContent = n ? "已答 " + n + " / " + QUIZ.length + "，答对 " + ok + " 题。" : "";
  }
  wrap.addEventListener("click", e => {
    const b = e.target.closest("[data-o]"); if(!b) return;
    const box = b.closest(".quiz"), qi = +box.dataset.q;
    if(answered[qi] !== undefined) return;
    const right = QUIZ[qi].a, pick = +b.dataset.o;
    $$("[data-o]", box).forEach(o => { if(+o.dataset.o === right) o.classList.add("ok"); });
    if(pick !== right) b.classList.add("no");
    $(".qex", box).classList.add("show");
    answered[qi] = pick === right;
    stat();
  });
})();

/* ═════════ 主题 ═════════ */
const theme = (function(){
  const btn = $("#themeBtn"), root = document.documentElement;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const L = { auto:"随系统", light:"浅色", dark:"深色" };
  let mode = store.get("bible2-theme", "auto");
  function paint(){
    root.setAttribute("data-theme", mode === "auto" ? (mq.matches ? "dark" : "light") : mode);
    btn.textContent = L[mode];
    btn.setAttribute("aria-label", "当前主题：" + L[mode] + "，点击切换");
  }
  function cycle(){
    mode = mode === "auto" ? "light" : (mode === "light" ? "dark" : "auto");
    store.set("bible2-theme", mode); paint();
  }
  btn.addEventListener("click", cycle);
  if(mq.addEventListener) mq.addEventListener("change", () => { if(mode === "auto") paint(); });
  paint();
  return { cycle: cycle };
})();

/* ═════════ 全站搜索 ═════════ */
(function palette(){
  const pal = $("#pal"), input = $("#palIn"), list = $("#palList");
  let index = null, results = [], sel = 0;
  function build(){
    const ix = [];
    $$("section.part").forEach(sec => {
      const h2 = $("h2", sec);
      ix.push({ t: strip(h2.innerHTML), c: "章节", id: sec.id });
      $$("h3[id]", sec).forEach(h => ix.push({ t: strip(h.innerHTML), c: "小节", id: h.id }));
    });
    BOOKS.forEach(b => ix.push({ t: b.nm + "　" + b.en, c: "经卷", id: "p6", bk: b.n, extra: b.tg + " " + b.story }));
    EVENTS.forEach((v, i) => ix.push({ t: v.y + "　" + v.t, c: "时间线", id: "p2-2", extra: strip(v.d) }));
    GLOSS.forEach(g => ix.push({ t: g[0] + "　" + g[1], c: "术语", id: "ap-2", extra: g[2] }));
    CARDS.forEach((c, i) => ix.push({ t: strip(c.q), c: "记忆卡", id: "p11-4", extra: c.c + " " + strip(c.a) }));
    LDS.forEach(l => ix.push({ t: "主日 " + l.d + "　" + l.t, c: "海德堡", id: "p11-6", extra: l.k }));
    return ix;
  }
  function draw(){
    list.innerHTML = results.map((r, i) =>
      '<li><button type="button" data-i="' + i + '" class="' + (i === sel ? "sel" : "") + '"><span class="t">' +
      esc(r.t) + '</span><span class="c">' + r.c + "</span></button></li>").join("") ||
      '<li><button type="button" disabled><span class="t" style="color:var(--ink-3)">没有匹配结果</span></button></li>';
  }
  function search(q){
    if(!index) index = build();
    q = q.trim().toLowerCase();
    if(!q){ results = index.filter(r => r.c === "章节").slice(0, 14); sel = 0; draw(); return; }
    const hit = [];
    for(let i = 0; i < index.length && hit.length < 60; i++){
      const r = index[i];
      const inT = r.t.toLowerCase().indexOf(q) >= 0;
      if(inT || (r.extra && r.extra.toLowerCase().indexOf(q) >= 0)) hit.push({ r: r, s: inT ? 0 : 1 });
    }
    hit.sort((a, b) => a.s - b.s);
    results = hit.map(h => h.r).slice(0, 40); sel = 0; draw();
  }
  function open(){
    pal.classList.add("open"); input.value = ""; search(""); input.focus();
  }
  function close(){
    pal.classList.remove("open");
    if(input.blur) input.blur();
    if(document.activeElement === input && document.body.focus) document.body.focus();
  }
  function go(i){
    const r = results[i]; if(!r) return;
    close();
    const el = document.getElementById(r.id);
    if(el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    if(r.bk) setTimeout(() => showBook(r.bk), 260);
  }
  $("#searchBtn").addEventListener("click", open);
  input.addEventListener("input", () => search(input.value));
  list.addEventListener("click", e => { const b = e.target.closest("[data-i]"); if(b) go(+b.dataset.i); });
  pal.addEventListener("click", e => { if(e.target === pal) close(); });
  document.addEventListener("keydown", e => {
    const ae = document.activeElement;
    const typing = !!ae && /^(INPUT|TEXTAREA)$/.test(ae.tagName) && ae !== input;
    if(!pal.classList.contains("open")){
      if(e.key === "/" && !typing){ e.preventDefault(); open(); return; }
      if((e.key === "t" || e.key === "T") && !typing){ theme.cycle(); return; }
      if((e.key === "m" || e.key === "M") && !typing){ $("#tocBtn").click(); return; }
      return;
    }
    if(e.key === "Escape"){ close(); return; }
    if(e.key === "ArrowDown"){ e.preventDefault(); sel = Math.min(sel + 1, results.length - 1); draw(); scrollSel(); }
    if(e.key === "ArrowUp"){ e.preventDefault(); sel = Math.max(sel - 1, 0); draw(); scrollSel(); }
    if(e.key === "Enter"){ e.preventDefault(); go(sel); }
  });
  function scrollSel(){
    const b = list.querySelector(".sel");
    if(b && b.scrollIntoView) b.scrollIntoView({ block: "nearest" });
  }
})();

/* ═════════ 滚动：目录高亮 · 进度 · 回顶 ═════════ */
(function spy(){
  const links = $$("#toc a[href^='#']");
  const map = links.map(a => ({ a: a, el: document.getElementById(a.getAttribute("href").slice(1)) })).filter(x => x.el);
  const crumb = $("#crumb"), sb = $("#sidebar"), top = $("#backtop"), prog = $("#prog");
  let ticking = false, last = null;
  function run(){
    ticking = false;
    const line = 96;
    let best = map[0];
    for(let i = 0; i < map.length; i++){
      if(map[i].el.getBoundingClientRect().top - line <= 0) best = map[i]; else break;
    }
    if(best && best.a !== last){
      links.forEach(a => a.classList.remove("on"));
      best.a.classList.add("on");
      const sub = best.a.closest(".sub");
      if(sub){
        const li = sub.parentElement;
        li.dataset.open = "1";
        const pa = li.querySelector(".grp > a"); if(pa) pa.classList.add("on");
      }
      last = best.a;
      crumb.textContent = best.a.textContent.trim();
      if(window.innerWidth > 920 && $("#wrap").dataset.toc === "on"){
        const r = best.a.getBoundingClientRect(), sr = sb.getBoundingClientRect();
        if(r.top < sr.top + 40 || r.bottom > sr.bottom - 40) sb.scrollTop += (r.top - sr.top) - sb.clientHeight * 0.4;
      }
    }
    const h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h > 0 ? Math.min(100, window.scrollY / h * 100) : 0) + "%";
    top.classList.toggle("show", window.scrollY > 900);
    if(window.__revealCheck) window.__revealCheck();
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(run); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  run();
})();

/* ═════════ 入场显现系统 ═════════ */
const REVEAL = (function(){
  const items = [];
  function check(){
    const vh = window.innerHeight || 800;
    for(let i = 0; i < items.length; i++){
      const it = items[i];
      if(it.done) continue;
      const r = it.el.getBoundingClientRect();
      if(r.top < vh - 30 && r.bottom > -40){ it.done = true; try { it.fn(); } catch(e){} }
    }
  }
  window.__revealCheck = check;
  return { add(el, fn){ if(el) items.push({ el: el, fn: fn, done: false }); check(); } };
})();

/* ═════════ 地图图层切换 ═════════ */
(function layers(){
  $$(".viz").forEach(v => {
    const btns = $$(".lyr", v); if(!btns.length) return;
    function set(k, on){ $$('.layer[data-l="' + k + '"]', v).forEach(g => g.classList.toggle("on", on)); }
    btns.forEach(b => b.addEventListener("click", () => {
      const on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      set(b.dataset.l, on);
    }));
    REVEAL.add(v, () => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        btns.forEach(b => set(b.dataset.l, b.getAttribute("aria-pressed") === "true"));
      }));
    });
  });
})();

/* ═════════ 动态图表 ═════════ */
(function charts(){
  const host = $("#chapChart"); if(!host) return;
  const NS = "http://www.w3.org/2000/svg";
  const otCh = BOOKS.filter(b => b.tt === "ot").reduce((a, b) => a + b.ch, 0);
  const ntCh = BOOKS.filter(b => b.tt === "nt").reduce((a, b) => a + b.ch, 0);
  const all = otCh + ntCh;

  /* —— 66 卷章数柱状图 —— */
  const W = 900, H = 270, L = 40, R = 12, T = 24, B = 62, MAX = 150;
  const bw = (W - L - R) / 66, sc = (H - T - B) / MAX;
  const LABELED = { 1:"创", 2:"出", 5:"申", 19:"诗", 20:"箴", 23:"赛", 24:"耶", 26:"结", 40:"太", 42:"路", 44:"徒", 45:"罗", 66:"启" };
  let g = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="六十六卷章数分布柱状图">';
  g += '<text x="' + (W / 2) + '" y="16" font-size="12.6" font-weight="700" fill="var(--navy)" text-anchor="middle">六十六卷章数分布（合计 ' + all + ' 章）</text>';
  [50, 100, 150].forEach(v => {
    const y = H - B - v * sc;
    g += '<line x1="' + L + '" y1="' + y + '" x2="' + (W - R) + '" y2="' + y + '" stroke="var(--rule)" stroke-width="1" stroke-dasharray="3 4"/>' +
         '<text x="' + (L - 6) + '" y="' + (y + 3.5) + '" class="barlbl" text-anchor="end">' + v + "</text>";
  });
  g += '<line x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - R) + '" y2="' + (H - B) + '" stroke="var(--rule-2)" stroke-width="1.5"/>';
  BOOKS.forEach((b, i) => {
    const h = Math.max(2, b.ch * sc), x = L + i * bw, y = H - B - h;
    g += '<rect class="cbar" data-dv="' + b.dv + '" data-n="' + b.n + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
      '" width="' + (bw - 2).toFixed(1) + '" height="' + h.toFixed(1) + '" rx="1.6" fill="' + DIV_COLOR[b.dv] +
      '" style="transform:scaleY(0);transform-box:fill-box;transform-origin:bottom center;transition:transform .7s cubic-bezier(.3,.9,.3,1) ' +
      (i * 9) + 'ms,opacity .2s"><title>' + esc(b.nm) + " · " + b.ch + " 章 · " + b.dv + "</title></rect>";
    if(LABELED[b.n]) g += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - B + 12) +
      '" class="barlbl" text-anchor="middle" font-size="9">' + LABELED[b.n] + "</text>";
  });
  g += '<line x1="' + (L + 39 * bw - 1) + '" y1="' + T + '" x2="' + (L + 39 * bw - 1) + '" y2="' + (H - B + 18) +
    '" stroke="var(--burg)" stroke-width="1.6" stroke-dasharray="5 4"/>';
  g += '<text x="' + (L + 39 * bw - 5) + '" y="' + (H - B + 34) + '" class="barlbl" text-anchor="end" fill="var(--burg)">旧约 39 卷 · ' + otCh + " 章</text>";
  g += '<text x="' + (L + 39 * bw + 5) + '" y="' + (H - B + 34) + '" class="barlbl" fill="var(--navy)">新约 27 卷 · ' + ntCh + " 章</text>";
  g += '<text x="' + (W / 2) + '" y="' + (H - 8) + '" class="barlbl" text-anchor="middle">横轴为正典次序，纵轴为章数；鼠标悬停可看书名（点上方类别可高亮）</text></svg>';
  host.innerHTML = g;
  const bars = $$(".cbar", host);
  REVEAL.add(host, () => requestAnimationFrame(() => bars.forEach(r => { r.style.transform = "scaleY(1)"; })));

  const cb = $("#chartBar");
  const divs = []; BOOKS.forEach(b => { if(divs.indexOf(b.dv) < 0) divs.push(b.dv); });
  cb.innerHTML = '<button class="lyr" data-dv="all" aria-pressed="true"><i style="background:var(--ink-3)"></i>全部</button>' +
    divs.map(d => '<button class="lyr" data-dv="' + d + '" style="--lc:' + DIV_COLOR[d] + '" aria-pressed="false"><i></i>' + d + "</button>").join("");
  cb.addEventListener("click", e => {
    const b = e.target.closest(".lyr"); if(!b) return;
    const d = b.dataset.dv;
    $$(".lyr", cb).forEach(o => o.setAttribute("aria-pressed", o === b ? "true" : "false"));
    bars.forEach(r => { r.style.opacity = (d === "all" || r.dataset.dv === d) ? "1" : "0.16"; });
  });

  /* —— 旧约／新约体量环形图 —— */
  const pc = $("#pieChart");
  const frac = otCh / all, C = 2 * Math.PI * 62;
  pc.innerHTML = '<svg viewBox="0 0 380 230" role="img" aria-label="旧约与新约章数占比环形图">' +
    '<text x="190" y="18" font-size="12.6" font-weight="700" fill="var(--navy)" text-anchor="middle">旧约与新约的体量</text>' +
    '<circle cx="110" cy="124" r="62" fill="none" stroke="var(--navy)" stroke-width="26" opacity=".85"/>' +
    '<circle id="otArc" cx="110" cy="124" r="62" fill="none" stroke="var(--gold)" stroke-width="26" ' +
    'stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) +
    '" transform="rotate(-90 110 124)" style="transition:stroke-dashoffset 1.2s cubic-bezier(.3,.9,.3,1)"/>' +
    '<text x="110" y="120" font-size="17" font-weight="700" fill="var(--ink)" text-anchor="middle">' + all + "</text>" +
    '<text x="110" y="140" font-size="10" fill="var(--ink-3)" text-anchor="middle">章 · 合计</text>' +
    '<g><rect x="208" y="72" width="13" height="13" rx="3" fill="var(--gold)"/>' +
    '<text x="228" y="83" font-size="11.6" fill="var(--ink)">旧约 39 卷</text>' +
    '<text x="228" y="100" font-size="11" fill="var(--ink-3)">' + otCh + " 章 · 占 " + (frac * 100).toFixed(1) + "%</text>" +
    '<rect x="208" y="122" width="13" height="13" rx="3" fill="var(--navy)"/>' +
    '<text x="228" y="133" font-size="11.6" fill="var(--ink)">新约 27 卷</text>' +
    '<text x="228" y="150" font-size="11" fill="var(--ink-3)">' + ntCh + " 章 · 占 " + ((1 - frac) * 100).toFixed(1) + "%</text>" +
    '<text x="208" y="184" font-size="10.4" fill="var(--ink-3)">章数只是粗略的体量指标，</text>' +
    '<text x="208" y="200" font-size="10.4" fill="var(--ink-3)">各卷章的长短相差很大</text></g></svg>';
  REVEAL.add(pc, () => requestAnimationFrame(() => {
    const a = $("#otArc"); if(a) a.style.strokeDashoffset = (C * (1 - frac)).toFixed(1);
  }));

  /* —— 九大分组条形图 —— */
  const gc = $("#groupChart");
  const rows = divs.map(d => {
    const bs = BOOKS.filter(b => b.dv === d);
    return { d: d, n: bs.length, ch: bs.reduce((a, b) => a + b.ch, 0) };
  }).sort((a, b) => b.ch - a.ch);
  const maxCh = rows[0].ch, GW = 460, x0 = 104, gw = 268;
  let gs = '<svg viewBox="0 0 ' + GW + " " + (30 + rows.length * 28 + 26) + '" role="img" aria-label="九大分组的卷数与章数条形图">' +
    '<text x="' + (GW / 2) + '" y="16" font-size="12.6" font-weight="700" fill="var(--navy)" text-anchor="middle">九大分组：卷数与章数</text>';
  rows.forEach((r, i) => {
    const y = 30 + i * 28, w = Math.max(4, r.ch / maxCh * gw);
    gs += '<text x="' + (x0 - 8) + '" y="' + (y + 13) + '" font-size="11" fill="var(--ink-2)" text-anchor="end">' + r.d + "</text>" +
      '<rect class="gbar" x="' + x0 + '" y="' + y + '" width="' + w.toFixed(1) + '" height="17" rx="3" fill="' + DIV_COLOR[r.d] +
      '" style="transform:scaleX(0);transform-box:fill-box;transform-origin:left center;transition:transform .8s cubic-bezier(.3,.9,.3,1) ' +
      (i * 70) + 'ms"><title>' + r.d + " · " + r.n + " 卷 · " + r.ch + " 章</title></rect>" +
      '<text x="' + (x0 + w + 6).toFixed(1) + '" y="' + (y + 13) + '" font-size="10.4" fill="var(--ink-3)">' + r.ch + " 章 / " + r.n + " 卷</text>";
  });
  gs += '<text x="' + (GW / 2) + '" y="' + (30 + rows.length * 28 + 16) + '" font-size="10" fill="var(--ink-3)" text-anchor="middle">条长按章数，括注为卷数——两者并不成正比</text></svg>';
  gc.innerHTML = gs;
  REVEAL.add(gc, () => requestAnimationFrame(() => $$(".gbar", gc).forEach(r => { r.style.transform = "scaleX(1)"; })));
})();

/* ═════════ 可播放时间轴 ═════════ */
(function axis(){
  const box = $("#playAxis"); if(!box) return;
  const nodes = $$("#axisNodes .step"), cap = $("#axisCap");
  const NAMES = ["创造：神说，就有了","堕落：应许女人的后裔（创 3:15）","洪水与巴别：罪的扩散与列国的分散",
    "亚伯拉罕：地、后裔、万国得福","出埃及：以血遮盖，领出为奴之地","士师：螺旋下坠，呼求一位真王",
    "大卫之约：你的国位必坚定，直到永远","王国分裂：北国十支派与南国犹大","被掳：地、殿、王三样凭据同时失去",
    "归回：余民重建，盼望未熄","基督：全部应许在此转轴","再来：神的帐幕在人间"];
  let timer = null;
  function reset(){ nodes.forEach(n => n.classList.remove("lit")); }
  function play(){
    if(timer){ clearInterval(timer); timer = null; }
    reset(); let i = 0;
    timer = setInterval(() => {
      if(i >= nodes.length){ clearInterval(timer); timer = null; cap.textContent = "十二个节点，是全书任何一段经文的定位坐标——先问它落在哪两个节点之间"; return; }
      nodes[i].classList.add("lit");
      cap.textContent = (i + 1) + " / 12　" + NAMES[i];
      i++;
    }, 560);
  }
  $("#axisPlay").addEventListener("click", play);
  $("#axisAll").addEventListener("click", () => {
    if(timer){ clearInterval(timer); timer = null; }
    nodes.forEach(n => n.classList.add("lit"));
    cap.textContent = "十二个节点，是全书任何一段经文的定位坐标——先问它落在哪两个节点之间";
  });
  REVEAL.add(box, () => nodes.forEach(n => n.classList.add("lit")));
})();

/* ═════════ 列王双轨图与帝国横条 ═════════ */
(function kings(){
  const host = $("#kingsChart"); if(!host) return;
  const W = 900, L = 86, R = 14, k = (W - L - R) / 540;      // 1060 BC → 520 BC
  const X = y => L + (1060 - y) * k;
  const EVAL = { "正":"var(--green)", "半":"var(--gold)", "恶":"var(--burg)" };
  const pack = list => {                                      // 车道分配，保证互不重叠
    const lanes = [];                                          // lanes[i] = 该车道最后一段的结束年（BC，数值更小＝更晚）
    list.slice().sort((a, b) => b.s - a.s).forEach(it => {      // 先按起始年从早到晚排序
      let li = 0;
      while(li < lanes.length && lanes[li] < it.s) li++;        // 该车道结束得比新段起始更晚 → 重叠，换下一条
      if(li === lanes.length) lanes.push(it.e); else lanes[li] = it.e;
      it._lane = li;
    });
    return lanes.length;
  };
  const U = KINGS.filter(x => x.k === "U"), N = KINGS.filter(x => x.k === "N"), S = KINGS.filter(x => x.k === "S");
  const P = PROPHET_SPANS.slice();
  const nU = pack(U), nN = pack(N), nS = pack(S), nP = pack(P);
  const BH = 17, BG = 3, RG = 16, TOP = 46;
  let y = TOP, rows = [];
  function band(title, list, lanes, tag){
    const y0 = y;
    rows.push({ title: title, y0: y0, h: lanes * (BH + BG) });
    list.forEach(it => { it._y = y0 + it._lane * (BH + BG); it._tag = tag; });
    y = y0 + lanes * (BH + BG) + RG;
  }
  band("联合王国", U, nU, "k"); band("北国 以色列", N, nN, "k");
  band("南国 犹大", S, nS, "k"); band("先知", P, nP, "p");
  const H = y + 30;
  let g = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="联合王国、南北两国列王与先知的并行时间条形图">';
  g += '<text x="' + (W / 2) + '" y="18" font-size="13" font-weight="700" fill="var(--navy)" text-anchor="middle">四十二位王与十五位先知 · 同一条时间轴（BC）</text>';
  for(let yr = 1050; yr >= 560; yr -= 50){
    const x = X(yr);
    g += '<line x1="' + x.toFixed(1) + '" y1="' + (TOP - 12) + '" x2="' + x.toFixed(1) + '" y2="' + (H - 26) +
      '" stroke="var(--rule)" stroke-width="1" stroke-dasharray="3 5"/>' +
      '<text x="' + x.toFixed(1) + '" y="' + (TOP - 17) + '" class="barlbl" text-anchor="middle">' + yr + "</text>";
  }
  [[931, "分裂", "var(--rust)"], [722, "北亡", "var(--burg)"], [586, "南亡", "var(--burg)"]].forEach(m => {
    const x = X(m[0]);
    g += '<line x1="' + x.toFixed(1) + '" y1="' + (TOP - 12) + '" x2="' + x.toFixed(1) + '" y2="' + (H - 26) +
      '" stroke="' + m[2] + '" stroke-width="1.8"/>' +
      '<text x="' + (x + 3).toFixed(1) + '" y="' + (H - 14) + '" class="barlbl" fill="' + m[2] + '" font-weight="700">' + m[0] + " " + m[1] + "</text>";
  });
  rows.forEach(r => {
    g += '<text x="' + (L - 8) + '" y="' + (r.y0 + 12) + '" font-size="10.6" font-weight="700" fill="var(--ink-2)" text-anchor="end">' + r.title + "</text>";
  });
  function bar(it, fill, cls, label){
    let x1 = X(it.s); const x2 = X(it.e); let w = x2 - x1;
    if(w < 2.4){ const c = (x1 + x2) / 2; x1 = c - 1.2; w = 2.4; } else { w = w - 0.8; }
    const showName = w >= it.n.length * 9.8 + 7;
    let o = '<g class="' + cls + '" data-kn="' + esc(it.n) + '" style="cursor:pointer">' +
      '<rect x="' + x1.toFixed(1) + '" y="' + it._y + '" width="' + w.toFixed(1) + '" height="' + BH +
      '" rx="3" fill="' + fill + '" opacity=".92"><title>' + esc(label) + "</title></rect>";
    if(showName) o += '<text x="' + (x1 + w / 2).toFixed(1) + '" y="' + (it._y + 12.4) +
      '" font-size="9.6" fill="#fff" text-anchor="middle" style="pointer-events:none">' + esc(it.n) + "</text>";
    return o + "</g>";
  }
  U.concat(N, S).forEach(it => { g += bar(it, EVAL[it.v], "kbar", it.n + "　" + it.s + "–" + it.e + " BC　" + it.v); });
  const PC = { N:"var(--rust)", S:"var(--teal)", E:"var(--violet)" };
  P.forEach(it => { g += bar(it, PC[it.side] || "var(--ink-3)", "pbar", it.n + "　约 " + it.s + "–" + it.e + " BC"); });
  g += '<g transform="translate(' + L + "," + (H - 8) + ')">' +
    '<rect x="0" y="-9" width="11" height="9" rx="2" fill="var(--green)"/><text x="15" y="-1" class="barlbl">行正</text>' +
    '<rect x="52" y="-9" width="11" height="9" rx="2" fill="var(--gold)"/><text x="67" y="-1" class="barlbl">行正但有保留</text>' +
    '<rect x="152" y="-9" width="11" height="9" rx="2" fill="var(--burg)"/><text x="167" y="-1" class="barlbl">行恶</text>' +
    '<rect x="204" y="-9" width="11" height="9" rx="2" fill="var(--rust)"/><text x="219" y="-1" class="barlbl">北国先知</text>' +
    '<rect x="284" y="-9" width="11" height="9" rx="2" fill="var(--teal)"/><text x="299" y="-1" class="barlbl">南国先知</text>' +
    '<rect x="364" y="-9" width="11" height="9" rx="2" fill="var(--violet)"/><text x="379" y="-1" class="barlbl">被掳中的先知</text></g>';
  g += "</svg>";
  host.innerHTML = g;

  const panel = $("#kingPanel");
  host.addEventListener("click", e => {
    const t = e.target.closest("[data-kn]"); if(!t) return;
    const nm = t.dataset.kn;
    const kk = KINGS.filter(x => x.n === nm)[0];
    if(kk){
      const side = { U:"联合王国", N:"北国 以色列", S:"南国 犹大" }[kk.k];
      panel.innerHTML = "<h4>" + esc(kk.n) + "</h4>" +
        '<div style="font-family:var(--disp);font-size:.78rem;letter-spacing:.07em;color:var(--gold)">' +
        kk.s + "–" + kk.e + " BC　｜　" + side + "　｜　" + kk.dyn + "　｜　评价：" + kk.v +
        '</div><p style="font-size:.9rem;margin:.4rem 0 0">' + esc(kk.note) + "</p>";
      return;
    }
    const pp = PROPHET_SPANS.filter(x => x.n === nm)[0];
    if(pp){
      const sd = { N:"向北国说话", S:"向南国说话", E:"向被掳群体说话" }[pp.side];
      panel.innerHTML = "<h4>" + esc(pp.n) + "</h4>" +
        '<div style="font-family:var(--disp);font-size:.78rem;letter-spacing:.07em;color:var(--gold)">约 ' +
        pp.s + "–" + pp.e + " BC　｜　" + sd + '</div><p style="font-size:.9rem;margin:.4rem 0 0">详见本部分 2.6「先知站在哪位王面前」一表。</p>';
    }
  });
  $$('[data-kf]').forEach(b => b.addEventListener("click", () => {
    const f = b.dataset.kf;
    $$('[data-kf]').forEach(o => o.setAttribute("aria-pressed", o === b ? "true" : "false"));
    $$(".kbar", host).forEach(gEl => {
      const kk = KINGS.filter(x => x.n === gEl.dataset.kn)[0]; if(!kk) return;
      let on = true;
      if(f === "N") on = kk.k === "N" || kk.k === "U";
      else if(f === "S") on = kk.k === "S" || kk.k === "U";
      else if(f === "good") on = kk.v === "正";
      gEl.style.opacity = on ? "1" : "0.14";
    });
    $$(".pbar", host).forEach(gEl => { gEl.style.opacity = (f === "good") ? "0.14" : "1"; });
  }));

  /* —— 帝国横条 —— */
  const ec = $("#empireChart"); if(!ec) return;
  const EW = 900, EL = 74, ER = 14, ek = (EW - EL - ER) / 1000;  // 900 BC → 100 AD
  const EX = yr => EL + (900 - yr) * ek;
  let es = '<svg viewBox="0 0 ' + EW + ' ' + (58 + EMPIRE_SPANS.length * 30 + 34) + '" role="img" aria-label="亚述至罗马的列强更替横条图">';
  es += '<text x="' + (EW / 2) + '" y="18" font-size="13" font-weight="700" fill="var(--navy)" text-anchor="middle">列强更替：以色列从未长期独立</text>';
  for(let yr = 900; yr >= -100; yr -= 100){
    const x = EX(yr), lb = yr > 0 ? yr + " BC" : (yr === 0 ? "1" : (-yr) + " AD");
    es += '<line x1="' + x.toFixed(1) + '" y1="34" x2="' + x.toFixed(1) + '" y2="' + (44 + EMPIRE_SPANS.length * 30) +
      '" stroke="var(--rule)" stroke-width="1" stroke-dasharray="3 5"/>' +
      '<text x="' + x.toFixed(1) + '" y="30" class="barlbl" text-anchor="middle">' + lb + "</text>";
  }
  EMPIRE_SPANS.forEach((em, i) => {
    const x1 = EX(em.s), x2 = EX(em.e), yy = 44 + i * 30, w = x2 - x1;
    es += '<text x="' + (EL - 8) + '" y="' + (yy + 14) + '" font-size="11" font-weight="700" fill="var(--ink-2)" text-anchor="end">' + em.n + "</text>" +
      '<rect class="ebar" x="' + x1.toFixed(1) + '" y="' + yy + '" width="' + w.toFixed(1) + '" height="20" rx="4" fill="' + em.c +
      '" opacity=".85" style="transform:scaleX(0);transform-box:fill-box;transform-origin:left center;transition:transform .8s cubic-bezier(.3,.9,.3,1) ' +
      (i * 90) + 'ms"><title>' + esc(em.n + "　" + em.note) + "</title></rect>" +
      '<text x="' + (x1 + 8).toFixed(1) + '" y="' + (yy + 14) + '" font-size="9.8" fill="#fff" style="pointer-events:none">' + esc(em.note.slice(0, Math.max(0, Math.floor(w / 11)))) + "</text>";
  });
  const yb = 44 + EMPIRE_SPANS.length * 30 + 4;
  [[722, "北亡"], [586, "南亡"], [538, "归回"], [4, "基督降生"], [-70, "圣殿被毁"]].forEach(m => {
    const x = EX(m[0]);
    es += '<line x1="' + x.toFixed(1) + '" y1="34" x2="' + x.toFixed(1) + '" y2="' + yb + '" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="4 3"/>' +
      '<text x="' + x.toFixed(1) + '" y="' + (yb + 14) + '" class="barlbl" text-anchor="middle" fill="var(--gold)" font-weight="700">' + m[1] + "</text>";
  });
  es += "</svg>";
  ec.innerHTML = es;
  REVEAL.add(ec, () => requestAnimationFrame(() => $$(".ebar", ec).forEach(r => { r.style.transform = "scaleX(1)"; })));
})();
