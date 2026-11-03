/* ByKatriel · interacción del sitio */
(function () {
  'use strict';

  // Número de WhatsApp: prefijo de país, sin espacios ni «+»
  var PHONE = '34611528824';

  // Servicios: nombre en la web y nombre exacto en la agenda de TrueStudio
  var SERVICES = {
    rusaS: { name: 'Manicura rusa semipermanente S', agenda: 'MANICURA RUSA SEMIPERMANENTE S' },
    rusaM: { name: 'Manicura rusa semipermanente M', agenda: 'MANICURA RUSA SEMIPERMANENTE M' },
    rusaPedi: { name: 'Manicura rusa + pedicura semipermanente', agenda: 'MANICURA RUSA Y PEDICURA SEMIPERMANENTE' },
    gelx: { name: 'Extensión Gel X', agenda: 'EXTENSION GEL X' },
    relleno: { name: 'Relleno de gel', agenda: 'RELLENO DE GEL' },
    semi: { name: 'Manicura semipermanente', agenda: 'MANICURA SEMIPERMANENTE' },
    pediSemi: { name: 'Pedicura semipermanente', agenda: 'PEDICURA SEMIPERMANENTE' },
    pediTrad: { name: 'Pedicura tradicional', agenda: 'PEDICURA TRADICIONAL' },
    diseno: { name: 'Diseño / nail art', agenda: 'DISEÑO' }
  };

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function wa(msg) {
    return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
  }

  /* ---------- Capas: panel de reservas e información legal ---------- */

  var openLayer = null;
  var lastFocus = null;

  function focusables(root) {
    var all = root.querySelectorAll('a[href], button:not([disabled]), select, input, textarea, [tabindex]:not([tabindex="-1"])');
    return Array.prototype.filter.call(all, function (el) { return el.offsetParent !== null; });
  }

  function showLayer(layer, dialog) {
    if (openLayer && openLayer !== layer) hideLayer(true);
    if (!openLayer) lastFocus = document.activeElement;
    layer.hidden = false;
    openLayer = layer;
    document.body.classList.add('bk-lock');
    setTimeout(function () { dialog.focus(); }, 30);
  }

  function hideLayer(keepFocus) {
    if (!openLayer) return;
    openLayer.hidden = true;
    openLayer = null;
    document.body.classList.remove('bk-lock');
    if (!keepFocus && lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('keydown', function (e) {
    if (!openLayer) return;
    if (e.key === 'Escape') {
      hideLayer();
      return;
    }
    if (e.key !== 'Tab') return;
    var items = focusables(openLayer);
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !openLayer.contains(document.activeElement))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Reservas: el panel explica la agenda de TrueStudio y lleva a ella
  var sheetLayer = document.getElementById('bk-sheet-layer');
  var sheet = document.getElementById('bk-sheet');
  var select = document.getElementById('bk-svc');
  var agendaName = document.getElementById('bk-agenda-name');
  var waBooking = document.getElementById('bk-wa-booking');

  function pickService(id) {
    if (!SERVICES[id]) id = 'rusaS';
    var s = SERVICES[id];
    select.value = id;
    agendaName.textContent = s.agenda;
    waBooking.href = wa('Hola Katriel, tengo una duda sobre mi reserva de ' + s.name);
  }

  select.addEventListener('change', function () { pickService(select.value); });

  // Información legal: dos pestañas en la misma ventana
  var legalLayer = document.getElementById('bk-legal-layer');
  var legal = document.getElementById('bk-legal');
  var legalBody = document.getElementById('bk-legal-body');
  var docs = { aviso: document.getElementById('bk-doc-aviso'), privacidad: document.getElementById('bk-doc-privacidad') };
  var tabs = { aviso: document.getElementById('bk-tab-aviso'), privacidad: document.getElementById('bk-tab-privacidad') };

  function openLegal(which) {
    if (!docs[which]) which = 'aviso';
    Object.keys(docs).forEach(function (k) {
      docs[k].hidden = k !== which;
      tabs[k].setAttribute('aria-selected', String(k === which));
    });
    legalBody.scrollTop = 0;
    if (openLayer !== legalLayer) showLayer(legalLayer, legal);
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-reservar]');
    if (t) {
      e.preventDefault();
      pickService(t.getAttribute('data-reservar'));
      showLayer(sheetLayer, sheet);
      return;
    }
    t = e.target.closest('[data-legal]');
    if (t) {
      e.preventDefault();
      openLegal(t.getAttribute('data-legal'));
      return;
    }
    if (e.target.closest('[data-cerrar]')) hideLayer();
  });

  // Enlaces directos: tudominio.com/#aviso-legal y tudominio.com/#privacidad
  function fromHash() {
    if (location.hash === '#aviso-legal') openLegal('aviso');
    else if (location.hash === '#privacidad') openLegal('privacidad');
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();

  /* ---------- Botón fijo de reserva en móvil ---------- */

  var sticky = document.getElementById('bk-sticky');
  function onScroll() {
    sticky.classList.toggle('is-on', (window.scrollY || 0) > 640);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Aparición de los bloques al hacer scroll ---------- */

  // Se anima con Web Animations: si el script falla, el contenido sigue visible
  (function setupReveal() {
    var root = document.querySelector('.bk');
    if (!root || !root.animate || !('IntersectionObserver' in window) || reduceMotion) return;
    var ease = 'cubic-bezier(.2,.7,.1,1)';
    var armed = new Map();
    var io = new IntersectionObserver(function (entries) {
      var k = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var a = armed.get(en.target);
        armed.delete(en.target);
        if (!a) return;
        a.effect.updateTiming({ delay: Math.min(k, 6) * 80 });
        a.play();
        a.finished.then(function () { a.cancel(); }).catch(function () {});
        k += 1;
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    var vh = window.innerHeight;
    root.querySelectorAll('.bk-reveal, .bk-reveal-img, .bk-stagger > *').forEach(function (el) {
      if (el.getBoundingClientRect().top < vh) return;
      var img = el.classList.contains('bk-reveal-img');
      var frames = img
        ? [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }]
        : [{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'translateY(0)' }];
      var a = el.animate(frames, { duration: img ? 1300 : 900, easing: ease, fill: 'both' });
      a.pause();
      armed.set(el, a);
      io.observe(el);
    });
  })();

  /* ---------- Banda curva del inicio ---------- */

  // El movimiento es una animación CSS; arrastrar mueve su reloj
  (function setupRing() {
    var stage = document.querySelector('.bk-stage');
    if (!stage || !stage.getAnimations) return;
    var anims = null;
    var drag = null;
    var vel = 0;
    var raf = 0;
    var hover = false;

    function ringAnims() {
      if (!anims) {
        anims = stage.getAnimations({ subtree: true }).filter(function (a) {
          return /^bk-(travel|shade|label)$/.test(a.animationName);
        });
        anims.forEach(function (a) { a.currentTime = (a.currentTime || 0) + 56000 * 40; });
      }
      return anims;
    }
    function shiftRing(ms) { ringAnims().forEach(function (a) { a.currentTime = a.currentTime + ms; }); }
    function rateRing(r) { ringAnims().forEach(function (a) { a.playbackRate = r; }); }
    function msPerPx() {
      var w = stage.offsetWidth;
      var s = w <= 820 ? 0.55 : w >= 2000 ? 1.5 : w >= 1700 ? 1.3 : w >= 1500 ? 1.12 : 1;
      return 29 / s;
    }

    stage.addEventListener('pointerdown', function (e) {
      ringAnims();
      cancelAnimationFrame(raf);
      drag = { last: e.clientX, t: performance.now() };
      vel = 0;
      rateRing(0);
      try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    });

    stage.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var now = performance.now();
      var dx = e.clientX - drag.last;
      var dt = Math.max(1, now - drag.t);
      drag = { last: e.clientX, t: now };
      shiftRing(-dx * msPerPx());
      vel = 0.75 * vel + 0.25 * (dx / dt);
    });

    function release() {
      if (!drag) return;
      drag = null;
      var k = msPerPx();
      var target = hover ? 0.4 : 1;
      var v = vel;
      var rate = 0;
      var last = performance.now();
      function step(now) {
        var dt = Math.min(64, now - last);
        last = now;
        v *= Math.pow(0.05, dt / 1000);
        if (Math.abs(v) > 0.01) {
          shiftRing(-v * dt * k);
        } else {
          rate = Math.min(target, rate + (dt / 800) * target);
          rateRing(rate);
        }
        if (Math.abs(v) > 0.01 || rate < target) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
    }
    stage.addEventListener('pointerup', release);
    stage.addEventListener('pointercancel', release);

    stage.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse') return;
      hover = true;
      if (!drag) {
        cancelAnimationFrame(raf);
        rateRing(0.4);
      }
    });
    stage.addEventListener('pointerleave', function (e) {
      if (e.pointerType !== 'mouse') return;
      hover = false;
      if (!drag) {
        cancelAnimationFrame(raf);
        rateRing(1);
      }
    });
  })();

  /* ---------- Vídeo del método ---------- */

  // Silenciado y en bucle; solo se reproduce cuando está en pantalla
  (function setupVideo() {
    var video = document.querySelector('.bk-video');
    var btn = document.querySelector('.bk-video-btn');
    if (!video || !btn) return;
    var userPaused = reduceMotion;
    var visible = false;
    video.muted = true;

    function setIcon(paused) {
      btn.setAttribute('aria-label', paused ? 'Reproducir vídeo' : 'Pausar vídeo');
      btn.querySelector('.bk-ico-play').hidden = !paused;
      btn.querySelector('.bk-ico-pause').hidden = paused;
    }
    function play() {
      var p = video.play();
      if (p && p.catch) p.catch(function () { setIcon(true); });
    }

    setIcon(userPaused);
    btn.addEventListener('click', function () {
      if (video.paused) {
        userPaused = false;
        play();
        setIcon(false);
      } else {
        userPaused = true;
        video.pause();
        setIcon(true);
      }
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !userPaused) play();
        else if (!visible) video.pause();
      }, { rootMargin: '200px 0px' }).observe(video);
    } else if (!userPaused) {
      play();
    }
  })();
})();
