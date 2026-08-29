/**
 * Shared settings chrome for number instruments.
 * Syncs theme / ui / font / faces via IBMTools (ibm.tools.shared).
 */
(function (global) {
  'use strict';

  var THEMES = ['light', 'dark', 'contrast', 'paper', 'glass', 'frost', 'brutal', 'loom', 'tank', 'nes'];
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

  function applyChrome(settings) {
    var web = useWebFaces(settings);
    var uiMap = web ? UI_FONTS_WEB : UI_FONTS_LOCAL;
    var faces = web ? TYPE_FACES_WEB : TYPE_FACES_LOCAL;
    var uiKey = uiMap[settings.ui] ? settings.ui : 'braun';
    var digitFont = (faces[uiKey] && faces[uiKey][settings.font]) || faces.braun.mono;
    var root = document.documentElement;
    root.setAttribute('data-theme', settings.theme);
    root.setAttribute('data-ui', uiKey);
    root.setAttribute('data-font', settings.font);
    root.setAttribute('data-faces', web ? 'web' : 'local');
    root.setAttribute('data-show-viz', settings.showViz === false ? 'false' : 'true');
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

  function syncRadios(settings) {
    ['theme', 'ui', 'font', 'faces'].forEach(function (name) {
      var nodes = document.querySelectorAll('input[name="' + name + '"]');
      nodes.forEach(function (n) { n.checked = n.value === settings[name]; });
    });
    var viz = document.querySelector('input[name="showViz"]');
    if (viz) viz.checked = settings.showViz !== false;
  }

  function loadLocal(id) {
    try {
      return JSON.parse(localStorage.getItem('ibm.tool.' + id + '.settings') || '{}') || {};
    } catch (e) { return {}; }
  }

  function saveLocal(id, settings) {
    try {
      localStorage.setItem('ibm.tool.' + id + '.settings', JSON.stringify({
        theme: settings.theme,
        ui: settings.ui,
        font: settings.font,
        faces: settings.faces,
        showViz: settings.showViz !== false
      }));
    } catch (e) {}
  }

  function mountSettings(opts) {
    var id = opts.id;
    var about = opts.about || '';
    var hasViz = !!opts.hasViz;
    var settings = {
      theme: preferTheme(),
      ui: 'braun',
      font: 'mono',
      faces: 'auto',
      showViz: true
    };

    var local = loadLocal(id);
    Object.keys(local).forEach(function (k) {
      if (local[k] != null) settings[k] = local[k];
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

    var dock = document.createElement('div');
    dock.className = 'dock';
    dock.innerHTML =
      '<div id="settings" role="dialog" aria-label="settings" hidden>' +
        '<div class="inner">' +
          '<div class="sheet-grip" aria-hidden="true"></div>' +
          '<div class="fields">' +
            '<fieldset><legend>theme</legend><div class="seg" role="radiogroup" aria-label="theme">' +
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
                '<label><input type="radio" name="showViz" value="on"><span>viz</span></label>' +
                '<label><input type="radio" name="showViz" value="off"><span>plain</span></label>' +
                '</div></fieldset>'
              : '') +
            '<fieldset class="about-info"><legend>how it works</legend>' +
              '<p class="about-copy">' + (about || 'Local instrument. Settings sync theme, chrome, and fonts with words and time.') + '</p>' +
            '</fieldset>' +
            '<fieldset><legend>keys</legend><p class="keys-hint">' +
              '<kbd>esc</kbd> close · <kbd>⌘/ctrl</kbd>+<kbd>,</kbd> settings · <kbd>⌘/ctrl</kbd>+<kbd>⇧</kbd>+<kbd>t</kbd> theme' +
              '<br>gestures: face/chart = primary · row = that field · trackpad X = linked axis · pinch = coarse' +
              '<br>touch: drag chart, face, or any value · tap field to type · stack scrolls · steppers hold' +
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
      saveLocal(id, settings);
      if (global.IBMTools) IBMTools.pushSharedFrom(settings);
    }

    function apply() {
      applyChrome(settings);
      syncRadios(settings);
      // sync viz radios as on/off
      var vizOn = document.querySelector('input[name="showViz"][value="on"]');
      var vizOff = document.querySelector('input[name="showViz"][value="off"]');
      if (vizOn) vizOn.checked = settings.showViz !== false;
      if (vizOff) vizOff.checked = settings.showViz === false;
      if (typeof opts.onApply === 'function') opts.onApply(settings);
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
      var suite = document.querySelector('.suite-nav.is-open');
      if (suite) suite.classList.remove('is-open');
      var suiteBtn = document.querySelector('.suite-nav-btn');
      if (suiteBtn) suiteBtn.setAttribute('aria-expanded', 'false');
      var suitePanel = document.querySelector('.suite-nav-panel');
      if (suitePanel) suitePanel.setAttribute('hidden', '');
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
        settings.showViz = t.value !== 'off';
      } else if (t.name === 'theme' && THEMES.indexOf(t.value) >= 0) {
        settings.theme = t.value;
      } else if (t.name === 'ui' && UI_FONTS_WEB[t.value]) {
        settings.ui = t.value;
      } else if (t.name === 'font' && FONT_ROLES[t.value]) {
        settings.font = t.value;
      } else if (t.name === 'faces' && FACES[t.value]) {
        settings.faces = t.value;
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
      setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
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

  function afterPaint() {
    requestAnimationFrame(function () {
      syncStageBounds();
      syncStackScrollState();
    });
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
      return document.querySelector('main input[type="number"][data-primary]') ||
        document.querySelector('main input[type="number"]');
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
      }, 280);
    }

    function endScrubNow() {
      if (scrubTimer) clearTimeout(scrubTimer);
      scrubTimer = null;
      document.body.classList.remove('is-scrubbing');
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
        var active = document.activeElement;
        if (active && active.blur && active.matches && active.matches('input[type="number"]')) {
          try { active.blur(); } catch (err) {}
        }
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
    }

    function onPointerUp(e) {
      if (!drag || e.pointerId !== drag.id) return;
      var moved = drag.moved;
      var cap = drag.captureEl;
      var pid = drag.id;
      var focusEl = drag.focusEl;
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

    document.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('pointerdown', onPointerDown, { passive: false });
    document.addEventListener('pointermove', onPointerMove, { passive: false });
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);

    document.addEventListener('focusin', function (e) {
      if (e.target && e.target.matches && e.target.matches('input[type="number"]')) {
        setActive(e.target);
      }
    });
    document.addEventListener('focusout', function () {
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

  function prefersReducedMotion() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) { return false; }
  }

  /** Keep stage well = everything above face+stack; stack is the scroll pad. */
  function syncStageBounds() {
    var stage = document.getElementById('toolStage');
    /* Instrument band = face + fields only (not the stage chart itself) */
    var nodes = document.querySelectorAll('main .face, main .stack');
    var vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
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
    var padB = Math.max(140, Math.round(vh - top + 10));
    if (stage) stage.style.setProperty('--pad-b', padB + 'px');
    document.documentElement.style.setProperty('--instrument-h', padB + 'px');
  }

  function syncKeyboardInset() {
    var vv = window.visualViewport;
    var open = false;
    if (vv) {
      open = (window.innerHeight - vv.height) > 120;
    }
    document.body.classList.toggle('is-kb-open', open);
    if (open) {
      var active = document.activeElement;
      if (active && active.matches && active.matches('input, select, textarea')) {
        try {
          active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        } catch (err) {
          try { active.scrollIntoView(false); } catch (e2) {}
        }
      }
    }
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

  function mountInstrumentLayout() {
    syncStageBounds();
    syncStackScrollState();
    syncKeyboardInset();

    var stack = document.querySelector('main .stack');
    if (stack) {
      stack.addEventListener('scroll', function () {
        syncStackScrollState();
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

  global.IBMNumberTool = {
    THEMES: THEMES,
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
    paintSoonGhost: paintSoonGhost
  };
})(typeof window !== 'undefined' ? window : globalThis);
