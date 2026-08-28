/**
 * ibm.io tools suite — surreptitious top-right switcher + shared look settings.
 * Load from word counter (../lib/suite.js) or time counter (../lib/suite.js).
 */
(function (global) {
  'use strict';

  var SHARED_KEY = 'ibm.tools.shared';
  var STYLE_ID = 'ibm-suite-styles';

  var TOOLS = [
    {
      id: 'wordcount',
      label: 'words',
      paths: ['wordcount', 'wordcounter'],
      file: 'index.html'
    },
    {
      id: 'timecount',
      label: 'time',
      paths: ['timecount'],
      file: 'index.html'
    }
  ];

  function detectToolId() {
    var path = (global.location && global.location.pathname) || '';
    var i;
    for (i = 0; i < TOOLS.length; i++) {
      var j;
      for (j = 0; j < TOOLS[i].paths.length; j++) {
        if (path.indexOf('/' + TOOLS[i].paths[j]) >= 0) return TOOLS[i].id;
      }
    }
    if (/\/index\.html?$/.test(path) || path.endsWith('/')) return 'wordcount';
    return 'wordcount';
  }

  function suiteRoot() {
    var path = (global.location && global.location.pathname) || '/';
    var segments = path.split('/').filter(Boolean);
    var i;
    for (i = 0; i < TOOLS.length; i++) {
      var j;
      for (j = 0; j < TOOLS[i].paths.length; j++) {
        var idx = segments.indexOf(TOOLS[i].paths[j]);
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

  function hasWordcountPath() {
    var path = (global.location && global.location.pathname) || '/';
    return /\/(wordcount|wordcounter)(\/|$)/.test(path);
  }

  function toolHref(tool) {
    var loc = global.location || {};
    var path = loc.pathname || '';
    if (loc.protocol === 'file:') {
      var inSub = TOOLS.some(function (t) {
        return t.id !== tool.id && t.paths.some(function (p) {
          return path.indexOf('/' + p + '/') >= 0;
        });
      });
      if (tool.id === 'wordcount') {
        return inSub ? '../index.html' : 'index.html';
      }
      return inSub ? 'index.html' : 'timecount/index.html';
    }
    // Live ibm.io / workers — always absolute tool URLs
    if (isProductionHost()) {
      return '/' + tool.paths[0] + '/';
    }
    // Local mirror of prod layout (.../wordcount/, .../timecount/)
    if (hasWordcountPath()) {
      var root = suiteRoot();
      var pathSeg = tool.paths[0];
      if (!root || root === '/') return '/' + pathSeg + '/';
      return root + '/' + pathSeg + '/';
    }
    // Local repo http.server: wordcount at /, timecount at /timecount/
    var here = detectToolId();
    if (tool.id === 'wordcount') {
      return here === 'timecount' ? '../' : './';
    }
    return here === 'timecount' ? './' : 'timecount/';
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css =
      '.suite-nav{position:fixed;top:max(8px,env(safe-area-inset-top));right:max(8px,env(safe-area-inset-right));z-index:200;font:400 11px/1.2 var(--ui,Helvetica,Arial,sans-serif);color:var(--mute,#757575);pointer-events:none}' +
      '.suite-nav-inner{pointer-events:auto;display:flex;flex-direction:column;align-items:flex-end;gap:0}' +
      '.suite-nav-btn{width:22px;height:22px;padding:0;border:0;background:none;color:inherit;cursor:pointer;opacity:.28;transition:opacity .2s ease,color .2s ease;display:flex;align-items:center;justify-content:center;touch-action:manipulation}' +
      '.suite-nav:hover .suite-nav-btn,.suite-nav:focus-within .suite-nav-btn,.suite-nav.is-open .suite-nav-btn{opacity:.92;color:var(--ink,#111)}' +
      '.suite-nav-btn:focus-visible{outline:1px solid var(--accent,#c45c26);outline-offset:2px;opacity:1}' +
      '.suite-nav-btn svg{display:block;width:12px;height:12px}' +
      '.suite-nav-menu{margin:4px 0 0;padding:3px 0;list-style:none;min-width:5.5rem;background:color-mix(in srgb,var(--face,#fafaf8) 94%,var(--ink,#111) 6%);border:1px solid var(--hair,#e4e4e0);opacity:0;transform:translateY(-4px);pointer-events:none;transition:opacity .18s ease,transform .18s ease}' +
      '.suite-nav.is-open .suite-nav-menu,.suite-nav:hover .suite-nav-menu,.suite-nav:focus-within .suite-nav-menu{opacity:1;transform:none;pointer-events:auto}' +
      '.suite-nav-menu a{display:block;padding:5px 10px 5px 9px;color:var(--mute,#757575);text-decoration:none;letter-spacing:.06em;text-transform:lowercase;white-space:nowrap;transition:color .15s ease,background .15s ease}' +
      '.suite-nav-menu a:hover,.suite-nav-menu a:focus-visible{color:var(--ink,#111);background:color-mix(in srgb,var(--hair,#e4e4e0) 55%,transparent);outline:none}' +
      '.suite-nav-menu a[aria-current="page"]{color:var(--accent,#c45c26)}' +
      '.suite-nav-menu a[aria-current="page"]::before{content:"· ";opacity:.7}' +
      '@media(max-width:560px){.suite-nav-menu{opacity:0;pointer-events:none}.suite-nav.is-open .suite-nav-menu{opacity:1;pointer-events:auto}}';
    var el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = css;
    document.head.appendChild(el);
  }

  function mountSuiteNav(currentId) {
    injectStyles();
    currentId = currentId || detectToolId();
    if (document.querySelector('.suite-nav')) return;

    var nav = document.createElement('nav');
    nav.className = 'suite-nav';
    nav.setAttribute('aria-label', 'tools');

    var inner = document.createElement('div');
    inner.className = 'suite-nav-inner';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'suite-nav-btn';
    btn.setAttribute('aria-label', 'tools');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<svg viewBox="0 0 12 12" aria-hidden="true" fill="currentColor">' +
      '<rect x="1" y="1" width="3" height="3" rx=".4"/>' +
      '<rect x="8" y="1" width="3" height="3" rx=".4"/>' +
      '<rect x="1" y="8" width="3" height="3" rx=".4"/>' +
      '<rect x="8" y="8" width="3" height="3" rx=".4"/>' +
      '</svg>';

    var menu = document.createElement('ul');
    menu.className = 'suite-nav-menu';
    menu.setAttribute('role', 'list');

    TOOLS.forEach(function (tool) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = toolHref(tool);
      a.textContent = tool.label;
      if (tool.id === currentId) a.setAttribute('aria-current', 'page');
      li.appendChild(a);
      menu.appendChild(li);
    });

    inner.appendChild(btn);
    inner.appendChild(menu);
    nav.appendChild(inner);
    document.body.appendChild(nav);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('pointerdown', function (e) {
      if (!nav.contains(e.target)) {
        nav.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        nav.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
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
    detectToolId: detectToolId,
    toolHref: toolHref,
    mountSuiteNav: mountSuiteNav,
    loadShared: loadShared,
    saveShared: saveShared,
    mergeSharedInto: mergeSharedInto,
    pushSharedFrom: pushSharedFrom
  };
})(typeof window !== 'undefined' ? window : globalThis);
