  /* ============================================================
     EMAILJS CONFIGURATION — booking form
     ------------------------------------------------------------
     See EMAILJS_SETUP.md in the repo root for full step-by-step
     instructions. Quick version:
       1. Create a free account at https://www.emailjs.com
       2. Add an Email Service connected to
          balineaholidayhome@gmail.com → copy its Service ID below.
       3. Create an Email Template with these variables:
            {{from_name}}  {{from_email}}  {{phone}}
            {{room}}       {{checkin}}     {{checkout}}
          Set the template's "To email" to
          balineaholidayhome@gmail.com and "Reply To" to
          {{from_email}} → copy its Template ID below.
       4. In Account → General, copy your Public Key below.
     None of these three values are secret — EmailJS's public key
     model is designed to be used from client-side code.
     ============================================================ */
  const EMAILJS_PUBLIC_KEY  = '8kjTuYoyXGnlXagjI';
  const EMAILJS_SERVICE_ID  = 'service_yo97vqn';
  const EMAILJS_TEMPLATE_ID = 'template_u6ueapm';
  const EMAILJS_READY = !/^YOUR_/.test(EMAILJS_PUBLIC_KEY) && !/^YOUR_/.test(EMAILJS_SERVICE_ID) && !/^YOUR_/.test(EMAILJS_TEMPLATE_ID);
  if (window.emailjs && EMAILJS_READY) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  // Scroll reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.07, rootMargin: '0px 0px -36px 0px' });
  document.querySelectorAll('.fu,.fl,.fr').forEach(el => { if (!el.classList.contains('in')) io.observe(el); });

  // Nav solidify + sticky CTA
  const nav = document.getElementById('nav');
  const stickyCta = document.getElementById('sticky-cta');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', scrollY > 56);
    stickyCta.classList.toggle('up', scrollY > 400);
  }, { passive: true });

  // Mobile menu
  let mo = false;
  function closeMenu() {
    mo = false;
    document.getElementById('mmenu').style.display = 'none';
    document.getElementById('hb1').style.transform = '';
    document.getElementById('hb2').style.opacity = '1';
    document.getElementById('hb3').style.transform = '';
  }
  document.getElementById('ham').addEventListener('click', () => {
    mo = !mo;
    document.getElementById('mmenu').style.display = mo ? 'block' : 'none';
    document.getElementById('hb1').style.transform = mo ? 'translateY(6.5px) rotate(45deg)' : '';
    document.getElementById('hb2').style.opacity = mo ? '0' : '1';
    document.getElementById('hb3').style.transform = mo ? 'translateY(-6.5px) rotate(-45deg)' : '';
  });

  // Lightbox
  let lbImages = [], lbIdx = 0;
  const imgGroupMap = new WeakMap();

  function lbBuild() {
    // Each section gets its own navigation group
    const groupDefs = [
      { sel: '.g-about',     key: 'about'   },
      { sel: '.g-room',      key: 'deluxe'  },
      { sel: '.g-room-r',    key: 'suite'   },
      { sel: '#villa',       key: 'villa'   },
      { sel: '.g-gal',       key: 'gallery' },
      { sel: '#dining .g-3', key: 'dining'  },
    ];
    const groups = {};
    groupDefs.forEach(({ sel, key }) => {
      const c = document.querySelector(sel);
      if (!c) return;
      groups[key] = Array.from(c.querySelectorAll('.zw img, .gal-item img'));
      groups[key].forEach(img => imgGroupMap.set(img, groups[key]));
    });
    // Extra row: workdesk → deluxe, suite images → suite, parking → standalone
    const extra = document.getElementById('rooms-extra');
    if (extra) {
      extra.querySelectorAll('.zw img').forEach(img => {
        const src = decodeURIComponent(img.src);
        let g;
        if (/Deluxe|Workdesk/i.test(src)) g = groups.deluxe;
        else if (/Suite/i.test(src))       g = groups.suite;
        if (g && !g.includes(img)) g.push(img);
        imgGroupMap.set(img, g || [img]);
      });
    }
    document.querySelectorAll('.zw').forEach(el => {
      el.addEventListener('click', () => lbOpen(el));
    });
  }

  function lbOpen(el) {
    const img = el.querySelector('img');
    if (!img) return;
    lbImages = imgGroupMap.get(img) || [img];
    lbIdx = lbImages.indexOf(img);
    if (lbIdx === -1) lbIdx = 0;
    lbShow();
    document.getElementById('lb').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function lbShow() {
    const img = lbImages[lbIdx];
    document.getElementById('lb-img').src = img.src;
    document.getElementById('lb-img').alt = img.alt || '';
    document.getElementById('lb-counter').textContent = (lbIdx + 1) + ' / ' + lbImages.length;
  }

  function lbNav(dir) {
    lbIdx = (lbIdx + dir + lbImages.length) % lbImages.length;
    lbShow();
  }

  function lbClose() {
    document.getElementById('lb').classList.remove('open');
    if (document.getElementById('booking-modal').style.display !== 'block') {
      document.body.style.overflow = '';
    }
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { lbClose(); closeBooking(); }
    if (document.getElementById('lb').classList.contains('open')) {
      if (e.key === 'ArrowRight') lbNav(1);
      if (e.key === 'ArrowLeft') lbNav(-1);
    }
  });

  lbBuild();


  // Booking modal
  function openBooking(room) {
    const modal = document.getElementById('booking-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    if (room) document.getElementById('bk-room').value = room;
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bk-checkin').min = today;
    document.getElementById('bk-checkout').min = today;
    // Reset any leftover status/error state from a previous submission
    document.getElementById('bk-status').style.display = 'none';
    document.getElementById('bk-email-hint').style.display = 'none';
    document.getElementById('booking-form').querySelectorAll('.bk-err').forEach(el => el.classList.remove('bk-err'));
    const submitBtn = document.getElementById('bk-submit');
    submitBtn.disabled = false;
    document.getElementById('bk-submit-label').textContent = 'Confirm Booking';
  }

  function closeBooking() {
    const modal = document.getElementById('booking-modal');
    if (modal.style.display !== 'block') return;
    modal.style.display = 'none';
    document.getElementById('booking-form').reset();
    document.getElementById('bk-status').style.display = 'none';
    document.getElementById('bk-email-hint').style.display = 'none';
    if (!document.getElementById('lb').classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }

  document.getElementById('bk-checkin').addEventListener('change', function() {
    document.getElementById('bk-checkout').min = this.value;
    if (document.getElementById('bk-checkout').value && document.getElementById('bk-checkout').value <= this.value) {
      document.getElementById('bk-checkout').value = '';
    }
  });

  // Booking form — EmailJS submission
  const bookingForm  = document.getElementById('booking-form');
  const bkStatus     = document.getElementById('bk-status');
  const bkSubmitBtn  = document.getElementById('bk-submit');
  const bkSubmitLbl  = document.getElementById('bk-submit-label');
  const BK_FIELD_IDS = ['bk-name', 'bk-phone', 'bk-email', 'bk-email-confirm', 'bk-checkin', 'bk-checkout', 'bk-room'];

  function showBkStatus(kind, html) {
    bkStatus.style.display = 'block';
    bkStatus.innerHTML = html;
    if (kind === 'success') {
      bkStatus.style.background = 'rgba(46,125,70,.08)';
      bkStatus.style.border = '1px solid rgba(46,125,70,.35)';
      bkStatus.style.color = '#1f5c37';
    } else {
      bkStatus.style.background = 'rgba(180,40,40,.08)';
      bkStatus.style.border = '1px solid rgba(180,40,40,.35)';
      bkStatus.style.color = '#8a1f1f';
    }
  }

  function clearBkFieldErrors() {
    BK_FIELD_IDS.forEach(id => document.getElementById(id).classList.remove('bk-err'));
  }

  function markBkFieldError(id) {
    document.getElementById(id).classList.add('bk-err');
  }

  const CONTACT_FALLBACK = 'Please call or WhatsApp us at <a href="tel:+6282333933199" style="color:inherit;text-decoration:underline;">+62 823 3393 3199</a> instead.';

  // Live "emails match" hint as the guest types the confirmation field
  const bkEmailEl        = document.getElementById('bk-email');
  const bkEmailConfirmEl = document.getElementById('bk-email-confirm');
  const bkEmailHint      = document.getElementById('bk-email-hint');
  function checkEmailsMatchLive() {
    const a = bkEmailEl.value.trim().toLowerCase();
    const b = bkEmailConfirmEl.value.trim().toLowerCase();
    const mismatch = b.length > 0 && a !== b;
    bkEmailHint.style.display = mismatch ? 'block' : 'none';
    bkEmailConfirmEl.classList.toggle('bk-err', mismatch);
  }
  bkEmailEl.addEventListener('input', checkEmailsMatchLive);
  bkEmailConfirmEl.addEventListener('input', checkEmailsMatchLive);

  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearBkFieldErrors();
    bkStatus.style.display = 'none';

    const name          = document.getElementById('bk-name').value.trim();
    const phone         = document.getElementById('bk-phone').value.trim();
    const email         = document.getElementById('bk-email').value.trim();
    const emailConfirm  = document.getElementById('bk-email-confirm').value.trim();
    const checkin       = document.getElementById('bk-checkin').value;
    const checkout      = document.getElementById('bk-checkout').value;
    const room          = document.getElementById('bk-room').value;

    // Native required / type=email / type=date validation
    if (!bookingForm.reportValidity()) {
      BK_FIELD_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (!el.checkValidity()) markBkFieldError(id);
      });
      return;
    }

    // Cross-field check: the two email fields must match, so a typo doesn't
    // silently send the confirmation to the wrong address
    if (email.toLowerCase() !== emailConfirm.toLowerCase()) {
      markBkFieldError('bk-email');
      markBkFieldError('bk-email-confirm');
      bkEmailHint.style.display = 'block';
      showBkStatus('error', 'Please make sure both email fields match — this is the address we\'ll use to confirm your booking.');
      return;
    }

    // Cross-field check: check-out must be strictly after check-in
    if (new Date(checkout) <= new Date(checkin)) {
      markBkFieldError('bk-checkin');
      markBkFieldError('bk-checkout');
      showBkStatus('error', 'Check-out date must be after your check-in date.');
      return;
    }

    if (!EMAILJS_READY) {
      showBkStatus('error', 'Online booking isn\'t fully set up yet. ' + CONTACT_FALLBACK);
      return;
    }

    const fmt = d => { const [y, m, day] = d.split('-'); return day + '.' + m + '.' + y; };

    bkSubmitBtn.disabled = true;
    bkSubmitLbl.textContent = 'Sending…';

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:  name,
      from_email: email,
      phone:      phone,
      room:       room,
      checkin:    fmt(checkin),
      checkout:   fmt(checkout)
    }).then(function () {
      showBkStatus('success', '✓ Thank you, ' + (name.split(' ')[0] || name) + '! Your booking request has been sent — we\'ll confirm within 24 hours.');
      bkSubmitLbl.textContent = 'Sent ✓';
      bookingForm.reset();
      setTimeout(closeBooking, 4000);
    }).catch(function (err) {
      console.error('EmailJS error:', err);
      showBkStatus('error', 'Something went wrong sending your request. ' + CONTACT_FALLBACK);
      bkSubmitBtn.disabled = false;
      bkSubmitLbl.textContent = 'Confirm Booking';
    });
  });

  // Intro popup (home page only — inner pages don't include this markup)
  (function() {
    const intro = document.getElementById('intro');
    if (!intro) return;
    const slides  = document.querySelectorAll('.i-slide');
    const content = document.getElementById('intro-content');
    const deco    = document.getElementById('intro-deco');
    let cur = 0, closed = false;

    document.body.style.overflow = 'hidden';

    // Animate text in after short delay
    setTimeout(() => { content.classList.add('visible'); deco.classList.add('visible'); }, 300);

    // Cycle background images
    const cycle = setInterval(() => {
      slides[cur].classList.remove('i-active');
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add('i-active');
    }, 3800);

    function introClose() {
      if (closed) return;
      closed = true;
      clearInterval(cycle);
      intro.classList.add('closing');
      document.body.style.overflow = '';
      setTimeout(() => { intro.style.display = 'none'; }, 1250);
    }

    intro.addEventListener('click', introClose);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') introClose(); });
  })();
