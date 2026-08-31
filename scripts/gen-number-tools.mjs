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

function segField(legend, name, aria, opts) {
  return (
    '<fieldset><legend>' + legend + '</legend><div class="seg" role="radiogroup" aria-label="' + aria + '">' +
    opts.map(([v, l]) => '<label><input type="radio" name="' + name + '" value="' + v + '"><span>' + l + '</span></label>').join('') +
    '</div></fieldset>'
  );
}

function makeExtra(defaults, ...fields) {
  return { defaults, fieldsHtml: fields.join('') };
}

function pageShell({ id, title, blurb, about, status, body, script, hasViz, extra }) {
  const soon = status === 'soon';
  const extraJson = extra ? JSON.stringify(extra) : 'null';
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link id="webFonts" rel="stylesheet" href="${FONTS}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="${FONTS}"></noscript>
<link rel="stylesheet" href="../lib/number-tool.css?v=36">
<link rel="manifest" href="../manifest.webmanifest">
<link rel="apple-touch-icon" href="../icons/icon-192.png">
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
<script src="../lib/suite.js?v=36"></script>
<script src="../lib/number-tool.js?v=36"></script>
<script>
(function () {
  if (window.IBMTools) IBMTools.mountSuiteNav('${id}');
  var toolUI = window.IBMNumberTool && IBMNumberTool.mountSettings({
    id: '${id}',
    about: ${JSON.stringify(about || blurb)},
    hasViz: ${soon ? 'false' : hasViz ? 'true' : 'false'},
    extra: ${extraJson},
    onApply: function () {
      if (typeof window.__ibmToolRender === 'function') window.__ibmToolRender();
    }
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
    about: 'Receipt total → tip → per person. Stage is a receipt well; tip ribbon encodes share or dollars.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { view: 'people', tipMark: 'share' },
      segField('view', 'view', 'stage view', [['people', 'people'], ['receipt', 'receipt']]),
      segField('tip', 'tipMark', 'tip mark', [['share', 'share'], ['dollars', 'dollars']])
    ),
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">$0.00</div>
    <p class="face-sub" id="sub">per person</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>receipt</legend>
      <label class="row"><span class="key">total</span><span class="value"><input id="total" type="number" inputmode="decimal" min="0" step="0.01" value="86.40" aria-label="receipt total"></span></label>
      <label class="row"><span class="key">tip</span><span class="value"><input id="tip" type="number" inputmode="decimal" min="0" max="100" step="1" value="20" data-primary data-axis="y" data-axis-x="people" data-step-fast="5" data-gesture="1" aria-label="tip percent"><span class="unit">%</span></span></label>
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
  function S(){ return (toolUI && toolUI.settings) || {}; }
  function money(n){ return IBMNumberTool.formatMoney(n, { forceCents: true }); }
  function syncTipPresets(tipPct){
    document.querySelectorAll('#presets .preset').forEach(function(btn){
      btn.setAttribute('aria-pressed', String(Number(btn.getAttribute('data-tip')) === tipPct));
    });
  }
  function paint(people, tipPct, tipAmt, grand){
    var n = Math.max(1, Math.min(12, people));
    var view = S().view || 'people';
    var tipMark = S().tipMark || 'share';
    var tipShare = tipPct / (100 + Math.max(tipPct, 0));
    var ribbon = tipMark === 'dollars'
      ? Math.max(0, Math.min(92, Math.min(1, tipAmt / Math.max(grand, 0.01)) * 100))
      : Math.max(0, Math.min(92, tipShare * 100));
    var html = '<div class="receipt-well" data-view="' + view + '">';
    html += '<div class="rcpt-lines"><span class="rcpt-line" data-scrub="total"><em>sub</em><i></i></span>';
    html += '<span class="rcpt-tip" data-scrub="tip" style="--ribbon:' + ribbon.toFixed(1) + '%"><em>tip</em><b></b></span>';
    html += '<span class="rcpt-line is-total" data-scrub="tip"><em>total</em><i></i></span></div>';
    html += '<div class="person-cols">';
    for (var i = 0; i < n; i++) html += '<b data-scrub="people" style="--tip:' + ribbon.toFixed(1) + '%"></b>';
    html += '</div></div>';
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
    paint(people, tipPct, tip, grand);
    syncTipPresets(tipPct);
  }
  window.__ibmToolRender = render;
  ['total','tip','people'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  document.getElementById('presets').addEventListener('click', function(e){
    var btn = e.target.closest('[data-tip]');
    if (!btn) return;
    document.getElementById('tip').value = btn.getAttribute('data-tip');
    render();
  });
  render();`
  },

  hourly: {
    title: 'hourly',
    blurb: 'rate · project',
    about: 'Hourly ↔ day rate ↔ project total. Calendar strip: weeks as rows, days as hour ladders.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { grain: 'days', showRate: 'tint' },
      segField('grain', 'grain', 'calendar grain', [['days', 'days'], ['weeks', 'weeks']]),
      segField('rate', 'showRate', 'rate tint', [['off', 'off'], ['tint', 'tint']])
    ),
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
  function S(){ return (toolUI && toolUI.settings) || {}; }
  function money(n){ return IBMNumberTool.formatMoney(n); }
  function paint(days, hpd, rate){
    var grain = S().grain || 'days';
    var showRate = S().showRate || 'tint';
    var d = Math.max(0, Math.min(28, Math.round(days)));
    var slots = Math.max(1, Math.min(12, Math.round(hpd) || 1));
    var worked = Math.max(0, Math.min(slots, Math.round(hpd)));
    var tint = showRate === 'tint' ? Math.max(8, Math.min(72, rate / 4)) : 0;
    var html = '<div class="cal-strip" data-grain="' + grain + '" style="--rate-tint:' + tint + '%">';
    if (grain === 'weeks') {
      var weeks = Math.max(1, Math.ceil(d / 7));
      for (var w = 0; w < weeks; w++) {
        html += '<div class="cal-week">';
        for (var day = 0; day < 7; day++) {
          var idx = w * 7 + day;
          if (idx >= d) { html += '<div class="day is-empty"></div>'; continue; }
          html += '<div class="day" data-scrub="days">';
          for (var s = 0; s < slots; s++) html += '<i class="' + (s < worked ? 'on' : '') + '"></i>';
          html += '</div>';
        }
        html += '</div>';
      }
    } else {
      html += '<div class="day-cols">';
      for (var i = 0; i < d; i++) {
        html += '<div class="day" data-scrub="days">';
        for (var s2 = 0; s2 < slots; s2++) html += '<i class="' + (s2 < worked ? 'on' : '') + '"></i>';
        html += '</div>';
      }
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
    paint(days, hpd, rate);
  }
  window.__ibmToolRender = render;
  ['rate','hpd','days'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  render();`
  },

  fuel: {
    title: 'fuel',
    blurb: 'mpg · trip cost',
    about: 'Miles ÷ mpg × price. Tank fill = gallons; route ticks = miles with cost at the nose.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { focus: 'tank' },
      segField('focus', 'focus', 'stage focus', [['tank', 'tank'], ['route', 'route']])
    ),
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
  function S(){ return (toolUI && toolUI.settings) || {}; }
  function paint(gal, miles, cost){
    var focus = S().focus || 'tank';
    var fill = Math.max(4, Math.min(96, Math.min(1, gal / 20) * 100));
    var ticks = Math.max(4, Math.min(24, Math.round(miles / 20) || 4));
    var html = '<div class="tank-route" data-focus="' + focus + '">';
    html += '<div class="fuel-tank" data-scrub="mpg" style="--fill:' + fill.toFixed(1) + '%"><i></i><em>' + gal.toFixed(1) + ' gal</em></div>';
    html += '<div class="fuel-route" data-scrub="miles"><div class="route-line">';
    for (var i = 0; i < ticks; i++) html += '<i></i>';
    html += '</div><span class="route-nose" data-scrub="price">' + IBMNumberTool.formatMoney(cost, { forceCents: true }) + '</span>';
    html += '<span class="route-cap">' + miles.toFixed(0) + ' mi</span></div></div>';
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
    document.getElementById('out').textContent = IBMNumberTool.formatMoney(cost, { forceCents: true });
    document.getElementById('sub').textContent =
      gal.toFixed(1) + ' gal · ' + l100.toFixed(1) + ' L/100km · ' + IBMNumberTool.formatMoney(price / mpg, { forceCents: true }) + '/mi';
    paint(gal, miles, cost);
  }
  window.__ibmToolRender = render;
  ['miles','mpg','price'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  render();`
  },

  unit: {
    title: 'unit',
    blurb: 'cups · grams',
    about: 'Kitchen conversions with density. Twin vessels linked by a density bridge.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { vessel: 'bottle' },
      segField('vessel', 'vessel', 'vessel shape', [['bottle', 'bottle'], ['cup', 'cup'], ['bar', 'bar']])
    ),
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
  function S(){ return (toolUI && toolUI.settings) || {}; }
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
  function paint(amount, outAmt){
    var vessel = S().vessel || 'bottle';
    var scale = Math.max(amount, outAmt, 1);
    var left = Math.max(6, Math.min(96, (amount / scale) * 100));
    var right = Math.max(6, Math.min(96, (outAmt / scale) * 100));
    var ghosts = '';
    try {
      var hist = JSON.parse(localStorage.getItem('ibm.tool.unit.hist') || '[]');
      hist.slice(0, 2).forEach(function(line, idx){
        var m = String(line).match(/^([\d.]+)/);
        if (!m) return;
        var g = Math.max(4, Math.min(92, Math.log10(parseFloat(m[1]) + 1) / Math.log10(11) * 100));
        ghosts += '<div class="ghost" style="--fill:' + g + '%;opacity:' + (0.22 - idx * 0.06) + '"></div>';
      });
    } catch(e){}
    stage.innerHTML =
      '<div class="twin-vessels" data-vessel="' + vessel + '">' +
      '<div class="vessel is-from" data-scrub="amount">' + ghosts +
      '<div class="fill" style="height:' + left + '%"></div></div>' +
      '<div class="bridge" aria-hidden="true"></div>' +
      '<div class="vessel is-to"><div class="fill" style="height:' + right + '%"></div></div>' +
      '</div>';
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
    paint(amount, out);
    if (commit) commitHist(amount + ' ' + from + ' → ' + pretty + ' ' + to);
    else renderHist();
  }
  window.__ibmToolRender = function(){ render(false); };
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
    about: 'Kitchen / garden dilutions only. Split panes or a diminishing drop trail.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { view: 'split' },
      segField('view', 'view', 'dose view', [['split', 'split'], ['drops', 'drops']])
    ),
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">0</div>
    <p class="face-sub" id="sub">concentrate</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>mix</legend>
      <label class="row"><span class="key">target</span><span class="value"><input id="want" type="number" inputmode="decimal" min="0" max="100" step="0.1" value="2" data-primary data-axis="y" data-axis-x="vol" data-pinch="have" data-step-fast="1" data-gesture="1" aria-label="target percent"><span class="unit">%</span></span></label>
      <label class="row"><span class="key">stock</span><span class="value"><input id="have" type="number" inputmode="decimal" min="0.01" step="0.1" value="10" data-step-fast="1" aria-label="stock percent"><span class="unit">%</span></span></label>
      <label class="row"><span class="key">batch</span><span class="value"><input id="vol" type="number" inputmode="decimal" min="0" step="1" value="1000" data-step-fast="100" aria-label="batch volume"><span class="unit">vol</span></span></label>
    </fieldset>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('dose');
  function S(){ return (toolUI && toolUI.settings) || {}; }
  function paint(conc, water, ratio){
    var view = S().view || 'split';
    if (view === 'drops') {
      var html = '<div class="dose-drops">';
      var n = 6;
      for (var i = 0; i < n; i++) {
        var scale = Math.max(0.18, Math.pow(1 / Math.max(ratio, 1.05), i));
        html += '<i data-scrub="vol" style="--s:' + scale.toFixed(3) + '"></i>';
      }
      html += '</div>';
      stage.innerHTML = html;
    } else {
      stage.innerHTML =
        '<div class="field-split">' +
        '<div class="conc" data-scrub="want"></div><div class="dil" data-scrub="have"></div></div>';
      var split = stage.querySelector('.field-split');
      IBMNumberTool.setVars(split, {
        '--a': String(conc || 0.0001),
        '--b': String(water || 0.0001)
      });
    }
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var want = Math.max(0, parseFloat(document.getElementById('want').value) || 0);
    var have = Math.max(0.0001, parseFloat(document.getElementById('have').value) || 0.0001);
    var vol = Math.max(0, parseFloat(document.getElementById('vol').value) || 0);
    var conc = vol * (want / have);
    var water = Math.max(0, vol - conc);
    var ratio = have / Math.max(want, 0.0001);
    document.getElementById('out').textContent = conc.toFixed(1);
    document.getElementById('sub').textContent =
      'concentrate · add ' + water.toFixed(1) + ' diluent (same units)';
    paint(conc, water, ratio);
  }
  window.__ibmToolRender = render;
  ['want','have','vol'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  render();`
  },

  bitrate: {
    title: 'bandwidth',
    blurb: 'size ÷ speed',
    about: 'Rough wall-clock download time. Transfer river of packets with an ETA clock.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { clock: 'end', packets: 'blocks' },
      segField('clock', 'clock', 'eta clock', [['end', 'end'], ['ring', 'ring']]),
      segField('packets', 'packets', 'packet style', [['blocks', 'blocks'], ['stream', 'stream']])
    ),
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
  function S(){ return (toolUI && toolUI.settings) || {}; }
  function fmt(sec){
    sec = Math.max(0, Math.round(sec));
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    if (h) return h + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
    return m + ':' + String(s).padStart(2,'0');
  }
  function paint(mb, sec){
    var clock = S().clock || 'end';
    var packets = S().packets || 'blocks';
    var maxCells = packets === 'stream' ? 64 : 48;
    var scale = mb > maxCells ? mb / maxCells : 1;
    var cells = Math.max(0, Math.min(maxCells, Math.round(mb / scale)));
    var ref = 3600;
    var frac = Math.max(0, Math.min(1, sec / ref));
    var html = '<div class="xfer-river" data-clock="' + clock + '" data-packets="' + packets + '">';
    html += '<div class="river" data-scrub="size">';
    for (var i = 0; i < cells; i++) {
      var done = i / Math.max(cells, 1) < frac;
      html += '<i class="' + (done ? 'on' : '') + (packets === 'stream' ? ' is-stream' : '') + '"></i>';
    }
    html += '</div>';
    if (clock === 'ring') {
      var arc = CIRC * frac;
      html +=
        '<div class="time-dial" data-scrub="speed"><svg viewBox="0 0 100 100" aria-hidden="true">' +
        '<circle class="track" cx="50" cy="50" r="46"/>' +
        '<circle class="arc" cx="50" cy="50" r="46" style="stroke-dasharray:' + arc.toFixed(2) + ' ' + CIRC.toFixed(2) + '"/>' +
        '</svg></div>';
    } else {
      html += '<div class="eta-cap" data-scrub="speed">' + fmt(sec) + '</div>';
    }
    html += '</div>';
    stage.innerHTML = html;
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var mb = Math.max(0, parseFloat(document.getElementById('size').value) || 0);
    var mbps = Math.max(0.01, parseFloat(document.getElementById('speed').value) || 0.01);
    var sec = (mb * 8) / mbps;
    document.getElementById('out').textContent = fmt(sec);
    document.getElementById('sub').textContent = mb + ' MB @ ' + mbps + ' Mbps';
    paint(mb, sec);
  }
  window.__ibmToolRender = render;
  ['size','speed'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  render();`
  },

  scalemap: {
    title: 'scale',
    blurb: 'map legend',
    about: 'Map legend → measured length → real distance. Distance rings and a true scale bar.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { units: 'mi', rings: 'on' },
      segField('units', 'units', 'distance units', [['mi', 'mi'], ['km', 'km']]),
      segField('rings', 'rings', 'distance rings', [['off', 'off'], ['on', 'on']])
    ),
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
  function S(){ return (toolUI && toolUI.settings) || {}; }
  var MI_PER_KM = 0.621371;
  function paint(measure, real, units, dist){
    var ringsOn = (S().rings || 'on') === 'on';
    var seg = Math.max(4, Math.min(76, (measure / 4) * 76));
    var html = '<div class="map-plane" data-rings="' + (ringsOn ? 'on' : 'off') + '">';
    if (ringsOn) {
      for (var r = 1; r <= 3; r++) {
        html += '<div class="ring" style="--r:' + (r * 28) + '%"><span>' +
          (dist * r / 3).toFixed(dist >= 10 ? 0 : 1) + ' ' + units + '</span></div>';
      }
    }
    html += '<div class="origin"></div>';
    html += '<div class="seg" data-scrub="measure" style="width:' + seg + '%"></div>';
    html += '<div class="legend" data-scrub="real"><div class="scale-bar"><i></i><i></i><i></i><i></i></div>';
    html += '1 in = ' + real + ' ' + units + '</div></div>';
    stage.innerHTML = html;
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var units = S().units || 'mi';
    var realIn = Math.max(0, parseFloat(document.getElementById('real').value) || 0);
    var measure = Math.max(0, parseFloat(document.getElementById('measure').value) || 0);
    var real = units === 'km' ? realIn * (1 / MI_PER_KM) : realIn;
    /* Input stays as authored; display converts when units=km assuming input is mi-per-inch */
    var factor = units === 'km' ? (1 / MI_PER_KM) : 1;
    var out = measure * realIn * factor;
    var pretty = out >= 100 ? out.toFixed(0) : out.toFixed(2);
    var unitLabel = document.querySelector('#real + .unit, .row .unit');
    var realRow = document.getElementById('real');
    if (realRow && realRow.parentElement) {
      var u = realRow.parentElement.querySelector('.unit');
      if (u) u.textContent = units;
    }
    document.getElementById('out').textContent = pretty;
    document.getElementById('sub').textContent = measure + ' in × ' + realIn + ' ' + units + '/in';
    paint(measure, realIn, units, out);
  }
  window.__ibmToolRender = render;
  ['real','measure'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  render();`
  },

  ratio: {
    title: 'ratio',
    blurb: 'aspect · gold',
    about: 'Drag the rectangle; width÷height updates. Optional thirds / golden guides; preset lock snaps scrub.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { guides: 'none', lock: 'free' },
      segField('guides', 'guides', 'composition guides', [['none', 'none'], ['thirds', 'thirds'], ['golden', 'golden']]),
      segField('lock', 'lock', 'aspect lock', [['free', 'free'], ['preset', 'preset']])
    ),
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
  function S(){ return (toolUI && toolUI.settings) || {}; }
  var PRESETS = [1.618, 1.777, 1.333, 1, 0.707];
  var box = document.getElementById('box');
  var stage = document.getElementById('stage');
  function syncPresets(r){
    document.querySelectorAll('.presets .preset').forEach(function(btn){
      var v = parseFloat(btn.getAttribute('data-r'));
      btn.setAttribute('aria-pressed', String(Math.abs(v - r) < 0.01));
    });
  }
  function nearestPreset(r){
    var best = PRESETS[0], bd = Math.abs(r - best);
    for (var i = 1; i < PRESETS.length; i++) {
      var d = Math.abs(r - PRESETS[i]);
      if (d < bd) { bd = d; best = PRESETS[i]; }
    }
    return best;
  }
  function syncGuides(){
    var guides = S().guides || 'none';
    var g = stage.querySelector('.guides');
    if (!g) {
      g = document.createElement('div');
      g.className = 'guides';
      g.setAttribute('aria-hidden', 'true');
      stage.appendChild(g);
    }
    g.setAttribute('data-guides', guides);
    g.innerHTML = guides === 'thirds'
      ? '<i class="v"></i><i class="v"></i><i class="h"></i><i class="h"></i>'
      : guides === 'golden'
        ? '<i class="spiral"></i>'
        : '';
  }
  function syncBox(){
    var w = Math.max(1, parseFloat(document.getElementById('w').value) || 1);
    var h = Math.max(1, parseFloat(document.getElementById('h').value) || 1);
    var r = w / h;
    document.getElementById('out').textContent = r.toFixed(3);
    document.getElementById('sub').textContent = Math.round(w) + ' × ' + Math.round(h);
    var pct = Math.min(76, Math.max(18, 12 + r * 28));
    box.style.width = pct + '%';
    box.style.aspectRatio = w + ' / ' + h;
    syncPresets(r);
    syncGuides();
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function setRatio(r){
    var h = Math.max(1, parseFloat(document.getElementById('h').value) || 1000);
    document.getElementById('w').value = Math.round(h * r);
    syncBox();
  }
  window.__ibmToolRender = syncBox;
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
      if ((S().lock || 'free') === 'preset') r = nearestPreset(r);
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
        if ((S().lock || 'free') === 'preset') {
          var rr = nearestPreset((parseFloat(wEl.value) || 1) / Math.max(1, parseFloat(hEl.value) || 1));
          wEl.value = String(Math.round(Math.max(1, parseFloat(hEl.value) || 1) * rr));
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
    about: 'Base size × ratio → modular steps. Vertical scale ladder with live specimens.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { specimen: 'Aa', ladder: '5' },
      segField('specimen', 'specimen', 'specimen text', [['Aa', 'Aa'], ['word', 'word'], ['glyphs', 'glyphs']]),
      segField('ladder', 'ladder', 'ladder steps', [['5', '5'], ['all', 'all']])
    ),
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
  function S(){ return (toolUI && toolUI.settings) || {}; }
  function specimenText(){
    var sp = S().specimen || 'Aa';
    if (sp === 'word') return 'word';
    if (sp === 'glyphs') return 'Hg';
    return 'Aa';
  }
  function render(){
    var base = Math.max(1, parseFloat(document.getElementById('base').value) || 16);
    var ratio = parseFloat(document.getElementById('ratio').value) || 1.25;
    var steps = Math.max(3, Math.min(12, parseInt(document.getElementById('steps').value, 10) || 6));
    document.getElementById('out').textContent = String(Math.round(base));
    document.getElementById('sub').textContent = 'base · ×' + ratio;
    var html = '';
    var stageSteps = [];
    for (var i = -2; i < steps - 2; i++) {
      var px = base * Math.pow(ratio, i);
      var rem = px / base;
      html += '<li><span style="font-size:' + Math.min(40, px) + 'px">' + specimenText() + ' ' + (i >= 0 ? '+' : '') + i + '</span><span>' + px.toFixed(1) + 'px · ' + rem.toFixed(3) + 'rem</span></li>';
      stageSteps.push({ px: px, i: i });
    }
    var ladder = S().ladder || '5';
    var pick = stageSteps;
    if (ladder === '5' && stageSteps.length > 5) {
      pick = stageSteps.filter(function(_, idx){
        return idx === 0 || idx === stageSteps.length - 1 || idx % Math.ceil(stageSteps.length / 4) === 0;
      }).slice(0, 5);
    }
    var field = '<div class="type-ladder" data-scrub="base">';
    pick.forEach(function(step){
      var show = Math.min(72, Math.max(14, step.px));
      field += '<div class="rung"><i></i><span style="font-size:' + show + 'px">' + specimenText() + '</span><em>' + step.px.toFixed(0) + '</em></div>';
    });
    field += '</div>';
    document.getElementById('list').innerHTML = html;
    stage.innerHTML = field;
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  window.__ibmToolRender = render;
  ['base','ratio','steps'].forEach(function(id){
    document.getElementById(id).addEventListener('input', render);
    document.getElementById(id).addEventListener('change', render);
  });
  render();`
  },

  odds: {
    title: 'odds',
    blurb: 'chance · payoff',
    about: 'What a bet pays on average: win chance × win amount, plus lose chance × lose amount. The seesaw tips with that average.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { frame: 'seesaw' },
      segField('frame', 'frame', 'odds frame', [['seesaw', 'seesaw'], ['field', 'field']])
    ),
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">0</div>
    <p class="face-sub" id="sub">average outcome</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>bet</legend>
      <label class="row"><span class="key">chance</span><span class="value"><input id="p" type="number" inputmode="decimal" min="0" max="100" step="0.1" value="12" data-primary data-axis="y" data-axis-x="win" data-step-fast="1" data-gesture="1" aria-label="win chance percent"><span class="unit">%</span></span></label>
      <label class="row"><span class="key">$ if win</span><span class="value"><input id="win" type="number" inputmode="decimal" step="1" value="100" data-step-fast="10" aria-label="dollars if win"></span></label>
      <label class="row"><span class="key">$ if lose</span><span class="value"><input id="lose" type="number" inputmode="decimal" step="1" value="-20" aria-label="dollars if lose"></span></label>
    </fieldset>
    <p class="note">positive means the bet pays on average</p>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('odds');
  function S(){ return (toolUI && toolUI.settings) || {}; }
  function paint(ev, p, win, lose){
    var frame = S().frame || 'seesaw';
    if (frame === 'field') {
      var span = Math.max(Math.abs(ev) * 2, 1);
      var pct = 50 + (ev / span) * 45;
      pct = Math.max(5, Math.min(95, pct));
      var on = Math.round(Math.max(0, Math.min(100, p * 100)) / 10);
      var dots = '';
      for (var i = 0; i < 10; i++) dots += '<i class="' + (i < on ? 'on' : '') + '"></i>';
      stage.innerHTML =
        '<div class="signed-field"><div class="lose" data-scrub="lose"></div><div class="win" data-scrub="win"></div>' +
        '<div class="zero"></div>' +
        '<div class="ev-mark' + (ev < 0 ? ' is-neg' : '') + '" style="left:' + pct + '%"></div>' +
        '<div class="chance-dots" data-scrub="p">' + dots + '</div></div>';
    } else {
      var tilt = Math.max(-18, Math.min(18, ev * 2));
      var weights = Math.max(1, Math.min(12, Math.round(p * 12)));
      var html = '<div class="seesaw" style="--tilt:' + tilt.toFixed(1) + 'deg">';
      html += '<div class="beam"><div class="plate lose" data-scrub="lose"><em>lose</em><span>' + lose + '</span></div>';
      html += '<div class="fulcrum" data-scrub="p"></div>';
      html += '<div class="plate win" data-scrub="win"><em>win</em><span>' + win + '</span><div class="weights">';
      for (var w = 0; w < weights; w++) html += '<i></i>';
      html += '</div></div></div>';
      html += '<div class="ev-balance">' + (ev >= 0 ? '+' : '') + ev.toFixed(2) + '</div></div>';
      stage.innerHTML = html;
    }
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
    paint(ev, p, win, lose);
  }
  window.__ibmToolRender = render;
  ['p','win','lose'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  render();`
  },

  combo: {
    title: 'combo',
    blurb: 'pick k of n',
    about: 'How many ways to pick k items from n when order does not matter — a poker hand, a lottery ticket, a team.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { shape: 'ring' },
      segField('shape', 'shape', 'combo shape', [['ring', 'ring'], ['grid', 'grid']])
    ),
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">0</div>
    <p class="face-sub" id="sub">ways to pick</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>choose</legend>
      <label class="row"><span class="key">from</span><span class="value"><input id="n" type="number" inputmode="numeric" min="0" step="1" value="52" data-primary data-axis="y" data-axis-x="k" data-step-fast="5" data-gesture="1" aria-label="total items"></span></label>
      <label class="row"><span class="key">pick</span><span class="value"><input id="k" type="number" inputmode="numeric" min="0" step="1" value="5" aria-label="how many to pick"></span></label>
    </fieldset>
    <p class="note">order does not matter</p>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('combo');
  function S(){ return (toolUI && toolUI.settings) || {}; }
  function choose(n, k){
    n = Math.floor(n); k = Math.floor(k);
    if (k < 0 || n < 0 || k > n) return 0;
    k = Math.min(k, n - k);
    var r = 1;
    for (var i = 1; i <= k; i++) r = r * (n - k + i) / i;
    return Math.round(r);
  }
  function paint(n, k){
    var shape = S().shape || 'ring';
    if (shape === 'grid' || (shape === 'auto' && n <= 16)) {
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
      return;
    }
    var seats = Math.max(3, Math.min(48, n || 3));
    var lit = Math.max(0, Math.min(seats, k));
    var html = '<div class="combo-ring" style="--n:' + seats + '">';
    for (var i = 0; i < seats; i++) {
      var ang = (i / seats) * 360;
      html += '<i class="' + (i < lit ? 'on' : '') + '" data-scrub="' + (i < lit ? 'k' : 'n') + '" style="--a:' + ang.toFixed(2) + 'deg"></i>';
    }
    html += '</div>';
    stage.innerHTML = html;
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var n = Math.max(0, parseInt(document.getElementById('n').value, 10) || 0);
    var k = Math.max(0, parseInt(document.getElementById('k').value, 10) || 0);
    var ways = choose(n, k);
    document.getElementById('out').textContent = IBMNumberTool.formatCount(ways);
    document.getElementById('sub').textContent = 'pick ' + k + ' of ' + n;
    paint(n, k);
  }
  window.__ibmToolRender = render;
  ['n','k'].forEach(function(id){ document.getElementById(id).addEventListener('input', render); });
  render();`
  },

  sample: {
    title: 'sample',
    blurb: 'poll · margin',
    about: 'How wide a poll result tends to swing. Bigger sample → tighter band. Rough rule of thumb, not a full survey design.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { z: '1.96', curve: 'bell' },
      segField('z', 'z', 'confidence level', [['1.645', '90%'], ['1.96', '95%'], ['2.576', '99%']]),
      segField('curve', 'curve', 'sample curve', [['bell', 'bell'], ['rail', 'rail']])
    ),
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">±0%</div>
    <p class="face-sub" id="sub">margin of error</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>survey</legend>
      <label class="row"><span class="key">size</span><span class="value"><input id="n" type="number" inputmode="numeric" min="1" step="1" value="400" data-primary data-axis="y" data-axis-x="p" data-step-fast="50" data-gesture="1" aria-label="sample size"></span></label>
      <label class="row"><span class="key">share</span><span class="value"><input id="p" type="number" inputmode="decimal" min="0" max="100" step="1" value="50" aria-label="estimated share percent"><span class="unit">%</span></span></label>
    </fieldset>
    <p class="note">± around the share at the chosen confidence</p>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('sample');
  function S(){ return (toolUI && toolUI.settings) || {}; }
  function paint(p, moe){
    var curve = S().curve || 'bell';
    var lo = Math.max(0, (p - moe) * 100);
    var hi = Math.min(100, (p + moe) * 100);
    var mid = p * 100;
    if (curve === 'rail') {
      var top = 100 - hi;
      var span = Math.max(1, hi - lo);
      stage.innerHTML =
        '<div class="sample-field"></div>' +
        '<div class="conf-rail">' +
        '<div class="track" data-scrub="n"></div>' +
        '<div class="band" data-scrub="n" style="top:' + top + '%;height:' + span + '%"></div>' +
        '<div class="head" data-scrub="p" style="top:' + (100 - mid) + '%"></div>' +
        '<div class="marks"><span style="top:0%">100</span><span style="top:50%">50</span><span style="top:100%">0</span></div>' +
        '</div>';
    } else {
      var bandL = Math.max(0, mid - moe * 100);
      var bandW = Math.max(2, Math.min(100, moe * 200));
      stage.innerHTML =
        '<div class="sample-bell" data-scrub="n">' +
        '<svg viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden="true">' +
        '<path class="curve" d="M0,52 C18,52 22,' + Math.max(4, Math.min(40, 8 + moe * 120)).toFixed(1) + ' 50,' + Math.max(4, Math.min(40, 8 + moe * 80)).toFixed(1) + ' C78,' + Math.max(4, Math.min(40, 8 + moe * 120)).toFixed(1) + ' 82,52 100,52"/>' +
        '<rect class="moe" x="' + bandL.toFixed(1) + '" y="6" width="' + bandW.toFixed(1) + '" height="46"/>' +
        '</svg>' +
        '<div class="baseline"><i class="head" data-scrub="p" style="left:' + mid.toFixed(1) + '%"></i></div>' +
        '<div class="conf-rail is-legend">' +
        '<div class="band" style="top:' + (100 - hi) + '%;height:' + Math.max(1, hi - lo) + '%"></div>' +
        '<div class="head" style="top:' + (100 - mid) + '%"></div>' +
        '</div></div>';
    }
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var n = Math.max(1, parseInt(document.getElementById('n').value, 10) || 1);
    var z = parseFloat(S().z) || 1.96;
    var conf = ({ '1.645': '90%', '1.96': '95%', '2.576': '99%' })[String(z)] || '95%';
    var p = Math.max(0, Math.min(1, (parseFloat(document.getElementById('p').value) || 50) / 100));
    var moe = z * Math.sqrt(p * (1 - p) / n);
    document.getElementById('out').textContent = '±' + (moe * 100).toFixed(1) + '%';
    document.getElementById('sub').textContent = n + ' people · ' + conf + ' confidence';
    paint(p, moe);
  }
  window.__ibmToolRender = render;
  ['n','p'].forEach(function(id){
    document.getElementById(id).addEventListener('input', render);
    document.getElementById(id).addEventListener('change', render);
  });
  render();`
  },

  budget: {
    title: 'budget',
    blurb: 'week envelopes',
    about: 'Split a weekly pot into envelopes. Pot well shows remaining; drawers or share chart below.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { layout: 'drawers', warn: 'tint' },
      segField('layout', 'layout', 'budget layout', [['drawers', 'drawers'], ['share', 'share']]),
      segField('warn', 'warn', 'over allocation', [['tint', 'tint'], ['strike', 'strike']])
    ),
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">$0</div>
    <p class="face-sub" id="sub">left this week</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>week</legend>
      <label class="row"><span class="key">pot</span><span class="value"><input id="pot" type="number" inputmode="decimal" min="0" step="10" value="600" data-primary data-axis="y" data-axis-x="live" data-step-fast="50" data-gesture="1" aria-label="weekly pot"></span></label>
    </fieldset>
    <fieldset class="panel">
      <legend>envelopes</legend>
      <label class="row"><span class="key">live</span><span class="value"><input id="live" type="number" inputmode="decimal" min="0" step="10" value="280" data-step-fast="25" aria-label="live envelope"></span></label>
      <label class="row"><span class="key">food</span><span class="value"><input id="food" type="number" inputmode="decimal" min="0" step="5" value="120" data-step-fast="20" aria-label="food envelope"></span></label>
      <label class="row"><span class="key">move</span><span class="value"><input id="move" type="number" inputmode="decimal" min="0" step="5" value="80" data-step-fast="20" aria-label="move envelope"></span></label>
      <label class="row"><span class="key">fun</span><span class="value"><input id="fun" type="number" inputmode="decimal" min="0" step="5" value="60" data-step-fast="20" aria-label="fun envelope"></span></label>
    </fieldset>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('budget');
  var ENVS = [
    { id: 'live', label: 'live' },
    { id: 'food', label: 'food' },
    { id: 'move', label: 'move' },
    { id: 'fun', label: 'fun' }
  ];
  function S(){ return (toolUI && toolUI.settings) || {}; }
  function money(n){ return IBMNumberTool.formatMoney(n); }
  function paint(pot, parts, left){
    var layout = S().layout || 'drawers';
    var warn = S().warn || 'tint';
    var used = parts.reduce(function(s, p){ return s + p.amt; }, 0);
    var remPct = pot > 0 ? Math.max(0, Math.min(100, (Math.max(0, left) / pot) * 100)) : 0;
    var over = left < 0;
    var html = '<div class="budget-well" data-layout="' + layout + '" data-warn="' + warn + '" data-over="' + (over ? '1' : '0') + '">';
    html += '<div class="pot-bar" data-scrub="pot"><b style="width:' + remPct.toFixed(1) + '%"></b>';
    if (over) html += '<i class="over" style="width:' + Math.min(100, (Math.abs(left) / Math.max(pot, 1)) * 100).toFixed(1) + '%"></i>';
    html += '</div>';
    if (layout === 'share') {
      html += '<div class="share-stack">';
      var denom = Math.max(used, pot, 1);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        var w = Math.max(0, (p.amt / denom) * 100);
        html += '<div class="share-seg" data-scrub="' + p.id + '" style="width:' + w.toFixed(1) + '%"><em>' + p.label + '</em></div>';
      }
      html += '</div>';
    } else {
      html += '<div class="env-cols">';
      for (var j = 0; j < parts.length; j++) {
        var e = parts[j];
        var pct = pot > 0 ? Math.max(0, Math.min(100, (e.amt / pot) * 100)) : 0;
        html += '<div class="env" data-scrub="' + e.id + '" style="--fill:' + pct.toFixed(1) + '%"><em>' + e.label + '</em><i></i></div>';
      }
      html += '</div>';
    }
    html += '</div>';
    stage.innerHTML = html;
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var pot = Math.max(0, parseFloat(document.getElementById('pot').value) || 0);
    var parts = ENVS.map(function(e){
      return { id: e.id, label: e.label, amt: Math.max(0, parseFloat(document.getElementById(e.id).value) || 0) };
    });
    var used = parts.reduce(function(s, p){ return s + p.amt; }, 0);
    var left = pot - used;
    document.getElementById('out').textContent = money(left);
    document.getElementById('out').style.color = left < 0 ? 'var(--mark, var(--accent))' : '';
    document.getElementById('sub').textContent =
      left < 0
        ? 'over by ' + money(Math.abs(left)) + ' · used ' + money(used)
        : money(used) + ' allocated · ' + (pot ? Math.round((used / pot) * 100) : 0) + '%';
    paint(pot, parts, left);
  }
  window.__ibmToolRender = render;
  ['pot','live','food','move','fun'].forEach(function(id){
    document.getElementById(id).addEventListener('input', render);
  });
  render();`
  },

  exposure: {
    title: 'exposure',
    blurb: 'iso · shutter',
    about: 'Exposure value from ISO, aperture, and shutter. Triangle instrument with sunny-16 reference.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { ref: 'sunny16', triangle: 'filled' },
      segField('ref', 'ref', 'face reference', [['sunny16', 'sunny 16'], ['ev', 'ev']]),
      segField('triangle', 'triangle', 'triangle style', [['filled', 'filled'], ['wire', 'wire']])
    ),
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">EV 0</div>
    <p class="face-sub" id="sub">exposure value</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>triangle</legend>
      <label class="row"><span class="key">ISO</span><span class="value"><input id="iso" type="number" inputmode="numeric" min="25" step="25" value="100" data-step-fast="100" aria-label="ISO"></span></label>
      <label class="row"><span class="key">ƒ</span><span class="value"><input id="fnum" type="number" inputmode="decimal" min="0.5" step="0.1" value="8" data-primary data-axis="y" data-axis-x="shut" data-pinch="iso" data-step-fast="1" data-gesture="1" aria-label="aperture"></span></label>
      <label class="row"><span class="key">shutter</span><span class="value"><input id="shut" type="number" inputmode="numeric" min="1" step="1" value="125" data-step-fast="25" aria-label="shutter denominator"><span class="unit">1/n</span></span></label>
    </fieldset>
    <div class="presets" id="presets" role="group" aria-label="sunny 16 presets">
      <button type="button" class="preset" data-iso="100" data-f="16" data-shut="125">sunny</button>
      <button type="button" class="preset" data-iso="100" data-f="11" data-shut="125">haze</button>
      <button type="button" class="preset" data-iso="400" data-f="5.6" data-shut="250">shade</button>
      <button type="button" class="preset" data-iso="800" data-f="2.8" data-shut="60">dim</button>
    </div>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('exposure');
  function S(){ return (toolUI && toolUI.settings) || {}; }
  function paint(ev, iso, f, shutN){
    var style = S().triangle || 'filled';
    var t = Math.max(0.15, Math.min(1, (ev + 2) / 18));
    var sunny = 15;
    var locus = Math.max(8, Math.min(92, ((ev + 2) / 18) * 100));
    var html = '<div class="exp-instrument" data-style="' + style + '" style="--glow:' + t.toFixed(3) + ';--locus:' + locus.toFixed(1) + '%">';
    html += '<svg viewBox="0 0 100 86" aria-hidden="true">';
    html += '<polygon class="tri" points="50,6 94,80 6,80"/>';
    html += '<text class="ax" x="50" y="4" text-anchor="middle">ISO</text>';
    html += '<text class="ax" x="96" y="84" text-anchor="end">ƒ</text>';
    html += '<text class="ax" x="4" y="84" text-anchor="start">shut</text>';
    html += '<circle class="locus" cx="50" cy="' + (80 - (locus / 100) * 64).toFixed(1) + '" r="3.2"/>';
    html += '<line class="sunny" x1="18" y1="42" x2="82" y2="42"/>';
    html += '</svg>';
    html += '<div class="exp-labels"><span data-scrub="iso">ISO ' + iso + '</span><span data-scrub="fnum">ƒ/' + f + '</span><span data-scrub="shut">1/' + shutN + '</span></div>';
    html += '</div>';
    stage.innerHTML = html;
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var iso = Math.max(25, parseFloat(document.getElementById('iso').value) || 100);
    var f = Math.max(0.5, parseFloat(document.getElementById('fnum').value) || 1);
    var shutN = Math.max(1, parseFloat(document.getElementById('shut').value) || 1);
    var tt = 1 / shutN;
    var ev = Math.log((f * f) / tt) / Math.LN2 - Math.log(iso / 100) / Math.LN2;
    var sunnyDelta = ev - 15;
    var ref = S().ref || 'sunny16';
    document.getElementById('out').textContent = 'EV ' + (Math.round(ev * 10) / 10);
    if (ref === 'ev') {
      document.getElementById('sub').textContent = 'ƒ/' + f + ' · 1/' + shutN + ' · ISO ' + iso;
    } else {
      document.getElementById('sub').textContent =
        'ƒ/' + f + ' · 1/' + shutN + ' · ISO ' + iso +
        (Math.abs(sunnyDelta) < 0.15
          ? ' · sunny 16'
          : ' · ' + (sunnyDelta > 0 ? '+' : '') + (Math.round(sunnyDelta * 10) / 10) + ' from sunny 16');
    }
    paint(ev, iso, f, shutN);
    document.querySelectorAll('#presets .preset').forEach(function(btn){
      var match =
        Number(btn.getAttribute('data-iso')) === iso &&
        Number(btn.getAttribute('data-f')) === f &&
        Number(btn.getAttribute('data-shut')) === shutN;
      btn.setAttribute('aria-pressed', String(match));
    });
  }
  window.__ibmToolRender = render;
  document.getElementById('presets').addEventListener('click', function(e){
    var btn = e.target.closest('.preset');
    if (!btn) return;
    document.getElementById('iso').value = btn.getAttribute('data-iso');
    document.getElementById('fnum').value = btn.getAttribute('data-f');
    document.getElementById('shut').value = btn.getAttribute('data-shut');
    render();
  });
  ['iso','fnum','shut'].forEach(function(id){
    document.getElementById(id).addEventListener('input', render);
  });
  render();`
  },

  deal: {
    title: 'deal',
    blurb: 'deck left',
    about: 'Chance the next card is one you want. Set how many cards remain and how many of those are still favorable.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { style: 'poker', favor: 'tint' },
      segField('style', 'style', 'deck style', [['poker', 'poker'], ['shoe', 'shoe']]),
      segField('favor', 'favor', 'favorable mark', [['tint', 'tint'], ['pip', 'pip']])
    ),
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">0%</div>
    <p class="face-sub" id="sub">next card</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>deck</legend>
      <label class="row"><span class="key">left</span><span class="value"><input id="left" type="number" inputmode="numeric" min="1" max="52" step="1" value="40" data-primary data-axis="y" data-axis-x="want" data-step-fast="5" data-gesture="1" aria-label="cards left in deck"></span></label>
      <label class="row"><span class="key">favor</span><span class="value"><input id="want" type="number" inputmode="numeric" min="0" step="1" value="8" data-step-fast="2" aria-label="favorable cards left"></span></label>
    </fieldset>
    <div class="presets" id="presets" role="group" aria-label="deck presets">
      <button type="button" class="preset" data-left="52" data-want="4">4 aces</button>
      <button type="button" class="preset" data-left="52" data-want="13">1 suit</button>
      <button type="button" class="preset" data-left="52" data-want="16">10+</button>
      <button type="button" class="preset" data-left="20" data-want="3">late shoe</button>
    </div>
    <p class="note">lit cards are the ones you want</p>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('deal');
  function S(){ return (toolUI && toolUI.settings) || {}; }
  function paint(left, want){
    var n = Math.max(0, Math.min(52, Math.round(left)));
    var w = Math.max(0, Math.min(n, Math.round(want)));
    var style = S().style || 'poker';
    var favor = S().favor || 'tint';
    var thick = Math.max(6, Math.min(100, (n / 52) * 100));
    var html = '<div class="deal-shoe" data-style="' + style + '" data-favor="' + favor + '">';
    html += '<div class="shoe" data-scrub="left" style="--thick:' + thick.toFixed(1) + '%"><i></i><em>' + n + '</em></div>';
    html += '<div class="deal-grid" style="--cols:' + Math.min(13, Math.max(4, Math.ceil(Math.sqrt(n)))) + '">';
    for (var i = 0; i < n; i++) {
      html += '<i class="' + (i < w ? 'on' : '') + '" data-scrub="' + (i < w ? 'want' : 'left') + '"></i>';
    }
    html += '</div></div>';
    stage.innerHTML = html;
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var left = Math.max(1, parseInt(document.getElementById('left').value, 10) || 1);
    var want = Math.max(0, parseInt(document.getElementById('want').value, 10) || 0);
    if (want > left) {
      want = left;
      document.getElementById('want').value = String(want);
    }
    var pp = want / left;
    var pct = Math.round(pp * 1000) / 10;
    document.getElementById('out').textContent = pct + '%';
    document.getElementById('sub').textContent =
      want + ' of ' + left + ' left · about 1 in ' + (want ? (Math.round((left / want) * 10) / 10) : '∞');
    paint(left, want);
  }
  window.__ibmToolRender = render;
  document.getElementById('presets').addEventListener('click', function(e){
    var btn = e.target.closest('.preset');
    if (!btn) return;
    document.getElementById('left').value = btn.getAttribute('data-left');
    document.getElementById('want').value = btn.getAttribute('data-want');
    render();
  });
  ['left','want'].forEach(function(id){
    document.getElementById(id).addEventListener('input', render);
  });
  render();`
  },

  streak: {
    title: 'streak',
    blurb: 'next flip',
    about: 'Independent flips: a run of heads does not make tails "due." The next toss still has the same chance — the streak itself was just unlikely.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { view: 'dual' },
      segField('view', 'view', 'streak view', [['dual', 'dual'], ['run', 'run']])
    ),
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">50%</div>
    <p class="face-sub" id="sub">next toss</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>coin</legend>
      <label class="row"><span class="key">chance</span><span class="value"><input id="p" type="number" inputmode="decimal" min="0" max="100" step="1" value="50" data-primary data-axis="y" data-axis-x="run" data-step-fast="5" data-gesture="1" aria-label="chance of heads percent"><span class="unit">%</span></span></label>
      <label class="row"><span class="key">run</span><span class="value"><input id="run" type="number" inputmode="numeric" min="0" max="40" step="1" value="5" data-step-fast="2" aria-label="streak length"></span></label>
    </fieldset>
    <div class="presets" id="presets" role="group" aria-label="streak presets">
      <button type="button" class="preset" data-p="50" data-run="5">fair · 5</button>
      <button type="button" class="preset" data-p="50" data-run="10">fair · 10</button>
      <button type="button" class="preset" data-p="60" data-run="5">60% · 5</button>
      <button type="button" class="preset" data-p="40" data-run="5">40% · 5</button>
    </div>
    <p class="note">past flips do not change the next one</p>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('streak');
  function S(){ return (toolUI && toolUI.settings) || {}; }
  function paint(run, p01, streakP){
    var view = S().view || 'dual';
    var n = Math.max(0, Math.min(24, Math.round(run)));
    var html = '<div class="streak-tracks" data-view="' + view + '">';
    html += '<div class="streak-row is-run">';
    for (var i = 0; i < n; i++) html += '<i class="on" data-scrub="run"></i>';
    html += '</div>';
    if (view === 'dual') {
      html += '<div class="streak-row is-myth">';
      for (var j = 0; j < n; j++) {
        var fade = Math.max(0.12, 1 - j / Math.max(n, 1));
        html += '<i class="myth" style="opacity:' + fade.toFixed(2) + '"></i>';
      }
      html += '<i class="next" data-scrub="p" style="--p:' + Math.round(p01 * 100) + '%"></i>';
      html += '</div>';
    } else if (n < 24) {
      html += '<div class="streak-row"><i class="next" data-scrub="p" style="--p:' + Math.round(p01 * 100) + '%"></i></div>';
    }
    html += '<div class="streak-cap">chance of this run ' +
      (streakP < 0.001 && run > 0 ? '<0.1%' : (Math.round(streakP * 1000) / 10) + '%') +
      '</div></div>';
    stage.innerHTML = html;
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var pct = Math.max(0, Math.min(100, parseFloat(document.getElementById('p').value) || 0));
    var run = Math.max(0, parseInt(document.getElementById('run').value, 10) || 0);
    var p01 = pct / 100;
    var streakP = Math.pow(p01, run);
    document.getElementById('out').textContent = (Math.round(pct * 10) / 10) + '%';
    document.getElementById('sub').textContent =
      'next still ' + pct + '% · this run was ' +
      (streakP < 0.001 && run > 0 ? '<0.1%' : (Math.round(streakP * 1000) / 10) + '%') +
      ' · not “due”';
    paint(run, p01, streakP);
  }
  window.__ibmToolRender = render;
  document.getElementById('presets').addEventListener('click', function(e){
    var btn = e.target.closest('.preset');
    if (!btn) return;
    document.getElementById('p').value = btn.getAttribute('data-p');
    document.getElementById('run').value = btn.getAttribute('data-run');
    render();
  });
  ['p','run'].forEach(function(id){
    document.getElementById(id).addEventListener('input', render);
  });
  render();`
  },


  tax: {
    title: 'tax',
    blurb: 'tip · tax',
    about: 'Subtotal → tax → tip. Tip can sit on pre-tax or on the taxed total. Stage is a stacked receipt; scrub each band.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { tipOn: 'pre' },
      segField('tip on', 'tipOn', 'tip base', [['pre', 'pre-tax'], ['total', 'after tax']])
    ),
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">$0.00</div>
    <p class="face-sub" id="sub">grand</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>check</legend>
      <label class="row"><span class="key">subtotal</span><span class="value"><input id="subtotal" type="number" inputmode="decimal" min="0" step="0.01" value="72.00" data-primary data-axis="y" data-axis-x="tip" data-step-fast="5" data-gesture="1" aria-label="subtotal"></span></label>
      <label class="row"><span class="key">tax</span><span class="value"><input id="tax" type="number" inputmode="decimal" min="0" max="100" step="0.25" value="8.875" aria-label="tax percent"><span class="unit">%</span></span></label>
      <label class="row"><span class="key">tip</span><span class="value"><input id="tip" type="number" inputmode="decimal" min="0" max="100" step="1" value="20" aria-label="tip percent"><span class="unit">%</span></span></label>
    </fieldset>
    <div class="presets" id="presets" role="group" aria-label="tip presets">
      <button type="button" class="preset" data-tip="15">15%</button>
      <button type="button" class="preset" data-tip="18">18%</button>
      <button type="button" class="preset" data-tip="20" aria-pressed="true">20%</button>
      <button type="button" class="preset" data-tip="25">25%</button>
    </div>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('tax');
  var money = function(n){ return IBMNumberTool.formatMoney(n); };
  function tipOn(){
    var s = toolUI && toolUI.settings;
    return (s && s.tipOn === 'total') ? 'total' : 'pre';
  }
  function paint(sub, taxAmt, tipAmt, grand, tipBase){
    if (!stage) return;
    var taxShare = grand > 0 ? (taxAmt / grand) * 100 : 0;
    var tipShare = grand > 0 ? (tipAmt / grand) * 100 : 0;
    var subShare = Math.max(4, 100 - taxShare - tipShare);
    var onTotal = tipOn() === 'total';
    stage.innerHTML =
      '<div class="tax-receipt' + (onTotal ? ' is-on-total' : ' is-on-pre') + '">' +
        '<div class="tax-band is-sub" data-scrub="subtotal" style="--h:' + subShare + '%"><span>sub</span><b>' + money(sub) + '</b></div>' +
        '<div class="tax-band is-tax" data-scrub="tax" style="--h:' + Math.max(6, taxShare) + '%"><span>tax</span><b>' + money(taxAmt) + '</b></div>' +
        '<div class="tax-tip-mark" aria-hidden="true"><i></i><span>tip on ' + (onTotal ? 'total' : 'pre-tax') + ' · ' + money(tipBase) + '</span></div>' +
        '<div class="tax-band is-tip" data-scrub="tip" style="--h:' + Math.max(6, tipShare) + '%"><span>tip</span><b>' + money(tipAmt) + '</b></div>' +
      '</div>';
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var sub = Math.max(0, parseFloat(document.getElementById('subtotal').value) || 0);
    var taxPct = Math.max(0, parseFloat(document.getElementById('tax').value) || 0);
    var tipPct = Math.max(0, parseFloat(document.getElementById('tip').value) || 0);
    var taxAmt = sub * (taxPct / 100);
    var tipBase = tipOn() === 'total' ? sub + taxAmt : sub;
    var tipAmt = tipBase * (tipPct / 100);
    var grand = sub + taxAmt + tipAmt;
    document.getElementById('out').textContent = money(grand);
    document.getElementById('sub').textContent =
      'tax ' + money(taxAmt) + ' · tip ' + money(tipAmt) + ' on ' + (tipOn() === 'total' ? 'total' : 'pre-tax');
    paint(sub, taxAmt, tipAmt, grand, tipBase);
  }
  window.__ibmToolRender = render;
  document.getElementById('presets').addEventListener('click', function(e){
    var btn = e.target.closest('.preset');
    if (!btn) return;
    document.getElementById('tip').value = btn.getAttribute('data-tip');
    document.querySelectorAll('#presets .preset').forEach(function(b){
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });
    render();
  });
  ['subtotal','tax','tip'].forEach(function(id){
    document.getElementById(id).addEventListener('input', render);
  });
  render();`
  },

  pace: {
    title: 'pace',
    blurb: 'distance · eta',
    about: 'Distance × pace → ETA (or solve for pace). Route ticks teach distance; tick spacing teaches pace; finish mark is the ETA.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { mode: 'eta' },
      segField('solve', 'mode', 'solve for', [['eta', 'eta'], ['pace', 'pace']])
    ),
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">0:00</div>
    <p class="face-sub" id="sub">eta</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>route</legend>
      <label class="row"><span class="key">distance</span><span class="value"><input id="distance" type="number" inputmode="decimal" min="0" step="0.1" value="5" data-primary data-axis="y" data-axis-x="pace" data-step-fast="1" data-gesture="1" aria-label="distance"></span></label>
      <label class="row"><span class="key">pace</span><span class="value"><input id="pace" type="number" inputmode="decimal" min="0" step="0.1" value="9.5" aria-label="pace minutes per unit"><span class="unit">min/u</span></span></label>
      <label class="row"><span class="key">hours</span><span class="value"><input id="hours" type="number" inputmode="decimal" min="0" step="0.05" value="0.8" aria-label="finish hours"></span></label>
    </fieldset>
    <div class="presets" id="presets" role="group" aria-label="pace presets">
      <button type="button" class="preset" data-pace="8" data-dist="5">5k easy</button>
      <button type="button" class="preset" data-pace="9.5" data-dist="6.2">10k</button>
      <button type="button" class="preset" data-pace="10" data-dist="13.1">half</button>
      <button type="button" class="preset" data-pace="11" data-dist="26.2">full</button>
    </div>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('pace');
  function fmtHours(h){
    var total = Math.round(Math.max(0, h) * 60);
    var hh = Math.floor(total / 60);
    var mm = total % 60;
    if (hh <= 0) return mm + ' min';
    return hh + ':' + String(mm).padStart(2,'0');
  }
  function mode(){
    var s = toolUI && toolUI.settings;
    return (s && s.mode === 'pace') ? 'pace' : 'eta';
  }
  function paint(d, pace, etaH, needed, solvingPace){
    if (!stage) return;
    var ticks = Math.max(2, Math.min(24, Math.round(d) || 2));
    var gap = Math.max(4, Math.min(48, pace * 2.2));
    var finish = solvingPace
      ? Math.max(8, Math.min(100, (needed > 0 && pace > 0 ? (pace / needed) : 1) * 100))
      : 100;
    var fill = solvingPace ? Math.min(100, finish) : Math.min(100, (etaH > 0 ? 100 : 0));
    /* In eta mode fill spans full route; density of ticks = distance, spacing CSS = pace */
    var tickHtml = '';
    for (var i = 0; i <= ticks; i++) {
      tickHtml += '<i style="left:' + ((i / ticks) * 100).toFixed(2) + '%"></i>';
    }
    stage.innerHTML =
      '<div class="pace-route' + (solvingPace ? ' is-solve-pace' : '') + '">' +
        '<div class="pace-track" data-scrub="distance" style="--gap:' + gap + 'px">' +
          '<div class="pace-fill" style="width:' + fill + '%"></div>' +
          '<div class="pace-ticks">' + tickHtml + '</div>' +
          '<b class="pace-finish" data-scrub="hours" style="left:' + finish + '%"></b>' +
        '</div>' +
        '<div class="pace-marks"><span data-scrub="distance">start</span><span data-scrub="pace">' +
          (Math.round(pace * 10) / 10) + ' min/u</span><span data-scrub="hours">finish</span></div>' +
      '</div>';
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var d = Math.max(0, parseFloat(document.getElementById('distance').value) || 0);
    var pace = Math.max(0, parseFloat(document.getElementById('pace').value) || 0);
    var hours = Math.max(0, parseFloat(document.getElementById('hours').value) || 0);
    if (mode() === 'pace') {
      var needed = d > 0 ? (hours * 60) / d : 0;
      document.getElementById('out').textContent = (Math.round(needed * 10) / 10) + '';
      document.getElementById('sub').textContent = 'min/unit for ' + fmtHours(hours) + ' finish';
      paint(d, pace, hours, needed, true);
    } else {
      var eta = (d * pace) / 60;
      document.getElementById('out').textContent = fmtHours(eta);
      document.getElementById('sub').textContent = d + ' u · ' + pace + ' min/u';
      paint(d, pace, eta, pace, false);
    }
  }
  window.__ibmToolRender = render;
  document.getElementById('presets').addEventListener('click', function(e){
    var btn = e.target.closest('.preset');
    if (!btn) return;
    document.getElementById('pace').value = btn.getAttribute('data-pace');
    document.getElementById('distance').value = btn.getAttribute('data-dist');
    render();
  });
  ['distance','pace','hours'].forEach(function(id){
    document.getElementById(id).addEventListener('input', render);
  });
  render();`
  },

  contrast: {
    title: 'contrast',
    blurb: 'fg · bg · wcag',
    about: 'Foreground / background hex → contrast ratio and WCAG bands. Swatch teaches luminance; text size follows settings.',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { size: 'normal' },
      segField('text', 'size', 'text size', [['normal', 'normal'], ['large', 'large']])
    ),
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">0.00</div>
    <p class="face-sub" id="sub">contrast</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>colors</legend>
      <label class="row"><span class="key">fg</span><span class="value"><input id="fg" type="text" value="#111111" spellcheck="false" autocomplete="off" aria-label="foreground hex"></span></label>
      <label class="row"><span class="key">bg</span><span class="value"><input id="bg" type="text" value="#f2f2f0" spellcheck="false" autocomplete="off" aria-label="background hex"></span></label>
      <label class="row"><span class="key">lift</span><span class="value"><input id="lift" type="number" inputmode="numeric" min="-40" max="40" step="2" value="0" data-primary data-axis="y" data-axis-x="lift" data-step-fast="5" data-gesture="1" aria-label="brightness lift"><span class="unit">Δ</span></span></label>
    </fieldset>
    <div class="presets" id="presets" role="group" aria-label="contrast presets">
      <button type="button" class="preset" data-fg="#111111" data-bg="#ffffff">ink/white</button>
      <button type="button" class="preset" data-fg="#c45c26" data-bg="#f2f2f0">accent</button>
      <button type="button" class="preset" data-fg="#757575" data-bg="#f2f2f0">mute</button>
      <button type="button" class="preset" data-fg="#ffffff" data-bg="#161616">dark</button>
    </div>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('contrast');
  var baseFg = '#111111';
  var baseBg = '#f2f2f0';
  function parseHex(hex){
    var h = String(hex || '').replace('#','').trim();
    if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) return null;
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  }
  function toHex(rgb){
    return '#' + rgb.map(function(c){
      return Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2,'0');
    }).join('');
  }
  function liftRgb(rgb, delta){
    return rgb.map(function(c){ return c + delta * 2.2; });
  }
  function lin(c){ var x=c/255; return x<=0.04045 ? x/12.92 : Math.pow((x+0.055)/1.055, 2.4); }
  function lum(rgb){ return 0.2126*lin(rgb[0])+0.7152*lin(rgb[1])+0.0722*lin(rgb[2]); }
  function size(){
    var s = toolUI && toolUI.settings;
    return (s && s.size === 'large') ? 'large' : 'normal';
  }
  function paint(fg, bg, ratio, pass, L1, L2){
    if (!stage) return;
    var h1 = Math.max(8, L1 * 100);
    var h2 = Math.max(8, L2 * 100);
    stage.innerHTML =
      '<div class="contrast-stage is-' + size() + '">' +
        '<div class="contrast-swatch" style="background:' + bg + ';color:' + fg + '">' +
          '<button type="button" class="contrast-half is-fg" data-focus="fg" aria-label="edit foreground">Aa</button>' +
          '<button type="button" class="contrast-half is-bg" data-focus="bg" aria-label="edit background"></button>' +
          '<small>' + ratio.toFixed(2) + ':1</small>' +
        '</div>' +
        '<div class="contrast-lum" data-scrub="lift" aria-hidden="true">' +
          '<div class="contrast-lum-bar is-fg" style="--h:' + h1 + '%"><span>L</span></div>' +
          '<div class="contrast-lum-bar is-bg" style="--h:' + h2 + '%"><span>L</span></div>' +
        '</div>' +
        '<div class="contrast-bands">' +
          '<span class="' + (pass.aa ? 'is-on' : '') + '">AA</span>' +
          '<span class="' + (pass.aaa ? 'is-on' : '') + '">AAA</span>' +
        '</div>' +
      '</div>';
    stage.querySelectorAll('[data-focus]').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        var id = btn.getAttribute('data-focus');
        var el = document.getElementById(id);
        if (el) { el.focus(); el.select && el.select(); }
      });
    });
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var lift = parseFloat(document.getElementById('lift').value) || 0;
    var fgRaw = document.getElementById('fg').value;
    var bgRaw = document.getElementById('bg').value;
    var fgP = parseHex(fgRaw);
    var bgP = parseHex(bgRaw);
    if (fgP) baseFg = toHex(fgP);
    if (bgP) baseBg = toHex(bgP);
    var fg = liftRgb(parseHex(baseFg) || [17,17,17], lift);
    var bg = liftRgb(parseHex(baseBg) || [242,242,240], -lift * 0.35);
    var fgHex = toHex(fg);
    var bgHex = toHex(bg);
    if (document.activeElement !== document.getElementById('fg')) document.getElementById('fg').value = fgHex;
    if (document.activeElement !== document.getElementById('bg')) document.getElementById('bg').value = bgHex;
    var L1 = lum(fg), L2 = lum(bg);
    var ratio = (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
    var large = size() === 'large';
    var pass = {
      aa: ratio >= (large ? 3 : 4.5),
      aaa: ratio >= (large ? 4.5 : 7)
    };
    document.getElementById('out').textContent = (Math.round(ratio * 100) / 100).toFixed(2);
    document.getElementById('sub').textContent =
      (pass.aaa ? 'AAA' : pass.aa ? 'AA' : 'fail') + ' · ' + size() + ' text';
    paint(fgHex, bgHex, ratio, pass, L1, L2);
  }
  window.__ibmToolRender = render;
  document.getElementById('presets').addEventListener('click', function(e){
    var btn = e.target.closest('.preset');
    if (!btn) return;
    baseFg = btn.getAttribute('data-fg');
    baseBg = btn.getAttribute('data-bg');
    document.getElementById('fg').value = baseFg;
    document.getElementById('bg').value = baseBg;
    document.getElementById('lift').value = 0;
    render();
  });
  ['fg','bg','lift'].forEach(function(id){
    document.getElementById(id).addEventListener('input', function(){
      if (id === 'fg' || id === 'bg') {
        var parsed = parseHex(document.getElementById(id).value);
        if (parsed) {
          if (id === 'fg') baseFg = toHex(parsed);
          else baseBg = toHex(parsed);
          document.getElementById('lift').value = 0;
        }
      }
      render();
    });
  });
  render();`
  },

  bayes: {
    title: 'bayes',
    blurb: 'update belief',
    about: 'Start with how likely something seems. New evidence that shows up more often when the claim is true than when it is false pulls that belief up (or down).',
    status: 'live',
    hasViz: true,
    extra: makeExtra(
      { view: 'bars' },
      segField('view', 'view', 'stage view', [['bars', 'bars'], ['odds', 'odds']])
    ),
    body: `
  <div class="face">
    <div class="face-value" id="out" role="status" aria-live="polite" aria-atomic="true">0%</div>
    <p class="face-sub" id="sub">after evidence</p>
  </div>
  <div class="stack">
    <fieldset class="panel">
      <legend>belief</legend>
      <label class="row"><span class="key">before</span><span class="value"><input id="prior" type="number" inputmode="decimal" min="0" max="100" step="1" value="10" data-primary data-axis="y" data-axis-x="hit" data-step-fast="5" data-gesture="1" aria-label="belief before evidence"><span class="unit">%</span></span></label>
      <label class="row"><span class="key">if true</span><span class="value"><input id="hit" type="number" inputmode="decimal" min="0" max="100" step="1" value="90" aria-label="chance of evidence if claim is true"><span class="unit">%</span></span></label>
      <label class="row"><span class="key">if false</span><span class="value"><input id="miss" type="number" inputmode="decimal" min="0" max="100" step="1" value="20" aria-label="chance of evidence if claim is false"><span class="unit">%</span></span></label>
    </fieldset>
    <div class="presets" id="presets" role="group" aria-label="bayes presets">
      <button type="button" class="preset" data-prior="10" data-hit="90" data-miss="20">screening</button>
      <button type="button" class="preset" data-prior="50" data-hit="80" data-miss="20">even start</button>
      <button type="button" class="preset" data-prior="1" data-hit="99" data-miss="5">rare event</button>
      <button type="button" class="preset" data-prior="80" data-hit="70" data-miss="40">already likely</button>
    </div>
    <p class="note">when if-true is much higher than if-false, belief rises</p>
  </div>`,
    script: `
  var stage = IBMNumberTool.ensureStage('bayes');
  function view(){
    var s = toolUI && toolUI.settings;
    return (s && s.view === 'odds') ? 'odds' : 'bars';
  }
  function paint(prior, posterior, hit, miss){
    if (!stage) return;
    var p0 = Math.round(prior * 1000) / 10;
    var p1 = Math.round(posterior * 1000) / 10;
    var lr = miss > 0 ? hit / miss : Infinity;
    var lrLabel = Number.isFinite(lr) ? (Math.round(lr * 100) / 100) : '∞';
    var arrow = Math.max(8, Math.min(92, Math.abs(p1 - p0)));
    if (view() === 'odds') {
      var o0 = prior >= 1 ? '∞' : (Math.round((prior / Math.max(1e-9, 1 - prior)) * 100) / 100);
      var o1 = posterior >= 1 ? '∞' : (Math.round((posterior / Math.max(1e-9, 1 - posterior)) * 100) / 100);
      stage.innerHTML =
        '<div class="bayes-odds">' +
          '<div data-scrub="prior"><span>before</span><b>' + o0 + '</b></div>' +
          '<div class="bayes-lr" data-scrub="hit"><span>× evidence</span><b>' + lrLabel + '</b></div>' +
          '<div data-scrub="miss"><span>after</span><b>' + o1 + '</b></div>' +
        '</div>';
    } else {
      stage.innerHTML =
        '<div class="bayes-bars">' +
          '<div class="bayes-row" data-scrub="prior"><span>before</span><div class="bayes-track"><i style="width:' + p0 + '%"></i></div><b>' + p0 + '%</b></div>' +
          '<div class="bayes-evidence">' +
            '<button type="button" class="bayes-tick is-hit" data-scrub="hit" style="--h:' + (hit * 100) + '%"><span>if true</span></button>' +
            '<div class="bayes-arrow" style="--w:' + arrow + '%" aria-hidden="true"><i></i><span>×' + lrLabel + '</span></div>' +
            '<button type="button" class="bayes-tick is-miss" data-scrub="miss" style="--h:' + (miss * 100) + '%"><span>if false</span></button>' +
          '</div>' +
          '<div class="bayes-row is-post"><span>after</span><div class="bayes-track"><i style="width:' + p1 + '%"></i></div><b>' + p1 + '%</b></div>' +
        '</div>';
    }
    IBMNumberTool.afterPaint && IBMNumberTool.afterPaint();
  }
  function render(){
    var prior = Math.min(100, Math.max(0, parseFloat(document.getElementById('prior').value) || 0)) / 100;
    var hit = Math.min(100, Math.max(0, parseFloat(document.getElementById('hit').value) || 0)) / 100;
    var miss = Math.min(100, Math.max(0, parseFloat(document.getElementById('miss').value) || 0)) / 100;
    var num = hit * prior;
    var den = num + miss * (1 - prior);
    var posterior = den > 0 ? num / den : 0;
    document.getElementById('out').textContent = (Math.round(posterior * 1000) / 10) + '%';
    document.getElementById('sub').textContent =
      'was ' + (Math.round(prior * 1000) / 10) + '% · evidence ×' + (miss > 0 ? (Math.round((hit / miss) * 100) / 100) : '∞');
    paint(prior, posterior, hit, miss);
  }
  window.__ibmToolRender = render;
  document.getElementById('presets').addEventListener('click', function(e){
    var btn = e.target.closest('.preset');
    if (!btn) return;
    document.getElementById('prior').value = btn.getAttribute('data-prior');
    document.getElementById('hit').value = btn.getAttribute('data-hit');
    document.getElementById('miss').value = btn.getAttribute('data-miss');
    render();
  });
  ['prior','hit','miss'].forEach(function(id){
    document.getElementById(id).addEventListener('input', render);
  });
  render();`
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
    hasViz: t.hasViz,
    extra: t.extra || null
  });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('wrote', id, t.status, t.hasViz ? 'viz' : '');
}

/* Keep desk suite copy in lockstep */
const suiteSrc = path.join(root, 'lib', 'suite.js');
const suiteDesk = path.join(root, 'timecount', 'lib', 'suite.js');
fs.mkdirSync(path.dirname(suiteDesk), { recursive: true });
fs.copyFileSync(suiteSrc, suiteDesk);
console.log('synced timecount/lib/suite.js');
console.log('done', Object.keys(tools).length);
