/* Parking scene: cars arrive and leave at random, one lane per lot, no overlaps */
(function () {
  var scene = document.querySelector('.pk-scene');
  if (!scene) return;
  var svg = scene.querySelector('svg');
  var carLayer = svg.querySelector('#pkCars');
  var wkLayer = svg.querySelector('#pkWalkers');
  var arm = svg.querySelector('#pkArm');
  if (!carLayer || !wkLayer) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var NS = 'http://www.w3.org/2000/svg';
  var COLORS = ['#e0a526', '#2f6fe0', '#c8463d', '#6b7a86', '#7a5cc8', '#f07a2b', '#0a8e80', '#d6477f', '#3aa463', '#1d2b36', '#e8e1d2'];
  var SHIRTS = ['#0a8e80', '#1faa59', '#e2552b', '#2f6fe0', '#7a5cc8', '#d6477f'];
  var SPEED = 150, WSPEED = 80, MIN_PARK = 7000, GAP = 36;

  var lots = {
    m: { xs: [80, 152, 224, 296, 368, 440], py: 92, lane: 164, ey: 124, wy: 145, sy: 128, dir: -1, busy: false, occ: [], last: [] },
    v: { xs: [80, 152, 224, 296], py: 270, lane: 196, ey: 236, wy: 222, sy: 246, dir: 1, busy: false, occ: [], last: [] }
  };
  var cars = [], walkers = [], clock = 0, nextAt = 1200;

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function place(el, x, y, r) { el.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + r.toFixed(1) + ')'); }
  function mkCar(color) {
    var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'pks-car'); g.style.color = color;
    var u = document.createElementNS(NS, 'use'); u.setAttribute('href', '#pkcar');
    u.setAttribute('x', -30); u.setAttribute('y', -15); u.setAttribute('width', 60); u.setAttribute('height', 30);
    g.appendChild(u); carLayer.appendChild(g); return g;
  }

  /* adopt the cars already drawn in the markup */
  Array.prototype.forEach.call(carLayer.querySelectorAll('.pks-car'), function (el) {
    var L = lots[el.dataset.lot], s = +el.dataset.slot;
    var c = { el: el, lot: el.dataset.lot, slot: s, color: el.style.color, parkedAt: -rnd(7000, 20000), moving: false };
    L.occ[s] = c; cars.push(c);
  });

  /* ---- paths ---- */
  function bez(p0, p1, p2, n, out) {
    for (var i = 1; i <= n; i++) {
      var t = i / n, u = 1 - t;
      out.push([u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]);
    }
  }
  function build(pts, r0, r1) {
    /* pts -> {x,y,r,d}[] ; heading from tangent, unwrapped; first/last heading forced */
    var out = [], d = 0, prev = r0;
    for (var i = 0; i < pts.length; i++) {
      var r;
      if (i === 0) r = r0;
      else if (i === pts.length - 1) r = r1;
      else {
        var a = pts[i + 1], b = pts[i - 1];
        r = Math.atan2(a[1] - b[1], a[0] - b[0]) * 180 / Math.PI;
      }
      while (r - prev > 180) r -= 360;
      while (r - prev < -180) r += 360;
      prev = r;
      if (i) d += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      out.push({ x: pts[i][0], y: pts[i][1], r: r, d: d });
    }
    return out;
  }
  function pathIn(L, xs) {
    var s = [-50, L.lane], c = [xs, L.lane], e = [xs, L.ey], p = [s], R = L.dir < 0 ? -90 : 90;
    p.push([xs - 40, L.lane]);
    bez([xs - 40, L.lane], c, e, 10, p);
    p.push([xs, L.py]);
    return build(p, 0, R);
  }
  function pathOut(L, xs) {
    var R = L.dir < 0 ? -90 : 90, p = [[xs, L.py], [xs, L.ey]];
    bez([xs, L.ey], [xs, L.lane], [xs - 40, L.lane], 10, p);
    p.push([-70, L.lane]);
    return build(p, R, 180 * (L.dir < 0 ? -1 : 1));
  }
  function at(path, d) {
    for (var i = 1; i < path.length; i++) if (d <= path[i].d) {
      var a = path[i - 1], b = path[i], t = b.d === a.d ? 1 : (d - a.d) / (b.d - a.d);
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, r: a.r + (b.r - a.r) * t };
    }
    var l = path[path.length - 1]; return { x: l.x, y: l.y, r: l.r };
  }
  function ease(p) { return 0.5 * p + 0.5 * (0.5 - Math.cos(Math.PI * p) / 2); }

  /* ---- trips ---- */
  function walkersClear(side, xs) {
    return walkers.every(function (w) { return w.side !== side || w.x > xs + GAP; });
  }
  function startTrip(car, path, kind) {
    var L = lots[car.lot];
    L.busy = true; car.moving = true;
    car.trip = { path: path, len: path[path.length - 1].d, t: 0, dur: path[path.length - 1].d / SPEED * 1000, kind: kind };
  }
  function spawn() {
    var sides = Math.random() < .5 ? ['m', 'v'] : ['v', 'm'];
    for (var k = 0; k < sides.length; k++) {
      var key = sides[k], L = lots[key];
      if (L.busy) continue;
      var free = [], parked = [];
      L.xs.forEach(function (x, i) {
        if (!L.occ[i]) free.push(i);
        else if (!L.occ[i].moving && clock - L.occ[i].parkedAt > MIN_PARK && L.last.indexOf(L.occ[i]) < 0) parked.push(L.occ[i]);
      });
      var count = L.xs.length - free.length;
      var canIn = free.length > 1 || (free.length === 1 && count === 0);
      var canOut = count >= 2 && parked.length > 0;
      var opts = [];
      if (canIn) opts.push('in');
      if (canOut) opts.push('out');
      if (!opts.length) continue;
      var kind = pick(opts);
      if (count <= 1) kind = canIn ? 'in' : kind;
      if (count >= L.xs.length - 1 && canOut) kind = 'out';
      if (kind === 'in') {
        var slots = free.filter(function (i) { return walkersClear(key, L.xs[i]); });
        if (!slots.length) continue;
        var si = pick(slots), col = pick(COLORS);
        var car = { el: mkCar(col), lot: key, slot: si, color: col, parkedAt: 0, moving: false };
        place(car.el, -50, L.lane, 0);
        L.occ[si] = car; cars.push(car);
        startTrip(car, pathIn(L, L.xs[si]), 'in');
        return;
      } else {
        var cand = parked.filter(function (c) { return walkersClear(key, L.xs[c.slot]); });
        if (!cand.length) continue;
        var cr = pick(cand);
        L.last.push(cr); if (L.last.length > 2) L.last.shift();
        startTrip(cr, pathOut(L, L.xs[cr.slot]), 'out');
        return;
      }
    }
  }
  function endTrip(car) {
    var L = lots[car.lot], t = car.trip;
    car.moving = false; L.busy = false; car.trip = null;
    if (t.kind === 'in') {
      car.parkedAt = clock; L.last.push(car); if (L.last.length > 2) L.last.shift();
      addWalker(car.lot, L.xs[car.slot]);
    } else {
      L.occ[car.slot] = null;
      cars.splice(cars.indexOf(car), 1);
      carLayer.removeChild(car.el);
    }
  }

  /* ---- walkers ---- */
  function addWalker(side, xs) {
    var L = lots[side], g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'pks-wk');
    g.innerHTML = '<circle r="7" cy="-9"></circle><rect x="-5" y="-3" width="10" height="14" rx="5" fill="' + pick(SHIRTS) + '"></rect>';
    wkLayer.appendChild(g);
    var x0 = xs + 22, pts = side === 'm'
      ? [[x0, L.sy], [x0 + 6, L.wy], [766, L.wy], [782, 172], [782, 178]]
      : [[x0, L.sy], [x0 + 6, L.wy], [770, L.wy], [782, 202], [782, 196]];
    var d = 0, path = pts.map(function (p, i) { if (i) d += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]); return { x: p[0], y: p[1], r: 0, d: d }; });
    var w = { el: g, side: side, path: path, len: d, d: 0, x: x0, ph: Math.random() * 6 };
    walkers.push(w); drawWalker(w);
  }
  function drawWalker(w) {
    var p = at(w.path, w.d); w.x = p.x;
    var bob = Math.abs(Math.sin(w.d / 7 + w.ph)) * -1.6;
    place(w.el, p.x, p.y + bob, 0);
    var o = Math.min(1, w.d / 14, (w.len - w.d) / 18);
    w.el.style.opacity = Math.max(0, o).toFixed(2);
  }

  /* ---- loop ---- */
  var running = false, visible = false, last = 0;
  function frame(now) {
    if (!running) return;
    var dt = Math.min(now - last, 50); last = now; clock += dt;
    if (clock >= nextAt) { spawn(); nextAt = clock + rnd(900, 2200); }
    var gateOpen = false;
    cars.forEach(function (c) {
      if (!c.trip) return;
      var t = c.trip; t.t += dt;
      var p = Math.min(1, t.t / t.dur), q = at(t.path, ease(p) * t.len);
      place(c.el, q.x, q.y, q.r);
      if (c.lot === 'm' && q.x > -10 && q.x < 190) gateOpen = true;
      if (p >= 1) endTrip(c);
    });
    for (var i = walkers.length - 1; i >= 0; i--) {
      var w = walkers[i]; w.d += WSPEED * dt / 1000;
      if (w.d >= w.len) { wkLayer.removeChild(w.el); walkers.splice(i, 1); } else drawWalker(w);
    }
    if (arm) arm.classList.toggle('open', gateOpen);
    requestAnimationFrame(frame);
  }
  function sync() {
    var want = visible && !document.hidden;
    if (want && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
    else if (!want) running = false;
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; sync(); }, { threshold: 0.15 }).observe(scene);
  } else { visible = true; }
  document.addEventListener('visibilitychange', sync);
  sync();
})();
