/* Original canvas implementation of a white, spring-following cursor trail. */
(() => {
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  canvas.className = 'smooth-cursor';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }
  const settings = {pointsCount: 40, lineWidth: .3, springStrength: .4, dampening: .5};
  const points = Array.from({length: settings.pointsCount}, () => ({x: 0, y: 0, vx: 0, vy: 0}));
  let target = {x: 0, y: 0}, frame = 0, last = 0, accumulator = 0, active = false;
  let initialized = false, width = innerWidth, height = innerHeight;
  const allowed = () => fine.matches && !reduced.matches && !document.hidden;
  const clear = () => ctx.clearRect(0, 0, width, height);
  function stop() {
    cancelAnimationFrame(frame); frame = 0; active = false; initialized = false;
    last = 0; accumulator = 0; clear();
  }
  function resize() {
    width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    stop();
  }
  function step() {
    let energy = 0;
    points.forEach((p, i) => {
      const lead = i ? points[i - 1] : target;
      p.vx = (p.vx + (lead.x - p.x) * settings.springStrength) * settings.dampening;
      p.vy = (p.vy + (lead.y - p.y) * settings.springStrength) * settings.dampening;
      p.x += p.vx; p.y += p.vy;
      energy += Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(lead.x - p.x) + Math.abs(lead.y - p.y);
    });
    return energy;
  }
  function render(now) {
    frame = 0;
    if (!active || !allowed()) { stop(); return; }
    accumulator += last ? Math.min(now - last, 50) : 16.67;
    last = now;
    let energy = Infinity;
    while (accumulator >= 1000 / 60) { energy = step(); accumulator -= 1000 / 60; }
    clear();
    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1], p = points[i], next = points[i + 1];
      ctx.lineWidth = Math.max(settings.lineWidth, (points.length - i) * settings.lineWidth);
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo((prev.x + p.x) / 2, (prev.y + p.y) / 2);
      ctx.quadraticCurveTo(p.x, p.y, (p.x + next.x) / 2, (p.y + next.y) / 2);
      ctx.stroke();
    }
    if (energy < .06) { clear(); last = 0; return; }
    frame = requestAnimationFrame(render);
  }
  document.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || !allowed() || e.target.closest?.('video, input, textarea, [contenteditable="true"]') || document.querySelector('dialog[open]')) { stop(); return; }
    target.x = e.clientX; target.y = e.clientY;
    if (!initialized) { points.forEach(p => Object.assign(p, target, {vx: 0, vy: 0})); initialized = true; }
    active = true;
    if (!frame) frame = requestAnimationFrame(render);
  }, {passive: true});
  document.documentElement.addEventListener('pointerleave', stop);
  document.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') stop(); }, {passive: true});
  window.addEventListener('blur', stop);
  document.addEventListener('visibilitychange', stop);
  window.addEventListener('resize', resize, {passive: true});
  fine.addEventListener('change', stop); reduced.addEventListener('change', stop);
  resize();
})();
