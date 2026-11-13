// TechByGrace: menu, project filter, scroll reveal, active nav, cursor light, lightbox, mailto form.
(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  var menuBtn = document.querySelector('.menu-btn');
  function setMenu(open) {
    root.classList.toggle('nav-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', function () { setMenu(!root.classList.contains('nav-open')); });
  document.querySelectorAll('#site-nav a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Project filter (a card can be in several categories: data-c="fe db")
  var filterBtns = document.querySelectorAll('.filters button');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.dataset.filter;
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      document.querySelectorAll('#project-grid .card').forEach(function (card) {
        card.hidden = cat !== 'all' && card.dataset.c.split(' ').indexOf(cat) === -1;
      });
    });
  });

  // In-page links to a project card hidden by the filter: show all projects first
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var target = document.getElementById(a.hash.slice(1));
      if (target && target.hidden) document.querySelector('.filters [data-filter="all"]').click();
    });
  });

  // Fade-up on scroll
  if (!reduceMotion && 'IntersectionObserver' in window) {
    root.classList.add('reveal-ready');
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal, .sec-title').forEach(function (el) { revealer.observe(el); });
  }

  // Typing headline: types, pauses, deletes, moves to the next line. Reduced motion: first line, static.
  var typed = document.querySelector('.typed');
  if (typed) {
    var lines = typed.dataset.lines.split('|');
    root.classList.add('typing');
    if (reduceMotion) {
      root.classList.add('typed-static');
      typed.textContent = lines[0];
    } else {
      var li = 0, ci = 0, deleting = false;
      (function tick() {
        var line = lines[li];
        ci += deleting ? -1 : 1;
        typed.textContent = line.slice(0, ci);
        var wait = deleting ? 35 : 70;
        if (!deleting && ci === line.length) { deleting = true; wait = 1800; }
        else if (deleting && ci === 0) { deleting = false; li = (li + 1) % lines.length; wait = 450; }
        setTimeout(tick, wait);
      })();
    }
  }

  // Highlight the nav link for the section in view
  if ('IntersectionObserver' in window) {
    var links = {};
    document.querySelectorAll('#site-nav a').forEach(function (a) { links[a.hash.slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || !links[e.target.id]) return;
        Object.keys(links).forEach(function (id) { links[id].classList.toggle('active', id === e.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  // Soft gold light that follows the cursor (desktop pointers only)
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    var glow = document.querySelector('.glow');
    root.classList.add('has-glow');
    window.addEventListener('pointermove', function (e) {
      glow.style.setProperty('--x', e.clientX + 'px');
      glow.style.setProperty('--y', e.clientY + 'px');
    }, { passive: true });
  }

  // Screenshot lightbox (links still open the image if <dialog> is unsupported)
  var box = document.getElementById('lightbox');
  if (box && typeof box.showModal === 'function') {
    var boxImg = box.querySelector('img');
    document.querySelectorAll('.shots a, .cert-thumb').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        boxImg.src = a.href;
        boxImg.alt = a.querySelector('img').alt;
        box.showModal();
      });
    });
    box.addEventListener('click', function () { box.close(); });
  }

  // YouTube demos: swap the thumbnail link for the player only when clicked (keeps the page light).
  // Without JS the link simply opens the video on YouTube.
  document.querySelectorAll('a.yt[data-yt]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(a.dataset.yt) + '?autoplay=1';
      frame.title = a.dataset.title;
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allowFullscreen = true;
      var box = document.createElement('div');
      box.className = 'yt';
      box.appendChild(frame);
      a.replaceWith(box);
      frame.focus();
    });
  });

  // Contact form: opens the visitor's email app with the message filled in
  var form = document.getElementById('contact-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements; // not form.name: that is the form's own name attribute
    var name = f.name.value.trim() || 'Someone';
    var subject = encodeURIComponent('Message from ' + name + ' via techbygrace.com');
    var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + f.email.value.trim() + '\n\nMessage:\n' + f.message.value);
    window.location.href = 'mailto:goodluckgrace08@gmail.com?subject=' + subject + '&body=' + body;
    setTimeout(function () { document.getElementById('form-tip').hidden = false; }, 800);
  });
})();
