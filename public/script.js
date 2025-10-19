// Update CSS variables for the cursor spotlight and touch support.
(function () {
  const root = document.documentElement;
  let raf = null;
  let last = { x: -1000, y: -1000 };

  function updateVars(x, y) {
    last.x = x;
    last.y = y;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      root.style.setProperty('--mouse-x', `${last.x}px`);
      root.style.setProperty('--mouse-y', `${last.y}px`);
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
  }

  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('touchmove', onPointer, { passive: true });
  window.addEventListener('mouseleave', onLeave);
  window.addEventListener('blur', onLeave);
})();
