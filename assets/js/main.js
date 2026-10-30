/* 상테크 - 상품권재테크 (gift-tech.net) — common script */
(function () {
  'use strict';

  /* 1) 이미지 로드 실패 시 폴백 (assets/images 가 아직 없어도 레이아웃이 깨지지 않도록)
        - img 가 .logo / .consult-card / .consult-band / .trust-visual / .cta-visual / .mark / figure 안에 있으면 해당 컨테이너에 .no-img 추가 */
  document.addEventListener(
    'error',
    function (e) {
      var el = e.target;
      if (!el || el.tagName !== 'IMG') return;
      var host = el.closest('.logo, .consult-card, .consult-band, .trust-visual, .cta-visual, .mark, figure');
      if (host) host.classList.add('no-img');
      else el.style.display = 'none';
    },
    true
  );

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    /* 2) Lucide 아이콘 렌더 */
    try {
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    } catch (err) {
      /* 아이콘 CDN 실패 시에도 페이지는 정상 동작 */
    }

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
    } catch (err) {
      /* URI 디코딩 실패는 무시 */
    }

    /* 5) 푸터 연도 */
    var y = document.querySelector('[data-year]');
    if (y) y.textContent = String(new Date().getFullYear());

    /* 6) 상담 클릭 이벤트 → dataLayer (GTM 연결 시 사용)
          GTM 미설치 상태에서는 아무 동작도 하지 않습니다. */
    document.querySelectorAll('a[href*="channel.io"]').forEach(function (a) {
      a.addEventListener('click', function () {
        try {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'consult_click',
            consult_channel: 'channeltalk',
            page_path: location.pathname,
            link_text: (a.textContent || '').trim().slice(0, 50)
          });
        } catch (err) {
          /* no-op */
        }
      });
    });
  });
})();
