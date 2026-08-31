/* deep-viz.js — IBM tools "deep" visualization layer (Vega + WebGL)
   Exposes window.IBMDeepViz = { engine(toolId), paint(toolId, stage, payload) }
   Depends on page helpers: IBMNumberTool, __deepGL; globals vegaEmbed / createREGL|regl.
*/
(function (global) {
  'use strict';

  var WEBGL_3D = { fuel: 1, exposure: 1, bayes: 1 };
  var CANVAS_2D = { ratio: 1, combo: 1, sample: 1 };
  var WEBGL = { fuel: 1, ratio: 1, exposure: 1, combo: 1, bayes: 1, sample: 1 };

  function engine(toolId) {
    if (WEBGL_3D[toolId]) return 'webgl3d';
    if (CANVAS_2D[toolId]) return 'canvas2d';
    return 'vega';
  }

  function NT() {
    return global.IBMNumberTool || {};
  }

  function GL() {
    return global.__deepGL || {};
  }

  function num(v, d) {
    v = +v;
    return isFinite(v) ? v : (d == null ? 0 : d);
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function deepShell(layers, pad) {
    pad = pad || { left: 12, top: 10, right: 8, bottom: 36 };
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 'container',
      autosize: { type: 'fit', contains: 'padding' },
      padding: pad,
      layer: layers
    };
  }

  /** Build ordinal axis domain with step grid plus live marker value. */
  function ordDomain(min, max, step, mark, descending) {
    var vals = [];
    var v;
    step = Math.max(step, 0.001);
    for (v = min; v <= max + 0.0001; v += step) {
      vals.push(Math.round(v * 1000) / 1000);
    }
    if (mark != null && isFinite(+mark)) {
      mark = Math.round(+mark * 1000) / 1000;
      /* Snap near-grid markers so ordinal heatmaps do not get orphan bands. */
      var snap = Math.round((mark - min) / step) * step + min;
      snap = Math.round(snap * 1000) / 1000;
      if (Math.abs(snap - mark) <= step * 0.251) mark = snap;
      if (vals.indexOf(mark) === -1) vals.push(mark);
    }
    vals.sort(function (a, b) { return descending ? b - a : a - b; });
    return vals;
  }

  /** Log-spaced grid for size/speed style axes; includes live mark. */
  function logOrdDomain(min, max, steps, mark, descending) {
    min = Math.max(0.001, min);
    max = Math.max(min * 1.01, max);
    var lo = Math.log10(min);
    var hi = Math.log10(max);
    var vals = [];
    var i;
    for (i = 0; i <= steps; i++) {
      vals.push(Math.round(Math.pow(10, lo + ((hi - lo) * i) / steps) * 1000) / 1000);
    }
    if (mark != null && isFinite(+mark) && mark > 0) {
      mark = Math.round(+mark * 1000) / 1000;
      if (vals.indexOf(mark) === -1) vals.push(mark);
    }
    vals.sort(function (a, b) { return descending ? b - a : a - b; });
    return vals;
  }

  function heatLayer(data, xField, yField, colorField, xTitle, yTitle, xDomain, yDomain) {
    return {
      data: { name: 'heat', values: data },
      mark: { type: 'rect', tooltip: true },
      encoding: {
        x: {
          field: xField,
          type: 'ordinal',
          title: xTitle,
          scale: { domain: xDomain, paddingInner: 0, paddingOuter: 0 }
        },
        y: {
          field: yField,
          type: 'ordinal',
          title: yTitle,
          scale: { domain: yDomain, paddingInner: 0, paddingOuter: 0 }
        },
        color: heatColorEncoding(colorField),
      }
    };
  }

  function stampHeatCross(data, xField, yField, valField, xVal, yVal, xGrid, yGrid, compute) {
    var seen = Object.create(null);
    var i;
    for (i = 0; i < data.length; i++) {
      seen[data[i][xField] + '|' + data[i][yField]] = 1;
    }
    function add(x, y) {
      var key = x + '|' + y;
      if (seen[key]) return;
      var row = {};
      row[xField] = x;
      row[yField] = y;
      row[valField] = compute(x, y);
      data.push(row);
      seen[key] = 1;
    }
    xGrid.forEach(function (x) { add(x, yVal); });
    yGrid.forEach(function (y) { add(xVal, y); });
    add(xVal, yVal);
    return data;
  }

  function markLayer(rows, xField, yField, xDomain, yDomain) {
    var c = themeColors();
    return {
      data: { name: 'mark', values: rows },
      mark: { type: 'point', filled: true, size: 88 },
      encoding: {
        x: { field: xField, type: 'ordinal', scale: { domain: xDomain } },
        y: { field: yField, type: 'ordinal', scale: { domain: yDomain } },
        color: { value: c.accent }
      }
    };
  }

  function chartFonts() {
    var nt = NT();
    if (nt.deepChartFonts) return nt.deepChartFonts();
    var g = GL();
    var cs = typeof document !== 'undefined'
      ? getComputedStyle(document.documentElement)
      : null;
    return {
      ui: cs ? (cs.getPropertyValue('--ui') || 'system-ui, sans-serif').trim() : 'system-ui, sans-serif',
      digits: cs ? (cs.getPropertyValue('--digits') || 'monospace').trim() : 'monospace',
      mute: g.cssColor ? g.cssColor('--mute', '#888') : '#888',
      ink: g.cssColor ? g.cssColor('--ink', '#1a1a1a') : '#1a1a1a',
      accent: g.cssColor ? g.cssColor('--accent', '#c44') : '#c44'
    };
  }

  /** Full token readout — themes, chrome faces, instrument colors. */
  function themeColors() {
    var f = chartFonts();
    var g = GL();
    return {
      ui: f.ui,
      digits: f.digits,
      mute: f.mute,
      ink: f.ink,
      accent: f.accent,
      rule: g.cssColor ? g.cssColor('--rule', '#ccc') : '#ccc',
      face: g.cssColor ? g.cssColor('--face', '#fafaf8') : '#fafaf8',
      bg: g.cssColor ? g.cssColor('--bg', '#f2f2f0') : '#f2f2f0',
      hair: g.cssColor ? g.cssColor('--hair', '#e4e4e0') : '#e4e4e0'
    };
  }

  function deepLookKey() {
    var nt = NT();
    if (typeof nt.deepLookKey === 'function') return nt.deepLookKey();
    var c = themeColors();
    var el = typeof document !== 'undefined' ? document.documentElement : null;
    return [
      el && el.getAttribute('data-theme'),
      el && el.getAttribute('data-ui'),
      el && el.getAttribute('data-font'),
      el && el.getAttribute('data-faces'),
      c.accent, c.mute, c.rule, c.face
    ].join('|');
  }

  function heatColorEncoding(field) {
    var c = themeColors();
    return {
      field: field,
      type: 'quantitative',
      scale: { range: [c.face, c.hair, c.rule, c.accent], nice: true },
      legend: null
    };
  }

  function nominalColorEncoding(field, legend) {
    var c = themeColors();
    var enc = {
      field: field,
      type: 'nominal',
      scale: { range: [c.mute, c.rule, c.ink, c.accent] }
    };
    if (legend !== false) enc.legend = legend || { title: null };
    return enc;
  }

  function canvasLabel(ctx, text, x, y, dpr, which) {
    var f = chartFonts();
    var family = which === 'digits' ? f.digits : f.ui;
    ctx.font = (10 * dpr) + 'px ' + family;
    ctx.fillStyle = f.mute;
    ctx.fillText(text, x, y);
  }

  function accentRgb() {
    var g = GL();
    var hex = g.cssColor ? g.cssColor('--accent', '#c44') : '#c44';
    return g.hexToRgb ? g.hexToRgb(hex) : [0.77, 0.27, 0.27];
  }

  function muteRgb() {
    var g = GL();
    var hex = g.cssColor ? g.cssColor('--mute', '#888') : '#888';
    return g.hexToRgb ? g.hexToRgb(hex) : [0.53, 0.53, 0.53];
  }

  function getReglFactory() {
    return global.createREGL || global.regl || null;
  }

  /* ─── Vega embed / update ───────────────────────────────────────── */

  function specGridKey(spec) {
    if (!spec || !spec.layer || spec.layer.length < 2) return '';
    var a = spec.layer[0];
    var b = spec.layer[1];
    var ax = a && a.encoding && a.encoding.x && a.encoding.x.scale && a.encoding.x.scale.domain;
    var ay = a && a.encoding && a.encoding.y && a.encoding.y.scale && a.encoding.y.scale.domain;
    var n0 = a && a.data && a.data.values ? a.data.values.length : 0;
    var n1 = b && b.data && b.data.values ? b.data.values.length : 0;
    return (ax ? ax.length : 0) + 'x' + (ay ? ay.length : 0) + ':' + n0 + '+' + n1;
  }

  function updateVegaData(el, spec) {
    var view = el._deepView;
    if (!view || !spec.layer || spec.layer.length < 2) return null;
    var heat = spec.layer[0].data && spec.layer[0].data.values;
    var mark = spec.layer[1].data && spec.layer[1].data.values;
    if (!heat || !mark) return null;
    try {
      return view.data('heat', heat).runAsync().then(function () {
        return view.data('mark', mark).runAsync();
      }).then(function () {
        if (NT().resizeDeepCharts) NT().resizeDeepCharts();
        return view;
      });
    } catch (e) {
      return null;
    }
  }

  function paintVega(el, spec) {
    if (!el) return Promise.reject(new Error('no host'));
    var embed = global.vegaEmbed;
    if (typeof embed !== 'function') {
      return Promise.reject(new Error('vegaEmbed missing'));
    }
    var cfg = NT().deepVegaConfig ? NT().deepVegaConfig() : {};
    var opts = { actions: false, renderer: 'canvas', config: cfg };
    var lookKey = deepLookKey();
    var gridKey = specGridKey(spec);
    var cacheKey = lookKey + '\0' + gridKey;

    if (el._deepView && el._deepCacheKey === cacheKey && gridKey) {
      var updated = updateVegaData(el, spec);
      if (updated) return updated;
    }

    function run() {
      return embed(el, spec, opts).then(function (res) {
        el._deepView = res && res.view ? res.view : null;
        el._deepGridKey = gridKey;
        el._deepCacheKey = cacheKey;
        if (NT().scheduleDeepResize) NT().scheduleDeepResize();
        else if (NT().resizeDeepCharts) NT().resizeDeepCharts();
        return res;
      });
    }

    if (el._deepView && typeof el._deepView.finalize === 'function') {
      try {
        el._deepView.finalize();
      } catch (e) { /* ignore */ }
      el._deepView = null;
      el._deepGridKey = '';
      el._deepCacheKey = '';
    }
    el.innerHTML = '';
    return run();
  }

  /* ─── WebGL surface mount ───────────────────────────────────────── */

  function buildHeightMesh(nx, ny, valueAt) {
    var positions = [];
    var normals = [];
    var cells = [];
    var i, j, u, v, h;
    var verts = [];

    for (j = 0; j <= ny; j++) {
      for (i = 0; i <= nx; i++) {
        u = i / nx;
        v = j / ny;
        h = clamp(valueAt(u, v), 0, 1);
        verts.push([u - 0.5, h * 0.55, v - 0.5]);
      }
    }

    function idxAt(ii, jj) {
      return jj * (nx + 1) + ii;
    }

    for (j = 0; j < ny; j++) {
      for (i = 0; i < nx; i++) {
        var a = idxAt(i, j);
        var b = idxAt(i + 1, j);
        var c = idxAt(i + 1, j + 1);
        var d = idxAt(i, j + 1);
        cells.push(a, b, c, a, c, d);
      }
    }

    var nCount = verts.length;
    var nAcc = new Array(nCount);
    for (i = 0; i < nCount; i++) nAcc[i] = [0, 0, 0];

    function addN(ia, ib, ic) {
      var A = verts[ia], B = verts[ib], C = verts[ic];
      var ex = B[0] - A[0], ey = B[1] - A[1], ez = B[2] - A[2];
      var fx = C[0] - A[0], fy = C[1] - A[1], fz = C[2] - A[2];
      var nxn = ey * fz - ez * fy;
      var nyn = ez * fx - ex * fz;
      var nzn = ex * fy - ey * fx;
      nAcc[ia][0] += nxn; nAcc[ia][1] += nyn; nAcc[ia][2] += nzn;
      nAcc[ib][0] += nxn; nAcc[ib][1] += nyn; nAcc[ib][2] += nzn;
      nAcc[ic][0] += nxn; nAcc[ic][1] += nyn; nAcc[ic][2] += nzn;
    }

    for (i = 0; i < cells.length; i += 3) {
      addN(cells[i], cells[i + 1], cells[i + 2]);
    }

    for (i = 0; i < nCount; i++) {
      var p = verts[i];
      var n = nAcc[i];
      var len = Math.hypot(n[0], n[1], n[2]) || 1;
      positions.push(p[0], p[1], p[2]);
      normals.push(n[0] / len, n[1] / len, n[2] / len);
    }

    /* wireframe edges along grid */
    var lines = [];
    for (j = 0; j <= ny; j++) {
      for (i = 0; i < nx; i++) {
        lines.push(idxAt(i, j), idxAt(i + 1, j));
      }
    }
    for (i = 0; i <= nx; i++) {
      for (j = 0; j < ny; j++) {
        lines.push(idxAt(i, j), idxAt(i, j + 1));
      }
    }

    return {
      positions: positions,
      normals: normals,
      cells: cells,
      lines: lines,
      verts: verts
    };
  }

  function sphereMesh(cx, cy, cz, r, seg) {
    seg = seg || 10;
    var positions = [];
    var normals = [];
    var cells = [];
    var i, j;
    for (j = 0; j <= seg; j++) {
      var ph = (j / seg) * Math.PI;
      var sp = Math.sin(ph), cp = Math.cos(ph);
      for (i = 0; i <= seg; i++) {
        var th = (i / seg) * Math.PI * 2;
        var st = Math.sin(th), ct = Math.cos(th);
        var x = ct * sp, y = cp, z = st * sp;
        positions.push(cx + x * r, cy + y * r, cz + z * r);
        normals.push(x, y, z);
      }
    }
    function sIdx(ii, jj) {
      return jj * (seg + 1) + ii;
    }
    for (j = 0; j < seg; j++) {
      for (i = 0; i < seg; i++) {
        var a = sIdx(i, j), b = sIdx(i + 1, j), c = sIdx(i + 1, j + 1), d = sIdx(i, j + 1);
        cells.push(a, b, c, a, c, d);
      }
    }
    return { positions: positions, normals: normals, cells: cells };
  }

  function bindOrbit(canvas, state) {
    if (canvas._orbitBound) return;
    canvas._orbitBound = true;
    var dragging = false;
    var lastX = 0, lastY = 0;

    function onDown(e) {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* */ }
    }
    function onMove(e) {
      if (!dragging) return;
      var dx = e.clientX - lastX;
      var dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      state.yaw += dx * 0.01;
      state.pitch = clamp(state.pitch + dy * 0.01, -1.2, 1.2);
    }
    function onUp() {
      dragging = false;
    }
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.style.touchAction = 'none';
    canvas.style.cursor = 'grab';
  }

  function resizeCanvas(canvas, regl) {
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    var h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      if (regl && regl._gl) {
        try { regl._gl.viewport(0, 0, w, h); } catch (e) { /* */ }
      }
    }
    return { w: w, h: h, aspect: w / h };
  }

  function mountSurface(canvas, opts) {
    var factory = getReglFactory();
    if (!factory || typeof factory !== 'function') {
      return Promise.reject(new Error('regl missing'));
    }
    opts = opts || {};
    var g = GL();
    var nx = opts.gridX || 32;
    var ny = opts.gridY || 32;
    var valueAt = opts.valueAt || function () { return 0; };
    var marker = opts.marker || null;
    var color = opts.color || muteRgb();
    var accent = accentRgb();

    var state = canvas._deepGL;
    if (state && state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }

    var regl;
    if (state && state.regl) {
      regl = state.regl;
      state.yaw = state.yaw != null ? state.yaw : 0.7;
      state.pitch = state.pitch != null ? state.pitch : 0.45;
    } else {
      try {
        regl = factory({
          canvas: canvas,
          attributes: { alpha: true, antialias: true, preserveDrawingBuffer: false }
        });
      } catch (e) {
        return Promise.reject(e);
      }
      state = {
        regl: regl,
        yaw: 0.7,
        pitch: 0.45,
        draw: null,
        raf: 0
      };
      canvas._deepGL = state;
      bindOrbit(canvas, state);
    }

    var mesh = buildHeightMesh(nx, ny, valueAt);
    var sph = marker
      ? sphereMesh(marker[0] - 0.5, marker[2] * 0.55, marker[1] - 0.5, 0.035, 8)
      : null;

    var drawSurf = regl({
      frag: [
        'precision mediump float;',
        'varying vec3 vN;',
        'uniform vec3 uColor;',
        'void main(){',
        '  vec3 L=normalize(vec3(0.4,1.0,0.3));',
        '  float d=0.35+0.65*max(dot(normalize(vN),L),0.0);',
        '  gl_FragColor=vec4(uColor*d,0.92);',
        '}'
      ].join('\n'),
      vert: [
        'precision mediump float;',
        'attribute vec3 position;',
        'attribute vec3 normal;',
        'uniform mat4 uMVP;',
        'varying vec3 vN;',
        'void main(){',
        '  vN=normal;',
        '  gl_Position=uMVP*vec4(position,1.0);',
        '}'
      ].join('\n'),
      attributes: {
        position: mesh.positions,
        normal: mesh.normals
      },
      elements: mesh.cells,
      uniforms: {
        uMVP: regl.prop('mvp'),
        uColor: color
      },
      cull: { enable: false }
    });

    var drawWire = regl({
      frag: [
        'precision mediump float;',
        'uniform vec3 uColor;',
        'void main(){ gl_FragColor=vec4(uColor,0.35); }'
      ].join('\n'),
      vert: [
        'precision mediump float;',
        'attribute vec3 position;',
        'uniform mat4 uMVP;',
        'void main(){ gl_Position=uMVP*vec4(position,1.0); }'
      ].join('\n'),
      attributes: { position: mesh.positions },
      elements: mesh.lines,
      primitive: 'lines',
      uniforms: {
        uMVP: regl.prop('mvp'),
        uColor: [color[0] * 0.6, color[1] * 0.6, color[2] * 0.6]
      },
      depth: { enable: true, mask: false }
    });

    var drawMark = sph
      ? regl({
          frag: [
            'precision mediump float;',
            'varying vec3 vN;',
            'uniform vec3 uColor;',
            'void main(){',
            '  vec3 L=normalize(vec3(0.3,1.0,0.4));',
            '  float d=0.4+0.6*max(dot(normalize(vN),L),0.0);',
            '  gl_FragColor=vec4(uColor*d,1.0);',
            '}'
          ].join('\n'),
          vert: [
            'precision mediump float;',
            'attribute vec3 position;',
            'attribute vec3 normal;',
            'uniform mat4 uMVP;',
            'varying vec3 vN;',
            'void main(){ vN=normal; gl_Position=uMVP*vec4(position,1.0); }'
          ].join('\n'),
          attributes: {
            position: sph.positions,
            normal: sph.normals
          },
          elements: sph.cells,
          uniforms: {
            uMVP: regl.prop('mvp'),
            uColor: accent
          }
        })
      : null;

    function frame() {
      var sz = resizeCanvas(canvas, regl);
      var eye = g.orbitEye
        ? g.orbitEye(state.yaw, state.pitch, 1.85, [0, 0.15, 0])
        : [1.2, 0.9, 1.2];
      var view = g.lookAt ? g.lookAt(eye, [0, 0.1, 0], [0, 1, 0]) : null;
      var proj = g.perspective
        ? g.perspective(Math.PI / 4, sz.aspect, 0.05, 20)
        : null;
      var mvp = view && proj && g.mul ? g.mul(proj, view) : [
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
      ];

      regl.clear({ color: [0, 0, 0, 0], depth: 1 });
      drawSurf({ mvp: mvp });
      drawWire({ mvp: mvp });
      if (drawMark) drawMark({ mvp: mvp });
      state.raf = requestAnimationFrame(frame);
    }

    state.draw = frame;
    if (state.raf) cancelAnimationFrame(state.raf);
    resizeCanvas(canvas, regl);
    state.raf = requestAnimationFrame(frame);
    return Promise.resolve();
  }

  /* ─── Dedicated WebGL / 2D drawers ──────────────────────────────── */

  function paintRatio(canvas, payload) {
    return new Promise(function (resolve, reject) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          try {
            resolve(paintRatioFrame(canvas, payload));
          } catch (e) {
            reject(e);
          }
        });
      });
    });
  }

  function paintRatioFrame(canvas, payload) {
    var w = Math.max(1, num(payload.width, 16));
    var h = Math.max(1, num(payload.height, 9));
    var phi = 1.6180339887;
    var state = canvas._deepGL;
    if (state && state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }
    var ctx = canvas.getContext('2d');
    if (!ctx) return Promise.reject(new Error('2d context missing'));

    canvas._deepGL = { regl: null, yaw: 0, pitch: 0, draw: null, raf: 0 };
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var cw = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    var ch = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    canvas.width = cw;
    canvas.height = ch;
    ctx.clearRect(0, 0, cw, ch);

    var mute = muteRgb();
    var acc = accentRgb();
    var pad = Math.min(cw, ch) * 0.08;
    var box = Math.min(cw, ch) - pad * 2;

    function col(c) {
      return 'rgb(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ')';
    }
    function strokeRect(x, y, rw, rh, c, lw) {
      ctx.strokeStyle = col(c);
      ctx.lineWidth = lw;
      ctx.strokeRect(x, y, rw, rh);
    }

    var x = (cw - box) / 2;
    var y = (ch - box / phi) / 2;
    var rw = box;
    var rh = box / phi;
    var sx = x, sy = y, sw = rw, sh = rh;
    var dir = 0;
    ctx.beginPath();
    for (var i = 0; i < 12; i++) {
      strokeRect(sx, sy, sw, sh, mute, 1 * dpr);
      var side = Math.min(sw, sh);
      var ax, ay, start, end;
      if (dir === 0) {
        ax = sx + side; ay = sy + side;
        start = Math.PI; end = Math.PI * 1.5;
        ctx.moveTo(ax + Math.cos(start) * side, ay + Math.sin(start) * side);
        ctx.arc(ax, ay, side, start, end, false);
        sx += side; sw -= side;
      } else if (dir === 1) {
        ax = sx; ay = sy + side;
        start = Math.PI * 1.5; end = Math.PI * 2;
        ctx.moveTo(ax + Math.cos(start) * side, ay + Math.sin(start) * side);
        ctx.arc(ax, ay, side, start, end, false);
        sy += side; sh -= side;
      } else if (dir === 2) {
        ax = sx; ay = sy;
        start = 0; end = Math.PI * 0.5;
        ctx.moveTo(ax + Math.cos(start) * side, ay + Math.sin(start) * side);
        ctx.arc(ax, ay, side, start, end, false);
        sw -= side;
      } else {
        ax = sx + side; ay = sy;
        start = Math.PI * 0.5; end = Math.PI;
        ctx.moveTo(ax + Math.cos(start) * side, ay + Math.sin(start) * side);
        ctx.arc(ax, ay, side, start, end, false);
        sh -= side;
      }
      dir = (dir + 1) % 4;
      if (sw < 3 || sh < 3) break;
    }
    ctx.strokeStyle = col(mute);
    ctx.lineWidth = 1.75 * dpr;
    ctx.stroke();

    var ar = w / h;
    var aw, ah;
    if (ar >= 1) {
      aw = box * 0.5;
      ah = aw / ar;
    } else {
      ah = box * 0.5;
      aw = ah * ar;
    }
    strokeRect((cw - aw) / 2, (ch - ah) / 2, aw, ah, acc, 2.25 * dpr);
    return Promise.resolve();
  }

  function binom(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    k = Math.min(k, n - k);
    var r = 1;
    for (var i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
    return r;
  }

  function paintCombo(canvas, payload) {
    var n = clamp(Math.round(num(payload.n, 10)), 0, 64);
    var k = clamp(Math.round(num(payload.k, 3)), 0, n);
    var state = canvas._deepGL;
    if (state && state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }
    var ctx = canvas.getContext('2d');
    if (!ctx) return Promise.reject(new Error('2d context missing'));

    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var cw = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    var ch = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    canvas.width = cw;
    canvas.height = ch;
    ctx.clearRect(0, 0, cw, ch);

    var mute = muteRgb();
    var acc = accentRgb();
    var rows = n;
    if (rows <= 0) {
      canvas._deepGL = { regl: null, yaw: 0, pitch: 0, draw: null, raf: 0 };
      return Promise.resolve();
    }

    var padX = cw * (rows > 36 ? 0.04 : 0.06);
    var padY = ch * (rows > 36 ? 0.03 : 0.06);
    var usableW = cw - padX * 2;
    var usableH = ch - padY * 2;
    var cellH = usableH / (rows + 1);
    var maxCells = rows + 1;
    var cellW = usableW / maxCells;
    var peak = binom(rows, Math.floor(rows / 2));
    var logPeak = Math.log(peak + 1);
    var gap = rows > 40 ? 0.88 : rows > 24 ? 0.84 : 0.82;

    for (var row = 0; row <= rows; row++) {
      var count = row + 1;
      var rowW = count * cellW;
      var startX = padX + (usableW - rowW) / 2;
      for (var col = 0; col <= row; col++) {
        var c = binom(row, col);
        var bright = logPeak > 0 ? Math.log(c + 1) / logPeak : 1;
        bright = clamp(bright, 0.08, 1);
        var isHit = row === n && col === k;
        var g = isHit ? acc : mute;
        var a = isHit ? 1 : 0.22 + bright * 0.72;
        ctx.fillStyle = 'rgba(' + Math.round(g[0] * 255) + ',' + Math.round(g[1] * 255) + ',' + Math.round(g[2] * 255) + ',' + a + ')';
        var x = startX + col * cellW;
        var y = padY + row * cellH;
        var s = Math.min(cellW, cellH) * gap;
        ctx.fillRect(x + (cellW - s) / 2, y + (cellH - s) / 2, s, s);
      }
    }
    canvas._deepGL = { regl: null, yaw: 0, pitch: 0, draw: null, raf: 0 };
    return Promise.resolve();
  }

  /* ─── Per-tool Vega specs ───────────────────────────────────────── */

  function specBill(p) {
    var people = clamp(Math.round(num(p.people, 2)), 1, 12);
    var tipPct = clamp(num(p.tipPct, 18), 0, 50);
    var total = Math.max(0, num(p.total, 100));
    var data = [];
    var tip, peop;
    for (tip = 0; tip <= 50; tip += 2) {
      for (peop = 1; peop <= 12; peop++) {
        data.push({ tip: tip, people: peop, each: total * (1 + tip / 100) / peop });
      }
    }
    var tipDomain = ordDomain(0, 50, 2, tipPct, false);
    var peopleDomain = ordDomain(1, 12, 1, people, true);
    stampHeatCross(data, 'tip', 'people', 'each', tipPct, people, tipDomain, peopleDomain, function (t, pe) {
      return total * (1 + t / 100) / pe;
    });
    return deepShell([
      heatLayer(data, 'tip', 'people', 'each', 'tip %', 'people', tipDomain, peopleDomain),
      markLayer([{ tip: tipPct, people: people }], 'tip', 'people', tipDomain, peopleDomain)
    ]);
  }

  function specHourly(p) {
    var rate = Math.max(0, num(p.rate, 100));
    var days = Math.max(0, num(p.days, 10));
    var hpd = Math.max(0.1, num(p.hpd, 8));
    var daysMax = Math.min(365, Math.max(28, Math.ceil(days)));
    var dayStep = daysMax <= 28 ? 1 : daysMax <= 56 ? 2 : daysMax <= 112 ? 4 : 7;
    var rateStep = rate > 200 ? 20 : 10;
    var rateLo = Math.max(0, Math.floor(rate / rateStep) * rateStep - rateStep * 3);
    var rateHi = Math.max(rateLo + rateStep * 5, Math.ceil(rate / rateStep) * rateStep + rateStep * 3);
    var data = [];
    var r, d;
    for (r = rateLo; r <= rateHi; r += rateStep) {
      for (d = dayStep; d <= daysMax; d += dayStep) {
        data.push({ days: d, rate: r, total: r * hpd * d });
      }
    }
    var daysDomain = ordDomain(dayStep, daysMax, dayStep, days, false);
    var rateDomain = ordDomain(rateLo, rateHi, rateStep, rate, true);
    stampHeatCross(data, 'days', 'rate', 'total', days, rate, daysDomain, rateDomain, function (d, r) {
      return r * hpd * d;
    });
    return deepShell([
      heatLayer(data, 'days', 'rate', 'total', 'days', '$/hr', daysDomain, rateDomain),
      markLayer([{ days: days, rate: rate }], 'days', 'rate', daysDomain, rateDomain)
    ]);
  }

  function specBudget(p) {
    var pot = Math.max(1, num(p.pot, 3000));
    var food = Math.max(0, num(p.food, 400));
    var move = Math.max(0, num(p.move, 800));
    var fun = Math.max(0, num(p.fun, 200));
    var liveCur = clamp(num(p.live, 1000), 0, pot);
    var data = [];
    var steps = 40;
    var i;
    for (i = 0; i <= steps; i++) {
      var live = (i / steps) * pot;
      var used = live + food + move + fun;
      data.push({
        live: live,
        remaining: Math.max(0, pot - used),
        used: Math.min(used, pot)
      });
    }
    return deepShell([
      {
        data: { values: data },
        mark: { type: 'area', opacity: 0.35, line: true },
        encoding: {
          x: { field: 'live', type: 'quantitative', title: 'live' },
          y: { field: 'used', type: 'quantitative', title: 'used' }
        }
      },
      {
        data: { values: data },
        mark: { type: 'line' },
        encoding: {
          x: { field: 'live', type: 'quantitative' },
          y: { field: 'remaining', type: 'quantitative', title: 'left' }
        }
      },
      {
        data: { values: [{ live: liveCur }] },
        mark: { type: 'rule' },
        encoding: { x: { field: 'live', type: 'quantitative' } }
      }
    ]);
  }

  function specTax(p) {
    var sub = Math.max(0.01, num(p.sub, 100));
    var taxPct = num(p.taxPct, 8);
    var tipPct = clamp(num(p.tipPct, 18), 0, 40);
    var tipOn = p.tipOn === 'total' ? 'total' : 'pre';
    var data = [];
    var t;
    for (t = 0; t <= 40; t++) {
      var tipPre = sub * (t / 100);
      var taxAmt = sub * (taxPct / 100);
      var tipTot = (sub + taxAmt) * (t / 100);
      var effPre = ((tipPre + taxAmt) / sub) * 100;
      var effTot = ((tipTot + taxAmt) / sub) * 100;
      data.push({ tip: t, mode: 'pre', eff: effPre });
      data.push({ tip: t, mode: 'total', eff: effTot });
    }
    return deepShell([
      {
        data: { values: data },
        mark: { type: 'line' },
        encoding: {
          x: { field: 'tip', type: 'quantitative', title: 'tip %' },
          y: { field: 'eff', type: 'quantitative', title: 'eff %' },
          color: nominalColorEncoding('mode'),
          strokeDash: { field: 'mode', type: 'nominal' },
          opacity: {
            condition: { test: "datum.mode === '" + tipOn + "'", value: 1 },
            value: 0.35
          }
        }
      },
      {
        data: { values: [{ tip: tipPct }] },
        mark: { type: 'rule' },
        encoding: { x: { field: 'tip', type: 'quantitative' } }
      }
    ]);
  }

  function specUnit(p) {
    var amount = Math.max(0, num(p.amount, 1));
    var density = Math.max(0.01, num(p.density, 1));
    var cross = !!(p.fromIsVol && p.toIsMass) || !!(p.fromIsMass && p.toIsVol);

    var densities = [
      { name: 'water', d: 1 },
      { name: 'flour', d: 0.53 },
      { name: 'sugar', d: 0.85 },
      { name: 'butter', d: 0.91 }
    ];
    var data = [];
    var i, a;
    if (cross) {
      for (i = 0; i < densities.length; i++) {
        for (a = 0; a <= 10; a += 0.25) {
          data.push({
            amount: a,
            grams: a * 240 * densities[i].d,
            name: densities[i].name,
            d: densities[i].d
          });
        }
      }
      data.push({
        amount: amount,
        grams: amount * 240 * density,
        name: 'current',
        d: density
      });
      return {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: 'container',
        height: 'container',
        autosize: { type: 'fit', contains: 'padding' },
        layer: [
          {
            data: { values: data.filter(function (r) { return r.name !== 'current'; }) },
            mark: { type: 'line' },
            encoding: {
              x: { field: 'amount', type: 'quantitative', title: 'cups≈' },
              y: { field: 'grams', type: 'quantitative', title: 'g' },
              color: nominalColorEncoding('name'),
              opacity: {
              condition: {
                test: 'abs(datum.d - ' + density + ') < 0.001',
                value: 1
              },
              value: 0.35
            }
            }
          },
          {
            data: { values: [{ amount: amount, grams: amount * 240 * density }] },
            mark: { type: 'point', filled: true, size: 90 },
            encoding: {
              x: { field: 'amount', type: 'quantitative' },
              y: { field: 'grams', type: 'quantitative' }
            }
          }
        ]
      };
    }
    for (a = 0; a <= 10; a += 0.25) {
      data.push({ amount: a, out: a });
    }
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 'container',
      autosize: { type: 'fit', contains: 'padding' },
      layer: [
        {
          data: { values: data },
          mark: { type: 'line' },
          encoding: {
            x: { field: 'amount', type: 'quantitative', title: 'in' },
            y: { field: 'out', type: 'quantitative', title: 'out' }
          }
        },
        {
          data: { values: [{ amount: amount, out: amount }] },
          mark: { type: 'point', filled: true, size: 90 },
          encoding: {
            x: { field: 'amount', type: 'quantitative' },
            y: { field: 'out', type: 'quantitative' }
          }
        }
      ]
    };
  }

  function specDose(p) {
    var want = clamp(num(p.want, 2), 0.1, 100);
    var have = clamp(num(p.have, 500), 1, 2000);
    var vol = Math.max(0.01, num(p.vol, 5));
    var stocks = [have * 0.5, have, have * 1.5].map(function (s) {
      return Math.max(1, s);
    });
    var data = [];
    var s, w;
    for (s = 0; s < stocks.length; s++) {
      var stock = stocks[s];
      var maxW = Math.min(100, Math.max(want * 2.5, 20));
      var step = Math.max(0.25, maxW / 30);
      for (w = 0.5; w <= maxW + 0.001; w += step) {
        data.push({
          want: Math.round(w * 100) / 100,
          conc: vol * (w / stock),
          label: s === 1 ? 'have' : (s === 0 ? '0.5×' : '1.5×')
        });
      }
    }
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 'container',
      autosize: { type: 'fit', contains: 'padding' },
      layer: [
        {
          data: { values: data },
          mark: { type: 'line' },
          encoding: {
            x: { field: 'want', type: 'quantitative', title: 'target %' },
            y: { field: 'conc', type: 'quantitative', title: 'concentrate' },
            color: nominalColorEncoding('label'),
            opacity: {
              condition: { test: "datum.label === 'have'", value: 1 },
              value: 0.4
            }
          }
        },
        {
          data: { values: [{ want: want, conc: vol * (want / have) }] },
          mark: { type: 'point', filled: true, size: 90 },
          encoding: {
            x: { field: 'want', type: 'quantitative' },
            y: { field: 'conc', type: 'quantitative' }
          }
        }
      ]
    };
  }

  function specBitrate(p) {
    var size = Math.max(0.01, num(p.size, 100));
    var speed = Math.max(0.01, num(p.speed, 50));
    var sizeDomain = logOrdDomain(0.5, Math.max(1000, size * 2), 10, size, false);
    var speedDomain = logOrdDomain(0.5, Math.max(1000, speed * 2), 10, speed, true);
    var data = [];
    var si, sj;
    for (si = 0; si < sizeDomain.length; si++) {
      for (sj = 0; sj < speedDomain.length; sj++) {
        var sz = sizeDomain[si];
        var sp = speedDomain[sj];
        var t = (sz * 8) / sp;
        data.push({ size: sz, speed: sp, timeSec: t, logt: Math.log(t) / Math.LN10 });
      }
    }
    stampHeatCross(data, 'size', 'speed', 'logt', size, speed, sizeDomain, speedDomain, function (sz, sp) {
      return Math.log((sz * 8) / sp) / Math.LN10;
    });
    return deepShell([
      heatLayer(data, 'size', 'speed', 'logt', 'MB', 'Mbps', sizeDomain, speedDomain),
      markLayer([{ size: size, speed: speed }], 'size', 'speed', sizeDomain, speedDomain)
    ]);
  }

  function specScalemap(p) {
    var measure = Math.max(0.01, num(p.measure, 2.4));
    var real = Math.max(0.01, num(p.real, 10));
    var ratio = real / measure;
    var dist = Math.max(0.01, num(p.dist, ratio));
    var units = p.units || 'mi';
    var maxM = Math.max(measure * 1.5, 6);
    var maxR = Math.max(ratio * 1.5, 10);
    var data = [];
    var rings = [1, 2, 3];
    var ri, mi, r;
    for (ri = 0; ri < rings.length; ri++) {
      r = rings[ri];
      for (mi = 0.5; mi <= maxM + 0.001; mi += Math.max(0.25, maxM / 24)) {
        data.push({
          measure: Math.round(mi * 100) / 100,
          ratio: ratio * r,
          ground: mi * ratio * r,
          ring: r + '×'
        });
      }
    }
    return deepShell([
      {
        data: { values: data },
        mark: { type: 'line' },
        encoding: {
          x: { field: 'measure', type: 'quantitative', title: 'measure (in)' },
          y: { field: 'ground', type: 'quantitative', title: 'ground ' + units },
          color: nominalColorEncoding('ring', { title: 'scale' }),
          opacity: { value: 0.55 }
        }
      },
      {
        data: { values: [{ measure: measure, ground: dist, ratio: ratio }] },
        mark: { type: 'point', filled: true, size: 100 },
        encoding: {
          x: { field: 'measure', type: 'quantitative' },
          y: { field: 'ground', type: 'quantitative' }
        }
      },
      {
        data: { values: [{ measure: measure, ground: dist * 0.92, label: '1 in = ' + (Math.round(ratio * 100) / 100) + ' ' + units }] },
        mark: { type: 'text', align: 'left', baseline: 'bottom', fontSize: 10, color: chartFonts().mute },
        encoding: {
          x: { field: 'measure', type: 'quantitative' },
          y: { field: 'ground', type: 'quantitative' },
          text: { field: 'label', type: 'nominal' }
        }
      }
    ]);
  }

  function specPace(p) {
    var distance = Math.max(0.01, num(p.distance, 10));
    var pace = Math.max(0.01, num(p.pace, 10));
    var etaH = Math.max(0.001, num(p.etaH, distance * pace / 60));
    var paceMax = Math.max(pace * 2, 30);
    var distMax = Math.max(distance * 1.5, 20);
    var data = [];
    var pi, di;
    var paceStep = Math.max(0.5, paceMax / 24);
    var distStep = Math.max(0.5, distMax / 24);
    for (pi = paceStep; pi <= paceMax + 0.001; pi += paceStep) {
      for (di = distStep; di <= distMax + 0.001; di += distStep) {
        data.push({
          pace: Math.round(pi * 10) / 10,
          distance: Math.round(di * 10) / 10,
          hours: (pi * di) / 60
        });
      }
    }
    var paceDomain = ordDomain(paceStep, paceMax, paceStep, pace, false);
    var distDomain = ordDomain(distStep, distMax, distStep, distance, false);
    stampHeatCross(data, 'pace', 'distance', 'hours', pace, distance, paceDomain, distDomain, function (pc, d) {
      return (pc * d) / 60;
    });
    return deepShell([
      heatLayer(data, 'pace', 'distance', 'hours', 'min/unit', 'distance', paceDomain, distDomain),
      markLayer([{ pace: pace, distance: distance }], 'pace', 'distance', paceDomain, distDomain)
    ]);
  }

  function specTypescale(p) {
    var base = Math.max(1, num(p.base, 16));
    var ratio = Math.max(1.01, num(p.ratio, 1.25));
    var steps = clamp(Math.round(num(p.steps, 6)), 2, 12);
    var ratios = [1.125, 1.2, 1.25, 1.333, 1.5, 1.618];
    var data = [];
    var ri, si;
    for (ri = 0; ri < ratios.length; ri++) {
      var r = ratios[ri];
      for (si = -2; si <= steps - 3; si++) {
        data.push({
          step: si,
          size: base * Math.pow(r, si),
          ratio: String(r),
          current: Math.abs(r - ratio) < 0.001
        });
      }
    }
    return deepShell([{
      data: { values: data },
      mark: { type: 'line', point: true },
      encoding: {
        x: { field: 'step', type: 'quantitative', title: 'step' },
        y: { field: 'size', type: 'quantitative', scale: { type: 'log' }, title: 'px' },
        color: nominalColorEncoding('ratio'),
        opacity: {
          condition: { test: 'datum.current', value: 1 },
          value: 0.3
        },
        strokeWidth: {
          condition: { test: 'datum.current', value: 2.5 },
          value: 1
        }
      }
    }]);
  }

  function specContrast(p) {
    var L1 = clamp(num(p.L1, 0.2), 0, 1);
    var L2 = clamp(num(p.L2, 0.95), 0, 1);
    var data = [];
    var a, b;
    for (a = 0; a <= 1.001; a += 0.05) {
      for (b = 0; b <= 1.001; b += 0.05) {
        var mx = Math.max(a, b);
        var mn = Math.min(a, b);
        var c = (mx + 0.05) / (mn + 0.05);
        data.push({ Lfg: Math.round(a * 100) / 100, Lbg: Math.round(b * 100) / 100, contrast: c });
      }
    }
    var Lf = Math.round(L1 * 20) / 20;
    var Lb = Math.round(L2 * 20) / 20;
    var lfgDomain = ordDomain(0, 1, 0.05, Lf, false);
    var lbgDomain = ordDomain(0, 1, 0.05, Lb, true);
    stampHeatCross(data, 'Lfg', 'Lbg', 'contrast', Lf, Lb, lfgDomain, lbgDomain, function (fg, bg) {
      var mx = Math.max(fg, bg);
      var mn = Math.min(fg, bg);
      return (mx + 0.05) / (mn + 0.05);
    });
    return deepShell([
      heatLayer(data, 'Lfg', 'Lbg', 'contrast', 'fg L', 'bg L', lfgDomain, lbgDomain),
      markLayer([{ Lfg: Lf, Lbg: Lb }], 'Lfg', 'Lbg', lfgDomain, lbgDomain)
    ]);
  }

  function specOdds(p) {
    var prob = clamp(num(p.p, 0.5), 0, 1);
    var win = num(p.win, 100);
    var lose = num(p.lose, -50);
    var winMax = Math.max(Math.abs(win) * 2, 50, Math.abs(lose) * 2);
    var pStep = 0.05;
    var wStep = Math.max(1, winMax / 20);
    var data = [];
    var pi, wi;
    for (pi = 0; pi <= 1.001; pi += pStep) {
      for (wi = -winMax; wi <= winMax + 0.001; wi += wStep) {
        var ev = pi * wi + (1 - pi) * lose;
        data.push({
          p: Math.round(pi * 100) / 100,
          win: Math.round(wi * 10) / 10,
          ev: ev
        });
      }
    }
    var pDomain = ordDomain(0, 1, pStep, prob, false);
    var wDomain = ordDomain(-winMax, winMax, wStep, win, true);
    stampHeatCross(data, 'p', 'win', 'ev', prob, win, pDomain, wDomain, function (pr, w) {
      return pr * w + (1 - pr) * lose;
    });
    return deepShell([
      heatLayer(data, 'p', 'win', 'ev', 'p', 'win', pDomain, wDomain),
      markLayer([{ p: prob, win: win }], 'p', 'win', pDomain, wDomain)
    ]);
  }

  function specDeal(p) {
    var left = clamp(Math.round(num(p.left, 52)), 1, 52);
    var want = clamp(Math.round(num(p.want, 1)), 0, left);
    var wantMax = Math.min(left, 52);
    var data = [];
    var L, W;
    for (L = 1; L <= 52; L++) {
      for (W = 0; W <= L; W++) {
        data.push({ left: L, want: W, p: W / L });
      }
    }
    var leftDomain = ordDomain(1, 52, 1, left, false);
    var wantDomain = ordDomain(0, wantMax, 1, want, true);
    stampHeatCross(data, 'left', 'want', 'p', left, want, leftDomain, wantDomain, function (l, w) {
      return w / Math.max(l, 1);
    });
    return deepShell([
      heatLayer(data, 'left', 'want', 'p', 'left', 'want', leftDomain, wantDomain),
      markLayer([{ left: left, want: want }], 'left', 'want', leftDomain, wantDomain)
    ]);
  }

  function specSample(p) {
    var n = Math.max(1, num(p.n, 400));
    var share = clamp(num(p.share, 0.5), 0.01, 0.99);
    var moe = Math.max(0, num(p.moe, 0.05));
    var z = Math.max(0.1, num(p.z, 1.96));
    var ps = [0.1, 0.25, 0.5, share];
    var uniq = [];
    ps.forEach(function (pp) {
      pp = Math.round(pp * 1000) / 1000;
      if (uniq.indexOf(pp) === -1) uniq.push(pp);
    });
    var ns = [];
    var v = 10;
    while (v <= Math.max(2000, n * 1.5)) {
      ns.push(Math.round(v));
      v *= 1.28;
    }
    if (ns.indexOf(Math.round(n)) === -1) ns.push(Math.round(n));
    ns.sort(function (a, b) { return a - b; });
    var data = [];
    var i, j;
    for (i = 0; i < uniq.length; i++) {
      for (j = 0; j < ns.length; j++) {
        var pp = uniq[i];
        var nn = ns[j];
        data.push({
          n: nn,
          p: String(pp),
          moe: z * Math.sqrt((pp * (1 - pp)) / nn),
          live: Math.abs(pp - share) < 0.001
        });
      }
    }
    return deepShell([
      {
        data: { values: data },
        mark: { type: 'line', point: false },
        encoding: {
          x: { field: 'n', type: 'quantitative', scale: { type: 'log' }, title: 'n' },
          y: { field: 'moe', type: 'quantitative', title: 'moe' },
          color: nominalColorEncoding('p', { title: 'p' }),
          opacity: {
            condition: { test: 'datum.live', value: 1 },
            value: 0.35
          },
          strokeWidth: {
            condition: { test: 'datum.live', value: 2.5 },
            value: 1
          }
        }
      },
      {
        data: { values: [{ n: n, moe: moe }] },
        mark: { type: 'point', filled: true, size: 90 },
        encoding: {
          x: { field: 'n', type: 'quantitative', scale: { type: 'log' } },
          y: { field: 'moe', type: 'quantitative' }
        }
      }
    ]);
  }

  function specStreak(p) {
    var prob = clamp(num(p.p, 0.5), 0.01, 0.99);
    var run = clamp(Math.round(num(p.run, 5)), 0, 40);
    var runMax = Math.max(40, run);
    var data = [];
    var r;
    for (r = 0; r <= runMax; r++) {
      data.push({
        run: r,
        streak: Math.pow(prob, r),
        fair: prob
      });
    }
    return deepShell([
      {
        data: { values: data },
        mark: { type: 'line' },
        encoding: {
          x: { field: 'run', type: 'quantitative', title: 'run' },
          y: { field: 'streak', type: 'quantitative', scale: { type: 'log' }, title: 'p^run' }
        }
      },
      {
        data: { values: data },
        mark: { type: 'line', strokeDash: [3, 3], opacity: 0.45 },
        encoding: {
          x: { field: 'run', type: 'quantitative' },
          y: { field: 'fair', type: 'quantitative', title: 'p (fair coin)' }
        }
      },
      {
        data: { values: [{ run: run, streak: Math.pow(prob, run) }] },
        mark: { type: 'point', filled: true, size: 90 },
        encoding: {
          x: { field: 'run', type: 'quantitative' },
          y: { field: 'streak', type: 'quantitative' }
        }
      }
    ]);
  }

  function preferFlat() {
    try {
      return window.matchMedia && window.matchMedia('(max-width: 600px)').matches;
    } catch (e) {
      return false;
    }
  }

  function paintHeat2d(canvas, opts) {
    opts = opts || {};
    var nx = opts.gridX || 28;
    var ny = opts.gridY || 28;
    var valueAt = opts.valueAt;
    var marker = opts.marker;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    function draw() {
      var w = Math.max(1, canvas.clientWidth || canvas.parentElement.clientWidth || 320);
      var h = Math.max(1, canvas.clientHeight || canvas.parentElement.clientHeight || 240);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      var ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      var cellW = w / nx;
      var cellH = h / ny;
      var i, j, u, v, z, g;
      for (j = 0; j < ny; j++) {
        for (i = 0; i < nx; i++) {
          u = i / (nx - 1);
          v = 1 - j / (ny - 1);
          z = valueAt(u, v);
          g = Math.round(clamp(z, 0, 1) * 200);
          ctx.fillStyle = 'rgb(' + g + ',' + g + ',' + g + ')';
          ctx.fillRect(i * cellW, j * cellH, cellW + 0.5, cellH + 0.5);
        }
      }
      if (marker) {
        var mx = marker[0] * w;
        var my = (1 - marker[1]) * h;
        ctx.strokeStyle = GL().cssColor ? GL().cssColor('--accent', '#c44') : '#c44';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mx, my, 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    draw();
    if (!canvas._deepResize) {
      canvas._deepResize = function () { draw(); };
      window.addEventListener('resize', canvas._deepResize);
    }
    return Promise.resolve();
  }

  /* ─── WebGL tool painters ───────────────────────────────────────── */

  function paintFuel(canvas, payload) {
    var miles = clamp(num(payload.miles, 200), 0, 500);
    var mpg = clamp(num(payload.mpg, 25), 5, 50);
    var price = Math.max(0.01, num(payload.price, 3.5));
    var maxCost = 500 * price / 5;
    var opts = {
      gridX: 36,
      gridY: 36,
      valueAt: function (u, v) {
        var m = 5 + u * 45;
        var mi = v * 500;
        var cost = mi * price / Math.max(m, 0.1);
        return clamp(cost / maxCost, 0, 1);
      },
      marker: [
        (mpg - 5) / 45,
        miles / 500,
        clamp((miles * price / Math.max(mpg, 0.1)) / maxCost, 0, 1)
      ],
      color: muteRgb()
    };
    if (preferFlat()) return paintHeat2d(canvas, opts);
    return mountSurface(canvas, opts);
  }

  function paintExposure(canvas, payload) {
    var iso = Math.max(25, num(payload.iso, 100));
    var fnum = Math.max(0.5, num(payload.fnum, 2.8));
    var shutN = Math.max(1, num(payload.shutN, 125));
    /* EV-ish surface over f and shutter */
    var minZ = Infinity, maxZ = -Infinity;
    var i, j, u, v, f, shut, z;
    for (j = 0; j <= 24; j++) {
      for (i = 0; i <= 24; i++) {
        u = i / 24;
        v = j / 24;
        f = 1 + u * 15;
        shut = 1 + Math.pow(v, 2) * 1999;
        z = Math.log(f * f / (1 / shut)) / Math.LN2 - Math.log(iso / 100) / Math.LN2;
        if (z < minZ) minZ = z;
        if (z > maxZ) maxZ = z;
      }
    }
    var span = maxZ - minZ || 1;
    var curZ =
      Math.log(fnum * fnum / (1 / shutN)) / Math.LN2 - Math.log(iso / 100) / Math.LN2;
    var uMark = clamp((fnum - 1) / 15, 0, 1);
    var shutT = Math.sqrt(clamp((shutN - 1) / 1999, 0, 1));
    var opts = {
      gridX: 28,
      gridY: 28,
      valueAt: function (uu, vv) {
        f = 1 + uu * 15;
        shut = 1 + Math.pow(vv, 2) * 1999;
        z = Math.log(f * f / (1 / shut)) / Math.LN2 - Math.log(iso / 100) / Math.LN2;
        return clamp((z - minZ) / span, 0, 1);
      },
      marker: [uMark, shutT, clamp((curZ - minZ) / span, 0, 1)],
      color: muteRgb()
    };
    if (preferFlat()) return paintHeat2d(canvas, opts);
    return mountSurface(canvas, opts);
  }

  function paintBayes(canvas, payload) {
    var prior = clamp(num(payload.prior, 0.5), 0.001, 0.999);
    var hit = Math.max(0.001, num(payload.hit, 0.9));
    var miss = Math.max(0.001, num(payload.miss, 0.1));
    var lr = Math.max(0.01, num(payload.lr, hit / miss));
    var logLR = clamp(Math.log(lr) / Math.LN10, -2, 2);
    var post = (lr * prior) / (lr * prior + (1 - prior));
    var opts = {
      gridX: 36,
      gridY: 36,
      valueAt: function (u, v) {
        var pr = clamp(u, 0.001, 0.999);
        var llr = -2 + v * 4;
        var L = Math.pow(10, llr);
        return clamp((L * pr) / (L * pr + (1 - pr)), 0, 1);
      },
      marker: [prior, (logLR + 2) / 4, clamp(post, 0, 1)],
      color: muteRgb()
    };
    if (preferFlat()) return paintHeat2d(canvas, opts);
    return mountSurface(canvas, opts);
  }

  function paintSample(canvas, payload) {
    var n = clamp(Math.round(num(payload.n, 400)), 1, 5000);
    var share = clamp(num(payload.share, 0.5), 0.01, 0.99);
    var moe = Math.max(0.001, num(payload.moe, 0.05));
    var state = canvas._deepGL;
    if (state && state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }
    var ctx = canvas.getContext('2d');
    if (!ctx) return Promise.reject(new Error('2d context missing'));
    canvas._deepGL = { regl: null, yaw: 0, pitch: 0, draw: null, raf: 0 };
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var cw = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    var ch = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    canvas.width = cw;
    canvas.height = ch;
    ctx.clearRect(0, 0, cw, ch);
    var mute = muteRgb();
    var acc = accentRgb();
    var cols = Math.min(48, Math.max(8, Math.round(Math.sqrt(n / 8))));
    var rows = Math.min(48, Math.max(8, Math.ceil(n / cols)));
    var cellW = cw / cols;
    var cellH = ch / rows;
    var spread = moe * cw * 0.45;
    var cx = cw * share;
    var i, j, idx = 0;
    function col(c, a) {
      a = a == null ? 1 : a;
      return 'rgba(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ',' + a + ')';
    }
    for (j = 0; j < rows && idx < n; j++) {
      for (i = 0; i < cols && idx < n; i++) {
        var u = (idx + 0.5) / n;
        var x = cx + (u - share) * spread + (Math.sin(idx * 12.9898) * 0.5 + 0.5 - 0.5) * spread * 0.35;
        var y = (j + 0.5) * cellH + (Math.cos(idx * 78.233) * 0.5) * cellH * 0.15;
        var r = Math.max(1.5, Math.min(cellW, cellH) * 0.22);
        ctx.beginPath();
        ctx.fillStyle = col(mute, 0.35 + 0.45 * (idx / Math.max(n, 1)));
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        idx++;
      }
    }
    ctx.beginPath();
    ctx.strokeStyle = col(acc, 0.9);
    ctx.lineWidth = 1.5 * dpr;
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, ch);
    ctx.stroke();
    ctx.fillStyle = col(acc, 1);
    canvasLabel(ctx, 'p=' + (Math.round(share * 1000) / 10) + '% ±' + (Math.round(moe * 1000) / 10), 8 * dpr, 14 * dpr, dpr, 'digits');
    return Promise.resolve();
  }

  /* ─── Router ────────────────────────────────────────────────────── */

  var VEGA_SCRUB = {
    bill: 'tip',
    hourly: 'days',
    budget: 'live',
    tax: 'tip',
    unit: 'amount',
    dose: 'want',
    bitrate: 'size',
    scalemap: 'measure',
    pace: 'pace',
    typescale: 'base',
    contrast: 'lift',
    odds: 'p',
    deal: 'left',
    streak: 'run'
  };

  var WEBGL_SCRUB = {
    fuel: 'miles',
    ratio: 'w',
    exposure: 'iso',
    combo: 'n',
    bayes: 'prior',
    sample: 'n'
  };

  var SPECS = {
    bill: specBill,
    hourly: specHourly,
    budget: specBudget,
    tax: specTax,
    unit: specUnit,
    dose: specDose,
    bitrate: specBitrate,
    scalemap: specScalemap,
    pace: specPace,
    typescale: specTypescale,
    contrast: specContrast,
    odds: specOdds,
    deal: specDeal,
    streak: specStreak
  };

  function paint(toolId, stage, payload) {
    payload = payload || {};
    var ensure = NT().ensureDeepHost;
    if (typeof ensure !== 'function') {
      return Promise.reject(new Error('ensureDeepHost missing'));
    }

    if (WEBGL[toolId]) {
      var canvas = ensure(stage, 'webgl', WEBGL_SCRUB[toolId] || null);
      if (!canvas) return Promise.reject(new Error('no canvas'));
      if (toolId === 'fuel') return paintFuel(canvas, payload);
      if (toolId === 'ratio') return paintRatio(canvas, payload);
      if (toolId === 'exposure') return paintExposure(canvas, payload);
      if (toolId === 'combo') return paintCombo(canvas, payload);
      if (toolId === 'bayes') return paintBayes(canvas, payload);
      if (toolId === 'sample') return paintSample(canvas, payload);
      return Promise.reject(new Error('unknown webgl tool'));
    }

    var el = ensure(stage, 'vega', VEGA_SCRUB[toolId] || null);
    if (!el) return Promise.reject(new Error('no chart host'));
    var build = SPECS[toolId];
    if (!build) return Promise.reject(new Error('unknown vega tool: ' + toolId));
    var spec = build(payload);
    /* strip expr colors that may fail without theme — accent via config.point */
    return paintVega(el, spec);
  }

  global.IBMDeepViz = {
    engine: engine,
    paint: paint,
    WEBGL_3D: WEBGL_3D,
    CANVAS_2D: CANVAS_2D,
    VEGA_SCRUB: VEGA_SCRUB,
    WEBGL_SCRUB: WEBGL_SCRUB
  };
})(typeof window !== 'undefined' ? window : this);
