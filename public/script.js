// Update CSS variables for the cursor spotlight and touch support.
(function () {
  const root = document.documentElement;
  let raf = null;
  let last = { x: -1000, y: -1000 };

  function updateVars(x, y) {
    last.x = x;
    last.y = y;
    // If a RAF is already queued, we'll update `last` and let that RAF flush
    if (raf) return;
    raf = requestAnimationFrame(() => {
      // Debug log so we can see values being written
      try {
        console.debug('[spotlight] setting css vars', last.x, last.y);
      } catch (e) { /* ignore when console.debug isn't available */ }
      // Use the priority arg to set as !important in case a stylesheet rule
      // is unintentionally overriding the inline value during tests.
      root.style.setProperty('--mouse-x', `${last.x}px`, 'important');
      root.style.setProperty('--mouse-y', `${last.y}px`, 'important');
      // If a debug element exists, position and show it
      try {
        const dbg = document.getElementById('debug-spotlight');
        if (dbg) {
          dbg.style.display = 'block';
          dbg.style.left = `${last.x}px`;
          dbg.style.top = `${last.y}px`;
          dbg.style.opacity = '0.95';
        }
      } catch (e) { /* ignore */ }
      raf = null;
    });
  }

  function onPointer(e) {
    // support PointerEvent and TouchEvent
    if (e.touches && e.touches[0]) {
      updateVars(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.clientX !== undefined && e.clientY !== undefined) {
      updateVars(e.clientX, e.clientY);
    }
  }

  function onLeave() {
    // move offscreen when pointer leaves
    updateVars(-1000, -1000);
    try {
      const dbg = document.getElementById('debug-spotlight');
      if (dbg) dbg.style.display = 'none';
    } catch (e) {}
  }

  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('touchmove', onPointer, { passive: true });
  window.addEventListener('mouseleave', onLeave);
  window.addEventListener('blur', onLeave);
})();

// Expose a small helper for manual testing from the console:
try {
  window.__setMouseVar = function (x, y) {
    if (!document || !document.documentElement) return;
    document.documentElement.style.setProperty('--mouse-x', `${x}px`, 'important');
    document.documentElement.style.setProperty('--mouse-y', `${y}px`, 'important');
    console.info('[spotlight] __setMouseVar set to', x, y);
  };
} catch (e) {
  // ignore
}

// Minimal background particle system (lightweight, subtle)
(function () {
  let canvas = null;
  let ctx = null;
  let w = 0, h = 0, particles = [];

  function resize() {
    if (!canvas) return;
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function makeParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: rand(-0.2, 0.2),
        vy: rand(-0.05, 0.05),
        r: rand(0.6, 2.6),
        alpha: rand(0.08, 0.32),
        hue: rand(170, 210)
      });
    }
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
      ctx.beginPath();
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      g.addColorStop(0, `hsla(${p.hue}, 80%, 60%, ${p.alpha})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(p.x - p.r * 6, p.y - p.r * 6, p.r * 12, p.r * 12);
    }
  }

  function loop() {
    draw();
    requestAnimationFrame(loop);
  }

  function init() {
    canvas = document.getElementById('particle-canvas');
    if (!canvas) return; // if still missing, bail
    ctx = canvas.getContext('2d');
    resize();
    // particle count scales with area but capped for perf
    const area = (window.innerWidth * window.innerHeight) / (1366 * 768);
    const count = Math.min(120, Math.max(24, Math.round(48 * area)));
    makeParticles(count);
    loop();
  }

  window.addEventListener('resize', () => {
    resize();
    makeParticles(Math.min(120, Math.max(24, Math.round(48 * ((window.innerWidth * window.innerHeight) / (1366 * 768))))));
  });

  // Start after DOM ready so the canvas element exists
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // run async to allow DOM mutation in case script executed before canvas insertion
    setTimeout(init, 0);
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }
})();
