/* ============================================================
   Script.js — Carlos Ledesma Portfolio
   Handles: custom cursor, scroll-reveal, mobile menu, contact form
   ============================================================ */

(function () {

  // ---- CUSTOM CURSOR ----
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let rafId;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    function animateRing() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      rafId = requestAnimationFrame(animateRing);
    }

    animateRing();

    document.addEventListener('mouseleave', () => {
      document.body.classList.add('cursor-hidden');
    });

    document.addEventListener('mouseenter', () => {
      document.body.classList.remove('cursor-hidden');
    });

    // Grow ring on hoverable elements
    const hoverables = 'a, button, [role="button"], .project-item, .chip';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }


  // ---- SCROLL REVEAL ----
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealItems.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(el => io.observe(el));
  } else {
    // fallback: show all immediately
    revealItems.forEach(el => el.classList.add('visible'));
  }


  // ---- MOBILE MENU ----
  const menuBtn  = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open);
      // prevent body scroll when menu open
      document.body.style.overflow = open ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }


  // ---- CONTACT FORM ----
  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn  = document.getElementById('submitBtn');

  if (form && submitBtn) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;

      const data = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
        .then(res => {
          if (res.ok) {
            form.reset();
            submitBtn.textContent = '¡Enviado!';
            if (successMsg) successMsg.classList.add('visible');
          } else {
            submitBtn.textContent = 'Error — intenta de nuevo';
            submitBtn.disabled = false;
          }
        })
        .catch(() => {
          submitBtn.textContent = 'Sin conexión';
          submitBtn.disabled = false;
        });
    });
  }

  // ---- THEME TOGGLE (ripple from button) ----
  const html     = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('cl-theme', theme);
    if (themeBtn) {
      themeBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
    }
  }

  // Restore saved preference (anti-flash inline script already applied it,
  // but we still need aria-label to reflect current state)
  applyTheme(html.getAttribute('data-theme') || 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const current  = html.getAttribute('data-theme') || 'dark';
      const next     = current === 'dark' ? 'light' : 'dark';

      // --- Position: center of the button ---
      const rect = themeBtn.getBoundingClientRect();
      const rx   = Math.round(rect.left + rect.width  / 2);
      const ry   = Math.round(rect.top  + rect.height / 2);

      // --- Create overlay ---
      const overlay = document.createElement('div');
      overlay.classList.add('theme-ripple', `theme-ripple--to-${next}`);
      overlay.style.setProperty('--rx', rx + 'px');
      overlay.style.setProperty('--ry', ry + 'px');
      document.body.appendChild(overlay);

      // Disable button during animation
      themeBtn.disabled = true;

      // Force reflow so the initial clip-path (circle 0) is painted
      overlay.getBoundingClientRect();

      // --- Expand ripple ---
      overlay.classList.add('theme-ripple--expand');

      overlay.addEventListener('transitionend', function onExpanded() {
        overlay.removeEventListener('transitionend', onExpanded);

        // Switch theme now that the new background covers everything
        applyTheme(next);

        // Fade out overlay to reveal the freshly-themed page
        overlay.style.transition = 'opacity 0.22s ease';
        overlay.style.opacity = '0';

        setTimeout(() => {
          overlay.remove();
          themeBtn.disabled = false;
        }, 240);
      });
    });
  }

})();