/* The Conflict Ledger — Main Script
 * Vanilla JS, no build step required
 * Data loaded async from ./data.json with inline fallback
 */


/* ─── GLOBAL: VIEW SWITCHER ────────────────────────────────── */
function switchView(v) {
  try { localStorage.setItem('cl-view', v); } catch(e) {}
  try { if(window.plausible) plausible('Switch View', {props:{view:v}}); } catch(e) {}
  var isRes = v === 'research';
  document.getElementById('tab-simple').setAttribute('aria-pressed', String(!isRes));
  document.getElementById('tab-research').setAttribute('aria-pressed', String(isRes));
  document.body.classList.toggle('show-research', isRes);
  document.getElementById('tab-simple').classList.toggle('sw-active', !isRes);
  document.getElementById('tab-research').classList.toggle('sw-active', isRes);
  window.scrollTo(0, 0);
  if (isRes && !window._resInited) { window._resInited = true; initResearch(); }
}

/* ─── SIMPLE SCRIPTS (isolated scope) ──────────────────────── */
(function() {

/* PROGRESS BAR */
var prog = document.getElementById('prog');
var raf = false;
window.addEventListener('scroll', function() {
  if (raf) return; raf = true;
  requestAnimationFrame(function() {
    var s = window.scrollY, t = document.body.scrollHeight - window.innerHeight;
    prog.style.width = Math.min((s/t)*100, 100) + '%';
    raf = false;
  });
}, {passive: true});

/* SCROLL REVEAL */
var obs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { e.target.classList.add('s-visible'); obs.unobserve(e.target); }
  });
}, {threshold: 0.07, rootMargin: '0px 0px -20px 0px'});
document.querySelectorAll('.s-reveal').forEach(function(el) { obs.observe(el); });

/* COUNT-UP */
function countUp(el) {
  var fin = parseFloat(el.dataset.target);
  var dec = parseInt(el.dataset.dec || '0');
  var sfx = el.dataset.suffix || '';
  var pfx = el.dataset.prefix || '';
  var dur = 1400, t0 = performance.now();
  var ease = function(t) { return 1 - Math.pow(2, -10 * t); };
  (function frame(now) {
    var p = Math.min((now - t0) / dur, 1);
    el.textContent = pfx + (ease(p) * fin).toFixed(dec) + sfx;
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = pfx + fin.toFixed(dec) + sfx;
  })(t0);
}
var cuObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { countUp(e.target); cuObs.unobserve(e.target); }
  });
}, {threshold: 0.6});
document.querySelectorAll('[data-target]').forEach(function(el) { cuObs.observe(el); });

/* BAR ANIMATION */
var barObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.pct + '%';
      barObs.unobserve(e.target);
    }
  });
}, {threshold: 0.4});
document.querySelectorAll('.comp-bar-fill').forEach(function(el) { barObs.observe(el); });

/* SECTOR CHART */
var SEC_LABELS = ['Private Security', 'Aerospace & Defense', 'Agri. Commodities',
                  'Energy (Oil & Gas)', 'Gold / Safe-Haven', 'Consumer Goods', 'Tourism'];
var SEC_VALUES = [44.6, 32.4, 22.1, 18.7, 14.2, -4.1, -11.8];

var chartObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (!e.isIntersecting) return;
    if (typeof Chart === 'undefined') return;
    var sk = document.getElementById('sk-' + e.target.id);
    if (sk) sk.style.display = 'none';
    e.target.style.display = 'block';
    new Chart(e.target.getContext('2d'), {
      type: 'bar',
      data: {
        labels: SEC_LABELS,
        datasets: [{
          data: SEC_VALUES,
          backgroundColor: SEC_VALUES.map(function(v) {
            return v >= 0 ? 'rgba(26,107,58,0.75)' : 'rgba(212,43,43,0.75)';
          }),
          borderColor: 'transparent', borderRadius: 2
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: {
          legend: {display: false},
          tooltip: {
            backgroundColor: '#0e2040', titleColor: '#ffffff',
            bodyColor: 'rgba(255,255,255,.7)', borderColor: 'rgba(255,255,255,.1)',
            borderWidth: 1, padding: 10,
            titleFont: {family: 'DM Mono', size: 10, weight: '500'},
            bodyFont: {family: 'DM Mono', size: 10},
            callbacks: {label: function(i) { return ' ' + (i.raw > 0 ? '+' : '') + i.raw + '% YTD 2026'; }}
          }
        },
        scales: {
          x: {
            grid: {color: 'rgba(0,0,0,.06)'},
            ticks: {color: '#7a7268', font: {family: 'DM Mono', size: 9.5}, callback: function(v) { return v + '%'; }},
            border: {color: 'transparent'}
          },
          y: {
            grid: {display: false},
            ticks: {color: '#7a7268', font: {family: 'DM Mono', size: 9.5}, maxRotation: 0},
            border: {color: 'transparent'}
          }
        },
        animation: {duration: 900, easing: 'easeOutQuart'}
      }
    });
    chartObs.unobserve(e.target);
  });
}, {threshold: 0.2});
document.querySelectorAll('#sectorChartSimple').forEach(function(el) { chartObs.observe(el); });

/* SCENARIO SWITCHER */
/* SCENARIOS populated by fetchData() above */

function showScenario(name) {
  if (!SCENARIOS) return;
  var s = SCENARIOS[name];
  document.getElementById('sc-title').textContent   = s.title;
  document.getElementById('sc-defense').textContent = s.defense;
  document.getElementById('sc-spend').textContent   = s.spend;
  document.getElementById('sc-oil').textContent     = s.oil;
  document.getElementById('sc-recon').textContent   = s.recon;
  document.getElementById('sc-human').textContent   = s.human;
  document.getElementById('sc-note').textContent    = s.note;

  // Color defense value
  var defEl = document.getElementById('sc-defense');
  defEl.className = 'sc-row-val ' + (name === 'bear' ? 's-neg' : 's-pos');

  // Color recon value
  var reconEl = document.getElementById('sc-recon');
  reconEl.style.color = name === 'bear' ? 'var(--green)' : 'var(--muted)';

  // Active button state
  document.querySelectorAll('.sc-btn').forEach(function(b) {
    b.classList.remove('s-active');
    b.setAttribute('aria-pressed', 'false');
  });
  var activeBtn = document.querySelector('.sc-btn.' + name);
  if (activeBtn) {
    activeBtn.classList.add('s-active');
    activeBtn.setAttribute('aria-pressed', 'true');
  }

  document.getElementById('sc-output').classList.add('s-show');
}

/* expose to HTML onclick */
window.showScenario = showScenario;

  /* Re-attempt simple chart if Chart.js loads after scroll */
  window.addEventListener('chartjs-loaded', function() {
    var sk = document.getElementById('sk-sectorChartSimple');
    var cv = document.getElementById('sectorChartSimple');
    if (!cv) return;
    var rect = cv.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (sk) sk.style.display = 'none';
      cv.style.display = 'block';
      if (!cv._chartInited) {
        cv._chartInited = true;
        if (typeof Chart !== 'undefined') new Chart(cv.getContext('2d'), window._simpleChartConfig || {});
      }
    }
  });

/* dark mode for simple view */
window.toggleSimpleDark = function() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  var newDark = !isDark;
  document.documentElement.setAttribute('data-theme', newDark ? 'dark' : 'light');
  var btn = document.getElementById('simpleDmBtn');
  if (btn) { btn.textContent = newDark ? '☀ LIGHT' : '☾ DARK'; btn.setAttribute('aria-pressed', String(newDark)); }
  try { localStorage.setItem('cl-dark', newDark ? '1' : '0'); } catch(e) {}
  window._resDark = newDark;  // sync research chart palette
  if (window.refreshAllCharts) window.refreshAllCharts();
  // Sync research dark mode button label if visible
  var resDmBtn = document.getElementById('dmBtn');
  if (resDmBtn) resDmBtn.textContent = newDark ? '☀ LIGHT' : '☾ DARK';
};

})();

/* ─── GLOBAL: RESEARCH LAZY INIT ───────────────────────────── */
function initResearch() {
  if (window.rObs)  document.querySelectorAll('#view-research .reveal').forEach(function(el){ window.rObs.observe(el); });
  if (window.cuObs) document.querySelectorAll('#view-research [data-target]').forEach(function(el){ window.cuObs.observe(el); });
  if (window.bObs)  document.querySelectorAll('#view-research .cf-bar-fill').forEach(function(el){ window.bObs.observe(el); });
  if (window.calcUpdate) window.calcUpdate();
}

/* ─── RESEARCH SCRIPTS (isolated scope) ────────────────────── */
(function() {

/* THEME */
const html = document.documentElement;
const dmBtn = document.getElementById('dmBtn');
let dark = false;
dmBtn.addEventListener('click', () => {
  dark = !dark;
  window._resDark = dark;
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  dmBtn.textContent = dark ? '☀ LIGHT' : '☾ DARK';
  // Sync simple view dark mode button
  var simpleDmBtn = document.getElementById('simpleDmBtn');
  if (simpleDmBtn) {
    simpleDmBtn.textContent = dark ? '☀ LIGHT' : '☾ DARK';
    simpleDmBtn.setAttribute('aria-pressed', String(dark));
  }
  try { localStorage.setItem('cl-dark', dark ? '1' : '0'); } catch(e) {}
  refreshAllCharts();
});

/* PROGRESS */
const progressBar = document.getElementById('progress-bar');
const scrollTopBtn = document.getElementById('scrollTop');
let rafP = false;
window.addEventListener('scroll', () => {
  if (rafP) return; rafP = true;
  requestAnimationFrame(() => {
    const s = window.scrollY, t = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = Math.min((s/t)*100,100)+'%';
    scrollTopBtn.classList.toggle('show', s > 400);
    rafP = false;
  });
}, {passive:true});

/* NAV ACTIVE */
const navLinks = document.querySelectorAll('.nav-link');
const sectionIds = ['findings','analysis','data','cases','perspectives','scenarios','calculator','glossary','sources'];
window.addEventListener('scroll', () => {
  const y = window.scrollY + 130;
  let cur = '';
  sectionIds.forEach(id => { const el = document.getElementById(id); if (el && el.offsetTop <= y) cur = id; });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#'+cur));
}, {passive:true});

/* GLOSSARY TOGGLE */
function toggleGl(trigger) {
  const def = trigger.nextElementSibling;
  trigger.classList.toggle('open');
  def.classList.toggle('open');
  trigger.setAttribute('aria-expanded', trigger.classList.contains('open') ? 'true' : 'false');
}

/* FOOTNOTE SCROLL — Safari-safe */
function scrollToFn(n) {
  const el = document.getElementById('sources');
  if (!el) return;
  // Safari <14 doesn't support scrollIntoView options reliably
  try {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch(e) {
    el.scrollIntoView(true);
  }
}

/* ── DATA (loaded async from data.json) ──────────────────────
 * Falls back to inline values if fetch fails (e.g. file:// protocol)
 * To update data: edit data.json, no JS changes needed.
 */
var DEF_VALUES   = [88,74,67,59,94,71,18];
var SEC_LABELS   = ['Private Security','Aerospace & Defense','Agri. Commodities','Energy (Oil & Gas)','Gold / Safe-Haven','Maritime Insurance','Civilian Consumer Goods','Tourism & Hospitality'];
var SEC_VALUES   = [44.6,32.4,22.1,18.7,14.2,9.3,-4.1,-11.8];
var DONUT_VALUES = [916,296,380,109,142,157];
var DONUT_LABELS = ['USA','China','EU/NATO','Russia','Indo-Pac.','Other'];
var DK_COLORS    = ['#5090d0','#e05060','#d4a030','#a0aabb','#3aaa66','#304050'];
var LT_COLORS    = ['#1a4a8a','#c8102e','#9a6800','#6b6560','#1a6b3a','#c4bfb0'];
var SCENARIOS    = null; // populated by fetchData()
var PRESETS      = null; // populated by fetchData()

function fetchData() {
  return fetch('./data.json')
    .then(function(r) {
      if (!r.ok) throw new Error('data.json not found');
      return r.json();
    })
    .then(function(d) {
      // Overwrite inline fallbacks with fetched values
      DEF_VALUES   = d.defenseContractors.ytdReturns;
      SEC_LABELS   = d.sectors.labels;
      SEC_VALUES   = d.sectors.ytdReturns;
      DONUT_VALUES = d.regionalSpend.values;
      DONUT_LABELS = d.regionalSpend.labels;
      DK_COLORS    = d.defenseContractors.colors.dark;
      LT_COLORS    = d.defenseContractors.colors.light;
      // Build SCENARIOS from JSON
      SCENARIOS = {};
      ['bull','base','bear'].forEach(function(k) { SCENARIOS[k] = d.scenarios[k]; });
      // Build PRESETS from JSON
      PRESETS = {};
      Object.keys(d.calculatorPresets).forEach(function(k) { PRESETS[k] = d.calculatorPresets[k]; });
      try { window.dispatchEvent(new Event('data-loaded')); } catch(e) {}
    })
    .catch(function() {
      // Fetch failed (file://, network error, etc.) — use inline fallback values
      SCENARIOS = {
        bull: { title:'Scenario: Escalation', defense:'Strong further gains', spend:'$2.7–2.9 trillion', oil:'$90–120/barrel', recon:'Very low demand', human:'Worsening significantly', note:'Based on 2022–2023 escalation data.' },
        base: { title:'Scenario: Status Quo', defense:'Moderate gains likely', spend:'$2.5–2.6 trillion', oil:'$70–85/barrel', recon:'Low demand', human:'Remains critical', note:'Most likely near-term path consistent with 2024–2025 SIPRI trend data.' },
        bear: { title:'Scenario: De-escalation', defense:'Multiple compression likely', spend:'$2.2–2.4 trillion', oil:'$55–70/barrel', recon:'Strong demand (rebuilding)', human:'Improving, slowly', note:'Based on post-Cold War (1991) and post-Iraq (2003) drawdown patterns.' }
      };
      PRESETS = {
        escalation:   { defense:30, alloc:35, intensity:90, oil:18 },
        base:         { defense:10, alloc:20, intensity:70, oil:5  },
        deescalation: { defense:-5, alloc:10, intensity:30, oil:-5 }
      };
      try { window.dispatchEvent(new Event('data-loaded')); } catch(e) {}
    });
}

function p() {
  var d = dark || (window._resDark || false);
  return {
    axis: d?'#708090':'#8a8278', grid: d?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.07)',
    bg: d?'#161b22':'#ffffff', paper: d?'#0d1117':'#f9f8f5',
    defBars: DEF_VALUES.map((_,i) => i===6?(d?'rgba(255,255,255,.18)':'rgba(0,0,0,.18)'):i===4?(d?'#e05060':'#c8102e'):(d?'#5090d0':'#1a4a8a')),
    secBars: v => v>=0?(d?'rgba(58,170,102,.8)':'rgba(26,107,58,.75)'):(d?'rgba(224,80,96,.8)':'rgba(200,16,46,.75)'),
    tt: { backgroundColor: d?'#1c2430':'#ffffff', titleColor: d?'#5090d0':'#1a4a8a', bodyColor: d?'#a0aabb':'#6b6560', borderColor: d?'#304050':'#d8d4c8', borderWidth:1, padding:11 }
  };
}

let defChart, sectorChart, donutChart;

function mkFont(sz) { return {family:'IBM Plex Mono',size:sz}; }
function mkTT(opts={}) { const pp=p(); return {...pp.tt, titleFont:mkFont(10), bodyFont:mkFont(10), ...opts}; }

function initDef() {
  if (typeof Chart === "undefined") return;
  if (defChart) return;
  var _sk = document.getElementById('sk-defChart');
  if (_sk) _sk.style.display = 'none';
  var _cv = document.getElementById('defChart');
  if (_cv) _cv.style.display = 'block';
  const pp = p();
  defChart = new Chart(document.getElementById('defChart').getContext('2d'), {
    type:'bar', data:{ labels:['Lockheed Martin','Northrop Grumman','Raytheon/RTX','BAE Systems','Rheinmetall','General Dynamics','S&P 500 Avg.'], datasets:[{data:DEF_VALUES,backgroundColor:pp.defBars,borderColor:'transparent',borderRadius:2,borderSkipped:false}] },
    options:{ responsive:true, maintainAspectRatio:false, indexAxis:'y',
      plugins:{ legend:{display:false}, tooltip:{...mkTT(), callbacks:{ title:i=>i[0].label, label:i=>{const v=i.raw,r=18;return ` +${v}% YTD${v>r?` (+${v-r}pp vs S&P)`:' (Benchmark)'}`; }, afterLabel:i=>{const n=['Defense & Aerospace','Multi-domain Defense','Missiles & Defense','UK Defense Prime','German Rearmament','Land & Sea Systems','S&P 500 Benchmark'];return ` ${n[i.dataIndex]}`; } }} },
      scales:{ x:{min:0,max:110,grid:{color:p().grid},ticks:{color:p().axis,font:mkFont(9),callback:v=>v+'%'},border:{color:'transparent'}}, y:{grid:{display:false},ticks:{color:p().axis,font:mkFont(9),maxRotation:0},border:{color:'transparent'}} },
      animation:{duration:900,easing:'easeOutQuart'} }
  });
}

function initSector() {
  if (typeof Chart === "undefined") return;
  if (sectorChart) return;
  var _sk = document.getElementById('sk-sectorChart');
  if (_sk) _sk.style.display = 'none';
  var _cv = document.getElementById('sectorChart');
  if (_cv) _cv.style.display = 'block';
  const pp = p();
  sectorChart = new Chart(document.getElementById('sectorChart').getContext('2d'), {
    type:'bar', data:{ labels:['PMC / Priv. Security','Aerospace & Defense','Agri. Commodities','Energy (Oil & Gas)','Gold / Safe-Haven','Infra / Reconstr.','Consumer Goods','Tourism / Hospitality'], datasets:[{data:SEC_VALUES,backgroundColor:SEC_VALUES.map(pp.secBars),borderColor:'transparent',borderRadius:2}] },
    options:{ responsive:true, maintainAspectRatio:false, indexAxis:'y',
      plugins:{ legend:{display:false}, tooltip:{...mkTT(), callbacks:{label:i=>` ${i.raw>0?'+':''}${i.raw}% YTD 2026`}} },
      scales:{ x:{grid:{color:p().grid},ticks:{color:p().axis,font:mkFont(8.5),callback:v=>v+'%'},border:{color:'transparent'}}, y:{grid:{display:false},ticks:{color:p().axis,font:mkFont(8.5),maxRotation:0},border:{color:'transparent'}} },
      animation:{duration:900,easing:'easeOutQuart'} }
  });
}

function initDonut() {
  if (typeof Chart === "undefined") return;
  if (donutChart) return;
  var _sk = document.getElementById('sk-donutChart');
  if (_sk) _sk.style.display = 'none';
  var _cv = document.getElementById('donutChart');
  if (_cv) _cv.style.display = 'block';
  const pp = p();
  donutChart = new Chart(document.getElementById('donutChart').getContext('2d'), {
    type:'doughnut', data:{ labels:DONUT_LABELS, datasets:[{data:DONUT_VALUES,backgroundColor:dark?DK_COLORS:LT_COLORS,borderColor:pp.bg,borderWidth:2,hoverOffset:6}] },
    options:{ responsive:true, maintainAspectRatio:false, cutout:'60%',
      plugins:{ legend:{display:true,position:'right',labels:{color:p().axis,font:mkFont(9),boxWidth:9,padding:7}}, tooltip:{...mkTT(), callbacks:{label:i=>` $${i.raw}B (${((i.raw/2000)*100).toFixed(1)}%)`}} },
      animation:{duration:1000,easing:'easeOutQuart'} }
  });
}

const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(!e.isIntersecting) return; if(e.target.id==='defChart') initDef(); if(e.target.id==='sectorChart') initSector(); if(e.target.id==='donutChart') initDonut(); cObs.unobserve(e.target); });
},{threshold:0.1});
['defChart','sectorChart','donutChart'].forEach(id => { const el=document.getElementById(id); if(el) cObs.observe(el); });

function refreshAllCharts() {
  const pp = p();
  if(defChart){defChart.data.datasets[0].backgroundColor=pp.defBars;defChart.options.scales.x.grid.color=pp.grid;defChart.options.scales.x.ticks.color=pp.axis;defChart.options.scales.y.ticks.color=pp.axis;}
  if(sectorChart){sectorChart.data.datasets[0].backgroundColor=SEC_VALUES.map(pp.secBars);sectorChart.options.scales.x.grid.color=pp.grid;sectorChart.options.scales.x.ticks.color=pp.axis;sectorChart.options.scales.y.ticks.color=pp.axis;}
  if(donutChart){donutChart.data.datasets[0].backgroundColor=dark?DK_COLORS:LT_COLORS;donutChart.data.datasets[0].borderColor=pp.bg;donutChart.options.plugins.legend.labels.color=pp.axis;}
  [defChart,sectorChart,donutChart].filter(Boolean).forEach(c=>c.update('none'));
}

/* SCROLL REVEAL */
const rObs = new IntersectionObserver(entries => { entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');rObs.unobserve(e.target);} }); },{threshold:0.05,rootMargin:'0px 0px -24px 0px'});
document.querySelectorAll('.reveal').forEach(el => rObs.observe(el));

/* COUNT-UP */
function countUp(el) {
  const fin=parseFloat(el.dataset.target), dec=parseInt(el.dataset.dec??'0'), sfx=el.dataset.suffix??'', pfx=el.dataset.prefix??'', dur=1500, t0=performance.now(), ease=t=>1-Math.pow(2,-10*t);
  (function frame(now){ const prog=Math.min((now-t0)/dur,1); el.textContent=pfx+(ease(prog)*fin).toFixed(dec)+sfx; if(prog<1) requestAnimationFrame(frame); else el.textContent=pfx+fin.toFixed(dec)+sfx; })(t0);
}
const cuObs = new IntersectionObserver(entries => { entries.forEach(e=>{ if(e.isIntersecting){countUp(e.target);cuObs.unobserve(e.target);} }); },{threshold:0.6});
document.querySelectorAll('[data-target]').forEach(el=>cuObs.observe(el));

/* INTENSITY BARS */
const bObs = new IntersectionObserver(entries => { entries.forEach(e=>{ if(e.isIntersecting){e.target.style.width=e.target.dataset.pct+'%';bObs.unobserve(e.target);} }); },{threshold:0.5});
document.querySelectorAll('.cf-bar-fill').forEach(el=>bObs.observe(el));

/* TABLE SORT */
var _tblEl = document.getElementById('sectorTable');
if (_tblEl) {
const tbl=_tblEl, tbdy=tbl.querySelector('tbody');
let sc=-1,sd=1;
tbl.querySelectorAll('thead th').forEach((th,i)=>{
  th.addEventListener('click',()=>{
    sc===i?sd*=-1:(sc=i,sd=1);
    tbl.querySelectorAll('thead th').forEach(t=>t.classList.remove('sort-asc','sort-desc'));
    th.classList.add(sd===1?'sort-asc':'sort-desc');
    Array.from(tbdy.querySelectorAll('tr')).sort((a,b)=>{const av=a.cells[i].textContent.trim(),bv=b.cells[i].textContent.trim(),an=parseFloat(av.replace(/[^-\d.]/g,'')),bn=parseFloat(bv.replace(/[^-\d.]/g,''));return(!isNaN(an)&&!isNaN(bn))?(an-bn)*sd:av.localeCompare(bv)*sd;}).forEach(r=>tbdy.appendChild(r));
  });
});
}

/* ─── PDF EXPORT — Safari-hardened ──────────────────────── */
function downloadPDF() {
  var btn = document.getElementById('pdfBtn');
  if (btn) { btn.classList.add('loading'); btn.textContent = '⏳ Preparing…'; }
  try { if(window.plausible) plausible('Download PDF'); } catch(e) {}

  // Switch to light mode for clean print output
  var wasDark = document.body.classList.contains('show-research')
    ? (typeof dark !== 'undefined' ? dark : false) : false;
  if (wasDark && window.refreshAllCharts) {
    document.documentElement.setAttribute('data-theme','light');
    window.refreshAllCharts();
  }


  setTimeout(function() {
    window.print();
    // Restore after print dialog closes
    setTimeout(function() {

      if (wasDark && window.refreshAllCharts) {
        document.documentElement.setAttribute('data-theme','dark');
        window.refreshAllCharts();
      }
      if (btn) { btn.classList.remove('loading'); btn.textContent = '↓ Download PDF'; }
    }, 1000);
  }, 300);
}

/* ─── UNIVERSAL TOOLTIP ENGINE ───────────────────────────── */
(function() {
  const tip = document.createElement('div');
  tip.className = 'tip'; tip.id = 'globalTip';
  document.body.appendChild(tip);
  let hideTimer = null;

  function showTip(el, e) {
    const raw = el.getAttribute('data-tip');
    if (!raw) return;
    const parts = raw.split('|');
    const body = parts[0].trim();
    const src  = parts[1] ? parts[1].trim() : null;
    const titleEl = el.querySelector('.kf-num, .stat-val') || null;
    const titleText = titleEl ? titleEl.textContent.trim().slice(0,48) : '';
    tip.innerHTML =
      (titleText ? `<div class="tip-title">${titleText}</div>` : '') +
      `<div>${body}</div>` +
      (src ? `<div class="tip-src">${src}</div>` : '');
    positionTip(e);
    clearTimeout(hideTimer);
    tip.classList.add('show');
  }

  function positionTip(e) {
    const vw=window.innerWidth, tw=Math.min(260,vw-32);
    tip.style.maxWidth = tw+'px';
    let x=e.clientX+14, y=e.clientY-10;
    if (x+tw > vw-12) x=e.clientX-tw-14;
    const th=tip.offsetHeight||120;
    if (y+th > window.innerHeight-12) y=e.clientY-th-6;
    tip.style.left=(x+window.scrollX)+'px';
    tip.style.top=(y+window.scrollY)+'px';
  }

  document.addEventListener('mouseover', e => { const el=e.target.closest('[data-tip]'); if(el) showTip(el,e); });
  document.addEventListener('mousemove', e => { if(!tip.classList.contains('show')) return; const el=e.target.closest('[data-tip]'); if(el) positionTip(e); });
  document.addEventListener('mouseout',  e => { const el=e.target.closest('[data-tip]'); if(el&&!el.contains(e.relatedTarget)){clearTimeout(hideTimer);hideTimer=setTimeout(()=>tip.classList.remove('show'),120);} });
  document.addEventListener('touchend',  e => {
    const el=e.target.closest('[data-tip]');
    if(el){e.preventDefault();if(tip.classList.contains('show')){tip.classList.remove('show');return;}showTip(el,{clientX:e.changedTouches[0].clientX,clientY:e.changedTouches[0].clientY});}
    else tip.classList.remove('show');
  });
})();

/* ─── CALCULATOR ─────────────────────────────────────────── */
// Preset scenarios matching the Scenarios section above
/* PRESETS populated by fetchData() above */

function applyPreset(name) {
  if (!PRESETS) return;
  var p = PRESETS[name];
  if (!p) return;
  document.getElementById('sl-defense').value   = p.defense;
  document.getElementById('sl-alloc').value      = p.alloc;
  document.getElementById('sl-intensity').value  = p.intensity;
  document.getElementById('sl-oil').value        = p.oil;
  calcUpdate();
}

function calcUpdate() {
  const def=+document.getElementById('sl-defense').value, alloc=+document.getElementById('sl-alloc').value, inten=+document.getElementById('sl-intensity').value, oil=+document.getElementById('sl-oil').value;
  document.getElementById('val-defense').textContent=(def>=0?'+':'')+def+'%';
  document.getElementById('val-alloc').textContent=alloc+'%';
  document.getElementById('val-intensity').textContent=inten;
  document.getElementById('val-oil').textContent=(oil>=0?'+':'')+oil+'%';
  const dr=(def*1.85+inten*.28).toFixed(1), er=(oil*1.6+inten*.08).toFixed(1), gr=(inten*.06+Math.max(0,-def)*.4).toFixed(1), cr=(-inten*.04-oil*.2).toFixed(1), ir=(oil*1.1+inten*.15).toFixed(1), pr=((alloc/100)*parseFloat(dr)+(1-alloc/100)*parseFloat(er)*.3).toFixed(1);
  const set=(id,v,p,n)=>{const el=document.getElementById(id);el.textContent=(parseFloat(v)>=0?'+':'')+v+'%';el.className='res-val '+(parseFloat(v)>0?p:parseFloat(v)<0?n:'neu');};
  set('res-defense',dr,'pos','neg'); set('res-energy',er,'pos','neg'); set('res-portfolio',pr,'pos','neg');
  document.getElementById('res-gold').textContent='+'+gr+'%';
  set('res-consumer',cr,'pos','neg');
  document.getElementById('res-insurance').textContent='+'+ir+'% premium';
}

/* kick off data fetch immediately */
fetchData();

/* expose observers globally so initResearch() can access them */
  window.rObs = typeof rObs !== "undefined" ? rObs : null;
  window.cuObs = typeof cuObs !== "undefined" ? cuObs : null;
  window.bObs = typeof bObs !== "undefined" ? bObs : null;
  window.cObs = typeof cObs !== "undefined" ? cObs : null;

  /* When Chart.js finishes loading, re-attempt any charts already in viewport */
  window.addEventListener('chartjs-loaded', function() {
    // Hide all skeletons that are still showing
    document.querySelectorAll('.chart-skeleton').forEach(function(sk) {
      sk.style.display = 'none';
    });
    // Reveal canvases and init any that are currently visible
    ['defChart','sectorChart','donutChart'].forEach(function(id) {
      var canvas = document.getElementById(id);
      if (!canvas) return;
      canvas.style.display = 'block';
      // Check if it's in viewport — if so, init immediately
      var rect = canvas.getBoundingClientRect();
      var inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        if (id === 'defChart'    && typeof initDef    === 'function') initDef();
        if (id === 'sectorChart' && typeof initSector === 'function') initSector();
        if (id === 'donutChart'  && typeof initDonut  === 'function') initDonut();
      }
    });
  });
/* expose to HTML onclick */
window.toggleGl      = typeof toggleGl      !== "undefined" ? toggleGl      : null;
window.scrollToFn    = typeof scrollToFn    !== "undefined" ? scrollToFn    : null;
window.downloadPDF   = typeof downloadPDF   !== "undefined" ? downloadPDF   : null;
window.applyPreset   = typeof applyPreset   !== "undefined" ? applyPreset   : null;
window.calcUpdate    = typeof calcUpdate    !== "undefined" ? calcUpdate    : null;
window.refreshAllCharts = typeof refreshAllCharts !== "undefined" ? refreshAllCharts : null;
})();
