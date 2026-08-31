/**
 * Shared settings chrome for number instruments.
 * Syncs theme / ui / font / faces via IBMTools (ibm.tools.shared).
 */
(function (global) {
  'use strict';

  var THEMES = (global.IBMTools && IBMTools.THEMES) ||
    ['light', 'dark', 'contrast', 'paper', 'glass', 'frost', 'brutal', 'loom', 'tank', 'nes'];
  var DYSLEXIC_WEB = '"OpenDyslexic", "Comic Sans MS", "Chalkboard SE", sans-serif';
  var DYSLEXIC_LOCAL = '"Comic Sans MS", "Chalkboard SE", "Segoe Print", "Bradley Hand", sans-serif';

  var TYPE_FACES_WEB = {
    braun: { sans: 'Helvetica, "Helvetica Neue", Arial, sans-serif', serif: 'Times, "Times New Roman", serif', book: 'Palatino, "Palatino Linotype", Georgia, serif', mono: '"SF Mono", Menlo, Consolas, monospace', dyslexic: DYSLEXIC_WEB },
    monocle: { sans: '"Source Sans 3", "Avenir Next", sans-serif', serif: '"Source Serif 4", Georgia, serif', book: '"Source Serif 4", Palatino, Georgia, serif', mono: '"Source Code Pro", Menlo, monospace', dyslexic: DYSLEXIC_WEB },
    bauhaus: { sans: '"Josefin Sans", Futura, sans-serif', serif: '"Josefin Slab", Georgia, serif', book: '"Cormorant Garamond", Didot, Georgia, serif', mono: '"Space Mono", Menlo, monospace', dyslexic: DYSLEXIC_WEB },
    noyes: { sans: '"IBM Plex Sans", Helvetica, Arial, sans-serif', serif: '"IBM Plex Serif", Georgia, serif', book: '"IBM Plex Serif", Palatino, Georgia, serif', mono: '"IBM Plex Mono", Menlo, monospace', dyslexic: DYSLEXIC_WEB },
    ikea: { sans: 'Verdana, Geneva, Tahoma, sans-serif', serif: 'Georgia, Times, serif', book: 'Palatino, Georgia, serif', mono: 'Consolas, monospace', dyslexic: DYSLEXIC_WEB },
    military: { sans: 'Oswald, "Arial Narrow", sans-serif', serif: '"Roboto Slab", Georgia, serif', book: '"Roboto Slab", Georgia, serif', mono: '"Share Tech Mono", monospace', dyslexic: DYSLEXIC_WEB },
    terminal: { sans: '"IBM Plex Sans", Helvetica, Arial, sans-serif', serif: '"IBM Plex Serif", Georgia, serif', book: 'Georgia, Times, serif', mono: '"SF Mono", Menlo, Consolas, monospace', dyslexic: DYSLEXIC_WEB },
    nyt: { sans: '"Libre Franklin", Helvetica, Arial, sans-serif', serif: 'Georgia, Times, serif', book: '"Newsreader", Georgia, serif', mono: '"IBM Plex Mono", Menlo, monospace', dyslexic: DYSLEXIC_WEB }
  };
  var TYPE_FACES_LOCAL = {
    braun: { sans: 'Helvetica, Arial, sans-serif', serif: 'Times, serif', book: 'Palatino, Georgia, serif', mono: 'ui-monospace, Menlo, monospace', dyslexic: DYSLEXIC_LOCAL },
    monocle: { sans: '"Avenir Next", "Gill Sans", sans-serif', serif: 'Georgia, serif', book: 'Palatino, Georgia, serif', mono: 'ui-monospace, Menlo, monospace', dyslexic: DYSLEXIC_LOCAL },
    bauhaus: { sans: 'Futura, "Century Gothic", sans-serif', serif: '"Century Schoolbook", Georgia, serif', book: 'Didot, Georgia, serif', mono: 'ui-monospace, monospace', dyslexic: DYSLEXIC_LOCAL },
    noyes: { sans: 'system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif', serif: 'Georgia, serif', book: 'Palatino, Georgia, serif', mono: 'ui-monospace, Menlo, monospace', dyslexic: DYSLEXIC_LOCAL },
    ikea: { sans: 'Verdana, Geneva, Tahoma, sans-serif', serif: 'Georgia, Times, serif', book: 'Palatino, Georgia, serif', mono: 'Consolas, monospace', dyslexic: DYSLEXIC_LOCAL },
    military: { sans: '"Arial Narrow", Impact, sans-serif', serif: 'Georgia, serif', book: 'Georgia, serif', mono: '"Courier New", monospace', dyslexic: DYSLEXIC_LOCAL },
    terminal: { sans: 'system-ui, Helvetica, Arial, sans-serif', serif: 'Georgia, serif', book: 'Georgia, serif', mono: 'ui-monospace, Menlo, monospace', dyslexic: DYSLEXIC_LOCAL },
    nyt: { sans: 'system-ui, Helvetica, Arial, sans-serif', serif: 'Georgia, Times, serif', book: 'Georgia, serif', mono: 'ui-monospace, Menlo, monospace', dyslexic: DYSLEXIC_LOCAL }
  };
  var UI_FONTS_WEB = {
    braun: 'Helvetica, "Helvetica Neue", Arial, sans-serif',
    monocle: '"Source Sans 3", "Avenir Next", "Gill Sans", sans-serif',
    bauhaus: '"Josefin Sans", Futura, "Century Gothic", sans-serif',
    noyes: '"IBM Plex Sans", Helvetica, Arial, sans-serif',
    ikea: 'Verdana, Geneva, Tahoma, sans-serif',
    military: 'Oswald, "Arial Narrow", sans-serif',
    terminal: '"SF Mono", Menlo, Consolas, monospace',
    nyt: 'Georgia, "Times New Roman", Times, serif'
  };
  var UI_FONTS_LOCAL = {
    braun: 'Helvetica, Arial, sans-serif',
    monocle: '"Avenir Next", "Gill Sans", sans-serif',
    bauhaus: 'Futura, "Century Gothic", sans-serif',
    noyes: 'system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
    ikea: 'Verdana, Geneva, Tahoma, sans-serif',
    military: '"Arial Narrow", sans-serif',
    terminal: 'ui-monospace, Menlo, monospace',
    nyt: 'Georgia, "Times New Roman", Times, serif'
  };
  var FONT_ROLES = { sans: true, serif: true, book: true, mono: true, dyslexic: true };
  var FACES = { auto: true, web: true, local: true };
  var UI_KEYS = Object.keys(UI_FONTS_WEB);

  function preferTheme() {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch (e) {}
    return 'light';
  }

  function useWebFaces(settings) {
    if (settings.faces === 'local') return false;
    if (settings.faces === 'web') return true;
    try { return navigator.onLine !== false; } catch (e) { return true; }
  }

  function normalizeShowViz(v) {
    if (v === false || v === 'off' || v === 'plain' || v === 'false') return 'plain';
    if (v === 'deep') return 'deep';
    return 'viz';
  }

  function vizMode(settings) {
    return normalizeShowViz(settings && settings.showViz);
  }

  function applyChrome(settings) {
    var web = useWebFaces(settings);
    var uiMap = web ? UI_FONTS_WEB : UI_FONTS_LOCAL;
    var faces = web ? TYPE_FACES_WEB : TYPE_FACES_LOCAL;
    var uiKey = uiMap[settings.ui] ? settings.ui : 'braun';
    var digitFont = (faces[uiKey] && faces[uiKey][settings.font]) || faces.braun.mono;
    var root = document.documentElement;
    var mode = vizMode(settings);
    root.setAttribute('data-theme', settings.theme);
    root.setAttribute('data-ui', uiKey);
    root.setAttribute('data-font', settings.font);
    root.setAttribute('data-faces', web ? 'web' : 'local');
    root.setAttribute('data-show-viz', mode);
    root.style.setProperty('--ui', uiMap[uiKey] || uiMap.braun);
    root.style.setProperty('--digits', digitFont);
    var link = document.getElementById('webFonts');
    if (link) link.disabled = !web;
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    var bg = getComputedStyle(root).getPropertyValue('--bg').trim() || '#f2f2f0';
    metas.forEach(function (m) { m.setAttribute('content', bg); });
    var themeBtn = document.getElementById('themeBtn');
    if (themeBtn) themeBtn.setAttribute('aria-label', 'theme: ' + settings.theme);
  }

  function syncRadios(settings, extraKeys) {
    ['theme', 'ui', 'font', 'faces'].concat(extraKeys || []).forEach(function (name) {
      var nodes = document.querySelectorAll('input[name="' + name + '"]');
      nodes.forEach(function (n) { n.checked = String(n.value) === String(settings[name]); });
    });
    var viz = document.querySelector('input[name="showViz"]');
    if (viz && viz.type === 'checkbox') viz.checked = vizMode(settings) !== 'plain';
  }

  var _deepLoads = Object.create(null);
  var _deepLibBase = null;

  function deepLibBase() {
    if (_deepLibBase) return _deepLibBase;
    var link = document.querySelector('link[rel="stylesheet"][href*="number-tool"]');
    if (link && link.href) {
      _deepLibBase = link.href.replace(/\/[^/]*$/, '/');
    } else {
      var scripts = document.querySelectorAll('script[src*="number-tool"]');
      var s = scripts[scripts.length - 1];
      _deepLibBase = s && s.src ? s.src.replace(/\/[^/]*$/, '/') : '../lib/';
    }
    return _deepLibBase;
  }

  function loadScriptOnce(src) {
    return new Promise(function (ok, fail) {
      var existing = document.querySelector('script[data-deep-src="' + src + '"]');
      if (existing) {
        if (existing.getAttribute('data-deep-ready') === '1') return ok();
        existing.addEventListener('load', function () { ok(); });
        existing.addEventListener('error', function () { fail(new Error('load ' + src)); });
        return;
      }
      var el = document.createElement('script');
      el.src = src;
      el.async = true;
      el.setAttribute('data-deep-src', src);
      el.onload = function () {
        el.setAttribute('data-deep-ready', '1');
        ok();
      };
      el.onerror = function () { fail(new Error('load ' + src)); };
      document.head.appendChild(el);
    });
  }

  function loadDeepViz(engine) {
    var key = engine === 'webgl' ? 'webgl' : 'vega';
    if (_deepLoads[key]) return _deepLoads[key];
    var base = deepLibBase();
    var bust = '43';
    var srcs;
    if (key === 'webgl') {
      srcs = [base + 'regl.min.js?v=' + bust, base + 'deep-viz.js?v=' + bust];
    } else {
      /* order matters: vega → vega-lite → vega-embed → deep-viz */
      srcs = [
        base + 'vega.min.js?v=' + bust,
        base + 'vega-lite.min.js?v=' + bust,
        base + 'vega-embed.min.js?v=' + bust,
        base + 'deep-viz.js?v=' + bust
      ];
    }
    _deepLoads[key] = srcs.reduce(function (chain, src) {
      return chain.then(function () { return loadScriptOnce(src); });
    }, Promise.resolve()).then(function () {
      return global.IBMDeepViz;
    });
    return _deepLoads[key];
  }

  function deepVegaConfig() {
    var cs = getComputedStyle(document.documentElement);
    var fg = (cs.getPropertyValue('--fg') || cs.getPropertyValue('--ink') || '#1a1a1a').trim();
    var border = (cs.getPropertyValue('--rule') || cs.getPropertyValue('--border') || '#ccc').trim();
    var accent = (cs.getPropertyValue('--accent') || '#c44').trim();
    var mute = (cs.getPropertyValue('--mute') || '#888').trim();
    var ui = (cs.getPropertyValue('--ui') || 'system-ui, sans-serif').trim();
    var digits = (cs.getPropertyValue('--digits') || ui).trim();
    return {
      background: 'transparent',
      padding: { left: 12, top: 10, right: 8, bottom: 36 },
      font: ui,
      text: { font: ui, color: mute, fontSize: 10 },
      axis: {
        labelFont: ui,
        titleFont: ui,
        labelColor: mute,
        titleColor: mute,
        gridColor: border,
        domainColor: border,
        tickColor: border,
        labelFontSize: 10,
        titleFontSize: 10,
        titlePadding: 10,
        labelPadding: 4,
        tickSize: 3,
        domain: false
      },
      view: { stroke: 'transparent' },
      legend: { labelFont: ui, titleFont: ui, labelColor: mute, titleColor: mute, labelFontSize: 9, titleFontSize: 10 },
      range: { ramp: { scheme: 'greys' }, category: { scheme: 'greys' } },
      point: { color: accent },
      rule: { color: accent },
      mark: { color: fg },
      title: { font: ui, color: mute, fontSize: 10 },
      header: { titleFont: ui, titleColor: mute, titleFontSize: 10 }
    };
  }

  /** Fonts + colors for canvas / WebGL deep painters (matches chrome + digits settings). */
  function deepChartFonts() {
    var cs = getComputedStyle(document.documentElement);
    return {
      ui: (cs.getPropertyValue('--ui') || 'system-ui, sans-serif').trim(),
      digits: (cs.getPropertyValue('--digits') || cs.getPropertyValue('--ui') || 'monospace').trim(),
      mute: (cs.getPropertyValue('--mute') || '#888').trim(),
      ink: (cs.getPropertyValue('--ink') || cs.getPropertyValue('--fg') || '#1a1a1a').trim(),
      accent: (cs.getPropertyValue('--accent') || '#c44').trim()
    };
  }

  function ensureDeepHost(stage, kind, scrubId) {
    if (!stage) return null;
    var want = kind === 'webgl' ? 'deep-canvas' : 'deep-chart';
    var el = stage.querySelector('.' + want);
    if (el && stage.getAttribute('data-deep') === kind) {
      if (scrubId) {
        var overlay = stage.querySelector('.deep-scrub');
        if (overlay) overlay.setAttribute('data-scrub', scrubId);
      }
      return el;
    }
    stage.innerHTML = '';
    stage.setAttribute('data-deep', kind);
    if (kind === 'webgl') {
      el = document.createElement('canvas');
      el.className = 'deep-canvas';
      el.setAttribute('aria-hidden', 'true');
      stage.appendChild(el);
    } else {
      el = document.createElement('div');
      el.className = 'deep-chart';
      el.setAttribute('aria-hidden', 'true');
      stage.appendChild(el);
    }
    if (scrubId) {
      var ov = document.createElement('div');
      ov.className = 'deep-scrub';
      ov.setAttribute('data-scrub', scrubId);
      ov.setAttribute('aria-hidden', 'true');
      stage.appendChild(ov);
    }
    return el;
  }

  var DEEP_WEBGL = { fuel: 1, ratio: 1, exposure: 1, combo: 1, bayes: 1, sample: 1 };
  var _deepPaintGen = 0;
  var _deepResizeRaf = 0;
  var _deepLastSize = { w: 0, h: 0 };
  var _stackScrollEnd = 0;

  function resizeDeepCharts() {
    var stage = document.getElementById('toolStage');
    if (!stage) return;
    var chart = stage.querySelector('.deep-chart');
    if (chart && chart._deepView && typeof chart._deepView.resize === 'function') {
      var r = chart.getBoundingClientRect();
      var w = Math.max(0, Math.round(r.width));
      var h = Math.max(0, Math.round(r.height));
      if (w >= 2 && h >= 2 && (w !== _deepLastSize.w || h !== _deepLastSize.h)) {
        _deepLastSize.w = w;
        _deepLastSize.h = h;
        try { chart._deepView.resize(); } catch (e) { /* ignore */ }
      }
    }
    var canvas = stage.querySelector('.deep-canvas');
    if (canvas && canvas._deepGL && typeof canvas._deepGL.draw === 'function') {
      try { canvas._deepGL.draw(); } catch (e2) { /* ignore */ }
    }
  }

  function scheduleDeepResize() {
    if (_deepResizeRaf) return;
    _deepResizeRaf = requestAnimationFrame(function () {
      _deepResizeRaf = 0;
      if (Date.now() < _stackScrollEnd) {
        scheduleDeepResize();
        return;
      }
      resizeDeepCharts();
    });
  }

  function paintDeep(toolId, stage, payload) {
    var engineHint = DEEP_WEBGL[toolId] ? 'webgl' : 'vega';
    if (global.IBMDeepViz && typeof IBMDeepViz.engine === 'function') {
      engineHint = IBMDeepViz.engine(toolId) || engineHint;
    }
    var gen = ++_deepPaintGen;
    syncStageBounds();
    return loadDeepViz(engineHint).then(function (api) {
      if (gen !== _deepPaintGen) return;
      if (!api || typeof api.paint !== 'function') throw new Error('IBMDeepViz missing');
      return api.paint(toolId, stage, payload || {});
    }).then(function () {
      if (gen !== _deepPaintGen) return;
      afterPaint();
      syncStageBounds();
      requestAnimationFrame(function () {
        if (gen !== _deepPaintGen) return;
        scheduleDeepResize();
        requestAnimationFrame(scheduleDeepResize);
      });
    }).catch(function (err) {
      if (gen !== _deepPaintGen) return;
      if (typeof console !== 'undefined' && console.warn) console.warn('deep viz', toolId, err);
      if (stage) {
        stage.innerHTML = '<div class="deep-fallback">deep view unavailable</div>';
        stage.removeAttribute('data-deep');
      }
    });
  }

  /* Shared WebGL math helpers for deep-viz.js */
  var deepGL = {
    perspective: function (fovy, aspect, near, far) {
      var f = 1 / Math.tan(fovy / 2);
      var nf = 1 / (near - far);
      return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, 2 * far * near * nf, 0
      ];
    },
    lookAt: function (eye, center, up) {
      var zx = eye[0] - center[0], zy = eye[1] - center[1], zz = eye[2] - center[2];
      var zl = 1 / Math.hypot(zx, zy, zz);
      zx *= zl; zy *= zl; zz *= zl;
      var xx = up[1] * zz - up[2] * zy;
      var xy = up[2] * zx - up[0] * zz;
      var xz = up[0] * zy - up[1] * zx;
      var xl = Math.hypot(xx, xy, xz) || 1;
      xx /= xl; xy /= xl; xz /= xl;
      var yx = zy * xz - zz * xy;
      var yy = zz * xx - zx * xz;
      var yz = zx * xy - zy * xx;
      return [
        xx, yx, zx, 0,
        xy, yy, zy, 0,
        xz, yz, zz, 0,
        -(xx * eye[0] + xy * eye[1] + xz * eye[2]),
        -(yx * eye[0] + yy * eye[1] + yz * eye[2]),
        -(zx * eye[0] + zy * eye[1] + zz * eye[2]),
        1
      ];
    },
    mul: function (a, b) {
      var o = new Array(16);
      for (var c = 0; c < 4; c++) {
        for (var r = 0; r < 4; r++) {
          o[c * 4 + r] =
            a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] +
            a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
        }
      }
      return o;
    },
    orbitEye: function (yaw, pitch, radius, target) {
      target = target || [0, 0, 0];
      var cy = Math.cos(yaw), sy = Math.sin(yaw);
      var cp = Math.cos(pitch), sp = Math.sin(pitch);
      return [
        target[0] + radius * cy * cp,
        target[1] + radius * sp,
        target[2] + radius * sy * cp
      ];
    },
    cssColor: function (name, fallback) {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback || '#888';
    },
    hexToRgb: function (hex) {
      hex = String(hex || '').replace('#', '');
      if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      var n = parseInt(hex, 16);
      if (!Number.isFinite(n)) return [0.5, 0.5, 0.5];
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    }
  };
  global.__deepGL = deepGL;

  var activeToolId = null;

  function loadLocal(id) {
    try {
      return JSON.parse(localStorage.getItem('ibm.tool.' + id + '.settings') || '{}') || {};
    } catch (e) { return {}; }
  }

  function saveLocal(id, settings, extraKeys) {
    try {
      var payload = {
        theme: settings.theme,
        ui: settings.ui,
        font: settings.font,
        faces: settings.faces,
        showViz: normalizeShowViz(settings.showViz)
      };
      (extraKeys || []).forEach(function (k) {
        if (settings[k] != null) payload[k] = settings[k];
      });
      localStorage.setItem('ibm.tool.' + id + '.settings', JSON.stringify(payload));
    } catch (e) {}
  }

  function mountSettings(opts) {
    var id = opts.id;
    activeToolId = id || null;
    var about = opts.about || '';
    var hasViz = !!opts.hasViz;
    var extra = opts.extra || null;
    var extraDefaults = (extra && extra.defaults) || {};
    var extraKeys = Object.keys(extraDefaults);
    var settings = {
      theme: preferTheme(),
      ui: 'braun',
      font: 'mono',
      faces: 'auto',
      showViz: 'viz'
    };
    extraKeys.forEach(function (k) { settings[k] = extraDefaults[k]; });

    var local = loadLocal(id);
    Object.keys(local).forEach(function (k) {
      if (local[k] != null) settings[k] = local[k];
    });
    settings.showViz = normalizeShowViz(settings.showViz);
    /* Re-apply defaults for unknown extra values */
    extraKeys.forEach(function (k) {
      if (settings[k] == null) settings[k] = extraDefaults[k];
    });

    if (global.IBMTools) {
      var shared = IBMTools.loadShared();
      if (THEMES.indexOf(shared.theme) >= 0) settings.theme = shared.theme;
      if (UI_FONTS_WEB[shared.ui] || UI_FONTS_LOCAL[shared.ui]) settings.ui = shared.ui;
      if (FONT_ROLES[shared.font]) settings.font = shared.font;
      if (FACES[shared.faces]) settings.faces = shared.faces;
    }
    if (THEMES.indexOf(settings.theme) < 0) settings.theme = preferTheme();
    if (!UI_FONTS_WEB[settings.ui]) settings.ui = 'braun';
    if (!FONT_ROLES[settings.font]) settings.font = 'mono';
    if (!FACES[settings.faces]) settings.faces = 'auto';
    settings.showViz = normalizeShowViz(settings.showViz);

    var dock = document.createElement('div');
    dock.className = 'dock';
    dock.innerHTML =
      '<div id="settings" role="dialog" aria-label="settings" hidden>' +
        '<div class="inner">' +
          '<div class="sheet-grip" aria-hidden="true"></div>' +
          '<div class="fields">' +
            '<fieldset><legend>look</legend><div class="seg" role="radiogroup" aria-label="theme">' +
              THEMES.map(function (t) {
                return '<label><input type="radio" name="theme" value="' + t + '"><span>' + t + '</span></label>';
              }).join('') +
            '</div></fieldset>' +
            '<fieldset><legend>chrome</legend><div class="seg" role="radiogroup" aria-label="interface font">' +
              UI_KEYS.map(function (u) {
                return '<label><input type="radio" name="ui" value="' + u + '"><span>' + u + '</span></label>';
              }).join('') +
            '</div></fieldset>' +
            '<fieldset><legend>digits</legend><div class="seg" role="radiogroup" aria-label="digit font">' +
              Object.keys(FONT_ROLES).map(function (f) {
                return '<label><input type="radio" name="font" value="' + f + '"><span>' + f + '</span></label>';
              }).join('') +
            '</div></fieldset>' +
            '<fieldset><legend>faces</legend><div class="seg" role="radiogroup" aria-label="font source">' +
              '<label><input type="radio" name="faces" value="auto"><span>auto</span></label>' +
              '<label><input type="radio" name="faces" value="web"><span>web</span></label>' +
              '<label><input type="radio" name="faces" value="local"><span>local</span></label>' +
            '</div></fieldset>' +
            (hasViz
              ? '<fieldset><legend>layer</legend><div class="seg" role="radiogroup" aria-label="visualization">' +
                '<label><input type="radio" name="showViz" value="viz"><span>viz</span></label>' +
                '<label><input type="radio" name="showViz" value="deep"><span>deep</span></label>' +
                '<label><input type="radio" name="showViz" value="plain"><span>plain</span></label>' +
                '</div></fieldset>'
              : '') +
            ((extra && extra.fieldsHtml) ? extra.fieldsHtml : '') +
            '<fieldset class="about-info"><legend>about</legend>' +
              '<p class="about-copy">' + (about || 'Local instrument. Look settings sync with words and time.') + '</p>' +
            '</fieldset>' +
            '<fieldset><legend>keys</legend><p class="keys-hint">' +
              '<kbd>esc</kbd> close · <kbd>⌘/ctrl</kbd>+<kbd>,</kbd> settings · <kbd>⌘/ctrl</kbd>+<kbd>⇧</kbd>+<kbd>t</kbd> theme' +
              '<br><strong>gestures</strong> — face / chart: drag up/down = primary · left/right = linked axis · pinch · trackpad · <kbd>⌘</kbd>+scroll = coarse' +
              '<br>value row: drag that field · tap empty cell to type · stack scrolls when mid-list' +
              '<br>chart cell: tab to focus · <kbd>↑</kbd><kbd>↓</kbd> nudge · <kbd>⇧</kbd> = coarse · live value while dragging' +
              '<br>steppers: hold ± to accelerate · haptic on each step' +
            '</p></fieldset>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(dock);
    polishInputs(document);
    mountSteppers(document);
    mountGestures();
    mountInstrumentLayout();

    var panel = document.getElementById('settings');
    var toggle = document.getElementById('settingsToggle');
    var themeBtn = document.getElementById('themeBtn');
    var settingsFocusBefore = null;

    if (panel) panel.setAttribute('aria-modal', 'true');
    if (toggle) toggle.setAttribute('aria-haspopup', 'dialog');

    function persist() {
      saveLocal(id, settings, extraKeys);
      if (global.IBMTools) IBMTools.pushSharedFrom(settings);
    }

    function apply() {
      applyChrome(settings);
      syncRadios(settings, extraKeys);
      var mode = vizMode(settings);
      ['viz', 'deep', 'plain'].forEach(function (v) {
        var node = document.querySelector('input[name="showViz"][value="' + v + '"]');
        if (node) node.checked = mode === v;
      });
      /* legacy on/off radios if present */
      var vizOn = document.querySelector('input[name="showViz"][value="on"]');
      var vizOff = document.querySelector('input[name="showViz"][value="off"]');
      if (vizOn) vizOn.checked = mode !== 'plain';
      if (vizOff) vizOff.checked = mode === 'plain';
      if (typeof opts.onApply === 'function') opts.onApply(settings);
      if (extra && typeof extra.onChange === 'function') extra.onChange(settings);
      if (typeof global.__ibmToolRender === 'function') global.__ibmToolRender();
    }

    function focusablesIn(root) {
      if (!root) return [];
      return Array.prototype.slice.call(root.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(function (el) {
        if (el.hasAttribute('hidden') || el.getAttribute('aria-hidden') === 'true') return false;
        var style = window.getComputedStyle(el);
        if (style.visibility === 'hidden' || style.display === 'none') return false;
        return true;
      });
    }

    function setOpen(open) {
      var wasOpen = document.body.classList.contains('settings-open');
      document.body.classList.toggle('settings-open', open);
      if (panel) {
        if (open) {
          panel.removeAttribute('hidden');
          panel.setAttribute('aria-modal', 'true');
          if (!panel.hasAttribute('tabindex')) panel.setAttribute('tabindex', '-1');
        } else {
          panel.setAttribute('hidden', '');
        }
      }
      if (toggle) {
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (toggle.textContent === 'close' || toggle.textContent === 'settings') {
          toggle.textContent = open ? 'close' : 'settings';
        }
      }
      if (open && !wasOpen) {
        settingsFocusBefore = document.activeElement;
        /* Defer past the click that opened settings so focus isn't stolen back by the toggle */
        setTimeout(function () {
          var list = focusablesIn(panel);
          var target = null;
          for (var i = 0; i < list.length; i++) {
            if (list[i] !== toggle && list[i].id !== 'settingsToggle') {
              target = list[i];
              break;
            }
          }
          target = target || panel;
          try { target.focus(); } catch (err) {}
        }, 0);
      } else if (!open && wasOpen) {
        var restore = settingsFocusBefore && document.contains(settingsFocusBefore)
          ? settingsFocusBefore
          : toggle;
        settingsFocusBefore = null;
        if (restore && restore.focus) {
          try { restore.focus(); } catch (err) {}
        }
      }
    }

    function cycleTheme() {
      var i = THEMES.indexOf(settings.theme);
      settings.theme = THEMES[(i + 1) % THEMES.length];
      persist();
      apply();
    }

    function closeSuiteNav() {
      if (global.IBMTools && typeof IBMTools.closeSuiteNav === 'function') {
        IBMTools.closeSuiteNav();
      } else {
        var suite = document.querySelector('.suite-nav.is-open');
        if (suite) suite.classList.remove('is-open');
        var suiteBtn = document.querySelector('.suite-nav-btn');
        if (suiteBtn) suiteBtn.setAttribute('aria-expanded', 'false');
        var suitePanel = document.querySelector('.suite-nav-panel');
        if (suitePanel) suitePanel.setAttribute('hidden', '');
      }
      if (global.IBMTools && typeof IBMTools.closeHelp === 'function') IBMTools.closeHelp();
    }

    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        closeSuiteNav();
        setOpen(!document.body.classList.contains('settings-open'));
      });
    }
    if (themeBtn) {
      themeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeSuiteNav();
        cycleTheme();
      });
    }

    panel.addEventListener('change', function (e) {
      var t = e.target;
      if (!t || !t.name) return;
      if (t.name === 'showViz') {
        settings.showViz = normalizeShowViz(t.value === 'on' ? 'viz' : t.value === 'off' ? 'plain' : t.value);
      } else if (t.name === 'theme' && THEMES.indexOf(t.value) >= 0) {
        settings.theme = t.value;
      } else if (t.name === 'ui' && UI_FONTS_WEB[t.value]) {
        settings.ui = t.value;
      } else if (t.name === 'font' && FONT_ROLES[t.value]) {
        settings.font = t.value;
      } else if (t.name === 'faces' && FACES[t.value]) {
        settings.faces = t.value;
      } else if (extraKeys.indexOf(t.name) >= 0 && t.type === 'radio' && t.checked) {
        settings[t.name] = t.value;
      } else return;
      persist();
      apply();
    });

    panel.addEventListener('keydown', function (e) {
      if (!document.body.classList.contains('settings-open')) return;
      if (e.key !== 'Tab') return;
      var list = focusablesIn(panel);
      if (!list.length) return;
      var first = list[0];
      var last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    document.addEventListener('pointerdown', function (e) {
      if (!document.body.classList.contains('settings-open')) return;
      if (!panel || !e.target) return;
      if (panel.contains(e.target)) return;
      if (toggle && (e.target === toggle || toggle.contains(e.target))) return;
      if (e.target.closest && e.target.closest('#suiteHelp, #suiteHelpBtn, .suite-help-backdrop')) return;
      setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && global.IBMTools && typeof IBMTools.isHelpOpen === 'function' && IBMTools.isHelpOpen()) {
        return;
      }
      if (e.key === 'Escape' && document.body.classList.contains('settings-open')) {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setOpen(!document.body.classList.contains('settings-open'));
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        cycleTheme();
      }
    });

    apply();
    return {
      settings: settings,
      extraKeys: extraKeys,
      apply: apply,
      persist: persist,
      setOpen: setOpen,
      cycleTheme: cycleTheme
    };
  }

  function setBar(el, pct) {
    if (!el) return;
    el.style.setProperty('--pct', Math.max(0, Math.min(100, pct)) + '%');
  }

  function setVars(el, map) {
    if (!el || !map) return;
    Object.keys(map).forEach(function (k) {
      el.style.setProperty(k, map[k]);
    });
  }

  function ensureStage(kind) {
    var stage = document.getElementById('toolStage');
    if (!stage) {
      stage = document.createElement('div');
      stage.id = 'toolStage';
      stage.className = 'tool-stage';
      stage.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(stage, document.body.firstChild);
    }
    if (kind) stage.setAttribute('data-kind', kind);
    requestAnimationFrame(function () {
      syncStageBounds();
      syncStackScrollState();
    });
    return stage;
  }

  /** Paint a grid of cells. opts: { count, on, shape:'sq'|'dot', cols } */
  function paintCells(root, opts) {
    opts = opts || {};
    var count = Math.max(0, Math.min(400, Math.floor(opts.count || 0)));
    var on = Math.max(0, Math.min(count, Math.floor(opts.on || 0)));
    var shape = opts.shape || 'sq';
    var cols = opts.cols || Math.ceil(Math.sqrt(count)) || 1;
    root.innerHTML = '';
    root.className = (root.className.replace(/\bis-dots\b|\bis-sq\b|\bis-sparse\b/g, '').trim() +
      (shape === 'dot' ? ' is-dots' : ' is-sq') +
      (count > 0 && count <= 16 ? ' is-sparse' : '')).trim();
    root.style.setProperty('--cols', String(cols));
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var cell = document.createElement('i');
      if (i < on) cell.className = 'on';
      frag.appendChild(cell);
    }
    root.appendChild(frag);
    afterPaint();
    return { count: count, on: on, scaled: opts.rawCount != null && opts.rawCount > count };
  }

  /** Last focused scrub cell id — paint() rebuilds DOM and would otherwise drop keyboard focus. */
  var lastScrubId = null;

  function scrubLabelFor(input, scrubId) {
    if (input) {
      return input.getAttribute('aria-label') || input.id || scrubId || 'value';
    }
    return scrubId || 'value';
  }

  /** Make mapped stage cells keyboard-reachable; keep aria in sync after each paint. */
  function wireScrubKeyboard() {
    var stage = document.getElementById('toolStage');
    if (!stage) return;
    var cells = stage.querySelectorAll('[data-scrub]');
    if (!cells.length) {
      stage.setAttribute('aria-hidden', 'true');
      return;
    }
    stage.removeAttribute('aria-hidden');
    var seen = Object.create(null);
    for (var i = 0; i < cells.length; i++) {
      var el = cells[i];
      var scrubId = el.getAttribute('data-scrub');
      var input = scrubId ? document.getElementById(scrubId) : null;
      var nativeFocus = !!(el.matches && el.matches('button, a, input, select, textarea, [href]'));
      var firstOfId = scrubId && !seen[scrubId];
      if (scrubId) seen[scrubId] = true;

      if (!nativeFocus) {
        /* One tab stop per mapped field — deal grids can have dozens of cells */
        el.setAttribute('tabindex', firstOfId ? '0' : '-1');
        el.setAttribute('role', 'slider');
        el.setAttribute('aria-orientation', 'vertical');
        el.setAttribute('aria-label', 'adjust ' + scrubLabelFor(input, scrubId));
      } else if (!el.getAttribute('aria-label') && scrubId) {
        el.setAttribute('aria-label', 'adjust ' + scrubLabelFor(input, scrubId));
      }

      if (input && (firstOfId || nativeFocus)) {
        var v = parseFloat(input.value);
        if (isFinite(v)) el.setAttribute('aria-valuenow', String(v));
        else el.removeAttribute('aria-valuenow');
        var minA = input.getAttribute('min');
        var maxA = input.getAttribute('max');
        if (minA != null && minA !== '') el.setAttribute('aria-valuemin', minA);
        else el.removeAttribute('aria-valuemin');
        if (maxA != null && maxA !== '') el.setAttribute('aria-valuemax', maxA);
        else el.removeAttribute('aria-valuemax');
      }
    }
  }

  function restoreScrubFocus() {
    if (!lastScrubId) return;
    var ae = document.activeElement;
    if (ae && ae !== document.body && ae !== document.documentElement) {
      if (ae.closest && ae.closest('[data-scrub]')) return;
      if (ae.closest && (ae.closest('main') || ae.closest('#settings') || ae.closest('.suite-nav') || ae.closest('.suite-chrome'))) {
        return;
      }
    }
    var stage = document.getElementById('toolStage');
    if (!stage || stage.getAttribute('aria-hidden') === 'true') return;
    var el = stage.querySelector('[data-scrub="' + lastScrubId.replace(/"/g, '') + '"][tabindex="0"]') ||
      stage.querySelector('button[data-scrub="' + lastScrubId.replace(/"/g, '') + '"]') ||
      stage.querySelector('[data-scrub="' + lastScrubId.replace(/"/g, '') + '"]');
    if (!el) return;
    try { el.focus({ preventScroll: true }); } catch (err) {
      try { el.focus(); } catch (err2) {}
    }
  }

  function afterPaint() {
    wireScrubKeyboard();
    requestAnimationFrame(function () {
      syncStageBounds();
      syncStackScrollState();
      restoreScrubFocus();
    });
  }

  function haptic(ms) {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms || 8);
    } catch (e) {}
  }

  function flashClamp(input) {
    if (!input) return;
    var row = input.closest('label.row') || input;
    row.classList.remove('is-clamped');
    void row.offsetWidth;
    row.classList.add('is-clamped');
    haptic(12);
    setTimeout(function () {
      row.classList.remove('is-clamped');
    }, 520);
  }

  /** Clamp a number input to min/max. Returns true if the value changed. */
  function clampNumberInput(input, opts) {
    opts = opts || {};
    if (!input || input.type !== 'number') return false;
    var minAttr = input.getAttribute('min');
    var maxAttr = input.getAttribute('max');
    var min = minAttr != null && minAttr !== '' ? parseFloat(minAttr) : NaN;
    var max = maxAttr != null && maxAttr !== '' ? parseFloat(maxAttr) : NaN;
    var raw = String(input.value).trim();
    var cur = parseFloat(raw);
    if (!isFinite(cur)) {
      if (opts.fillEmpty && isFinite(min)) {
        input.value = String(min);
        return true;
      }
      if (opts.fillEmpty) {
        input.value = '0';
        return true;
      }
      return false;
    }
    var next = cur;
    if (isFinite(min)) next = Math.max(min, next);
    if (isFinite(max)) next = Math.min(max, next);
    if (next === cur && String(next) === raw) return false;
    var decimals = 0;
    var step = parseFloat(input.getAttribute('step'));
    if (isFinite(step) && step > 0) {
      var stepStr = String(step);
      if (stepStr.indexOf('.') >= 0) decimals = stepStr.split('.')[1].length;
    }
    if (decimals > 0) {
      next = Math.round(next * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }
    input.value = String(next);
    return true;
  }

  function paintSoonGhost(id) {
    var stage = ensureStage(id);
    document.body.classList.add('is-soon');
    var html = '';
    if (id === 'exposure') {
      html = '<div class="soon-ghost soon-exposure"><i></i><i></i><i></i></div>';
    } else if (id === 'budget') {
      html = '<div class="soon-ghost soon-budget"><i></i><i></i><i></i></div>';
    } else if (id === 'deal') {
      html = '<div class="soon-ghost soon-deal">';
      for (var i = 0; i < 8; i++) html += '<i class="' + (i < 3 ? 'on' : '') + '"></i>';
      html += '</div>';
    } else if (id === 'streak') {
      html = '<div class="soon-ghost soon-streak">';
      for (var j = 0; j < 7; j++) html += '<i class="' + (j % 2 === 0 ? 'on' : '') + '"></i>';
      html += '</div>';
    } else {
      html = '<div class="soon-ghost"></div>';
    }
    stage.innerHTML = html;
    afterPaint();
    return stage;
  }

  function clearStage(stage) {
    if (stage) stage.innerHTML = '';
  }

  function stepAmount(input, dir, opts) {
    opts = opts || {};
    if (!input) return;
    /* Discrete choice fields: step through <select> options */
    if (input.tagName === 'SELECT') {
      var idx = input.selectedIndex;
      if (idx < 0) idx = 0;
      var jump = opts.fast ? 2 : 1;
      if (opts.factor && opts.factor > 2) jump = Math.max(jump, 2);
      var nextIdx = idx + (dir > 0 ? jump : -jump);
      nextIdx = Math.max(0, Math.min(input.options.length - 1, nextIdx));
      if (nextIdx === idx) return;
      input.selectedIndex = nextIdx;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      haptic(8);
      return;
    }
    var baseStep = parseFloat(input.getAttribute('step'));
    if (!isFinite(baseStep) || baseStep <= 0) baseStep = 1;
    var fast = parseFloat(input.getAttribute('data-step-fast'));
    var step = opts.fast && isFinite(fast) && fast > 0
      ? fast
      : opts.fast
        ? baseStep * 10
        : baseStep;
    if (opts.factor && opts.factor > 1) step = step * opts.factor;
    var minAttr = input.getAttribute('min');
    var maxAttr = input.getAttribute('max');
    var min = minAttr != null && minAttr !== '' ? parseFloat(minAttr) : -Infinity;
    var max = maxAttr != null && maxAttr !== '' ? parseFloat(maxAttr) : Infinity;
    var cur = parseFloat(input.value);
    if (!isFinite(cur)) cur = isFinite(min) ? min : 0;
    var next = cur + dir * step;
    var decimals = 0;
    var stepStr = String(step);
    if (stepStr.indexOf('e') >= 0) {
      decimals = 6;
    } else if (stepStr.indexOf('.') >= 0) {
      decimals = stepStr.split('.')[1].length;
    }
    next = Math.round(next * Math.pow(10, decimals)) / Math.pow(10, decimals);
    if (isFinite(min)) next = Math.max(min, next);
    if (isFinite(max)) next = Math.min(max, next);
    if (String(next) === String(input.value)) return;
    input.value = String(next);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    haptic(8);
  }

  function bindHold(btn, fn) {
    var timer = null;
    var delay = null;
    var captured = null;
    function clear(e) {
      if (timer) clearInterval(timer);
      if (delay) clearTimeout(delay);
      timer = null;
      delay = null;
      if (captured != null && btn.releasePointerCapture) {
        try {
          if (btn.hasPointerCapture && btn.hasPointerCapture(captured)) {
            btn.releasePointerCapture(captured);
          }
        } catch (err) {}
      }
      captured = null;
    }
    function start(e) {
      if (e.button != null && e.button !== 0) return;
      e.preventDefault();
      captured = e.pointerId;
      try {
        if (btn.setPointerCapture) btn.setPointerCapture(e.pointerId);
      } catch (err) {}
      fn();
      delay = setTimeout(function () {
        timer = setInterval(fn, 55);
      }, 380);
    }
    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', clear);
    btn.addEventListener('pointercancel', clear);
    btn.addEventListener('lostpointercapture', clear);
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fn();
      }
    });
  }

  /** Touch / iOS polish: no zoom on focus, sensible keyboard, no autofill noise. */
  function polishInputs(root) {
    root = root || document;
    root.querySelectorAll('input[type="number"], input[type="text"], select').forEach(function (el) {
      if (!el.getAttribute('autocomplete')) el.setAttribute('autocomplete', 'off');
      if (el.tagName === 'INPUT') {
        el.setAttribute('autocorrect', 'off');
        el.setAttribute('autocapitalize', 'off');
        el.setAttribute('spellcheck', 'false');
        if (!el.getAttribute('enterkeyhint')) el.setAttribute('enterkeyhint', 'done');
        if (el.type === 'number' && !el.getAttribute('inputmode')) {
          var step = el.getAttribute('step') || '1';
          el.setAttribute('inputmode', String(step).indexOf('.') >= 0 ? 'decimal' : 'numeric');
        }
        /* Percent fields: soft 0–100 bounds when the unit says % and attrs are missing */
        if (el.type === 'number') {
          var unitEl = el.parentElement && el.parentElement.querySelector
            ? el.parentElement.querySelector('.unit')
            : null;
          var isPct = !!(unitEl && /%/.test(unitEl.textContent || ''));
          if (isPct) {
            if (!el.getAttribute('min')) el.setAttribute('min', '0');
            if (!el.getAttribute('max')) el.setAttribute('max', '100');
          }
          if (el.getAttribute('data-clamp') === '0') return;
          if (el.__ibmClampBound) return;
          el.__ibmClampBound = true;
          el.addEventListener('blur', function () {
            if (!clampNumberInput(el, { fillEmpty: false })) return;
            flashClamp(el);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          });
        }
      }
    });
  }

  /** Attach Braun-style ± steppers to every number input in root. */
  function mountSteppers(root) {
    root = root || document;
    var inputs = root.querySelectorAll('input[type="number"]');
    inputs.forEach(function (input) {
      if (input.closest('.spin')) return;
      if (input.getAttribute('data-no-spin') != null) return;
      var host = input.parentElement;
      if (!host) return;
      var spin = document.createElement('span');
      spin.className = 'spin';
      spin.setAttribute('role', 'group');
      spin.setAttribute('aria-label', 'adjust value');
      spin.innerHTML =
        '<button type="button" class="spin-btn spin-up" tabindex="-1" aria-label="increase">' +
          '<svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 5 L5 1 L9 5" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter"/></svg>' +
        '</button>' +
        '<button type="button" class="spin-btn spin-down" tabindex="-1" aria-label="decrease">' +
          '<svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1 L5 5 L9 1" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter"/></svg>' +
        '</button>';
      host.appendChild(spin);
      bindHold(spin.querySelector('.spin-up'), function () { stepAmount(input, 1); });
      bindHold(spin.querySelector('.spin-down'), function () { stepAmount(input, -1); });
    });
  }

  /**
   * Gesture vocabulary (number tools):
   * - Face / chart: ambient scrub → data-primary (Y), data-axis-x (X), data-pinch (pinch)
   * - Chart [data-scrub=id]: locks to that input (envelope / mapped cell)
   * - Row (incl. its input): locked scrub → that field on both axes; tap (no drag) focuses
   * - Stack mid-scroll: wheel defers to scroll; empty chart well hits stage through main
   * - Ratio stage: owns its own drag (skipped here)
   * - Steppers: hold to accelerate; independent of scrub
   * Attrs on inputs: data-primary, data-axis-x, data-pinch, data-step-fast
   * Attrs on viz: data-scrub="<input id>"
   */
  var scrubBubble = null;
  var scrubBubbleAnchor = null;

  function ensureScrubBubble() {
    if (scrubBubble) return scrubBubble;
    scrubBubble = document.createElement('div');
    scrubBubble.className = 'scrub-bubble';
    scrubBubble.setAttribute('aria-hidden', 'true');
    document.body.appendChild(scrubBubble);
    return scrubBubble;
  }

  function formatScrubValue(input) {
    if (!input) return '';
    if (input.tagName === 'SELECT') {
      var opt = input.options[input.selectedIndex];
      return opt ? opt.textContent.trim() : '';
    }
    var v = parseFloat(input.value);
    if (!isFinite(v)) return String(input.value || '').trim();
    var row = input.closest('label.row');
    var unitEl = row && row.querySelector('.value .unit');
    var unit = unitEl ? unitEl.textContent.trim() : '';
    if (unit === '%') return formatPct(v, v % 1 ? 1 : 0);
    if (unit === '$' || (!unit && input.id && /total|sub|price|cost|pot|bill|pay/i.test(input.id) && input.getAttribute('max') !== '100')) {
      return formatMoney(v);
    }
    var step = parseFloat(input.getAttribute('step'));
    var digits = 0;
    if (isFinite(step) && step > 0 && String(step).indexOf('.') >= 0) {
      digits = String(step).split('.')[1].length;
    }
    var body;
    try {
      body = v.toLocaleString('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      });
    } catch (e) {
      body = digits ? v.toFixed(digits) : String(Math.round(v));
    }
    return unit ? body + unit : body;
  }

  function updateScrubBubble(input, clientX, clientY, anchor) {
    if (!input) return;
    var bubble = ensureScrubBubble();
    bubble.textContent = formatScrubValue(input);
    bubble.classList.add('is-on');
    document.body.classList.add('has-scrub-bubble');
    scrubBubbleAnchor = anchor || scrubBubbleAnchor;
    var x = clientX;
    var y = clientY;
    if (x == null || y == null) {
      var el = scrubBubbleAnchor || input.closest('label.row') || document.querySelector('main .face');
      if (el) {
        var r = el.getBoundingClientRect();
        x = r.left + r.width / 2;
        y = r.top;
      } else {
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
      }
    }
    bubble.style.left = Math.round(x) + 'px';
    bubble.style.top = Math.round(y - 10) + 'px';
  }

  function hideScrubBubble() {
    if (!scrubBubble) return;
    scrubBubble.classList.remove('is-on');
    document.body.classList.remove('has-scrub-bubble');
    scrubBubbleAnchor = null;
  }

  function mountGestures() {
    if (document.body.classList.contains('is-soon')) return;
    if (document.documentElement.getAttribute('data-gestures') === '1') return;
    document.documentElement.setAttribute('data-gestures', '1');

    var THRESH = 40;
    var TOUCH_THRESH = 28;
    var ACCEL_WINDOW = 400;
    var accumY = 0;
    var accumX = 0;
    var lastDir = 0;
    var streak = 0;
    var lastStepAt = 0;
    var scrubTimer = null;
    var drag = null;

    function primaryInput() {
      return document.querySelector('main input[type="number"][data-primary], main select[data-primary]') ||
        document.querySelector('main input[type="number"], main select[data-gesture]');
    }

    function resolveTarget(axis) {
      var focused = document.activeElement;
      if (focused && focused.matches && focused.matches('input[type="number"]')) {
        if (axis === 'x') {
          var xId = focused.getAttribute('data-axis-x');
          if (xId) {
            var xEl = document.getElementById(xId);
            if (xEl) return xEl;
          }
        }
        return focused;
      }
      var hovered = document.querySelector('label.row:hover input[type="number"]');
      if (hovered) {
        if (axis === 'x') {
          var hx = hovered.getAttribute('data-axis-x');
          if (hx) {
            var hxEl = document.getElementById(hx);
            if (hxEl) return hxEl;
          }
        }
        return hovered;
      }
      var primary = primaryInput();
      if (!primary) return null;
      if (axis === 'x') {
        var px = primary.getAttribute('data-axis-x');
        if (px) {
          var pxEl = document.getElementById(px);
          if (pxEl) return pxEl;
        }
      }
      return primary;
    }

    function setActive(input) {
      document.querySelectorAll('label.row[data-active]').forEach(function (r) {
        r.removeAttribute('data-active');
      });
      if (!input) return;
      var row = input.closest('label.row');
      if (row) row.setAttribute('data-active', 'true');
    }

    function beginScrub() {
      document.body.classList.add('is-scrubbing');
      if (scrubTimer) clearTimeout(scrubTimer);
      scrubTimer = setTimeout(function () {
        document.body.classList.remove('is-scrubbing');
        hideScrubBubble();
      }, 280);
    }

    function endScrubNow() {
      if (scrubTimer) clearTimeout(scrubTimer);
      scrubTimer = null;
      document.body.classList.remove('is-scrubbing');
      hideScrubBubble();
      document.querySelectorAll('.tool-stage [data-scrub].is-live').forEach(function (n) {
        n.classList.remove('is-live');
      });
    }

    function accelFactor() {
      var now = Date.now();
      if (now - lastStepAt > ACCEL_WINDOW) streak = 0;
      lastStepAt = now;
      streak += 1;
      if (streak > 24) return 4;
      if (streak > 12) return 3;
      if (streak > 5) return 2;
      return 1;
    }

    function nudge(input, dir, opts) {
      if (!input) return;
      setActive(input);
      beginScrub();
      var factor = accelFactor();
      if (dir !== lastDir) {
        streak = 1;
        factor = 1;
      }
      lastDir = dir;
      var anchor = drag && drag.scrubEl ? drag.scrubEl : null;
      updateScrubBubble(input, drag ? drag.lastX : null, drag ? drag.lastY : null, anchor);
      stepAmount(input, dir, {
        fast: opts && opts.fast,
        factor: factor
      });
    }

    function stackShouldScroll(stack, dy) {
      if (!stack) return false;
      var max = stack.scrollHeight - stack.clientHeight;
      if (max <= 2) return false;
      if (dy < 0 && stack.scrollTop > 1) return true;
      if (dy > 0 && stack.scrollTop < max - 1) return true;
      return false;
    }

    function isInteractiveTarget(t) {
      if (!t || !t.closest) return true;
      if (t.closest('button, a, select, textarea, .spin, .seg, .presets, #settings, .suite-nav, .suite-chrome, .icon-btn')) {
        return true;
      }
      /* Number fields in rows are scrub handles; tap (no drag) still focuses to type. */
      if (t.matches && t.matches('input[type="number"]') && t.closest('label.row')) {
        return false;
      }
      if (t.matches && t.matches('input')) return true;
      return false;
    }

    function onWheel(e) {
      if (document.body.classList.contains('settings-open')) return;
      if (document.body.classList.contains('is-soon')) return;

      var pinch = e.ctrlKey || e.metaKey;
      var dy = e.deltaY;
      var dx = e.deltaX;
      var absY = Math.abs(dy);
      var absX = Math.abs(dx);

      if (pinch) {
        e.preventDefault();
        accumY += dy;
        while (Math.abs(accumY) >= THRESH) {
          var pdir = accumY < 0 ? 1 : -1;
          accumY -= (accumY > 0 ? 1 : -1) * THRESH;
          var focusedNum = document.activeElement &&
            document.activeElement.matches &&
            document.activeElement.matches('input[type="number"]')
            ? document.activeElement
            : null;
          var pinTarget = focusedNum || primaryInput();
          if (!focusedNum && pinTarget) {
            var pinchId = pinTarget.getAttribute('data-pinch');
            if (pinchId) {
              var pinchEl = document.getElementById(pinchId);
              if (pinchEl) pinTarget = pinchEl;
            }
          }
          nudge(pinTarget, pdir, { fast: true });
        }
        return;
      }

      var overStack = e.target && e.target.closest && e.target.closest('main .stack');
      if (overStack && absY >= absX && stackShouldScroll(overStack, dy)) {
        accumY = 0;
        return;
      }

      if (absY < 1 && absX < 1) return;

      if (absY >= absX) {
        e.preventDefault();
        accumY += dy;
        accumX = 0;
        while (Math.abs(accumY) >= THRESH) {
          var ydir = accumY < 0 ? 1 : -1;
          accumY -= (accumY > 0 ? 1 : -1) * THRESH;
          nudge(resolveTarget('y'), ydir, { fast: e.shiftKey });
        }
      } else {
        e.preventDefault();
        accumX += dx;
        accumY = 0;
        while (Math.abs(accumX) >= THRESH) {
          var xdir = accumX > 0 ? 1 : -1;
          accumX -= (accumX > 0 ? 1 : -1) * THRESH;
          nudge(resolveTarget('x'), xdir, { fast: e.shiftKey });
        }
      }
    }

    function onPointerDown(e) {
      if (document.body.classList.contains('settings-open')) return;
      if (document.body.classList.contains('is-soon')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.isPrimary === false) return;
      var t = e.target;
      if (!t || !t.closest) return;
      /* Ratio stage owns its own drag / aspect scrub */
      if (t.closest('.ratio-stage')) return;
      if (isInteractiveTarget(t)) return;

      var row = t.closest('label.row');
      var face = t.closest('.face');
      var stage = t.closest('.tool-stage');
      var scrubHit = t.closest('[data-scrub]');
      if (!row && !face && !stage) return;

      var onRowInput = !!(t.matches && t.matches('input[type="number"]') && row);
      /* Already typing in this field: leave caret alone unless they drag */
      var typingHere = onRowInput && row.matches(':focus-within') && document.activeElement === t;

      var locked = null;
      if (row) locked = row.querySelector('input[type="number"]');
      if (onRowInput) locked = t;
      /* Chart region mapped to a field (envelope, day col, …) */
      if (!locked && scrubHit) {
        var scrubId = scrubHit.getAttribute('data-scrub');
        if (scrubId) locked = document.getElementById(scrubId);
      }

      /* Defer focus so a scrub drag doesn't pop the keyboard */
      if (onRowInput && !typingHere) {
        e.preventDefault();
      }

      drag = {
        id: e.pointerId,
        lastY: e.clientY,
        lastX: e.clientX,
        accumY: 0,
        accumX: 0,
        moved: false,
        locked: locked,
        ambient: !!(!row && !locked && (face || stage)),
        focusEl: onRowInput && !typingHere ? t : null,
        scrubEl: scrubHit || null,
        captureEl: row || scrubHit || face || stage
      };
      try {
        if (drag.captureEl && drag.captureEl.setPointerCapture) {
          drag.captureEl.setPointerCapture(e.pointerId);
        }
      } catch (err) {}
    }

    function onPointerMove(e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dy = e.clientY - drag.lastY;
      var dx = e.clientX - drag.lastX;
      drag.lastY = e.clientY;
      drag.lastX = e.clientX;
      drag.accumY += dy;
      drag.accumX += dx;

      var absY = Math.abs(drag.accumY);
      var absX = Math.abs(drag.accumX);
      if (!drag.moved && absY < 6 && absX < 6) return;
      if (!drag.moved) {
        drag.moved = true;
        drag.focusEl = null;
        document.body.classList.add('is-scrubbing');
        document.querySelectorAll('.tool-stage [data-scrub].is-live').forEach(function (n) {
          n.classList.remove('is-live');
        });
        if (drag.captureEl && drag.captureEl.getAttribute && drag.captureEl.getAttribute('data-scrub')) {
          drag.captureEl.classList.add('is-live');
        }
        var active = document.activeElement;
        if (active && active.blur && active.matches && active.matches('input[type="number"]')) {
          try { active.blur(); } catch (err) {}
        }
        var firstTarget = drag.locked || resolveTarget('y');
        updateScrubBubble(firstTarget, e.clientX, e.clientY, drag.scrubEl || drag.captureEl);
      }
      e.preventDefault();

      var thresh = e.pointerType === 'touch' || e.pointerType === 'pen' ? TOUCH_THRESH : THRESH;
      function dragTarget(axis) {
        /* Row lock owns both axes; ambient face/chart uses primary / axis-x / focus */
        if (drag.locked && !drag.ambient) return drag.locked;
        return resolveTarget(axis);
      }
      if (absY >= absX) {
        while (Math.abs(drag.accumY) >= thresh) {
          var ydir = drag.accumY < 0 ? 1 : -1;
          drag.accumY -= (drag.accumY > 0 ? 1 : -1) * thresh;
          nudge(dragTarget('y'), ydir, { fast: e.shiftKey });
        }
        drag.accumX = 0;
      } else {
        while (Math.abs(drag.accumX) >= thresh) {
          var xdir = drag.accumX > 0 ? 1 : -1;
          drag.accumX -= (drag.accumX > 0 ? 1 : -1) * thresh;
          nudge(dragTarget('x'), xdir, { fast: e.shiftKey });
        }
        drag.accumY = 0;
      }
      if (drag.moved) {
        var liveInput = drag.locked && !drag.ambient ? drag.locked : resolveTarget(absY >= absX ? 'y' : 'x');
        updateScrubBubble(liveInput, e.clientX, e.clientY, drag.scrubEl || drag.captureEl);
      }
    }

    function onPointerUp(e) {
      if (!drag || e.pointerId !== drag.id) return;
      var moved = drag.moved;
      var cap = drag.captureEl;
      var pid = drag.id;
      var focusEl = drag.focusEl;
      var scrubEl = drag.scrubEl;
      drag = null;
      endScrubNow();
      try {
        if (cap && cap.releasePointerCapture && cap.hasPointerCapture && cap.hasPointerCapture(pid)) {
          cap.releasePointerCapture(pid);
        }
      } catch (err) {}
      if (!moved && focusEl) {
        try { focusEl.focus(); } catch (err2) {}
        return;
      }
      /* Tap (no drag) on a mapped chart cell: focus for keyboard nudge */
      if (!moved && scrubEl) {
        try { scrubEl.focus({ preventScroll: true }); } catch (err3) {
          try { scrubEl.focus(); } catch (err4) {}
        }
        return;
      }
      if (moved) {
        /* Suppress synthetic click that would open the keyboard after a scrub */
        var block = function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          document.removeEventListener('click', block, true);
        };
        document.addEventListener('click', block, true);
        setTimeout(function () {
          document.removeEventListener('click', block, true);
        }, 400);
      }
    }

    function onScrubKey(e) {
      if (document.body.classList.contains('settings-open')) return;
      if (document.body.classList.contains('is-soon')) return;
      var t = e.target;
      if (!t || !t.getAttribute) return;
      var scrubId = t.getAttribute('data-scrub');
      if (!scrubId) return;
      var input = document.getElementById(scrubId);
      if (!input) return;
      var dir = 0;
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') dir = 1;
      else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') dir = -1;
      else return;
      e.preventDefault();
      lastScrubId = scrubId;
      nudge(input, dir, { fast: e.shiftKey });
      var v = parseFloat(input.value);
      if (isFinite(v)) t.setAttribute('aria-valuenow', String(v));
    }

    document.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('pointerdown', onPointerDown, { passive: false });
    document.addEventListener('pointermove', onPointerMove, { passive: false });
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);
    document.addEventListener('keydown', onScrubKey);

    document.addEventListener('focusin', function (e) {
      if (e.target && e.target.matches && e.target.matches('input[type="number"]')) {
        setActive(e.target);
      }
      var scrub = e.target && e.target.closest && e.target.closest('[data-scrub]');
      if (scrub) {
        lastScrubId = scrub.getAttribute('data-scrub');
        scrub.classList.add('is-live');
        var linked = lastScrubId ? document.getElementById(lastScrubId) : null;
        if (linked) setActive(linked);
      }
    });
    document.addEventListener('focusout', function (e) {
      var scrub = e.target && e.target.closest && e.target.closest('[data-scrub]');
      if (scrub) scrub.classList.remove('is-live');
      setTimeout(function () {
        var a = document.activeElement;
        if (!a || !a.matches || !a.matches('input[type="number"]')) {
          document.querySelectorAll('label.row[data-active]').forEach(function (r) {
            if (!r.matches(':hover')) r.removeAttribute('data-active');
          });
        }
      }, 0);
    });
  }

  function formatMoney(n, opts) {
    opts = opts || {};
    var abs = Math.abs(Number(n) || 0);
    var digits = opts.forceCents ? 2 : (opts.digits != null ? opts.digits : (abs % 1 ? 2 : 0));
    var body;
    try {
      body = abs.toLocaleString('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      });
    } catch (e) {
      body = abs.toFixed(digits);
    }
    return (n < 0 ? '−$' : '$') + body;
  }

  function formatCount(n) {
    var v = Math.round(Number(n) || 0);
    try { return v.toLocaleString('en-US'); } catch (e) { return String(v); }
  }

  function formatPct(n, digits) {
    var d = digits == null ? 1 : digits;
    var v = Number(n) || 0;
    return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)) + '%';
  }

  /** Keep stage well = everything above face+stack; stack is the scroll pad. */
  function syncStageBounds() {
    var stage = document.getElementById('toolStage');
    var deepMode = document.documentElement.getAttribute('data-show-viz') === 'deep';
    var nodes = document.querySelectorAll('main .face, main .stack');
    var vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
    var landscape = window.matchMedia('(orientation: landscape) and (max-height: 820px)').matches;
    var top = vh;
    var found = false;
    nodes.forEach(function (el) {
      if (!el) return;
      var style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return;
      var r = el.getBoundingClientRect();
      if (r.height < 2) return;
      top = Math.min(top, r.top);
      found = true;
    });
    if (!found) return;
    var padB = Math.max(140, Math.round(vh - top + 12));
    if (stage) {
      stage.style.setProperty('--pad-b', padB + 'px');
      if (landscape) {
        var face = document.querySelector('main .face');
        var stack = document.querySelector('main .stack');
        var padL = 16;
        if (face && stack) {
          var faceR = face.getBoundingClientRect();
          var stackR = stack.getBoundingClientRect();
          var isRatio = document.body.getAttribute('data-tool') === 'ratio';
          if (isRatio) {
            padL = Math.max(120, Math.round(Math.max(faceR.left, stackR.left) - 10));
          } else {
            padL = Math.max(120, Math.round(Math.max(faceR.right, stackR.right) + 10));
          }
        }
        stage.style.setProperty('--pad-l', padL + 'px');
      } else {
        stage.style.removeProperty('--pad-l');
      }
    }
    document.documentElement.style.setProperty('--instrument-h', padB + 'px');
    if (deepMode) scheduleDeepResize();
  }

  function syncKeyboardInset() {
    var vv = window.visualViewport;
    var vh = vv ? vv.height : window.innerHeight;
    var offset = vv ? vv.offsetTop : 0;
    var open = vv ? (window.innerHeight - vv.height) > 80 : false;
    document.documentElement.style.setProperty('--vv-h', Math.round(vh) + 'px');
    document.documentElement.style.setProperty('--vv-offset', Math.round(offset) + 'px');
    document.body.classList.toggle('is-kb-open', open);
    if (open) {
      var active = document.activeElement;
      if (active && active.matches && active.matches('input, select, textarea')) {
        requestAnimationFrame(function () {
          try {
            active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          } catch (err) {
            try { active.scrollIntoView(false); } catch (e2) {}
          }
        });
      }
    }
  }

  function syncTypingState() {
    var ae = document.activeElement;
    var typing = ae && ae.matches && ae.matches(
      'textarea, select, input:not([type="radio"]):not([type="checkbox"]):not([type="button"]):not([type="submit"])'
    );
    document.body.classList.toggle('is-typing', !!typing);
  }

  function syncStackScrollState() {
    var stack = document.querySelector('main .stack');
    if (!stack) return;
    var can = stack.scrollHeight > stack.clientHeight + 2;
    stack.classList.toggle('is-scrollable', can);
    stack.classList.toggle('is-scrolled', stack.scrollTop > 2);
    stack.classList.toggle(
      'is-scroll-end',
      !can || stack.scrollTop + stack.clientHeight >= stack.scrollHeight - 3
    );
  }

  function tickFace(el) {
    if (!el || prefersReducedMotion()) return;
    el.classList.remove('is-tick');
    void el.offsetWidth;
    el.classList.add('is-tick');
  }


  function collectFieldSnapshot() {
    var rows = [];
    document.querySelectorAll('main input[id], main select[id]').forEach(function (el) {
      if (!el.id) return;
      var label = '';
      var row = el.closest('label.row');
      if (row) {
        var key = row.querySelector('.key');
        if (key) label = key.textContent.trim();
      }
      rows.push({ id: el.id, label: label || el.id, value: el.value });
    });
    var out = document.getElementById('out');
    var sub = document.getElementById('sub');
    return {
      title: (document.querySelector('h1') || {}).textContent || '',
      face: out ? out.textContent.trim() : '',
      sub: sub ? sub.textContent.trim() : '',
      fields: rows
    };
  }

  function formatResultLine(snap) {
    var parts = [snap.title, snap.face];
    if (snap.sub) parts.push(snap.sub);
    snap.fields.forEach(function (f) {
      parts.push(f.label + ' ' + f.value);
    });
    return parts.filter(Boolean).join(' · ');
  }

  function buildShareUrl() {
    var url = new URL(global.location.href);
    url.search = '';
    document.querySelectorAll('main input[id], main select[id]').forEach(function (el) {
      if (!el.id || el.value === '' || el.value == null) return;
      url.searchParams.set(el.id, el.value);
    });
    return url.toString();
  }

  function isSmokeRun() {
    try {
      return new URLSearchParams(global.location.search || '').has('smoke');
    } catch (e) { return false; }
  }

  function valuesStorageKey(id) {
    return 'ibm.tool.' + id + '.values';
  }

  function loadFieldValues(id) {
    if (!id || isSmokeRun()) return null;
    try {
      var raw = localStorage.getItem(valuesStorageKey(id));
      if (!raw) {
        /* One-shot migrate legacy bill blob → shared values key */
        if (id === 'bill') {
          var legacy = localStorage.getItem('ibm.tool.bill');
          if (legacy) {
            try {
              var old = JSON.parse(legacy);
              if (old && typeof old === 'object') {
                var migrated = {};
                if (old.total != null) migrated.total = String(old.total);
                if (old.tip != null) migrated.tip = String(old.tip);
                if (old.people != null) migrated.people = String(old.people);
                localStorage.setItem(valuesStorageKey(id), JSON.stringify(migrated));
                localStorage.removeItem('ibm.tool.bill');
                return migrated;
              }
            } catch (err) {}
          }
        }
        return null;
      }
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (e) { return null; }
  }

  function saveFieldValues(id) {
    if (!id || isSmokeRun()) return;
    try {
      var payload = {};
      document.querySelectorAll('main input[id], main select[id]').forEach(function (el) {
        if (!el.id) return;
        payload[el.id] = el.value;
      });
      localStorage.setItem(valuesStorageKey(id), JSON.stringify(payload));
    } catch (e) {}
  }

  /** Set an input/select value; for <select>, snap to a valid option (exact, then nearest number). */
  function applyControlValue(el, raw) {
    if (!el || raw == null) return false;
    var next = String(raw);
    if (el.tagName === 'SELECT') {
      var i;
      for (i = 0; i < el.options.length; i++) {
        if (el.options[i].value === next) {
          if (el.selectedIndex !== i) {
            el.selectedIndex = i;
            return true;
          }
          return false;
        }
      }
      var n = parseFloat(next);
      if (isFinite(n)) {
        var best = -1;
        var bestDist = Infinity;
        for (i = 0; i < el.options.length; i++) {
          var ov = parseFloat(el.options[i].value);
          if (!isFinite(ov)) continue;
          var d = Math.abs(ov - n);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        }
        if (best >= 0 && el.selectedIndex !== best) {
          el.selectedIndex = best;
          return true;
        }
      }
      return false;
    }
    if (el.value !== next) {
      el.value = next;
      return true;
    }
    return false;
  }

  /** Restore last-used field values. URL hydrate wins when share params are present. */
  function hydrateFromValues(id) {
    var saved = loadFieldValues(id) || {};
    var local = loadLocal(id) || {};
    /* Bridge keys that used to live in settings and now are main-page selects */
    ['mode', 'tipOn', 'size', 'z', 'units', 'tip', 'sizeUnit', 'speedUnit', 'iso', 'fnum', 'shut', 'steps'].forEach(function (k) {
      if (saved[k] == null && local[k] != null) saved[k] = local[k];
    });
    var changed = false;
    Object.keys(saved).forEach(function (key) {
      var el = document.getElementById(key);
      if (!el || saved[key] == null) return;
      if (applyControlValue(el, saved[key])) changed = true;
    });
    return changed;
  }

  function hydrateFromUrl() {
    var params = new URLSearchParams(global.location.search || '');
    var anyField = false;
    var changed = false;
    params.forEach(function (val, key) {
      if (key === 'smoke') return;
      var el = document.getElementById(key);
      if (!el) return;
      anyField = true;
      if (applyControlValue(el, val)) changed = true;
    });
    return anyField ? (changed || true) : false;
  }

  function syncUrlFromFields() {
    if (isSmokeRun()) return;
    try {
      var next = buildShareUrl();
      if (next !== global.location.href) {
        global.history.replaceState(null, '', next);
      }
    } catch (e) {}
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        resolve();
      } catch (err) { reject(err); }
    });
  }

  function mountShareActions() {
    var face = document.querySelector('main .face');
    if (!face || face.querySelector('.face-actions')) return;
    var actions = document.createElement('div');
    actions.className = 'face-actions';
    actions.innerHTML =
      '<button type="button" class="quiet-btn" id="copyResultBtn" title="Copy result">copy</button>' +
      '<button type="button" class="quiet-btn" id="copyLinkBtn" title="Copy link with values">link</button>';
    face.appendChild(actions);
    var copyBtn = document.getElementById('copyResultBtn');
    var linkBtn = document.getElementById('copyLinkBtn');
    function flash(btn, ok) {
      if (!btn) return;
      var prev = btn.textContent;
      btn.textContent = ok ? 'copied' : 'failed';
      setTimeout(function () { btn.textContent = prev; }, 1200);
    }
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var line = formatResultLine(collectFieldSnapshot());
        copyText(line).then(function () { flash(copyBtn, true); }, function () { flash(copyBtn, false); });
      });
    }
    if (linkBtn) {
      linkBtn.addEventListener('click', function () {
        syncUrlFromFields();
        copyText(buildShareUrl()).then(function () { flash(linkBtn, true); }, function () { flash(linkBtn, false); });
      });
    }
  }

  function mountInstrumentLayout() {
    var fromUrl = hydrateFromUrl();
    if (!fromUrl) hydrateFromValues(activeToolId);
    mountShareActions();
    syncStageBounds();
    syncStackScrollState();
    syncKeyboardInset();
    document.querySelectorAll('main input[id], main select[id]').forEach(function (el) {
      function onField() {
        syncUrlFromFields();
        saveFieldValues(activeToolId);
      }
      el.addEventListener('input', onField);
      el.addEventListener('change', onField);
    });
    syncUrlFromFields();
    saveFieldValues(activeToolId);
    /* Tool scripts register __ibmToolRender after mountSettings; re-paint once hydrated. */
    var rerender = function () {
      if (typeof global.__ibmToolRender === 'function') global.__ibmToolRender();
    };
    if (typeof queueMicrotask === 'function') queueMicrotask(rerender);
    else setTimeout(rerender, 0);

    var stack = document.querySelector('main .stack');
    if (stack) {
      var scrollEndTimer = null;
      stack.addEventListener('scroll', function () {
        syncStackScrollState();
        _stackScrollEnd = Date.now() + 140;
        if (scrollEndTimer) clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(function () {
          _stackScrollEnd = 0;
          syncStageBounds();
          scrollEndTimer = null;
        }, 150);
      }, { passive: true });
    }

    var ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(function () {
          syncStageBounds();
          syncStackScrollState();
        })
      : null;
    var main = document.querySelector('main');
    if (ro && main) {
      ro.observe(main);
      main.querySelectorAll('.face, .stack').forEach(function (el) { ro.observe(el); });
    }
    var ratio = document.querySelector('.ratio-stage');
    if (ro && ratio) ro.observe(ratio);

    function onViewport() {
      syncStageBounds();
      syncStackScrollState();
      syncKeyboardInset();
    }

    window.addEventListener('resize', onViewport);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onViewport);
      window.visualViewport.addEventListener('scroll', onViewport);
    }

    document.addEventListener('focusin', function (e) {
      if (!e.target || !e.target.matches) return;
      if (!e.target.matches('input, select, textarea')) return;
      syncTypingState();
      setTimeout(function () {
        syncKeyboardInset();
        syncStageBounds();
        try {
          e.target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        } catch (err) {}
      }, 50);
      setTimeout(function () {
        syncKeyboardInset();
        syncStageBounds();
      }, 320);
    });
    document.addEventListener('focusout', function () {
      setTimeout(function () {
        syncTypingState();
        syncKeyboardInset();
        syncStageBounds();
      }, 120);
    });

    var out = document.getElementById('out');
    if (out) {
      var last = out.textContent;
      var mo = new MutationObserver(function () {
        var next = out.textContent;
        if (next === last) return;
        last = next;
        tickFace(out);
        requestAnimationFrame(function () {
          syncStageBounds();
          syncStackScrollState();
        });
      });
      mo.observe(out, { characterData: true, childList: true, subtree: true });
    }

    /* After fonts / first paint settle */
    requestAnimationFrame(function () {
      syncStageBounds();
      syncStackScrollState();
      setTimeout(function () {
        syncStageBounds();
        syncStackScrollState();
      }, 120);
    });
  }

  /**
   * Wire a square preset grid. Buttons carry data-<fieldId>="<value>".
   * opts.keys — field ids to apply / match (default: all data-* on the button)
   * opts.map — { dataKey: inputId } when names differ
   * opts.after(btn) — called after values are written (usually render)
   * opts.match(btn) — optional custom pressed matcher
   */
  function bindPresets(rootSel, opts) {
    opts = opts || {};
    var root = typeof rootSel === 'string' ? document.querySelector(rootSel) : rootSel;
    if (!root) return { sync: function () {}, apply: function () {} };

    function resolveId(dataKey) {
      if (opts.map && opts.map[dataKey]) return opts.map[dataKey];
      return dataKey;
    }

    function keysFor(btn) {
      if (opts.keys && opts.keys.length) return opts.keys.slice();
      var out = [];
      for (var i = 0; i < btn.attributes.length; i++) {
        var a = btn.attributes[i];
        if (a.name.indexOf('data-') === 0) out.push(a.name.slice(5));
      }
      return out;
    }

    function sameValue(a, b) {
      if (a == null || b == null) return false;
      var sa = String(a).trim();
      var sb = String(b).trim();
      if (sa.toLowerCase() === sb.toLowerCase()) return true;
      var na = Number(sa);
      var nb = Number(sb);
      if (!isNaN(na) && !isNaN(nb) && sa !== '' && sb !== '') {
        return Math.abs(na - nb) < 1e-6;
      }
      return false;
    }

    function dataAttr(btn, k) {
      var raw = btn.getAttribute('data-' + k);
      if (raw != null) return raw;
      return btn.getAttribute('data-' + String(k).toLowerCase());
    }

    function apply(btn) {
      if (!btn) return;
      keysFor(btn).forEach(function (k) {
        var raw = dataAttr(btn, k);
        if (raw == null) return;
        var el = document.getElementById(resolveId(k));
        if (!el) return;
        if (el.tagName === 'SELECT') {
          var matched = false;
          for (var i = 0; i < el.options.length; i++) {
            if (sameValue(el.options[i].value, raw)) {
              el.selectedIndex = i;
              matched = true;
              break;
            }
          }
          if (!matched) el.value = raw;
        } else {
          el.value = raw;
        }
      });
      if (typeof opts.after === 'function') opts.after(btn);
      else sync();
    }

    function matches(btn) {
      if (typeof opts.match === 'function') return !!opts.match(btn);
      return keysFor(btn).every(function (k) {
        var raw = dataAttr(btn, k);
        if (raw == null) return true;
        var el = document.getElementById(resolveId(k));
        if (!el) return false;
        return sameValue(el.value, raw);
      });
    }

    function sync() {
      root.querySelectorAll('.preset').forEach(function (btn) {
        btn.setAttribute('aria-pressed', matches(btn) ? 'true' : 'false');
      });
    }

    root.addEventListener('click', function (e) {
      var btn = e.target.closest('.preset');
      if (!btn || !root.contains(btn)) return;
      apply(btn);
      sync();
      haptic && haptic(8);
    });

    return { sync: sync, apply: apply, root: root };
  }

  global.IBMNumberTool = {
    THEMES: THEMES,
    formatMoney: formatMoney,
    formatCount: formatCount,
    formatPct: formatPct,
    mountSettings: mountSettings,
    applyChrome: applyChrome,
    setBar: setBar,
    setVars: setVars,
    ensureStage: ensureStage,
    paintCells: paintCells,
    clearStage: clearStage,
    mountSteppers: mountSteppers,
    polishInputs: polishInputs,
    mountGestures: mountGestures,
    stepAmount: stepAmount,
    mountInstrumentLayout: mountInstrumentLayout,
    syncStageBounds: syncStageBounds,
    afterPaint: afterPaint,
    paintSoonGhost: paintSoonGhost,
    clampNumberInput: clampNumberInput,
    haptic: haptic,
    collectFieldSnapshot: collectFieldSnapshot,
    formatResultLine: formatResultLine,
    buildShareUrl: buildShareUrl,
    hydrateFromUrl: hydrateFromUrl,
    hydrateFromValues: hydrateFromValues,
    saveFieldValues: saveFieldValues,
    syncUrlFromFields: syncUrlFromFields,
    copyText: copyText,
    mountShareActions: mountShareActions,
    normalizeShowViz: normalizeShowViz,
    vizMode: vizMode,
    loadDeepViz: loadDeepViz,
    deepVegaConfig: deepVegaConfig,
    deepChartFonts: deepChartFonts,
    ensureDeepHost: ensureDeepHost,
    paintDeep: paintDeep,
    resizeDeepCharts: resizeDeepCharts,
    scheduleDeepResize: scheduleDeepResize,
    bindPresets: bindPresets
  };
})(typeof window !== 'undefined' ? window : globalThis);
