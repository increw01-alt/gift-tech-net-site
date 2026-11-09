(function () {
  'use strict';

  const { protocol, hostname, search } = window.location;
  const productionHost = hostname === 'gift-tech.net' || hostname === 'www.gift-tech.net';
  const testVisit = new URLSearchParams(search).get('site_desk_test') === '1';
  if (protocol !== 'https:' || !productionHost || testVisit) return;

  const measurementId = 'G-ZYK30LEPGW';
  if (document.querySelector(`script[data-ga4="${measurementId}"]`)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  const loader = document.createElement('script');
  loader.async = true;
  loader.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  loader.dataset.ga4 = measurementId;
  document.head.append(loader);
})();
