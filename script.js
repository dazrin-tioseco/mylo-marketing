// ===================== mobile nav =====================
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

// ===================== header shadow on scroll =====================
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.style.borderBottomColor = window.scrollY > 8 ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.06)';
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ===================== scroll-reveal bounce-in =====================
const revealEls = document.querySelectorAll('.bounce-in');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

// ===================== gallery lightbox =====================
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImg = lightbox.querySelector('img');
  const lbCap = lightbox.querySelector('.lightbox-cap');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  const openLightbox = (src, caption) => {
    lbImg.src = src;
    lbImg.alt = caption || '';
    lbCap.textContent = caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      openLightbox(img.src, item.getAttribute('data-caption'));
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}

// ===================== tier -> contact prefill =====================
document.querySelectorAll('[data-tier-request]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const tier = btn.getAttribute('data-tier-request');
    e.preventDefault();
    window.location.href = `contact.html?tier=${encodeURIComponent(tier)}`;
  });
});

// ===================== contact form =====================
const form = document.getElementById('contact-form');
if (form) {
  // prefill message if arriving from a tier "request this tier" button
  const params = new URLSearchParams(window.location.search);
  const tier = params.get('tier');
  if (tier) {
    const msg = form.querySelector('#message');
    if (msg && !msg.value) {
      msg.value = `Hi Mylo Marketing team, I'd like to ask about the ${tier} Tier package for my upcoming event. Here are a few details:\n\nEvent date:\nEvent location:\nGuest count:\n`;
    }
  }

  const status = document.getElementById('form-status');

  const showError = (field, message) => {
    const wrap = field.closest('.field');
    wrap.classList.add('invalid');
    wrap.querySelector('small.err').textContent = message;
  };
  const clearError = (field) => {
    const wrap = field.closest('.field');
    wrap.classList.remove('invalid');
  };

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('input', (e) => {
    if (e.target.matches('input, textarea')) clearError(e.target);
  });

  form.addEventListener('submit', (e) => {
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    let valid = true;

    if (!name.value.trim()) { showError(name, 'Please enter your name.'); valid = false; }
    if (!email.value.trim() || !emailRe.test(email.value.trim())) { showError(email, 'Please enter a valid email address.'); valid = false; }
    if (!message.value.trim() || message.value.trim().length < 10) { showError(message, 'Please add a few details about your event (10+ characters).'); valid = false; }

    if (!valid) {
      e.preventDefault();
      status.textContent = 'Please fix the highlighted fields before sending.';
      status.className = 'form-status bad show';
      return;
    }

    status.textContent = 'Sending your message…';
    status.className = 'form-status ok show';
    // form submission continues on to FormSubmit (see contact.html form action)
  });
}
