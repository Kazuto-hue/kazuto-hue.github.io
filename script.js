/**
 * ============================================================
 *  Dark Fantasy Sci-Fi Portfolio — Main Script
 *  Vanilla JS · No dependencies
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------
   * 0.  CACHED SELECTORS & CONSTANTS
   * ------------------------------------------------------ */
  const NAVBAR_OFFSET   = 70;                       // fixed navbar height in px
  const SECTION_IDS     = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
  const sections        = SECTION_IDS.map(id => document.getElementById(id)).filter(Boolean);
  const navLinks        = document.querySelectorAll('.nav-links a[href^="#"]');
  const navbar          = document.querySelector('.navbar');
  const mobileToggle    = document.querySelector('.mobile-menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const heroSection     = document.querySelector('.hero');
  const heroImage       = document.querySelector('.hero img, .hero .hero-image');
  const contactForm     = document.getElementById('contactForm');

  /* --------------------------------------------------------
   * 1.  SMOOTH SCROLL FOR ANCHOR LINKS
   * ------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;                  // skip bare '#'

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* --------------------------------------------------------
   * 2.  ACTIVE NAV LINK HIGHLIGHTING ON SCROLL
   * ------------------------------------------------------ */
  function highlightActiveNav() {
    const scrollPos = window.scrollY + NAVBAR_OFFSET + 1; // +1 to avoid rounding issues

    let currentSection = sections[0]; // default to first section
    for (const section of sections) {
      if (section.offsetTop <= scrollPos) {
        currentSection = section;
      }
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection.id}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav, { passive: true });
  highlightActiveNav(); // run once on load

  /* --------------------------------------------------------
   * 3.  SCROLL ANIMATIONS (Intersection Observer)
   *     Elements with .animate-on-scroll receive .visible
   *     once they enter the viewport (threshold 15%).
   *     We unobserve after triggering for performance.
   * ------------------------------------------------------ */
  const animatedEls = document.querySelectorAll('.animate-on-scroll');

  if (animatedEls.length) {
    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);          // fire once, then stop watching
        }
      });
    }, { threshold: 0.15 });

    animatedEls.forEach(el => scrollObserver.observe(el));
  }

  /* --------------------------------------------------------
   * 4.  MOBILE MENU TOGGLE (hamburger ↔ X)
   * ------------------------------------------------------ */
  if (mobileToggle && navLinksContainer) {
    // Hamburger SVG & X SVG (inline for zero-dependency icons)
    const ICON_HAMBURGER = `<span class="hamburger-icon">&#9776;</span>`;  // ☰
    const ICON_CLOSE     = `<span class="close-icon">&times;</span>`;      // ×

    mobileToggle.innerHTML = ICON_HAMBURGER;

    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('active');
      mobileToggle.innerHTML = isOpen ? ICON_CLOSE : ICON_HAMBURGER;
    });

    // Close the mobile menu when any nav link is clicked
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        mobileToggle.innerHTML = ICON_HAMBURGER;
      });
    });
  }

  /* --------------------------------------------------------
   * 5.  NAV CARD CLICK NAVIGATION
   *     .nav-card elements with data-target="sectionId"
   * ------------------------------------------------------ */
  document.querySelectorAll('.nav-card[data-target]').forEach(card => {
    card.style.cursor = 'pointer';                   // visual affordance

    card.addEventListener('click', () => {
      const target = document.getElementById(card.dataset.target);
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* --------------------------------------------------------
   * 6.  NAVBAR BACKGROUND ON SCROLL
   *     Adds .scrolled class when scrolled past 50 px
   * ------------------------------------------------------ */
  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // initial check

  /* --------------------------------------------------------
   * 7.  CONTACT FORM HANDLING
   *     Sends form data via AJAX to Web3Forms and displays success/error states
   * ------------------------------------------------------ */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn    = contactForm.querySelector('button[type="submit"], input[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Send Message →';

      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled    = true;
      }

      const formData = new FormData(contactForm);
      const object   = Object.fromEntries(formData);
      const json     = JSON.stringify(object);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        const res = await response.json();
        if (response.status === 200) {
          if (submitBtn) {
            submitBtn.textContent = '✓ Message sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)'; // Success green
          }
          contactForm.reset();
        } else {
          console.error(res);
          if (submitBtn) {
            submitBtn.textContent = '✗ Failed to send';
            submitBtn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)'; // Error red
          }
        }
      })
      .catch((error) => {
        console.error(error);
        if (submitBtn) {
          submitBtn.textContent = '✗ Error occurred';
          submitBtn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)'; // Error red
        }
      })
      .finally(() => {
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled    = false;
            submitBtn.style.background = ''; // reset to CSS default
          }
        }, 3000);
      });
    });
  }

  /* --------------------------------------------------------
   * 8.  CURSOR BLINK ON HERO TAGLINE
   *     Appends a blinking cursor span to .tagline
   * ------------------------------------------------------ */
  const tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    const cursor  = document.createElement('span');
    cursor.classList.add('blinking-cursor');
    cursor.textContent = '|';

    // Inject minimal style for the blink animation
    const style = document.createElement('style');
    style.textContent = `
      .blinking-cursor {
        font-weight: 100;
        font-size: 1em;
        color: #00f0ff;
        animation: blink-caret 1s step-end infinite;
        margin-left: 2px;
      }
      @keyframes blink-caret {
        0%, 100% { opacity: 1; }
        50%      { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    tagline.appendChild(cursor);
  }

  /* --------------------------------------------------------
   * 9.  PARALLAX-LIKE EFFECT ON HERO IMAGE
   *     Moves the hero image opposite to mouse direction
   * ------------------------------------------------------ */
  if (heroSection && heroImage) {
    const PARALLAX_STRENGTH = 20; // max px shift

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      // Normalise mouse position to -1 … +1 relative to center
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

      // Translate opposite to cursor for parallax feel
      heroImage.style.transform =
        `translate(${-x * PARALLAX_STRENGTH}px, ${-y * PARALLAX_STRENGTH}px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroImage.style.transform = 'translate(0, 0)';
      heroImage.style.transition = 'transform 0.5s ease-out';
      // Remove transition after it completes so mousemove stays snappy
      setTimeout(() => { heroImage.style.transition = ''; }, 500);
    });
  }

  /* --------------------------------------------------------
   * 10. PARTICLE / STAR CANVAS BACKGROUND
   *     ~80 glowing dots drifting upward inside .hero
   * ------------------------------------------------------ */
  if (heroSection) {
    // --- Create & style the canvas ---
    const canvas  = document.createElement('canvas');
    canvas.classList.add('star-canvas');
    Object.assign(canvas.style, {
      position:       'absolute',
      top:            '0',
      left:           '0',
      width:          '100%',
      height:         '100%',
      zIndex:         '0',
      pointerEvents:  'none'    // let clicks pass through
    });

    // Ensure the hero can contain absolutely-positioned children
    if (getComputedStyle(heroSection).position === 'static') {
      heroSection.style.position = 'relative';
    }
    heroSection.prepend(canvas);                     // behind other hero content

    const ctx = canvas.getContext('2d');

    // --- Particle pool ---
    const STAR_COUNT = 80;
    const COLORS     = ['rgba(255,255,255,', 'rgba(0,240,255,'];   // white & cyan
    let stars        = [];

    function randomStar(forceBottom = false) {
      const colorBase = COLORS[Math.random() < 0.6 ? 0 : 1];     // 60 % white, 40 % cyan
      const opacity   = 0.2 + Math.random() * 0.8;                // 0.2 – 1.0
      const radius    = 0.5 + Math.random() * 2;                  // 0.5 – 2.5 px
      return {
        x:       Math.random() * canvas.width,
        y:       forceBottom ? canvas.height + Math.random() * 40 : Math.random() * canvas.height,
        r:       radius,
        speed:   0.15 + Math.random() * 0.45,                     // px / frame
        drift:   (Math.random() - 0.5) * 0.3,                     // slight horizontal wander
        color:   `${colorBase}${opacity.toFixed(2)})`,
        glow:    `${colorBase}${(opacity * 0.4).toFixed(2)})`      // softer glow ring
      };
    }

    function initStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(randomStar(false));
      }
    }

    // --- Resize handler ---
    function resizeCanvas() {
      canvas.width  = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
      initStars();
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // --- Animation loop ---
    let animationId;

    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Glow ring
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = s.glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();

        // Move upward + slight drift
        s.y -= s.speed;
        s.x += s.drift;

        // Recycle star when it drifts off screen
        if (s.y < -5 || s.x < -5 || s.x > canvas.width + 5) {
          stars[i] = randomStar(true);
        }
      }

      animationId = requestAnimationFrame(drawStars);
    }

    drawStars();

    // Pause when hero is off-screen to save GPU cycles
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationId) drawStars();
        } else {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      });
    }, { threshold: 0 });

    heroObserver.observe(heroSection);
  }

}); // end DOMContentLoaded
