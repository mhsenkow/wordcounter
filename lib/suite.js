/**
 * ibm.io tools suite — top-right panel (icons + micro titles) + shared look.
 * Load as lib/suite.js from each tool folder (or ../lib/suite.js from nested tools).
 */
(function (global) {
  'use strict';

  var SHARED_KEY = 'ibm.tools.shared';
  var STYLE_ID = 'ibm-suite-styles';

  /** Inline 16×16 stroke icons (viewBox 0 0 16 16). */
  var I = {
    words: '<path d="M2.5 3.5h11M2.5 8h8M2.5 12.5h10"/>',
    time: '<circle cx="8" cy="8" r="5.2"/><path d="M8 5.2v3.1l2.2 1.3"/>',
    bill: '<rect x="3" y="2.5" width="10" height="11" rx="1"/><path d="M5.5 6h5M5.5 8.5h3.5M5.5 11h4"/>',
    unit: '<path d="M3 11.5 7.2 4.5h1.6L13 11.5"/><path d="M4.8 9.2h6.4"/>',
    ratio: '<rect x="2.5" y="4" width="7" height="7" rx=".8"/><path d="M10.5 6.5h3v6h-6v-3"/>',
    budget: '<rect x="2.5" y="3.5" width="4.2" height="9" rx=".6"/><rect x="9.3" y="5.5" width="4.2" height="7" rx=".6"/>',
    odds: '<circle cx="5.2" cy="8" r="2.4"/><circle cx="10.8" cy="8" r="2.4"/><path d="M7.6 8h.8"/>',
    scalemap: '<path d="M2.5 12.5 8 3.5l5.5 9"/><path d="M5 12.5h6"/>',
    hourly: '<circle cx="8" cy="8" r="5.2"/><path d="M8 5v3.2l2.4 0"/>',
    typescale: '<path d="M3 12.5V4.5h3.2M2.5 4.5h4.2M8.5 12.5V7h2.4M8.2 7h3"/>',
    combo: '<circle cx="4.5" cy="5" r="1.4"/><circle cx="11.5" cy="5" r="1.4"/><circle cx="8" cy="11" r="1.4"/><path d="M5.6 5.8 7.2 9.6M10.4 5.8 8.8 9.6"/>',
    deal: '<rect x="4" y="2.5" width="8" height="11" rx="1"/><path d="M6.5 6h3M6.5 8.5h3M6.5 11h2"/>',
    sample: '<path d="M3 12.5V5.5l2.5 2 2.5-3.5 2.5 4 2.5-2.5v6.5z"/>',
    streak: '<circle cx="8" cy="8" r="5.2"/><path d="M8 4.5c1.6 0 2.8 1 2.8 2.2S9.4 8.5 8 8.5"/>',
    fuel: '<path d="M4 13V4.5h5.5V13M9.5 7h1.8c.8 0 1.4.6 1.4 1.4V11"/><path d="M6 7h1.5"/>',
    bandwidth: '<path d="M2.5 10.5 5 6.5l2.2 3 2.3-5 2.5 6 1.5-2.5"/><path d="M2.5 12.5h11"/>',
    exposure: '<circle cx="8" cy="8" r="5.2"/><circle cx="8" cy="8" r="2"/><path d="M8 2.8v1.4M8 11.8v1.4M2.8 8h1.4M11.8 8h1.4"/>',
    dose: '<path d="M6 3.5h4v3.2c1.6 1 2.6 2.6 2.6 4.4A4.6 4.6 0 0 1 8 15.5 4.6 4.6 0 0 1 3.4 11c0-1.8 1-3.4 2.6-4.4z"/>'
  };

  var GROUPS = [
    { id: 'desk', label: 'desk' },
    { id: 'money', label: 'money' },
    { id: 'convert', label: 'convert' },
    { id: 'form', label: 'form' },
    { id: 'chance', label: 'chance' }
  ];

  var TOOLS = [
    { id: 'wordcount', label: 'words', blurb: 'count text', group: 'desk', paths: ['wordcount', 'wordcounter'], icon: I.words, status: 'live' },
    { id: 'timecount', label: 'time', blurb: 'duration · limit', group: 'desk', paths: ['timecount'], icon: I.time, status: 'live' },
    { id: 'bill', label: 'bill', blurb: 'tip · split', group: 'money', paths: ['bill'], icon: I.bill, status: 'live' },
    { id: 'hourly', label: 'hourly', blurb: 'rate · project', group: 'money', paths: ['hourly'], icon: I.hourly, status: 'live' },
    { id: 'budget', label: 'budget', blurb: 'week envelopes', group: 'money', paths: ['budget'], icon: I.budget, status: 'soon' },
    { id: 'fuel', label: 'fuel', blurb: 'mpg · trip cost', group: 'money', paths: ['fuel'], icon: I.fuel, status: 'live' },
    { id: 'unit', label: 'unit', blurb: 'cups · grams', group: 'convert', paths: ['unit'], icon: I.unit, status: 'live' },
    { id: 'dose', label: 'dose', blurb: 'mix · dilute', group: 'convert', paths: ['dose'], icon: I.dose, status: 'live' },
    { id: 'bitrate', label: 'bandwidth', blurb: 'size ÷ speed', group: 'convert', paths: ['bitrate'], icon: I.bandwidth, status: 'live' },
    { id: 'scalemap', label: 'scale', blurb: 'map legend', group: 'convert', paths: ['scalemap'], icon: I.scalemap, status: 'live' },
    { id: 'ratio', label: 'ratio', blurb: 'aspect · gold', group: 'form', paths: ['ratio'], icon: I.ratio, status: 'live' },
    { id: 'typescale', label: 'type', blurb: 'modular scale', group: 'form', paths: ['typescale'], icon: I.typescale, status: 'live' },
    { id: 'exposure', label: 'exposure', blurb: 'iso · shutter', group: 'form', paths: ['exposure'], icon: I.exposure, status: 'soon' },
    { id: 'odds', label: 'odds', blurb: 'chance · ev', group: 'chance', paths: ['odds'], icon: I.odds, status: 'live' },
    { id: 'combo', label: 'combo', blurb: 'n choose k', group: 'chance', paths: ['combo'], icon: I.combo, status: 'live' },
    { id: 'deal', label: 'deal', blurb: 'deck left', group: 'chance', paths: ['deal'], icon: I.deal, status: 'soon' },
    { id: 'sample', label: 'sample', blurb: 'margin · n', group: 'chance', paths: ['sample'], icon: I.sample, status: 'live' },
    { id: 'streak', label: 'streak', blurb: 'coin bias', group: 'chance', paths: ['streak'], icon: I.streak, status: 'soon' }
  ];

  function toolById(id) {
    for (var i = 0; i < TOOLS.length; i++) if (TOOLS[i].id === id) return TOOLS[i];
    return null;
  }

  function pathTouches(path, seg) {
    if (!seg) return false;
    return (
      path === '/' + seg ||
      path === '/' + seg + '/' ||
      path.indexOf('/' + seg + '/') >= 0 ||
      path.endsWith('/' + seg) ||
      path.endsWith('/' + seg + '/index.html')
    );
  }

  function detectToolId() {
    var path = (global.location && global.location.pathname) || '';
    var i, j;
    // Longer path segments first so /wordcount wins over /count, etc.
    var ranked = TOOLS.slice().sort(function (a, b) {
      return (b.paths[0] || '').length - (a.paths[0] || '').length;
    });
    for (i = 0; i < ranked.length; i++) {
      for (j = 0; j < ranked[i].paths.length; j++) {
        if (pathTouches(path, ranked[i].paths[j])) return ranked[i].id;
      }
    }
    if (/\/index\.html?$/.test(path) || path.endsWith('/') || path === '') return 'wordcount';
    return 'wordcount';
  }

  function suiteRoot() {
    var path = (global.location && global.location.pathname) || '/';
    var segments = path.split('/').filter(Boolean);
    var i, j, idx;
    for (i = 0; i < TOOLS.length; i++) {
      for (j = 0; j < TOOLS[i].paths.length; j++) {
        idx = segments.indexOf(TOOLS[i].paths[j]);
        if (idx >= 0) return '/' + segments.slice(0, idx).join('/');
      }
    }
    var last = segments[segments.length - 1] || '';
    if (/\.html?$/i.test(last)) segments.pop();
    return segments.length ? '/' + segments.join('/') : '';
  }

  function isProductionHost() {
    var host = (global.location && global.location.hostname) || '';
    return /(^|\.)ibm\.io$/i.test(host) || /\.workers\.dev$/i.test(host);
  }

  function hasNamedToolPath() {
    var path = (global.location && global.location.pathname) || '/';
    return TOOLS.some(function (t) {
      return t.paths.some(function (p) { return pathTouches(path, p); });
    }) && pathTouches(path, 'wordcount');
  }

  function toolHref(tool) {
    var loc = global.location || {};
    var path = loc.pathname || '';
    var here = detectToolId();
    var seg = tool.paths[0];

    if (loc.protocol === 'file:') {
      if (tool.id === 'wordcount') return here === 'wordcount' ? 'index.html' : '../index.html';
      if (here === 'wordcount') return seg + '/index.html';
      if (here === tool.id) return 'index.html';
      return '../' + seg + '/index.html';
    }

    if (isProductionHost() || hasNamedToolPath()) {
      var root = suiteRoot();
      if (!root || root === '/') return '/' + seg + '/';
      return root + '/' + seg + '/';
    }

    // Local python http.server from repo root: words at /, others at /{id}/
    if (tool.id === 'wordcount') {
      return here === 'wordcount' ? './' : '../';
    }
    if (here === 'wordcount') return seg + '/';
    if (here === tool.id) return './';
    return '../' + seg + '/';
  }

  function injectStyles() {
    var css = [
      /* Surreptitious tools cluster: look (theme/settings) + grid, top-right. */
      '.suite-nav{position:fixed;top:max(10px,env(safe-area-inset-top));right:max(10px,env(safe-area-inset-right));z-index:210;font:400 11px/1.25 var(--ui,Helvetica,Arial,sans-serif);color:var(--mute,#757575);pointer-events:none}',
      '.suite-nav.is-open{z-index:240}',
      'body.settings-open .suite-nav{z-index:240}',
      '.suite-nav-inner{pointer-events:auto;display:flex;flex-direction:column;align-items:flex-end;gap:0}',
      '.suite-nav-bar{display:flex;align-items:center;justify-content:flex-end;gap:2px;position:relative;z-index:2}',
      '.suite-chrome{display:flex;align-items:center;gap:2px}',
      '.suite-chrome:empty{display:none}',
      '.suite-nav-btn,.suite-chrome #themeBtn,.suite-chrome #settingsToggle{position:relative;width:auto;min-width:44px;min-height:44px;height:44px;padding:0 10px;border:0;background:transparent;color:inherit;cursor:pointer;opacity:.38;transition:opacity .2s ease,color .2s ease;display:inline-flex;align-items:center;justify-content:center;touch-action:manipulation;border-radius:2px;font:inherit;font-size:11px;letter-spacing:.04em;line-height:1}',
      '.suite-nav-btn{width:44px;padding:0}',
      '.suite-chrome #themeBtn{width:44px;padding:0}',
      '.suite-nav-btn::before,.suite-chrome #themeBtn::before,.suite-chrome #settingsToggle::before{content:"";position:absolute;inset:8px;border-radius:2px;background:color-mix(in srgb,var(--bg,#f2f2f0) 88%,transparent);z-index:-1}',
      '.suite-nav:hover .suite-nav-btn,.suite-nav.is-open .suite-nav-btn,.suite-nav-btn:focus-visible,.suite-nav:hover .suite-chrome #themeBtn,.suite-nav:hover .suite-chrome #settingsToggle,.suite-chrome #themeBtn:focus-visible,.suite-chrome #settingsToggle:focus-visible,.suite-chrome #themeBtn:hover,.suite-chrome #settingsToggle:hover{opacity:.95;color:var(--ink,#111)}',
      '.suite-nav:hover .suite-nav-btn::before,.suite-nav.is-open .suite-nav-btn::before,.suite-nav-btn:focus-visible::before,.suite-nav:hover .suite-chrome #themeBtn::before,.suite-nav:hover .suite-chrome #settingsToggle::before,.suite-chrome #themeBtn:focus-visible::before,.suite-chrome #settingsToggle:focus-visible::before,.suite-chrome #themeBtn:hover::before,.suite-chrome #settingsToggle:hover::before{background:color-mix(in srgb,var(--face,#fafaf8) 92%,var(--bg,#f2f2f0))}',
      '.suite-nav-btn:focus-visible,.suite-chrome #themeBtn:focus-visible,.suite-chrome #settingsToggle:focus-visible{outline:1px solid var(--accent,#c45c26);outline-offset:2px;opacity:1}',
      '.suite-nav-btn svg{display:block;width:12px;height:12px}',
      '.suite-chrome .theme-orb{display:block;width:10px;height:10px;border:1.25px solid currentColor;border-radius:50%;background:none;box-sizing:border-box}',
      '.suite-chrome #settingsToggle{max-width:5.2rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.suite-nav-panel{display:none;margin:8px 0 0;width:min(292px,calc(100vw - 24px));max-height:min(72vh,calc(100dvh - 64px));overflow:auto;overscroll-behavior:contain;padding:10px 10px 12px;box-sizing:border-box;background:color-mix(in srgb,var(--face,#fafaf8) 96%,var(--ink,#111) 4%);border:1px solid var(--hair,#e4e4e0);scrollbar-width:thin;box-shadow:0 8px 28px color-mix(in srgb,var(--ink,#111) 12%,transparent)}',
      '.suite-nav.is-open .suite-nav-panel{display:block}',
      '.suite-group{margin:0 0 10px}',
      '.suite-group:last-child{margin-bottom:0}',
      '.suite-group-label{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute,#757575);opacity:.7;padding:2px 4px 6px}',
      '.suite-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin:0;padding:0;list-style:none}',
      '.suite-tile{display:flex;flex-direction:column;align-items:flex-start;gap:3px;padding:8px 7px 7px;min-height:58px;text-decoration:none;color:var(--mute,#757575);border:1px solid transparent;border-radius:2px;transition:color .15s ease,background .15s ease,border-color .15s ease;position:relative}',
      '.suite-tile:hover,.suite-tile:focus-visible{color:var(--ink,#111);background:color-mix(in srgb,var(--hair,#e4e4e0) 55%,transparent);outline:1px solid var(--accent,#c45c26);outline-offset:-1px;border-color:var(--hair,#e4e4e0)}',
      '.suite-tile[aria-current="page"]{color:var(--accent,#c45c26);border-color:color-mix(in srgb,var(--accent,#c45c26) 35%,var(--hair,#e4e4e0))}',
      '.suite-tile.is-soon{opacity:.55}',
      '.suite-tile.is-soon:hover,.suite-tile.is-soon:focus-visible{opacity:.85}',
      '.suite-tile svg{width:14px;height:14px;display:block;flex-shrink:0}',
      '.suite-tile-label{font-size:11px;letter-spacing:.04em;text-transform:lowercase;line-height:1.1}',
      '.suite-tile-blurb{font-size:9px;letter-spacing:.02em;line-height:1.25;opacity:.75;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.suite-tile-soon{position:absolute;top:5px;right:5px;font-size:7px;letter-spacing:.08em;text-transform:uppercase;opacity:.7}',
      /* Title only in masthead — chrome lives in .suite-nav */
      'header.masthead,.masthead{z-index:200}',
      'header.masthead .actions:empty,.masthead .actions:empty{display:none}'
    ].join('');
    var el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    el.textContent = css;
  }

  /** Move theme + settings into the tools cluster (IDs + listeners preserved). */
  function adoptSuiteChrome(nav) {
    if (!nav) return;
    var chrome = nav.querySelector('.suite-chrome');
    if (!chrome) return;
    var theme = document.getElementById('themeBtn');
    var settings = document.getElementById('settingsToggle');
    if (theme && !chrome.contains(theme)) chrome.appendChild(theme);
    if (settings && !chrome.contains(settings)) chrome.appendChild(settings);
    /* Drop empty masthead action rails so title can breathe */
    document.querySelectorAll('header.masthead .actions, header .actions, .masthead .actions').forEach(function (el) {
      if (!el.children.length) el.remove();
    });
  }

  function iconSvg(tool) {
    return '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">' +
      (tool.icon || '') + '</svg>';
  }

  function mountSuiteNav(currentId) {
    injectStyles();
    currentId = currentId || detectToolId();
    if (document.querySelector('.suite-nav')) {
      adoptSuiteChrome(document.querySelector('.suite-nav'));
      return;
    }

    var nav = document.createElement('nav');
    nav.className = 'suite-nav';
    nav.setAttribute('aria-label', 'tools');

    var inner = document.createElement('div');
    inner.className = 'suite-nav-inner';

    var bar = document.createElement('div');
    bar.className = 'suite-nav-bar';

    var chrome = document.createElement('div');
    chrome.className = 'suite-chrome';
    chrome.setAttribute('role', 'group');
    chrome.setAttribute('aria-label', 'look');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'suite-nav-btn';
    btn.id = 'suiteNavBtn';
    btn.setAttribute('aria-label', 'tools');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-controls', 'suiteNavPanel');
    btn.innerHTML =
      '<svg viewBox="0 0 12 12" aria-hidden="true" fill="currentColor">' +
      '<rect x="1" y="1" width="3" height="3" rx=".4"/>' +
      '<rect x="8" y="1" width="3" height="3" rx=".4"/>' +
      '<rect x="1" y="8" width="3" height="3" rx=".4"/>' +
      '<rect x="8" y="8" width="3" height="3" rx=".4"/>' +
      '</svg>';

    var panel = document.createElement('div');
    panel.className = 'suite-nav-panel';
    panel.id = 'suiteNavPanel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'tools');

    GROUPS.forEach(function (group) {
      var tools = TOOLS.filter(function (t) { return t.group === group.id; });
      if (!tools.length) return;
      var section = document.createElement('section');
      section.className = 'suite-group';
      section.setAttribute('aria-label', group.label);
      var label = document.createElement('span');
      label.className = 'suite-group-label';
      label.textContent = group.label;
      section.appendChild(label);
      var grid = document.createElement('ul');
      grid.className = 'suite-grid';
      tools.forEach(function (tool) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.className = 'suite-tile' + (tool.status === 'soon' ? ' is-soon' : '');
        a.href = toolHref(tool);
        if (tool.id === currentId) a.setAttribute('aria-current', 'page');
        if (tool.status === 'soon') {
          a.setAttribute('aria-label', tool.label + ' (soon)');
        }
        a.innerHTML = iconSvg(tool) +
          '<span class="suite-tile-label">' + tool.label + '</span>' +
          '<span class="suite-tile-blurb">' + tool.blurb + '</span>' +
          (tool.status === 'soon' ? '<span class="suite-tile-soon" aria-hidden="true">soon</span>' : '');
        li.appendChild(a);
        grid.appendChild(li);
      });
      section.appendChild(grid);
      panel.appendChild(section);
    });

    bar.appendChild(chrome);
    bar.appendChild(btn);
    inner.appendChild(bar);
    inner.appendChild(panel);
    nav.appendChild(inner);
    document.body.appendChild(nav);
    adoptSuiteChrome(nav);

    function tiles() {
      return Array.prototype.slice.call(panel.querySelectorAll('.suite-tile'));
    }

    function setOpen(open) {
      var was = nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        panel.removeAttribute('hidden');
        if (!was) {
          requestAnimationFrame(function () {
            var list = tiles();
            if (list.length) {
              try { list[0].focus(); } catch (err) {}
            }
          });
        }
      } else {
        panel.setAttribute('hidden', '');
        if (was && document.activeElement && panel.contains(document.activeElement)) {
          try { btn.focus(); } catch (err) {}
        }
      }
    }

    panel.setAttribute('hidden', '');

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var next = !nav.classList.contains('is-open');
      setOpen(next);
      if (next && document.body.classList.contains('settings-open')) {
        document.body.classList.remove('settings-open');
        var st = document.getElementById('settingsToggle');
        var settingsPanel = document.getElementById('settings');
        if (st) {
          st.setAttribute('aria-expanded', 'false');
          if (st.textContent === 'close') st.textContent = 'settings';
        }
        if (settingsPanel) settingsPanel.setAttribute('hidden', '');
      }
    });

    panel.addEventListener('keydown', function (e) {
      if (!nav.classList.contains('is-open')) return;
      var list = tiles();
      if (!list.length) return;
      var i = list.indexOf(document.activeElement);
      var cols = 3;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        if (i < 0) i = 0;
        var next = i;
        if (e.key === 'ArrowRight') next = Math.min(list.length - 1, i + 1);
        else if (e.key === 'ArrowLeft') next = Math.max(0, i - 1);
        else if (e.key === 'ArrowDown') next = Math.min(list.length - 1, i + cols);
        else if (e.key === 'ArrowUp') next = Math.max(0, i - cols);
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = list.length - 1;
        list[next].focus();
      }
    });

    document.addEventListener('pointerdown', function (e) {
      if (!nav.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        e.preventDefault();
        setOpen(false);
        btn.focus();
      }
    });
  }

  function loadShared() {
    try {
      var raw = localStorage.getItem(SHARED_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveShared(partial) {
    var next = loadShared();
    var key;
    for (key in partial) {
      if (Object.prototype.hasOwnProperty.call(partial, key)) next[key] = partial[key];
    }
    try {
      localStorage.setItem(SHARED_KEY, JSON.stringify(next));
    } catch (e) {}
    return next;
  }

  function mergeSharedInto(settings, keys) {
    var shared = loadShared();
    var out = settings || {};
    (keys || ['theme', 'ui', 'font', 'faces']).forEach(function (key) {
      if (shared[key] != null && out[key] == null) out[key] = shared[key];
    });
    return out;
  }

  function pushSharedFrom(settings, keys) {
    var partial = {};
    (keys || ['theme', 'ui', 'font', 'faces']).forEach(function (key) {
      if (settings && settings[key] != null) partial[key] = settings[key];
    });
    saveShared(partial);
  }

  global.IBMTools = {
    SHARED_KEY: SHARED_KEY,
    TOOLS: TOOLS,
    GROUPS: GROUPS,
    detectToolId: detectToolId,
    toolHref: toolHref,
    toolById: toolById,
    mountSuiteNav: mountSuiteNav,
    adoptSuiteChrome: adoptSuiteChrome,
    loadShared: loadShared,
    saveShared: saveShared,
    mergeSharedInto: mergeSharedInto,
    pushSharedFrom: pushSharedFrom
  };
})(typeof window !== 'undefined' ? window : globalThis);
