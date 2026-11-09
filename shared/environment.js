/* Browser differences only; business rules and HTTP storage remain unchanged. */
(function () {
  'use strict';
  var root = new URL('../', document.currentScript.src);
  // srcdoc has an about: URL, but loads this script from the same file root.
  var local = root.protocol === 'file:';
  window.HrmEnvironment = {
    local: local,
    targetOrigin: local ? '*' : location.origin,
    url: function (path) { return new URL(path, root).href; },
    replaceState: function (state, title, path) {
      var next = new URL(path, root);
      if (local) {
        var current = new URL(location.href);
        current.search = next.search;
        current.hash = next.hash;
        next = current;
      }
      try { history.replaceState(state, title, next.href); }
      catch (error) { if (!local) throw error; }
    },
    embed: function (html, search) {
      var base = '<base href="' + root.href.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '">';
      var result = /<base\b[^>]*>/i.test(html)
        ? html.replace(/<base\b[^>]*>/i, base)
        : html.replace(/<head\b[^>]*>/i, '$&' + base);
      if (search !== undefined) {
        result = result.replace(/<head\b[^>]*>/i, '$&<script>window.essProfileSearch=' +
          JSON.stringify(search).replace(/</g, '\\u003c') + ';<\/script>');
      }
      return result;
    }
  };
  // A root <base> also changes fragment-only links. Keep their native same-page intent.
  window.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest && event.target.closest('a[href^="#"]');
    if (!link || link.getAttribute('download') !== null || (link.getAttribute('target') && link.getAttribute('target') !== '_self')) return;
    event.preventDefault();
    location.hash = link.getAttribute('href').slice(1);
  });
  if (!local) return;
  ['localStorage', 'sessionStorage'].forEach(function (name) {
    var storage;
    try {
      storage = window.parent !== window && window.parent.HrmEnvironment
        ? window.parent[name] : window[name];
      // Access can be denied even when retrieving the Storage object succeeds.
      storage.getItem('__ess_storage_probe__');
    } catch (_) {
      var values = Object.create(null);
      storage = {
        get length() { return Object.keys(values).length; },
        key: function (index) { return Object.keys(values)[index] || null; },
        getItem: function (key) { return Object.prototype.hasOwnProperty.call(values, String(key)) ? values[String(key)] : null; },
        setItem: function (key, value) { values[String(key)] = String(value); },
        removeItem: function (key) { delete values[String(key)]; },
        clear: function () { values = Object.create(null); }
      };
    }
    Object.defineProperty(window, name, { configurable: true, value: storage });
  });
})();
