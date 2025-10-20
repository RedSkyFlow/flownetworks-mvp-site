// --- Navbar scroll effect ---
const navbar = document.getElementById('navbar');
window.onscroll = () => {
    if (window.scrollY > 50) {
        navbar.classList.add('bg-background-secondary/90', 'border-primary/20');
    } else {
        navbar.classList.remove('bg-background-secondary/90', 'border-primary/20');
    }
};

// --- Mobile menu toggle ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
         mobileMenu.classList.add('hidden');
    });
});

// --- Dynamic CTA Form Handling ---
const contactHeading = document.getElementById('contact-heading');
const contactSubheading = document.getElementById('contact-subheading');
const submitButton = document.getElementById('submit-button');
const ctaSourceInput = document.getElementById('cta_source');
const businessNameField = document.getElementById('business_name_field');

const ctaConfigs = {
    'default': { 
        heading: "Don't Just Connect. Understand. Start for Free Today.", 
        subheading: "Start for free today—no credit card, no obligation.", 
        buttonText: "Start Your Free Connect Plan", 
        ctaValue: "Start Free Plan (Default)", 
        showFields: [] 
    },
    'Start Free Plan': { 
        heading: "Start Your Free Connect Plan", 
        subheading: "Fill out the form to activate your free 'Connect' plan. No credit card, no obligation.", 
        buttonText: "Activate My Free Plan", 
        ctaValue: "Start Free Plan", 
        showFields: [] 
    },
    'Schedule Review': { // New CTA from Blueprint
        heading: "Schedule a 15-Minute Technical Review",
        subheading: "Let's discuss your existing tech stack and identify key integration points.",
        buttonText: "Schedule Technical Review",
        ctaValue: "Schedule Technical Review",
        showFields: [businessNameField]
    },
    'Strategy Call': { // New CTA from Blueprint
        heading: "Book a 15-Minute Strategy Call",
        subheading: "Ready to transform your physical space? Let's talk strategy.",
        buttonText: "Book Strategy Call",
        ctaValue: "Strategy Call",
        showFields: [businessNameField]
    },
    'Get Started': { // Original CTA from pricing table
        heading: "Let's Get Started", 
        subheading: "Tell us about your venue, and we'll recommend the perfect plan for your goals.", 
        buttonText: "Send Inquiry", 
        ctaValue: "Plan Inquiry", 
        showFields: [businessNameField] 
    },
    'Request Consultation': { // Original CTA from pricing table
        heading: "Request an Enterprise Consultation", 
        subheading: "Let's discuss a custom 'Enterprise' solution with the full power of the Flow AI Gateway.", 
        buttonText: "Request Consultation", 
        ctaValue: "Enterprise Consultation", 
        showFields: [businessNameField] 
    }
};

function updateFormForCTA(ctaType = 'default') {
    const config = ctaConfigs[ctaType] || ctaConfigs['default'];
    
    // Ensure elements exist before trying to set textContent
    if (contactHeading) contactHeading.textContent = config.heading;
    if (contactSubheading) contactSubheading.textContent = config.subheading;
    if (submitButton) submitButton.textContent = config.buttonText;
    if (ctaSourceInput) ctaSourceInput.value = config.ctaValue;
    
    [businessNameField].forEach(field => {
        if (field) field.style.display = 'none';
    });
    config.showFields.forEach(field => {
        if (field) field.style.display = 'block';
    });
}

document.querySelectorAll('a[href="#contact"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const ctaType = e.currentTarget.dataset.ctaType;
        updateFormForCTA(ctaType);
        // Scroll behavior is handled natively by the anchor link
    });
});

// Set the default form state on load
updateFormForCTA('default');


// --- SCRIPT.JS CONTENT (TUNED PER YOUR REQUEST) ---

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
      // --- UPDATED: Removed 'important' ---
      root.style.setProperty('--mouse-x', `${last.x}px`);
      root.style.setProperty('--mouse-y', `${last.y}px`);
      
      // --- UPDATED: Removed debug element logic ---
      raf = null;
    });
  }

  function onPointer(e) {
    if (e.touches && e.touches[0]) {
      updateVars(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.clientX !== undefined && e.clientY !== undefined) {
      updateVars(e.clientX, e.clientY);
    }
  }

  function onLeave() {
    updateVars(-1000, -1000);
    // --- UPDATED: Removed debug element logic ---
  }

  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('touchmove', onPointer, { passive: true });
  window.addEventListener('mouseleave', onLeave);
  window.addEventListener('blur', onLeave);
})();

// Expose a small helper for manual testing from the console (as requested)
try {
  window.__setMouseVar = function (x, y) {
    if (!document || !document.documentElement) return;
    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${y}px`);
    console.info('[spotlight] __setMouseVar set to', x, y);
  };
} catch (e) {
  // ignore
}

// --- UPDATED: Tuned Particle System ---
(function () {
  let canvas = null;
  let ctx = null;
  let w = 0, h = 0, particles = [];
  
  // Brand Hues: 176 (Primary), 205 (Secondary), 40 (Accent)
  const primaryHue = 176;
  const secondaryHue = 205;
  const accentHue = 40;

  function resize() {
    if (!canvas) return;
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function makeParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      
      // --- UPDATED: Hue logic ---
      // 1 in 12 chance for Accent, otherwise 50/50 Primary/Secondary
      let hue;
      const randCheck = rand(0, 12);
      if (randCheck < 1) {
        hue = accentHue; // ~8.3% chance of Accent Yellow
      } else if (randCheck < 6.5) {
        hue = rand(170, 185); // Primary Teal range
      } else {
        hue = rand(200, 215); // Secondary Blue range
      }

      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        // --- UPDATED: Velocities reduced by ~30% ---
        vx: rand(-0.14, 0.14),
        vy: rand(-0.035, 0.035),
        // --- UPDATED: Radius ---
        r: rand(0.4, 1.8),
        // --- UPDATED: Alpha ---
        alpha: rand(0.04, 0.16),
        hue: hue
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

      // --- Reverted to original draw logic (radial gradient) ---
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
    
    // --- UPDATED: Particle count (36-72) ---
    const area = (window.innerWidth * window.innerHeight) / (1366 * 768);
    const count = Math.min(72, Math.max(36, Math.round(48 * area))); // Tuned count
    
    makeParticles(count);
    loop();
  }

  window.addEventListener('resize', () => {
    resize();
    // --- UPDATED: Particle count (36-72) ---
    const area = (window.innerWidth * window.innerHeight) / (1366 * 768);
    const count = Math.min(72, Math.max(36, Math.round(48 * area)));
    makeParticles(count);
  });

  // Start after DOM ready so the canvas element exists
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 0);
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }
})();