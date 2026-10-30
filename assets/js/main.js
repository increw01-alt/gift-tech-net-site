/* 상테크 - 상품권재테크 (gift-tech.net) — common script
   - 이미지 폴백, 모바일 메뉴, 현재 메뉴 표시, 상담 클릭 dataLayer
   - 모션: 등장 애니메이션(data-reveal), 배경 패럴랙스(data-parallax), 배경 패닝(data-pan)
     기존 Wix 사이트의 효과(Float In 1.2s easeInOutSine / BgParallax / BgPan / BgFadeIn)를 재현 */
(function () {
  'use strict';

  /* 1) 이미지 로드 실패 시 폴백 */
  document.addEventListener(
    'error',
    function (e) {
      var el = e.target;
      if (!el || el.tagName !== 'IMG') return;
      var host = el.closest('.logo, .consult-card, .consult-band, .cta-phone, .mark, figure, .media, .hero-side, .kga-block');
      if (host) host.classList.add('no-img');
      else el.style.display = 'none';
    },
    true
  );

  var reduceMotion = false;
  try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (err) {}

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    /* 2) Lucide 아이콘 */
    try {
      if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
    } catch (err) {}

    /* 3) 모바일 내비게이션 */
    var toggle = document.querySelector('.nav-toggle');
    var mobile = document.querySelector('.nav-mobile');
    if (toggle && mobile) {
      toggle.addEventListener('click', function () {
        var open = mobile.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      });
      mobile.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          mobile.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobile.classList.contains('open')) {
          mobile.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      });
    }

    /* 4) 현재 페이지 메뉴 표시 */
    try {
      var path = decodeURIComponent(location.pathname).replace(/\.html$/, '').replace(/\/$/, '') || '/';
      document.querySelectorAll('.nav-desktop a, .nav-mobile a').forEach(function (a) {
        var href = decodeURIComponent(a.getAttribute('href') || '').replace(/\.html$/, '').replace(/\/$/, '') || '/';
        if (href === path) a.setAttribute('aria-current', 'page');
      });
    } catch (err) {}

    /* 5) 푸터 연도 */
    var y = document.querySelector('[data-year]');
    if (y) y.textContent = String(new Date().getFullYear());

    /* 6) 상담 클릭 → dataLayer (GTM 연결 시 전환 트리거로 사용) */
    document.querySelectorAll('a[href*="channel.io"]').forEach(function (a) {
      a.addEventListener('click', function () {
        try {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'consult_click', consult_channel: 'channeltalk', page_path: location.pathname, link_text: (a.textContent || '').trim().slice(0, 50) });
        } catch (err) {}
      });
    });

    /* 7) 등장 애니메이션 — data-reveal="left|right|up|fade", data-delay="ms"
          화면에 들어오면 .is-in 추가(한 번만). 모션 최소화 설정이면 바로 표시 */
    var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (reveals.length) {
      if (reduceMotion || !('IntersectionObserver' in window)) {
        reveals.forEach(function (el) { el.classList.add('is-in'); });
      } else {
        var pending = reveals.slice();
        function show(el) {
          if (el.classList.contains('is-in')) return;
          var d = parseInt(el.getAttribute('data-delay') || '0', 10);
          el.style.transitionDelay = d ? d + 'ms' : '';
          el.classList.add('is-in');
          var i = pending.indexOf(el);
          if (i > -1) pending.splice(i, 1);
        }
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            show(en.target);
            io.unobserve(en.target);
          });
        }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
        reveals.forEach(function (el) { io.observe(el); });
        /* 보조: 빠른 스크롤로 IO 알림을 놓친 요소는 스크롤 시점에 위치로 판정 */
        var rvTick = false;
        function sweep() {
          rvTick = false;
          var limit = window.innerHeight * 0.94;
          pending.slice().forEach(function (el) {
            var r = el.getBoundingClientRect();
            if (r.top < limit && r.bottom > 0) { show(el); io.unobserve(el); }
          });
        }
        window.addEventListener('scroll', function () { if (!rvTick) { rvTick = true; window.requestAnimationFrame(sweep); } }, { passive: true });
        window.setTimeout(sweep, 50);
      }
    }

    /* 8) 스크롤 연동 배경 효과 — data-parallax(세로 이동), data-pan(가로 이동), data-scrollfade(투명도)
          Wix의 BgParallax / BgPan / BgFadeIn 에 해당. 모션 최소화 설정이면 비활성 */
    var fx = Array.prototype.slice.call(document.querySelectorAll('[data-parallax],[data-pan],[data-scrollfade]'));
    if (fx.length && !reduceMotion) {
      var ticking = false;
      var vh = window.innerHeight;
      function progress(el) {
        /* 요소가 화면 하단에 처음 나타날 때 0 → 화면 상단으로 빠져나갈 때 1 */
        var r = el.parentElement.getBoundingClientRect();
        return Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      }
      function update() {
        ticking = false;
        fx.forEach(function (el) {
          var p = progress(el);
          if (el.hasAttribute('data-parallax')) {
            var amt = parseFloat(el.getAttribute('data-parallax')) || 12;      /* % of own height */
            el.style.transform = 'translate3d(0,' + ((p - 0.5) * amt).toFixed(2) + '%,0)';
          } else if (el.hasAttribute('data-pan')) {
            var amtX = parseFloat(el.getAttribute('data-pan')) || 8;
            el.style.transform = 'translate3d(' + ((0.5 - p) * 2 * amtX).toFixed(2) + '%,0,0)';
          } else if (el.hasAttribute('data-scrollfade')) {
            var o = Math.min(1, Math.max(0, (p - 0.08) / 0.3));
            el.style.opacity = o.toFixed(3);
          }
        });
      }
      function onScroll() {
        if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', function () { vh = window.innerHeight; onScroll(); });
      update();
    } else {
      fx.forEach(function (el) { if (el.hasAttribute('data-scrollfade')) el.style.opacity = '1'; });
    }
  });
})();
