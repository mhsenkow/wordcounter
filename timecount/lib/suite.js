/**
 * ibm.io tools suite — top-right panel (icons + micro titles) + shared look.
 * Load as lib/suite.js from each tool folder (or ../lib/suite.js from nested tools).
 */
(function (global) {
  'use strict';

  var SHARED_KEY = 'ibm.tools.shared';
  var THEMES = ['light', 'dark', 'contrast', 'paper', 'glass', 'frost', 'brutal', 'loom', 'tank', 'nes'];
  /* Shared look keys — theme/chrome/digits/faces sync across the suite */
  var LOOK_KEYS = ['theme', 'ui', 'font', 'faces'];
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
    dose: '<path d="M6 3.5h4v3.2c1.6 1 2.6 2.6 2.6 4.4A4.6 4.6 0 0 1 8 15.5 4.6 4.6 0 0 1 3.4 11c0-1.8 1-3.4 2.6-4.4z"/>',
    tax: '<rect x="3.5" y="2.5" width="9" height="11" rx="1"/><path d="M5.5 5.5h5M5.5 8h3.5M5.5 10.5h4M9.5 12.5l1.5-1.5"/>',
    pace: '<path d="M2.5 11.5 6 5.5l2.5 3.5L12 3.5"/><path d="M11 3.5h2.5V6"/>',
    contrast: '<circle cx="6" cy="8" r="3.2"/><path d="M10 4.8a3.2 3.2 0 0 1 0 6.4"/><path d="M10 4.8v6.4"/>',
    bayes: '<path d="M3 12.5V8.5l3-3 3 2 4-5"/><path d="M3 12.5h10"/>',
    tools: '<rect x="2.5" y="2.5" width="4.2" height="4.2" rx=".6"/><rect x="9.3" y="2.5" width="4.2" height="4.2" rx=".6"/><rect x="2.5" y="9.3" width="4.2" height="4.2" rx=".6"/><rect x="9.3" y="9.3" width="4.2" height="4.2" rx=".6"/>'
  };

  var GROUPS = [
    { id: 'desk', label: 'desk' },
    { id: 'money', label: 'money' },
    { id: 'convert', label: 'convert' },
    { id: 'form', label: 'form' },
    { id: 'chance', label: 'chance' }
  ];

  var MAP_HELP = {
    lead: 'Quiet map of local instruments.',
    body: 'Every tool runs in the browser — no accounts, no sync cloud. Theme, chrome, and digit faces follow you via shared look settings. Open any tile to work; the grid in the top-right is the same map from every page.',
    use: [
      'Use the circled i on any tool for a plain-language walkthrough.',
      'Settings (look / chrome / digits) sync across the suite.',
      'Copy and link under many faces share a result snapshot.'
    ]
  };

  var TOOLS = [
    {
      id: 'wordcount', label: 'words', blurb: 'count · draft', group: 'desk', paths: ['wordcount', 'wordcounter'], icon: I.words, status: 'live',
      help: {
        lead: 'A frictionless draft pad that counts as you type.',
        body: 'Paste or write in the editor. The hero shows the active metric — words by default — with reading time, sentences, characters, and more one swipe away. Everything stays on this device.',
        use: [
          'Type or paste in the draft; counts update live.',
          'Swipe or drag the hero sideways to cycle metrics (words, characters, reading time…).',
          'Settings hold theme, chrome, and a short primer on how counts are defined.'
        ]
      }
    },
    {
      id: 'timecount', label: 'time', blurb: 'duration · limit', group: 'desk', paths: ['timecount'], icon: I.time, status: 'live',
      help: {
        lead: 'A session clock — count up, count down, or mark splits.',
        body: 'Duration runs forward from start. Limit counts down from a target (pomodoro-style). Splits freeze lap marks without stopping the clock. Soft presets nudge common limits while a session is running.',
        use: [
          'Start / pause from the dial; scrub vertically to nudge the limit.',
          'Horizontal scrub on the dial jumps in coarser 5-minute steps.',
          'Enter limits as 25m, 5:00, or bare minutes.'
        ]
      }
    },
    {
      id: 'bill', label: 'bill', blurb: 'tip · split', group: 'money', paths: ['bill'], icon: I.bill, status: 'live',
      help: {
        lead: 'Split a check with tip baked in.',
        body: 'Enter the receipt total, tip percent, and party size. The face shows what each person owes. The stage draws a receipt well — tip as a ribbon, people as columns.',
        use: [
          'Enter the total and party size; pick a tip from the list.',
          'Scrub tip on the face or chart; drag sideways to change people.',
          'Settings can show tip as share of the grand total or as dollars.'
        ]
      }
    },
    {
      id: 'hourly', label: 'hourly', blurb: 'rate · project', group: 'money', paths: ['hourly'], icon: I.hourly, status: 'live',
      help: {
        lead: 'Turn an hourly rate into a project total.',
        body: 'Link $/hour, hours per day, and days of work. The face is the project total; day rate falls out of the same inputs. The calendar strip paints weeks as rows and days as hour ladders.',
        use: [
          'Scrub days on the face; horizontal drag adjusts hours/day; pinch coarsens the rate.',
          'Toggle grain (days / weeks) and rate tint in settings.'
        ]
      }
    },
    {
      id: 'budget', label: 'budget', blurb: 'week envelopes', group: 'money', paths: ['budget'], icon: I.budget, status: 'live',
      help: {
        lead: 'Carve a weekly pot into spending envelopes.',
        body: 'Set the week\'s total, then size each envelope. Remaining shows in the pot well; drawers or a share chart show how the pot is allocated.',
        use: [
          'Edit the pot and each envelope row; the face tracks what\'s left.',
          'Scrub the stage to redistribute; settings pick drawer vs share view.'
        ]
      }
    },
    {
      id: 'fuel', label: 'fuel', blurb: 'mpg · trip cost', group: 'money', paths: ['fuel'], icon: I.fuel, status: 'live',
      help: {
        lead: 'Estimate fuel cost for a trip.',
        body: 'Miles ÷ mpg × price per gallon. The face is trip cost; tank fill is gallons needed. Route ticks teach distance with cost riding the nose of the path.',
        use: [
          'Scrub miles on the face; linked axes adjust mpg and price.',
          'Watch gallons and cost update together under the face.'
        ]
      }
    },
    {
      id: 'tax', label: 'tax', blurb: 'tip · tax', group: 'money', paths: ['tax'], icon: I.tax, status: 'live',
      help: {
        lead: 'Stack sales tax and tip on a subtotal.',
        body: 'Start from the pre-tax amount, add tax, then tip. Tip can sit on the pre-tax figure or on the taxed total — a common restaurant vs receipt ambiguity. The stage is a stacked receipt you can scrub band by band.',
        use: [
          'Enter subtotal and tax %; pick tip and whether it applies pre-tax or after tax.',
          'Scrub each receipt band on the stage.'
        ]
      }
    },
    {
      id: 'unit', label: 'unit', blurb: 'cups · grams', group: 'convert', paths: ['unit'], icon: I.unit, status: 'live',
      help: {
        lead: 'Kitchen unit conversions with density.',
        body: 'Convert between volume and weight using an ingredient density. Twin vessels stay linked — change one side and the other follows across the density bridge.',
        use: [
          'Pick units on each side and type an amount.',
          'Choose an ingredient (or density) so cups ↔ grams stay honest.',
          'Scrub either vessel; the partner updates.'
        ]
      }
    },
    {
      id: 'dose', label: 'dose', blurb: 'mix · dilute', group: 'convert', paths: ['dose'], icon: I.dose, status: 'live',
      help: {
        lead: 'Dilution ratios for kitchen and garden mixes.',
        body: 'Not medical dosing — concentrate + water (or carrier) into a target mix. Split panes or a diminishing drop trail show how strong the result is.',
        use: [
          'Set concentrate strength, target strength, and batch size.',
          'Read how much concentrate and how much diluent to combine.',
          'Scrub the stage to feel the dilution fall off.'
        ]
      }
    },
    {
      id: 'bitrate', label: 'bandwidth', blurb: 'size ÷ speed', group: 'convert', paths: ['bitrate'], icon: I.bandwidth, status: 'live',
      help: {
        lead: 'Rough wall-clock time to move a file.',
        body: 'File size ÷ transfer speed ≈ download (or upload) duration. Units flex across MB/GB and Mbps/MB/s. The stage is a transfer river of packets with an ETA clock.',
        use: [
          'Enter size and speed; the face is elapsed wall time.',
          'Scrub either input on the stage; watch the river and ETA move.'
        ]
      }
    },
    {
      id: 'scalemap', label: 'scale', blurb: 'map legend', group: 'convert', paths: ['scalemap'], icon: I.scalemap, status: 'live',
      help: {
        lead: 'Turn a map legend into real-world distance.',
        body: 'Read the printed scale (e.g. 1:24,000 or a bar), measure a length on the map, and get ground distance. Distance rings and a true scale bar keep the ratio visible.',
        use: [
          'Set the map scale, pick miles or km, and measure a length on paper.',
          'The face shows real distance; scrub to explore nearby lengths.'
        ]
      }
    },
    {
      id: 'pace', label: 'pace', blurb: 'distance · eta', group: 'convert', paths: ['pace'], icon: I.pace, status: 'live',
      help: {
        lead: 'Distance × pace → finish time (or solve for pace).',
        body: 'For runs, rides, and hikes: enter distance and pace to get ETA, or lock a finish and back into pace. Route ticks teach distance; tick spacing teaches pace; the finish mark is the ETA.',
        use: [
          'Pick solve mode (finish time or needed pace), then fill the other fields.',
          'Scrub the route stage — spacing tightens as pace quickens.'
        ]
      }
    },
    {
      id: 'ratio', label: 'ratio', blurb: 'aspect · gold', group: 'form', paths: ['ratio'], icon: I.ratio, status: 'live',
      help: {
        lead: 'Explore aspect ratios by dragging a rectangle.',
        body: 'Width ÷ height updates live as you reshape the frame. Optional thirds and golden-section guides help composition; preset locks snap common film and screen ratios.',
        use: [
          'Drag the stage rectangle; numbers follow.',
          'Lock a preset (16:9, 4:5, φ…) to snap scrub.',
          'Toggle guides in settings.'
        ]
      }
    },
    {
      id: 'typescale', label: 'type', blurb: 'modular scale', group: 'form', paths: ['typescale'], icon: I.typescale, status: 'live',
      help: {
        lead: 'Build a modular type scale from a base size.',
        body: 'Base × ratio raises a ladder of steps (major third, perfect fourth, golden…). The stage shows the vertical scale with live specimen lines so hierarchy is felt, not just listed.',
        use: [
          'Set base px and ratio; steps fill automatically.',
          'Scrub base or ratio on the face / ladder.',
          'Copy sizes into a design system or CSS tokens.'
        ]
      }
    },
    {
      id: 'exposure', label: 'exposure', blurb: 'iso · shutter', group: 'form', paths: ['exposure'], icon: I.exposure, status: 'live',
      help: {
        lead: 'Balance ISO, aperture, and shutter as exposure value.',
        body: 'The exposure triangle: change one stop and see what the others must do to hold EV. Sunny-16 is the daylight reference baked into the instrument.',
        use: [
          'Scrub ISO, f-stop, or shutter; EV holds or follows per mode.',
          'Use the triangle stage to feel stop-for-stop tradeoffs.'
        ]
      }
    },
    {
      id: 'contrast', label: 'contrast', blurb: 'fg · bg · wcag', group: 'form', paths: ['contrast'], icon: I.contrast, status: 'live',
      help: {
        lead: 'Check text contrast against WCAG bands.',
        body: 'Pick foreground and background hex colors. The face is the contrast ratio; pass/fail bands for AA / AAA update with it. Choose normal or large text for the WCAG rules that apply.',
        use: [
          'Enter or scrub fg / bg hex values.',
          'Pick text size (normal / large) for the right WCAG rungs.',
          'Read the ratio and which bands clear.'
        ]
      }
    },
    {
      id: 'odds', label: 'odds', blurb: 'avg · bet', group: 'chance', paths: ['odds'], icon: I.odds, status: 'live',
      help: {
        lead: 'Average dollars each time you take a bet.',
        body: 'Not a bookmaker’s odds line — the long-run average: win % of the win $, plus lose % of the lose $ (usually a negative stake). Above zero means the bet pays you over many plays.',
        use: [
          'Enter win chance, dollars if you win, and dollars if you lose.',
          'Try a preset, then scrub chance and watch the seesaw tip.'
        ]
      }
    },
    {
      id: 'combo', label: 'combo', blurb: 'ways to pick', group: 'chance', paths: ['combo'], icon: I.combo, status: 'live',
      help: {
        lead: 'How many distinct groups can you draw from a pile?',
        body: 'Order does not matter — a poker hand is the same cards whether you were dealt them left-to-right or not. The stage lights the picks so the count is visible.',
        use: [
          'Set from (pile size) and pick (how many).',
          'Try poker / lotto / team presets; scrub to explore.'
        ]
      }
    },
    {
      id: 'deal', label: 'deal', blurb: 'next card', group: 'chance', paths: ['deal'], icon: I.deal, status: 'live',
      help: {
        lead: 'Chance the next card is one you still want.',
        body: 'As the deck shrinks, count cards left and how many of those are still wanted. Lit cards on the grid are the ones you care about.',
        use: [
          'Set left and want (wanted cards still in the deck).',
          'Presets snap common cases: aces, a suit, tens+, a short shoe.'
        ]
      }
    },
    {
      id: 'sample', label: 'sample', blurb: 'poll · ±', group: 'chance', paths: ['sample'], icon: I.sample, status: 'live',
      help: {
        lead: 'How far might a poll miss the real share?',
        body: 'Enter how many people you asked and the yes %. The face is a ballpark ± margin. More people tighten it. Rule of thumb — not a full survey design.',
        use: [
          'Enter sample size and estimated share; pick confidence on the page.',
          'Read ± margin on the face; scrub size to watch the band tighten.'
        ]
      }
    },
    {
      id: 'streak', label: 'streak', blurb: 'still the same', group: 'chance', paths: ['streak'], icon: I.streak, status: 'live',
      help: {
        lead: 'A streak does not make the next flip “due.”',
        body: 'Independent flips: past heads do not raise the chance of tails. The face stays on the next flip’s chance — unchanged — while the caption shows how rare that run was.',
        use: [
          'Set heads % and how many you’ve seen in a row.',
          'Read “next flip still…” under the face.'
        ]
      }
    },
    {
      id: 'bayes', label: 'bayes', blurb: 'before → after', group: 'chance', paths: ['bayes'], icon: I.bayes, status: 'live',
      help: {
        lead: 'How much should this evidence change your mind?',
        body: 'Before = how likely the claim seemed. When true / when false = how often you’d see this evidence in each world. The face is your belief after seeing it.',
        use: [
          'Enter before %, when true %, and when false %.',
          'Try lab test or rare disease; scrub to feel sensitivity.',
          'Handy for tests, filters, and “should this update me?”'
        ]
      }
    }
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
    if (pathTouches(path, 'tools')) return 'tools';
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
    var toolsIdx = segments.indexOf('tools');
    if (toolsIdx >= 0) return '/' + segments.slice(0, toolsIdx).join('/');
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
      if (here === 'tools') return '../' + seg + '/index.html';
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
    if (here === 'tools') return '../' + seg + '/';
    if (here === tool.id) return './';
    return '../' + seg + '/';
  }

  function toolsMapHref() {
    var loc = global.location || {};
    var here = detectToolId();
    if (loc.protocol === 'file:') {
      return here === 'wordcount' ? 'tools/index.html' : here === 'tools' ? 'index.html' : '../tools/index.html';
    }
    if (isProductionHost() || hasNamedToolPath()) {
      var root = suiteRoot();
      if (!root || root === '/') return '/tools/';
      return root + '/tools/';
    }
    if (here === 'wordcount') return 'tools/';
    if (here === 'tools') return './';
    return '../tools/';
  }

  function injectStyles() {
    var css = [
      /* Surreptitious tools cluster: look (theme/info/settings) + grid, top-right. */
      '.suite-nav{position:fixed;top:max(10px,env(safe-area-inset-top));right:max(10px,env(safe-area-inset-right));z-index:210;font:400 11px/1.25 var(--ui,Helvetica,Arial,sans-serif);color:var(--mute,#757575);pointer-events:none}',
      '.suite-nav.is-open{z-index:240}',
      'body.settings-open .suite-nav{z-index:240}',
      'body.help-open .suite-nav{z-index:220}',
      '.suite-nav-inner{pointer-events:auto;display:flex;flex-direction:column;align-items:flex-end;gap:0}',
      '.suite-nav-bar{display:flex;align-items:center;justify-content:flex-end;gap:2px;position:relative;z-index:2}',
      '.suite-chrome{display:flex;align-items:center;gap:2px}',
      '.suite-chrome:empty{display:none}',
      '.suite-nav-btn,.suite-help-btn,.suite-chrome #themeBtn,.suite-chrome #settingsToggle{position:relative;width:auto;min-width:44px;min-height:44px;height:44px;padding:0 10px;border:0;background:transparent;color:inherit;cursor:pointer;opacity:.38;transition:opacity .2s ease,color .2s ease;display:inline-flex;align-items:center;justify-content:center;touch-action:manipulation;border-radius:2px;font:inherit;font-size:11px;letter-spacing:.04em;line-height:1}',
      '.suite-nav-btn,.suite-help-btn{width:44px;padding:0}',
      '.suite-chrome #themeBtn{width:44px;padding:0}',
      '.suite-nav-btn::before,.suite-help-btn::before,.suite-chrome #themeBtn::before,.suite-chrome #settingsToggle::before{content:"";position:absolute;inset:8px;border-radius:2px;background:color-mix(in srgb,var(--bg,#f2f2f0) 88%,transparent);z-index:-1}',
      '.suite-nav:hover .suite-nav-btn,.suite-nav.is-open .suite-nav-btn,.suite-nav-btn:focus-visible,.suite-nav:hover .suite-help-btn,.suite-nav.is-help-open .suite-help-btn,.suite-help-btn:focus-visible,.suite-nav:hover .suite-chrome #themeBtn,.suite-nav:hover .suite-chrome #settingsToggle,.suite-chrome #themeBtn:focus-visible,.suite-chrome #settingsToggle:focus-visible,.suite-chrome #themeBtn:hover,.suite-chrome #settingsToggle:hover{opacity:.95;color:var(--ink,#111)}',
      '.suite-nav:hover .suite-nav-btn::before,.suite-nav.is-open .suite-nav-btn::before,.suite-nav-btn:focus-visible::before,.suite-nav:hover .suite-help-btn::before,.suite-nav.is-help-open .suite-help-btn::before,.suite-help-btn:focus-visible::before,.suite-nav:hover .suite-chrome #themeBtn::before,.suite-nav:hover .suite-chrome #settingsToggle::before,.suite-chrome #themeBtn:focus-visible::before,.suite-chrome #settingsToggle:focus-visible::before,.suite-chrome #themeBtn:hover::before,.suite-chrome #settingsToggle:hover::before{background:color-mix(in srgb,var(--face,#fafaf8) 92%,var(--bg,#f2f2f0))}',
      '.suite-nav-btn:focus-visible,.suite-help-btn:focus-visible,.suite-chrome #themeBtn:focus-visible,.suite-chrome #settingsToggle:focus-visible{outline:1px solid var(--accent,#c45c26);outline-offset:2px;opacity:1}',
      '.suite-nav-btn svg,.suite-help-btn svg{display:block;width:12px;height:12px}',
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
      '.suite-map-link{display:block;margin:4px 4px 0;padding:8px 6px;text-align:center;text-decoration:none;color:var(--mute,#757575);font-size:10px;letter-spacing:.1em;text-transform:uppercase;border-top:1px solid var(--hair,#e4e4e0)}',
      '.suite-map-link:hover,.suite-map-link:focus-visible{color:var(--ink,#111);outline:1px solid var(--accent,#c45c26);outline-offset:-1px}',
      '.suite-map-link[aria-current="page"]{color:var(--accent,#c45c26)}',
      /* Right-side help drawer — above suite chrome while open */
      '.suite-help-backdrop{position:fixed;inset:0;z-index:245;background:color-mix(in srgb,var(--ink,#111) 22%,transparent);opacity:0;pointer-events:none;transition:opacity .22s ease}',
      'body.help-open .suite-help-backdrop{opacity:1;pointer-events:auto}',
      '.suite-help{position:fixed;top:0;right:0;bottom:0;z-index:250;width:min(420px,100vw);max-width:100%;box-sizing:border-box;background:color-mix(in srgb,var(--face,#fafaf8) 97%,var(--ink,#111) 3%);border-left:1px solid var(--hair,#e4e4e0);box-shadow:-12px 0 40px color-mix(in srgb,var(--ink,#111) 14%,transparent);transform:translateX(104%);transition:transform .28s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column;font:400 13px/1.45 var(--ui,Helvetica,Arial,sans-serif);color:var(--ink,#111);outline:none}',
      'body.help-open .suite-help{transform:none}',
      '@media (prefers-reduced-motion:reduce){.suite-help,.suite-help-backdrop{transition:none}}',
      '.suite-help-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:max(18px,env(safe-area-inset-top)) max(14px,env(safe-area-inset-right)) 14px max(20px,env(safe-area-inset-left));border-bottom:1px solid var(--hair,#e4e4e0);flex:0 0 auto}',
      '.suite-help-kicker{display:block;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute,#757575);margin:0 0 6px}',
      '.suite-help-title{margin:0;font:500 1.35rem/1.2 var(--ui,Helvetica,Arial,sans-serif);letter-spacing:.02em;text-transform:lowercase}',
      '.suite-help-blurb{margin:6px 0 0;font-size:12px;color:var(--mute,#757575);letter-spacing:.02em}',
      '.suite-help-close{flex:0 0 auto;width:44px;height:44px;margin:-8px -4px 0 0;border:0;background:transparent;color:var(--mute,#757575);cursor:pointer;border-radius:2px;display:inline-flex;align-items:center;justify-content:center;font:inherit;font-size:18px;line-height:1}',
      '.suite-help-close:hover,.suite-help-close:focus-visible{color:var(--ink,#111);outline:1px solid var(--accent,#c45c26);outline-offset:2px}',
      '.suite-help-body{flex:1 1 auto;overflow:auto;overscroll-behavior:contain;padding:18px max(20px,env(safe-area-inset-right)) max(28px,env(safe-area-inset-bottom)) max(20px,env(safe-area-inset-left));scrollbar-width:thin}',
      '.suite-help-lead{margin:0 0 12px;font-size:15px;line-height:1.4;font-weight:500;letter-spacing:.01em}',
      '.suite-help-copy{margin:0 0 18px;color:var(--mute,#757575);font-size:13px;line-height:1.55}',
      '.suite-help-label{display:block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute,#757575);opacity:.75;margin:0 0 8px}',
      '.suite-help-list{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px}',
      '.suite-help-list li{position:relative;padding:0 0 0 14px;font-size:13px;line-height:1.5;color:var(--ink,#111)}',
      '.suite-help-list li::before{content:"";position:absolute;left:0;top:.55em;width:5px;height:5px;border-radius:1px;background:var(--accent,#c45c26)}',
      '.suite-help-foot{margin:22px 0 0;padding-top:14px;border-top:1px solid var(--hair,#e4e4e0);font-size:11px;line-height:1.5;color:var(--mute,#757575)}',
      '.suite-help-icon{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;margin:0 0 10px;color:var(--accent,#c45c26)}',
      '.suite-help-icon svg{width:18px;height:18px}',
      /* Title only in masthead — chrome lives in .suite-nav */
      'header.masthead,.masthead{z-index:200}',
      'header.masthead .actions:empty,.masthead .actions:empty{display:none}',
      'body.help-open{overflow:hidden}'
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
    var helpBtn = chrome.querySelector('.suite-help-btn');
    /* Order: theme · info · settings */
    if (theme && !chrome.contains(theme)) chrome.insertBefore(theme, helpBtn || null);
    if (settings && !chrome.contains(settings)) chrome.appendChild(settings);
    if (theme && !theme._ibmHelpCloseBound) {
      theme._ibmHelpCloseBound = true;
      theme.addEventListener('click', function () { closeHelp(); }, true);
    }
    if (settings && !settings._ibmHelpCloseBound) {
      settings._ibmHelpCloseBound = true;
      settings.addEventListener('click', function () { closeHelp(); }, true);
    }
    /* Drop empty masthead action rails so title can breathe */
    document.querySelectorAll('header.masthead .actions, header .actions, .masthead .actions').forEach(function (el) {
      if (!el.children.length) el.remove();
    });
  }

  function iconSvg(tool) {
    return '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">' +
      (tool.icon || '') + '</svg>';
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function helpFor(id) {
    if (id === 'tools') {
      return { label: 'tools', blurb: 'suite map', icon: I.tools, help: MAP_HELP };
    }
    var tool = toolById(id);
    if (!tool) return null;
    return tool;
  }

  function closeSettingsShell() {
    if (!document.body.classList.contains('settings-open')) return;
    document.body.classList.remove('settings-open');
    var st = document.getElementById('settingsToggle');
    var settingsPanel = document.getElementById('settings');
    if (st) {
      st.setAttribute('aria-expanded', 'false');
      if (st.textContent === 'close') st.textContent = 'settings';
    }
    if (settingsPanel) {
      settingsPanel.setAttribute('hidden', '');
      settingsPanel.classList.remove('open');
    }
  }

  function closeSuiteNav() {
    var suite = document.querySelector('.suite-nav.is-open');
    if (suite) suite.classList.remove('is-open');
    var suiteBtn = document.querySelector('.suite-nav-btn');
    if (suiteBtn) suiteBtn.setAttribute('aria-expanded', 'false');
    var suitePanel = document.querySelector('.suite-nav-panel');
    if (suitePanel) suitePanel.setAttribute('hidden', '');
  }

  function isHelpOpen() {
    return document.body.classList.contains('help-open');
  }

  function closeHelp() {
    if (!isHelpOpen()) return;
    document.body.classList.remove('help-open');
    var nav = document.querySelector('.suite-nav');
    if (nav) nav.classList.remove('is-help-open');
    var btn = document.getElementById('suiteHelpBtn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    var panel = document.getElementById('suiteHelp');
    if (panel) panel.setAttribute('hidden', '');
    var backdrop = document.getElementById('suiteHelpBackdrop');
    if (backdrop) backdrop.setAttribute('hidden', '');
    if (btn && document.activeElement && panel && panel.contains(document.activeElement)) {
      try { btn.focus(); } catch (err) {}
    }
  }

  function fillHelpPanel(panel, currentId) {
    var entry = helpFor(currentId);
    var help = (entry && entry.help) || MAP_HELP;
    var label = (entry && entry.label) || 'tools';
    var blurb = (entry && entry.blurb) || '';
    var icon = (entry && entry.icon) || I.tools;
    var use = (help && help.use) || [];
    var useHtml = use.length
      ? '<p class="suite-help-label">how to use</p><ul class="suite-help-list">' +
        use.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') +
        '</ul>'
      : '';
    panel.innerHTML =
      '<div class="suite-help-head">' +
        '<div>' +
          '<span class="suite-help-kicker">about</span>' +
          '<h2 class="suite-help-title" id="suiteHelpTitle">' + escapeHtml(label) + '</h2>' +
          (blurb ? '<p class="suite-help-blurb">' + escapeHtml(blurb) + '</p>' : '') +
        '</div>' +
        '<button type="button" class="suite-help-close" id="suiteHelpClose" aria-label="close about">×</button>' +
      '</div>' +
      '<div class="suite-help-body">' +
        '<div class="suite-help-icon" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">' + icon + '</svg></div>' +
        '<p class="suite-help-lead">' + escapeHtml((help && help.lead) || '') + '</p>' +
        '<p class="suite-help-copy">' + escapeHtml((help && help.body) || '') + '</p>' +
        useHtml +
        '<p class="suite-help-foot">Local only — nothing leaves this page unless you copy or share a link. Look settings sync across tools.</p>' +
      '</div>';
  }

  function openHelp(currentId) {
    var panel = document.getElementById('suiteHelp');
    var backdrop = document.getElementById('suiteHelpBackdrop');
    var btn = document.getElementById('suiteHelpBtn');
    var nav = document.querySelector('.suite-nav');
    if (!panel || !btn) return;
    closeSuiteNav();
    closeSettingsShell();
    fillHelpPanel(panel, currentId || detectToolId());
    document.body.classList.add('help-open');
    if (nav) nav.classList.add('is-help-open');
    btn.setAttribute('aria-expanded', 'true');
    panel.removeAttribute('hidden');
    if (backdrop) backdrop.removeAttribute('hidden');
    var closeBtn = document.getElementById('suiteHelpClose');
    setTimeout(function () {
      try { (closeBtn || panel).focus(); } catch (err) {}
    }, 0);
  }

  function setHelpOpen(open, currentId) {
    if (open) openHelp(currentId);
    else closeHelp();
  }

  function rememberVisit(id) {
    if (!id) return;
    try {
      var raw = localStorage.getItem(SHARED_KEY);
      var data = raw ? JSON.parse(raw) : {};
      if (!data || typeof data !== 'object') data = {};
      var recent = Array.isArray(data.recent) ? data.recent.filter(function (x) { return x !== id; }) : [];
      recent.unshift(id);
      data.recent = recent.slice(0, 8);
      localStorage.setItem(SHARED_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function mountSuiteNav(currentId) {
    injectStyles();
    currentId = currentId || detectToolId();
    rememberVisit(currentId);
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

    var helpBtn = document.createElement('button');
    helpBtn.type = 'button';
    helpBtn.className = 'suite-help-btn';
    helpBtn.id = 'suiteHelpBtn';
    helpBtn.setAttribute('aria-label', 'about this tool');
    helpBtn.setAttribute('aria-expanded', 'false');
    helpBtn.setAttribute('aria-haspopup', 'dialog');
    helpBtn.setAttribute('aria-controls', 'suiteHelp');
    helpBtn.innerHTML =
      '<svg viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round">' +
      '<circle cx="6" cy="6" r="4.25"/>' +
      '<path d="M6 5.2v3.1"/>' +
      '<circle cx="6" cy="3.65" r=".55" fill="currentColor" stroke="none"/>' +
      '</svg>';
    chrome.appendChild(helpBtn);

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

    var mapLink = document.createElement('a');
    mapLink.className = 'suite-map-link';
    mapLink.href = toolsMapHref();
    mapLink.textContent = 'all tools';
    if (currentId === 'tools') mapLink.setAttribute('aria-current', 'page');
    panel.appendChild(mapLink);

    bar.appendChild(chrome);
    bar.appendChild(btn);
    inner.appendChild(bar);
    inner.appendChild(panel);
    nav.appendChild(inner);
    document.body.appendChild(nav);

    var backdrop = document.createElement('div');
    backdrop.className = 'suite-help-backdrop';
    backdrop.id = 'suiteHelpBackdrop';
    backdrop.setAttribute('hidden', '');
    backdrop.setAttribute('aria-hidden', 'true');

    var helpPanel = document.createElement('aside');
    helpPanel.className = 'suite-help';
    helpPanel.id = 'suiteHelp';
    helpPanel.setAttribute('role', 'dialog');
    helpPanel.setAttribute('aria-modal', 'true');
    helpPanel.setAttribute('aria-labelledby', 'suiteHelpTitle');
    helpPanel.setAttribute('tabindex', '-1');
    helpPanel.setAttribute('hidden', '');
    fillHelpPanel(helpPanel, currentId);

    document.body.appendChild(backdrop);
    document.body.appendChild(helpPanel);

    adoptSuiteChrome(nav);
    registerShellWorker();

    function tiles() {
      return Array.prototype.slice.call(panel.querySelectorAll('.suite-tile'));
    }

    function setOpen(open) {
      var was = nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        closeHelp();
        panel.removeAttribute('hidden');
        if (!was) {
          requestAnimationFrame(function () {
            var list = tiles();
            var cur = panel.querySelector('.suite-tile[aria-current="page"]');
            var target = cur || (list.length ? list[0] : null);
            if (target) {
              try { target.focus(); } catch (err) {}
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

    helpBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setHelpOpen(!isHelpOpen(), currentId);
    });

    helpPanel.addEventListener('click', function (e) {
      var closeEl = e.target && e.target.closest && e.target.closest('#suiteHelpClose');
      if (closeEl) {
        e.preventDefault();
        closeHelp();
        try { helpBtn.focus(); } catch (err) {}
      }
    });

    backdrop.addEventListener('click', function () {
      closeHelp();
      try { helpBtn.focus(); } catch (err) {}
    });

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var next = !nav.classList.contains('is-open');
      setOpen(next);
      if (next) closeSettingsShell();
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
      if (e.key === 'Escape' && isHelpOpen()) {
        e.preventDefault();
        closeHelp();
        try { helpBtn.focus(); } catch (err) {}
        return;
      }
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        e.preventDefault();
        setOpen(false);
        btn.focus();
      }
    });
  }


  function registerShellWorker() {
    try {
      if (!('serviceWorker' in navigator)) return;
      if (!global.location || global.location.protocol === 'file:') return;
      var root = suiteRoot();
      var swUrl = (!root || root === '/') ? '/sw.js' : root + '/sw.js';
      navigator.serviceWorker.register(swUrl, { scope: (!root || root === '/') ? '/' : root + '/' }).catch(function () {});
    } catch (e) {}
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
    (keys || LOOK_KEYS).forEach(function (key) {
      if (shared[key] != null) out[key] = shared[key];
    });
    return out;
  }

  function pushSharedFrom(settings, keys) {
    var partial = {};
    (keys || LOOK_KEYS).forEach(function (key) {
      if (settings && settings[key] != null) partial[key] = settings[key];
    });
    saveShared(partial);
  }

  function loadHints() {
    var shared = loadShared();
    return shared && shared.hints ? shared.hints : {};
  }

  function hintSeen(key) {
    return !!loadHints()[key];
  }

  function markHintSeen(key) {
    var hints = loadHints();
    hints[key] = Date.now();
    saveShared({ hints: hints });
  }

  global.IBMTools = {
    SHARED_KEY: SHARED_KEY,
    THEMES: THEMES,
    LOOK_KEYS: LOOK_KEYS,
    TOOLS: TOOLS,
    GROUPS: GROUPS,
    detectToolId: detectToolId,
    toolHref: toolHref,
    toolsMapHref: toolsMapHref,
    toolById: toolById,
    helpFor: helpFor,
    mountSuiteNav: mountSuiteNav,
    closeSuiteNav: closeSuiteNav,
    closeHelp: closeHelp,
    isHelpOpen: isHelpOpen,
    openHelp: openHelp,
    adoptSuiteChrome: adoptSuiteChrome,
    loadShared: loadShared,
    saveShared: saveShared,
    mergeSharedInto: mergeSharedInto,
    pushSharedFrom: pushSharedFrom,
    hintSeen: hintSeen,
    markHintSeen: markHintSeen,
    registerShellWorker: registerShellWorker
  };
})(typeof window !== 'undefined' ? window : globalThis);
