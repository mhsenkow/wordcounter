#!/usr/bin/env node
/**
 * Generate number-instrument pages under repo root.
 * Run: node scripts/gen-number-tools.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const FONTS =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Serif:wght@400;500&family=Josefin+Sans:wght@400;500&family=Josefin+Slab:wght@400;500&family=Libre+Franklin:wght@400;500&family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Oswald:wght@400;500&family=Roboto+Slab:wght@400;500&family=Share+Tech+Mono&family=Source+Code+Pro:wght@400;500&family=Source+Sans+3:wght@400;500&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&family=Space+Mono:wght@400;700&display=swap';

function pageShell({ id, title, blurb, about, status, body, script, hasViz }) {
  const soon = status === 'soon';
  return `<!doctype html>
<html lang="en" data-theme="light" data-ui="braun" data-font="mono" data-faces="auto" data-show-viz="true">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#f2f2f0" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#161616" media="(prefers-color-scheme: dark)">
<title>${title} — ibm.io</title>
<meta name="description" content="${blurb}">
<link rel="canonical" href="https://ibm.io/${id}/">
<link id="webFonts" rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="../lib/number-tool.css?v=23">
</head>
<body class="tool-app${soon ? ' is-soon' : ''}" data-tool="${id}">
<header class="masthead">
  <div class="masthead-start">
    <h1>${title}</h1>
  </div>
  <div class="actions">
    <button id="themeBtn" class="icon-btn" type="button" aria-label="theme">
      <span class="theme-orb" aria-hidden="true"></span>
    </button>
    <button id="settingsToggle" type="button" aria-expanded="false" aria-controls="settings">settings</button>
  </div>
</header>
<main>
${soon ? `<p class="soon-badge">coming soon</p>
  <div class="face">
    <div class="face-value" style="color:var(--mute)" role="status" aria-live="polite" aria-atomic="true">—</div>
    <p class="face-sub">${blurb}. Local instrument; not built yet.</p>
  </div>
  <p class="note">Open the tools panel (top right) for live instruments. This page holds the slot so the suite stays honest.</p>` : body}
</main>
<script src="../lib/suite.js?v=23"></script>
<script src="../lib/number-tool.js?v=23"></script>
<script>
(function () {
  if (window.IBMTools) IBMTools.mountSuiteNav('${id}');
  window.IBMNumberTool && IBMNumberTool.mountSettings({
    id: '${id}',
    about: ${JSON.stringify(about || blurb)},
    hasViz: ${soon ? 'false' : hasViz ? 'true' : 'false'}
  });
${soon ? `  document.body.classList.add('is-soon');
  window.IBMNumberTool && IBMNumberTool.paintSoonGhost('${id}');
` : script}
})();
</script>
</body>
</html>
`;
}

const tools = {
  bill: {
    title: 'bill',
    blurb: 'tip · split',
    about: 'Receipt total → tip → per person. Person columns show tip share of the grand total.',
    status: 'live',
    hasViz: true,
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">$0.00</div>
    <p class="face-sub" id="sub">per person</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>receipt</legend>
      <label class="row"><span class="key">total</span><span class="value"><input id="total" type="number" inputmode="decimal" min="0" step="0.01" value="86.40" aria-label="receipt total"></span></label>
      <label class="row"><span class="key">tip</span><span class="value"><input id="tip" type="number" inputmode="decimal" min="0" step="1" value="20" data-primary data-axis="y" data-axis-x="people" data-step-fast="5" data-gesture="1" aria-label="tip percent"><span class="unit">%</span></span></label>
      <label class="row"><span class="key">people</span><span class="value"><input id="people" type="number" inputmode="numeric" min="1" step="1" value="2" aria-label="people"></span></label>
    </fieldset>
    <div class="presets" id="presets" role="group" aria-label="tip presets">
      <button type="button" class="preset" data-tip="15" aria-pressed="false">15%</button>
      <button type="button" class="preset" data-tip="18" aria-pressed="false">18%</button>
      <button type="button" class="preset" data-tip="20" aria-pressed="true">20%</button>
      <button type="button" class="preset" data-tip="25" aria-pressed="false">25%</button>
    </div>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('bill');
  function money(n){ return '$' + (Math.round(n * 100) / 100).toFixed(2); }
  function syncTipPresets(tipPct){
    document.querySelectorAll('#presets .preset').forEach(function(btn){
      btn.setAttribute('aria-pressed', String(Number(btn.getAttribute('data-tip')) === tipPct));
    });
  }
  function paint(people, tipPct){
    var n = Math.max(1, Math.min(12, people));
    /* Tip share of grand total — not raw tip% (which can fill the stage) */
    var tipH = Math.max(0, Math.min(92, (tipPct / (100 + Math.max(tipPct, 0))) * 100));
    var html = '<div class="person-cols">';
    for (var i = 0; i < n; i++) html += '<b style="--tip:' + tipH.toFixed(1) + '%"></b>';
    html += '</div>';
    stage.innerHTML = html;
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var total = Math.max(0, parseFloat(document.getElementById('total').value) || 0);
    var tipPct = Math.max(0, parseFloat(document.getElementById('tip').value) || 0);
    var people = Math.max(1, parseInt(document.getElementById('people').value, 10) || 1);
    var tip = total * tipPct / 100;
    var grand = total + tip;
    var each = grand / people;
    document.getElementById('out').textContent = money(each);
    document.getElementById('sub').textContent =
      (people === 1 ? 'you pay' : 'per person') + ' · tip ' + money(tip) + ' · total ' + money(grand);
    paint(people, tipPct);
    syncTipPresets(tipPct);
    try { localStorage.setItem('ibm.tool.bill', JSON.stringify({ total: total, tip: tipPct, people: people })); } catch(e){}
  }
  ['total','tip','people'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  document.getElementById('presets').addEventListener('click', function(e){
    var btn = e.target.closest('[data-tip]');
    if (!btn) return;
    document.getElementById('tip').value = btn.getAttribute('data-tip');
    render();
  });
  try {
    var saved = JSON.parse(localStorage.getItem('ibm.tool.bill') || 'null');
    if (saved) {
      if (saved.total != null) document.getElementById('total').value = saved.total;
      if (saved.tip != null) document.getElementById('tip').value = saved.tip;
      if (saved.people != null) document.getElementById('people').value = saved.people;
    }
  } catch(e){}
  render();`
  },

  hourly: {
    title: 'hourly',
    blurb: 'rate · project',
    about: 'Hourly ↔ day rate ↔ project total. Day columns fill with worked hours.',
    status: 'live',
    hasViz: true,
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">$0</div>
    <p class="face-sub" id="sub">project total</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>rate</legend>
      <label class="row"><span class="key">$ / hour</span><span class="value"><input id="rate" type="number" inputmode="decimal" min="0" step="1" value="125" data-step-fast="10" aria-label="hourly rate"></span></label>
      <label class="row"><span class="key">hours / day</span><span class="value"><input id="hpd" type="number" inputmode="decimal" min="0" step="0.5" value="6" aria-label="hours per day"></span></label>
      <label class="row"><span class="key">days</span><span class="value"><input id="days" type="number" inputmode="decimal" min="0" step="0.5" value="10" data-primary data-axis="y" data-axis-x="hpd" data-pinch="rate" data-step-fast="5" data-gesture="1" aria-label="days"></span></label>
    </fieldset>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('hourly');
  function money(n){ return '$' + Math.round(n).toLocaleString('en-US'); }
  function paint(days, hpd){
    var d = Math.max(0, Math.min(18, Math.round(days)));
    var slots = Math.max(1, Math.min(12, Math.round(hpd) || 1));
    var worked = Math.max(0, Math.min(slots, Math.round(hpd)));
    var html = '<div class="day-cols">';
    for (var i = 0; i < d; i++) {
      html += '<div class="day">';
      for (var s = 0; s < slots; s++) html += '<i class="' + (s < worked ? 'on' : '') + '"></i>';
      html += '</div>';
    }
    html += '</div>';
    stage.innerHTML = html;
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var rate = Math.max(0, parseFloat(document.getElementById('rate').value) || 0);
    var hpd = Math.max(0, parseFloat(document.getElementById('hpd').value) || 0);
    var days = Math.max(0, parseFloat(document.getElementById('days').value) || 0);
    var hours = hpd * days;
    var total = rate * hours;
    var dayRate = rate * hpd;
    document.getElementById('out').textContent = money(total);
    document.getElementById('sub').textContent =
      'day rate ' + money(dayRate) + (hours ? ' · ' + hours + 'h' : '');
    paint(days, hpd);
  }
  ['rate','hpd','days'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  render();`
  },

  fuel: {
    title: 'fuel',
    blurb: 'mpg · trip cost',
    about: 'Miles ÷ mpg × price. Bead tape = gallons along the trip.',
    status: 'live',
    hasViz: true,
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">$0</div>
    <p class="face-sub" id="sub">trip fuel cost</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>trip</legend>
      <label class="row"><span class="key">miles</span><span class="value"><input id="miles" type="number" inputmode="decimal" min="0" step="5" value="320" data-primary data-axis="y" data-axis-x="mpg" data-pinch="price" data-step-fast="25" data-gesture="1" aria-label="miles"></span></label>
      <label class="row"><span class="key">mpg</span><span class="value"><input id="mpg" type="number" inputmode="decimal" min="0.1" step="0.1" value="28" aria-label="miles per gallon"></span></label>
      <label class="row"><span class="key">$ / gal</span><span class="value"><input id="price" type="number" inputmode="decimal" min="0" step="0.01" value="3.89" data-step-fast="0.1" aria-label="dollars per gallon"></span></label>
    </fieldset>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('fuel');
  function paint(gal, miles){
    var raw = Math.max(0, gal);
    var maxBeads = 48;
    var scale = raw > maxBeads ? raw / maxBeads : 1;
    var beads = Math.max(0, Math.min(maxBeads, Math.round(raw / scale)));
    var html = '<div class="trip-tape">';
    for (var i = 0; i < beads; i++) html += '<i class="on"></i>';
    html += '<span class="cap">' + miles.toFixed(0) + ' mi</span></div>';
    stage.innerHTML = html;
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var miles = Math.max(0, parseFloat(document.getElementById('miles').value) || 0);
    var mpg = Math.max(0.01, parseFloat(document.getElementById('mpg').value) || 0.01);
    var price = Math.max(0, parseFloat(document.getElementById('price').value) || 0);
    var gal = miles / mpg;
    var cost = gal * price;
    var l100 = 235.215 / mpg;
    document.getElementById('out').textContent = '$' + cost.toFixed(2);
    document.getElementById('sub').textContent =
      gal.toFixed(1) + ' gal · ' + l100.toFixed(1) + ' L/100km · $' + (price / mpg).toFixed(2) + '/mi';
    paint(gal, miles);
  }
  ['miles','mpg','price'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  render();`
  },

  unit: {
    title: 'unit',
    blurb: 'cups · grams',
    about: 'Kitchen conversions with density. Vessel fill shows relative amount.',
    status: 'live',
    hasViz: true,
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">0</div>
    <p class="face-sub" id="sub">grams</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>convert</legend>
      <label class="row"><span class="key">amount</span><span class="value"><input id="amount" type="number" inputmode="decimal" min="0" step="0.01" value="1" data-primary data-axis="y" data-step-fast="0.1" data-gesture="1" aria-label="amount"></span></label>
      <label class="row"><span class="key">from</span><span class="value">
        <select id="from" aria-label="from unit">
          <option value="cup">cup</option>
          <option value="tbsp">tbsp</option>
          <option value="tsp">tsp</option>
          <option value="ml">ml</option>
          <option value="g">g</option>
          <option value="oz">oz</option>
          <option value="lb">lb</option>
        </select>
      </span></label>
      <label class="row"><span class="key">to</span><span class="value">
        <select id="to" aria-label="to unit">
          <option value="g" selected>g</option>
          <option value="cup">cup</option>
          <option value="tbsp">tbsp</option>
          <option value="tsp">tsp</option>
          <option value="ml">ml</option>
          <option value="oz">oz</option>
          <option value="lb">lb</option>
        </select>
      </span></label>
      <label class="row" id="densityRow"><span class="key">density</span><span class="value">
        <select id="density" aria-label="ingredient density">
          <option value="1">water</option>
          <option value="0.53">flour</option>
          <option value="0.85">sugar</option>
          <option value="0.91">butter</option>
          <option value="0.72">oats</option>
        </select>
      </span></label>
    </fieldset>
    <ul class="list" id="hist"></ul>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('unit');
  var ML = { cup: 240, tbsp: 15, tsp: 5, ml: 1 };
  var G_PURE = { g: 1, oz: 28.3495, lb: 453.592 };
  function isVol(u){ return !!ML[u]; }
  function isMass(u){ return !!G_PURE[u]; }
  function toGrams(amount, unit, density) {
    if (G_PURE[unit]) return amount * G_PURE[unit];
    return amount * (ML[unit] || 1) * density;
  }
  function fromGrams(g, unit, density) {
    if (G_PURE[unit]) return g / G_PURE[unit];
    return g / ((ML[unit] || 1) * density);
  }
  function renderHist(){
    try {
      var hist = JSON.parse(localStorage.getItem('ibm.tool.unit.hist') || '[]');
      document.getElementById('hist').innerHTML = hist.slice(0, 3).map(function(line){
        return '<li><span>' + line + '</span><span></span></li>';
      }).join('');
    } catch(e){}
  }
  function commitHist(line){
    try {
      var hist = JSON.parse(localStorage.getItem('ibm.tool.unit.hist') || '[]');
      if (hist[0] !== line) {
        hist.unshift(line);
        localStorage.setItem('ibm.tool.unit.hist', JSON.stringify(hist.slice(0, 3)));
      }
    } catch(e){}
    renderHist();
  }
  function paint(amount){
    var fill = Math.max(4, Math.min(92, Math.log10(amount + 1) / Math.log10(11) * 100));
    stage.innerHTML = '<div class="vessel"><div class="ghost"></div><div class="fill" style="--fill:' + fill + '%;height:' + fill + '%"></div></div>';
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(commit){
    var amount = Math.max(0, parseFloat(document.getElementById('amount').value) || 0);
    var from = document.getElementById('from').value;
    var to = document.getElementById('to').value;
    var density = parseFloat(document.getElementById('density').value) || 1;
    var needsDensity = (isVol(from) && isMass(to)) || (isMass(from) && isVol(to));
    document.getElementById('densityRow').classList.toggle('is-hidden', !needsDensity);
    var g = toGrams(amount, from, density);
    var out = fromGrams(g, to, density);
    var pretty = out >= 100 ? out.toFixed(0) : out >= 10 ? out.toFixed(1) : out.toFixed(2);
    document.getElementById('out').textContent = pretty;
    document.getElementById('sub').textContent = amount + ' ' + from + ' → ' + pretty + ' ' + to;
    paint(amount);
    if (commit) commitHist(amount + ' ' + from + ' → ' + pretty + ' ' + to);
    else renderHist();
  }
  ['amount','from','to','density'].forEach(function(id){
    document.getElementById(id).addEventListener('input', function(){ render(false); });
    document.getElementById(id).addEventListener('change', function(){ render(true); });
  });
  document.getElementById('amount').addEventListener('keydown', function(e){
    if (e.key === 'Enter') render(true);
  });
  document.getElementById('amount').addEventListener('blur', function(){ render(true); });
  render(false);`
  },

  dose: {
    title: 'dose',
    blurb: 'mix · dilute',
    about: 'Kitchen / garden dilutions only. Background split = concentrate vs diluent.',
    status: 'live',
    hasViz: true,
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">0</div>
    <p class="face-sub" id="sub">concentrate</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>mix</legend>
      <label class="row"><span class="key">target</span><span class="value"><input id="want" type="number" inputmode="decimal" min="0" step="0.1" value="2" data-primary data-axis="y" data-axis-x="vol" data-pinch="have" data-step-fast="1" data-gesture="1" aria-label="target percent"><span class="unit">%</span></span></label>
      <label class="row"><span class="key">stock</span><span class="value"><input id="have" type="number" inputmode="decimal" min="0.01" step="0.1" value="10" data-step-fast="1" aria-label="stock percent"><span class="unit">%</span></span></label>
      <label class="row"><span class="key">batch</span><span class="value"><input id="vol" type="number" inputmode="decimal" min="0" step="1" value="1000" data-step-fast="100" aria-label="batch volume"><span class="unit">vol</span></span></label>
    </fieldset>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('dose');
  function paint(conc, water){
    stage.innerHTML = '<div class="field-split"><div class="conc"></div><div class="dil"></div></div>';
    var split = stage.querySelector('.field-split');
    IBMNumberTool.setVars(split, {
      '--a': String(conc || 0.0001),
      '--b': String(water || 0.0001)
    });
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var want = Math.max(0, parseFloat(document.getElementById('want').value) || 0);
    var have = Math.max(0.0001, parseFloat(document.getElementById('have').value) || 0.0001);
    var vol = Math.max(0, parseFloat(document.getElementById('vol').value) || 0);
    var conc = vol * (want / have);
    var water = Math.max(0, vol - conc);
    document.getElementById('out').textContent = conc.toFixed(1);
    document.getElementById('sub').textContent =
      'concentrate · add ' + water.toFixed(1) + ' diluent (same units)';
    paint(conc, water);
  }
  ['want','have','vol'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  render();`
  },

  bitrate: {
    title: 'bandwidth',
    blurb: 'size ÷ speed',
    about: 'Rough wall-clock download time. Grid = MB chunks; dial = duration.',
    status: 'live',
    hasViz: true,
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">0:00</div>
    <p class="face-sub" id="sub">estimate</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>transfer</legend>
      <label class="row"><span class="key">size</span><span class="value"><input id="size" type="number" inputmode="decimal" min="0" step="10" value="1500" data-primary data-axis="y" data-axis-x="speed" data-step-fast="100" data-gesture="1" aria-label="file size"><span class="unit">MB</span></span></label>
      <label class="row"><span class="key">speed</span><span class="value"><input id="speed" type="number" inputmode="decimal" min="0.01" step="1" value="100" data-step-fast="10" aria-label="bandwidth"><span class="unit">Mbps</span></span></label>
    </fieldset>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('bitrate');
  var CIRC = 2 * Math.PI * 46;
  function fmt(sec){
    sec = Math.max(0, Math.round(sec));
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    if (h) return h + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
    return m + ':' + String(s).padStart(2,'0');
  }
  function paint(mb, sec){
    var maxCells = 120;
    var scale = mb > maxCells ? mb / maxCells : 1;
    var cells = Math.max(0, Math.min(maxCells, Math.round(mb / scale)));
    var ref = 3600;
    var frac = Math.max(0, Math.min(1, sec / ref));
    var arc = CIRC * frac;
    stage.innerHTML =
      '<div class="time-dial"><svg viewBox="0 0 100 100" aria-hidden="true">' +
      '<circle class="track" cx="50" cy="50" r="46"/>' +
      '<circle class="arc" cx="50" cy="50" r="46" style="stroke-dasharray:' + arc.toFixed(2) + ' ' + CIRC.toFixed(2) + '"/>' +
      '</svg></div><div class="stage-grid is-sq" id="bwGrid"></div>';
    IBMNumberTool.paintCells(document.getElementById('bwGrid'), {
      count: cells, on: cells, shape: 'sq', cols: Math.ceil(Math.sqrt(cells)) || 1, rawCount: mb
    });
  }
  function render(){
    var mb = Math.max(0, parseFloat(document.getElementById('size').value) || 0);
    var mbps = Math.max(0.01, parseFloat(document.getElementById('speed').value) || 0.01);
    var sec = (mb * 8) / mbps;
    document.getElementById('out').textContent = fmt(sec);
    document.getElementById('sub').textContent = mb + ' MB @ ' + mbps + ' Mbps';
    paint(mb, sec);
  }
  ['size','speed'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  render();`
  },

  scalemap: {
    title: 'scale',
    blurb: 'map legend',
    about: 'Map legend → measured length → real distance. Segment on the map plane is the measure.',
    status: 'live',
    hasViz: true,
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">0</div>
    <p class="face-sub" id="sub">miles</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>legend</legend>
      <label class="row"><span class="key">1 inch =</span><span class="value"><input id="real" type="number" inputmode="decimal" min="0" step="0.1" value="1" aria-label="miles per inch"><span class="unit">mi</span></span></label>
      <label class="row"><span class="key">measure</span><span class="value"><input id="measure" type="number" inputmode="decimal" min="0" step="0.1" value="2.4" data-primary data-axis="y" data-axis-x="real" data-step-fast="1" data-gesture="1" aria-label="inches on map"><span class="unit">in</span></span></label>
    </fieldset>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('scalemap');
  function paint(measure, real){
    var seg = Math.max(4, Math.min(76, (measure / 4) * 76));
    stage.innerHTML =
      '<div class="map-plane"><div class="seg" style="width:' + seg + '%"></div>' +
      '<div class="legend">1 in = ' + real + ' mi</div></div>';
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var real = Math.max(0, parseFloat(document.getElementById('real').value) || 0);
    var measure = Math.max(0, parseFloat(document.getElementById('measure').value) || 0);
    var out = measure * real;
    var pretty = out >= 100 ? out.toFixed(0) : out.toFixed(2);
    document.getElementById('out').textContent = pretty;
    document.getElementById('sub').textContent = measure + ' in × ' + real + ' mi/in';
    paint(measure, real);
  }
  ['real','measure'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  render();`
  },

  ratio: {
    title: 'ratio',
    blurb: 'aspect · gold',
    about: 'Drag the rectangle; width÷height updates. The stage is the instrument.',
    status: 'live',
    hasViz: true,
    body: `
  <div class="ratio-stage" id="stage" tabindex="0" aria-label="adjust aspect"><div class="box" id="box"></div></div>
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">1.618</div>
    <p class="face-sub" id="sub">width ÷ height</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>size</legend>
      <label class="row"><span class="key">width</span><span class="value"><input id="w" type="number" inputmode="numeric" min="1" step="1" value="1618" data-primary data-axis="y" data-step-fast="10" data-gesture="1" aria-label="width"></span></label>
      <label class="row"><span class="key">height</span><span class="value"><input id="h" type="number" inputmode="numeric" min="1" step="1" value="1000" data-step-fast="10" aria-label="height"></span></label>
    </fieldset>
    <div class="presets" role="group" aria-label="aspect presets">
      <button type="button" class="preset" data-r="1.618">gold</button>
      <button type="button" class="preset" data-r="1.777">16:9</button>
      <button type="button" class="preset" data-r="1.333">4:3</button>
      <button type="button" class="preset" data-r="1">1:1</button>
      <button type="button" class="preset" data-r="0.707">√2</button>
    </div>
  </div>`,
    script: `
  IBMNumberTool.ensureStage('ratio');
  var box = document.getElementById('box');
  var stage = document.getElementById('stage');
  function syncPresets(r){
    document.querySelectorAll('.presets .preset').forEach(function(btn){
      var v = parseFloat(btn.getAttribute('data-r'));
      btn.setAttribute('aria-pressed', String(Math.abs(v - r) < 0.01));
    });
  }
  function syncBox(){
    var w = Math.max(1, parseFloat(document.getElementById('w').value) || 1);
    var h = Math.max(1, parseFloat(document.getElementById('h').value) || 1);
    var r = w / h;
    document.getElementById('out').textContent = r.toFixed(3);
    document.getElementById('sub').textContent = Math.round(w) + ' × ' + Math.round(h);
    var pct = Math.min(76, Math.max(18, 12 + r * 28));
    box.style.width = pct + '%';
    syncPresets(r);
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function setRatio(r){
    var h = Math.max(1, parseFloat(document.getElementById('h').value) || 1000);
    document.getElementById('w').value = Math.round(h * r);
    syncBox();
  }
  ['w','h'].forEach(function(id){ document.getElementById(id).addEventListener('input', syncBox); });
  document.querySelector('.presets').addEventListener('click', function(e){
    var btn = e.target.closest('[data-r]');
    if (btn) setRatio(parseFloat(btn.getAttribute('data-r')));
  });
  stage.addEventListener('pointerdown', function(e){
    if (e.target.closest && e.target.closest('input,button,a')) return;
    stage.setPointerCapture(e.pointerId);
    function move(ev){
      var rect = stage.getBoundingClientRect();
      var x = Math.min(0.88, Math.max(0.18, (ev.clientX - rect.left) / rect.width));
      var h = Math.max(1, parseFloat(document.getElementById('h').value) || 1000);
      var r = Math.max(0.4, Math.min(3.2, (x - 0.12) / 0.28));
      document.getElementById('w').value = Math.round(h * r);
      syncBox();
    }
    function up(){ stage.releasePointerCapture(e.pointerId); stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerup', up); }
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerup', up);
    move(e);
  });
  stage.addEventListener('keydown', function(e){
    if (document.body.classList.contains('settings-open')) return;
    var wEl = document.getElementById('w');
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (window.IBMNumberTool && IBMNumberTool.stepAmount) IBMNumberTool.stepAmount(wEl, 1, { fast: e.shiftKey });
      else { wEl.value = String(Math.max(1, (parseFloat(wEl.value) || 1) + (e.shiftKey ? 10 : 1))); wEl.dispatchEvent(new Event('input', { bubbles: true })); }
      syncBox();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (window.IBMNumberTool && IBMNumberTool.stepAmount) IBMNumberTool.stepAmount(wEl, -1, { fast: e.shiftKey });
      else { wEl.value = String(Math.max(1, (parseFloat(wEl.value) || 1) - (e.shiftKey ? 10 : 1))); wEl.dispatchEvent(new Event('input', { bubbles: true })); }
      syncBox();
    }
  });
  /* Trackpad: wheel nudges aspect (width); pinch scales both preserving ratio */
  (function(){
    var acc = 0;
    var T = 40;
    stage.addEventListener('wheel', function(e){
      if (document.body.classList.contains('settings-open')) return;
      e.preventDefault();
      e.stopPropagation();
      var wEl = document.getElementById('w');
      var hEl = document.getElementById('h');
      if (e.ctrlKey || e.metaKey) {
        acc += e.deltaY;
        while (Math.abs(acc) >= T) {
          var dir = acc < 0 ? 1 : -1;
          acc -= (acc > 0 ? 1 : -1) * T;
          var w0 = Math.max(1, parseFloat(wEl.value) || 1);
          var h0 = Math.max(1, parseFloat(hEl.value) || 1);
          var scale = dir > 0 ? 1.05 : 1 / 1.05;
          wEl.value = String(Math.max(1, Math.round(w0 * scale)));
          hEl.value = String(Math.max(1, Math.round(h0 * scale)));
          syncBox();
        }
        return;
      }
      acc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      while (Math.abs(acc) >= T) {
        var d = acc < 0 ? 1 : -1;
        acc -= (acc > 0 ? 1 : -1) * T;
        if (window.IBMNumberTool && IBMNumberTool.stepAmount) {
          IBMNumberTool.stepAmount(wEl, d, { fast: e.shiftKey });
        } else {
          wEl.value = String(Math.max(1, (parseFloat(wEl.value) || 1) + d));
          wEl.dispatchEvent(new Event('input', { bubbles: true }));
        }
        syncBox();
      }
    }, { passive: false });
  })();
  syncBox();`
  },

  typescale: {
    title: 'type',
    blurb: 'modular scale',
    about: 'Base size × ratio → modular steps. Large Aa samples fill the stage.',
    status: 'live',
    hasViz: true,
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">16</div>
    <p class="face-sub" id="sub">base px</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>scale</legend>
      <label class="row"><span class="key">base</span><span class="value"><input id="base" type="number" inputmode="decimal" min="8" step="1" value="16" data-primary data-axis="y" data-axis-x="steps" data-step-fast="4" data-gesture="1" aria-label="base size"><span class="unit">px</span></span></label>
      <label class="row"><span class="key">ratio</span><span class="value">
        <select id="ratio" aria-label="scale ratio">
          <option value="1.125">major second</option>
          <option value="1.2">minor third</option>
          <option value="1.25" selected>major third</option>
          <option value="1.333">perfect fourth</option>
          <option value="1.414">augmented fourth</option>
          <option value="1.5">perfect fifth</option>
          <option value="1.618">golden</option>
        </select>
      </span></label>
      <label class="row"><span class="key">steps</span><span class="value"><input id="steps" type="number" inputmode="numeric" min="3" max="12" step="1" value="6" aria-label="steps"></span></label>
    </fieldset>
    <ul class="list" id="list"></ul>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('typescale');
  function render(){
    var base = Math.max(1, parseFloat(document.getElementById('base').value) || 16);
    var ratio = parseFloat(document.getElementById('ratio').value) || 1.25;
    var steps = Math.max(3, Math.min(12, parseInt(document.getElementById('steps').value, 10) || 6));
    document.getElementById('out').textContent = String(Math.round(base));
    document.getElementById('sub').textContent = 'base · ×' + ratio;
    var html = '';
    var field = '';
    var stageSteps = [];
    for (var i = -2; i < steps - 2; i++) {
      var px = base * Math.pow(ratio, i);
      var rem = px / base;
      html += '<li><span style="font-size:' + Math.min(40, px) + 'px">Aa ' + (i >= 0 ? '+' : '') + i + '</span><span>' + px.toFixed(1) + 'px · ' + rem.toFixed(3) + 'rem</span></li>';
      stageSteps.push(px);
    }
    /* Stage shows up to 5 large samples; list keeps full precision */
    var pick = stageSteps.length <= 5 ? stageSteps : stageSteps.filter(function(_, idx){
      return idx === 0 || idx === stageSteps.length - 1 || idx % Math.ceil(stageSteps.length / 4) === 0;
    }).slice(0, 5);
    pick.forEach(function(px){
      var show = Math.min(110, Math.max(28, px * 2.1));
      field += '<span style="font-size:' + show + 'px">Aa</span>';
    });
    document.getElementById('list').innerHTML = html;
    stage.innerHTML = '<div class="type-field">' + field + '</div>';
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  ['base','ratio','steps'].forEach(function(id){
    document.getElementById(id).addEventListener('input', render);
    document.getElementById(id).addEventListener('change', render);
  });
  render();`
  },

  odds: {
    title: 'odds',
    blurb: 'chance · ev',
    about: 'Expected value on a signed win/lose field. Dots in the win zone = chance.',
    status: 'live',
    hasViz: true,
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">0</div>
    <p class="face-sub" id="sub">expected value</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>bet</legend>
      <label class="row"><span class="key">chance</span><span class="value"><input id="p" type="number" inputmode="decimal" min="0" max="100" step="0.1" value="12" data-primary data-axis="y" data-axis-x="win" data-step-fast="1" data-gesture="1" aria-label="chance percent"><span class="unit">%</span></span></label>
      <label class="row"><span class="key">$ if win</span><span class="value"><input id="win" type="number" inputmode="decimal" step="1" value="100" data-step-fast="10" aria-label="if win"></span></label>
      <label class="row"><span class="key">$ if lose</span><span class="value"><input id="lose" type="number" inputmode="decimal" step="1" value="-20" aria-label="if lose"></span></label>
    </fieldset>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('odds');
  function paint(ev, p){
    var span = Math.max(Math.abs(ev) * 2, 1);
    var pct = 50 + (ev / span) * 45;
    pct = Math.max(5, Math.min(95, pct));
    var on = Math.round(Math.max(0, Math.min(100, p * 100)) / 10);
    var dots = '';
    for (var i = 0; i < 10; i++) dots += '<i class="' + (i < on ? 'on' : '') + '"></i>';
    stage.innerHTML =
      '<div class="signed-field"><div class="lose"></div><div class="win"></div>' +
      '<div class="zero"></div>' +
      '<div class="ev-mark' + (ev < 0 ? ' is-neg' : '') + '" style="left:' + pct + '%"></div>' +
      '<div class="chance-dots">' + dots + '</div></div>';
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var p = Math.max(0, Math.min(100, parseFloat(document.getElementById('p').value) || 0)) / 100;
    var win = parseFloat(document.getElementById('win').value) || 0;
    var lose = parseFloat(document.getElementById('lose').value) || 0;
    var ev = p * win + (1 - p) * lose;
    document.getElementById('out').textContent = (ev >= 0 ? '+' : '') + ev.toFixed(2);
    document.getElementById('sub').textContent =
      (p * 100).toFixed(1) + '% × ' + win + ' + ' + ((1 - p) * 100).toFixed(1) + '% × ' + lose;
    paint(ev, p);
  }
  ['p','win','lose'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  render();`
  },

  combo: {
    title: 'combo',
    blurb: 'n choose k',
    about: 'Unordered combinations C(n, k). Grid lights k of n cells.',
    status: 'live',
    hasViz: true,
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">0</div>
    <p class="face-sub" id="sub">ways</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>choose</legend>
      <label class="row"><span class="key">n</span><span class="value"><input id="n" type="number" inputmode="numeric" min="0" step="1" value="52" data-primary data-axis="y" data-axis-x="k" data-step-fast="5" data-gesture="1" aria-label="n"></span></label>
      <label class="row"><span class="key">k</span><span class="value"><input id="k" type="number" inputmode="numeric" min="0" step="1" value="5" aria-label="k"></span></label>
    </fieldset>
    <p class="note">unordered combinations</p>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('combo');
  function choose(n, k){
    n = Math.floor(n); k = Math.floor(k);
    if (k < 0 || n < 0 || k > n) return 0;
    k = Math.min(k, n - k);
    var r = 1;
    for (var i = 1; i <= k; i++) r = r * (n - k + i) / i;
    return Math.round(r);
  }
  function paint(n, k){
    var maxN = 64;
    var scale = n > maxN ? n / maxN : 1;
    var cells = Math.max(0, Math.min(maxN, Math.round(n / scale)));
    var on = Math.max(0, Math.min(cells, Math.round(k / scale)));
    stage.innerHTML = '<div class="stage-grid is-sq" id="comboGrid"></div>';
    IBMNumberTool.paintCells(document.getElementById('comboGrid'), {
      count: cells, on: on, shape: 'sq',
      cols: Math.ceil(Math.sqrt(cells)) || 1,
      rawCount: n
    });
  }
  function render(){
    var n = Math.max(0, parseInt(document.getElementById('n').value, 10) || 0);
    var k = Math.max(0, parseInt(document.getElementById('k').value, 10) || 0);
    var ways = choose(n, k);
    document.getElementById('out').textContent = ways.toLocaleString('en-US');
    document.getElementById('sub').textContent = 'C(' + n + ', ' + k + ')';
    paint(n, k);
  }
  ['n','k'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  render();`
  },

  sample: {
    title: 'sample',
    blurb: 'margin · n',
    about: 'Ballpark margin of error. Left rail = confidence band around p̂.',
    status: 'live',
    hasViz: true,
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">±0%</div>
    <p class="face-sub" id="sub">margin of error</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>survey</legend>
      <label class="row"><span class="key">sample n</span><span class="value"><input id="n" type="number" inputmode="numeric" min="1" step="1" value="400" data-primary data-axis="y" data-axis-x="p" data-step-fast="50" data-gesture="1" aria-label="sample size"></span></label>
      <label class="row"><span class="key">confidence</span><span class="value">
        <select id="z" aria-label="confidence">
          <option value="1.645">90%</option>
          <option value="1.96" selected>95%</option>
          <option value="2.576">99%</option>
        </select>
      </span></label>
      <label class="row"><span class="key">p̂</span><span class="value"><input id="p" type="number" inputmode="decimal" min="0" max="100" step="1" value="50" aria-label="estimated percent"><span class="unit">%</span></span></label>
    </fieldset>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('sample');
  function paint(p, moe){
    var lo = Math.max(0, (p - moe) * 100);
    var hi = Math.min(100, (p + moe) * 100);
    var top = 100 - hi;
    var span = Math.max(1, hi - lo);
    stage.innerHTML =
      '<div class="sample-field"></div>' +
      '<div class="conf-rail">' +
      '<div class="track"></div>' +
      '<div class="band" style="top:' + top + '%;height:' + span + '%"></div>' +
      '<div class="head" style="top:' + (100 - p * 100) + '%"></div>' +
      '<div class="marks"><span style="top:0%">100</span><span style="top:50%">50</span><span style="top:100%">0</span></div>' +
      '</div>';
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var n = Math.max(1, parseInt(document.getElementById('n').value, 10) || 1);
    var z = parseFloat(document.getElementById('z').value) || 1.96;
    var conf = ({ '1.645': '90%', '1.96': '95%', '2.576': '99%' })[String(z)] || '95%';
    var p = Math.max(0, Math.min(1, (parseFloat(document.getElementById('p').value) || 50) / 100));
    var moe = z * Math.sqrt(p * (1 - p) / n);
    document.getElementById('out').textContent = '±' + (moe * 100).toFixed(1) + '%';
    document.getElementById('sub').textContent = 'n = ' + n + ' · ' + conf;
    paint(p, moe);
  }
  ['n','z','p'].forEach(function(id){
    document.getElementById(id).addEventListener('input', render);
    document.getElementById(id).addEventListener('change', render);
  });
  render();`
  },

  budget: {
    title: 'budget',
    blurb: 'week envelopes',
    about: 'Envelope cash categories for the week — coming soon.',
    status: 'soon',
    hasViz: false,
    body: '',
    script: ''
  },
  exposure: {
    title: 'exposure',
    blurb: 'iso · shutter',
    about: 'Stops triangle for photographers — coming soon.',
    status: 'soon',
    hasViz: false,
    body: '',
    script: ''
  },
  deal: {
    title: 'deal',
    blurb: 'deck left',
    about: 'Cards remaining / odds of drawing X — coming soon.',
    status: 'soon',
    hasViz: false,
    body: '',
    script: ''
  },
  streak: {
    title: 'streak',
    blurb: 'coin bias',
    about: 'Bias simulator for the gambler’s fallacy — coming soon.',
    status: 'soon',
    hasViz: false,
    body: '',
    script: ''
  }
};

for (const [id, t] of Object.entries(tools)) {
  const dir = path.join(root, id);
  fs.mkdirSync(dir, { recursive: true });
  const html = pageShell({
    id,
    title: t.title,
    blurb: t.blurb,
    about: t.about,
    status: t.status,
    body: t.body,
    script: t.script,
    hasViz: t.hasViz
  });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('wrote', id, t.status, t.hasViz ? 'viz' : '');
}
console.log('done', Object.keys(tools).length);
