/* OrochiPulse / OrochiJIT — v1.1.1
   - IIFE isolée (évite collisions globales)
   - Guard d'initialisation
   - MutationObserver interne nommé _oroJitObserver
   - API: addHandler, processElement, processRoot, setOptions, destroy
*/

(function (global) {
  if (!global) return;

  // Guard : évite d'initialiser plusieurs fois
  if (global.OrochiJIT && global.OrochiJIT._orochiJitInitialized) {
    return;
  }

  /* ---------- Config / Helpers (local scope) ---------- */

  const SAFE_VALUE_RE = /^[0-9a-zA-Z\s\-\_\#\.\%\(\)\[\]\{\}\:;\/\+\>\<\=\'\",@]+$/i;
  const ARB_CLASS_RE = /(^|\s)([a-zA-Z0-9\-\_:]+)\[([^\]]+)\]/g;

  const DEFAULT_MAP = {
    'bg': (v, el) => ({ property: 'background', value: v }),
    'text': (v, el) => ({ property: 'color', value: v }),
    'radius': (v, el) => ({ property: 'border-radius', value: v }),
    'w': (v, el) => ({ property: 'width', value: v }),
    'h': (v, el) => ({ property: 'height', value: v }),
    'p': (v, el) => ({ property: 'padding', value: v }),
    'pt': (v, el) => ({ property: 'padding-top', value: v }),
    'pr': (v, el) => ({ property: 'padding-right', value: v }),
    'pb': (v, el) => ({ property: 'padding-bottom', value: v }),
    'pl': (v, el) => ({ property: 'padding-left', value: v }),
    'm': (v, el) => ({ property: 'margin', value: v }),
    'mt': (v, el) => ({ property: 'margin-top', value: v }),
    'mr': (v, el) => ({ property: 'margin-right', value: v }),
    'mb': (v, el) => ({ property: 'margin-bottom', value: v }),
    'ml': (v, el) => ({ property: 'margin-left', value: v }),
    'shadow': (v, el) => ({ property: 'box-shadow', value: v }),
  };

  function safeValue(val) {
    if (val === undefined || val === null) return null;
    const s = String(val).trim();
    if (!s) return null;
    if (!SAFE_VALUE_RE.test(s)) return null;
    const lowered = s.toLowerCase();
    if (lowered.includes('expression(') || lowered.includes('javascript:')) return null;
    return s;
  }

  function normalizePrefix(raw) {
    if (!raw) return raw;
    let s = String(raw).trim();
    s = s.replace(/^[\-\_]+/, '');
    s = s.replace(/[\-\_]+$/, '');
    s = s.replace(/[_]+/g, '-').replace(/-+/g, '-');
    if (s.indexOf(':') !== -1) {
      const parts = s.split(':');
      s = parts[parts.length - 1];
    }
    return s;
  }

  /* ---------- Core parser & applier ---------- */

  function parseAndApply(el, jit) {
    if (!el || !el.className) return;
    const classAttr = el.className;
    let m;
    // reset lastIndex in case regex reused
    ARB_CLASS_RE.lastIndex = 0;
    while ((m = ARB_CLASS_RE.exec(classAttr)) !== null) {
      const rawPrefix = m[2];
      const rawVal = m[3];
      const value = safeValue(rawVal);
      if (!value) continue;

      const prefix = normalizePrefix(rawPrefix);
      const handler = jit.handlers[prefix];

      if (handler) {
        try {
          const result = handler(value, el);
          if (result && result.property) {
            el.style.setProperty(result.property, result.value);
          } else if (typeof result === 'object') {
            if (result.property && result.value) {
              el.style.setProperty(result.property, result.value);
            } else {
              Object.entries(result).forEach(([prop, val]) => {
                el.style.setProperty(prop, val);
              });
            }
          }
        } catch (err) {
          // ne stoppe pas l'exécution si un handler foire
          /* eslint-disable no-console */
          console.warn('OrochiJIT handler error', err);
          /* eslint-enable no-console */
        }
      } else {
        const fallbackProp = prefix.replace(/[:_]/g, '-');
        el.style.setProperty(fallbackProp, value);
      }
    }
  }

  function applyTokenClasses(el) {
    if (!el || !el.classList) return;
    if (el.classList.contains('text-white')) el.style.setProperty('color', '#fff');
    if (el.classList.contains('text-black')) el.style.setProperty('color', '#000');
  }

  /* ---------- OrochiJIT public object ---------- */

  const OrochiJIT = {
    handlers: Object.assign({}, DEFAULT_MAP),
    options: {
      observeRoot: document.documentElement,
      attributeFilter: ['class'],
      selectorScan: '[class*="["]',
    },

    addHandler(name, fn) {
      if (!name || typeof fn !== 'function') {
        throw new Error('OrochiJIT.addHandler: invalid handler');
      }
      this.handlers[name] = fn;
      return this;
    },

    processElement(el) {
      if (!el || !el.className) return;
      const c = el.className;
      if (c.indexOf('[') === -1 && !el.classList.contains('text-white') && !el.classList.contains('text-black')) return;
      parseAndApply(el, this);
      applyTokenClasses(el);
    },

    processRoot(root = document) {
      const selector = this.options.selectorScan;
      if (root instanceof Element) {
        if (root.className && root.className.indexOf('[') !== -1) this.processElement(root);
        const list = root.querySelectorAll ? root.querySelectorAll(selector) : [];
        list.forEach(el => this.processElement(el));
      } else {
        const list = document.querySelectorAll ? document.querySelectorAll(selector) : [];
        list.forEach(el => this.processElement(el));
      }
    },

    setOptions(opts = {}) {
      Object.assign(this.options, opts);
      return this;
    },

    destroy() {
      try {
        _oroJitObserver && _oroJitObserver.disconnect();
      } catch (e) {}
      // remove marker so it could be reinitialized if desired
      this._orochiJitInitialized = false;
      // do not delete global reference - keep API stable but disable observer
    },

    _orochiJitInitialized: true,
  };

  // aliases tolerant
  if (!OrochiJIT.handlers['bg-']) OrochiJIT.addHandler('bg-', DEFAULT_MAP['bg']);
  if (!OrochiJIT.handlers['radius-']) OrochiJIT.addHandler('radius-', DEFAULT_MAP['radius']);

  /* ---------- MutationObserver (internal unique name) ---------- */

  // observer callback uses the OrochiJIT instance
  function _mutationCallback(mutations) {
    for (let i = 0; i < mutations.length; i++) {
      const mut = mutations[i];
      if (mut.type === 'attributes' && mut.attributeName === 'class' && mut.target) {
        OrochiJIT.processElement(mut.target);
      }
      if (mut.addedNodes && mut.addedNodes.length) {
        mut.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (node.className && node.className.indexOf('[') !== -1) {
            OrochiJIT.processElement(node);
          }
          if (node.querySelectorAll) {
            const list = node.querySelectorAll ? node.querySelectorAll(OrochiJIT.options.selectorScan) : [];
            list.forEach(el => OrochiJIT.processElement(el));
          }
        });
      }
    }
  }

  // unique variable name inside closure
  const _oroJitObserver = new MutationObserver(_mutationCallback);

  /* ---------- Initialization ---------- */

  function _init() {
    // initial scan
    try {
      OrochiJIT.processRoot(document);
    } catch (e) {
      /* eslint-disable no-console */
      console.warn('OrochiJIT initial scan failed', e);
      /* eslint-enable no-console */
    }

    // observe
    try {
      _oroJitObserver.observe(OrochiJIT.options.observeRoot, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: OrochiJIT.options.attributeFilter,
      });
    } catch (e) {
      /* eslint-disable no-console */
      console.warn('OrochiJIT observer failed to start', e);
      /* eslint-enable no-console */
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init, { once: true });
  } else {
    // DOM already ready
    _init();
  }

  /* ---------- Expose globally (safe) ---------- */
  // Merge with any existing global object, but do not overwrite existing handlers
  const existing = global.OrochiJIT || {};
  // copy only if not present to preserve previously registered handlers
  Object.keys(OrochiJIT.handlers || {}).forEach(k => {
    if (!existing.handlers) existing.handlers = {};
    if (!existing.handlers[k]) existing.handlers[k] = OrochiJIT.handlers[k];
  });

  // attach methods (prefer keeping existing methods if any)
  const final = Object.assign({}, existing, {
    handlers: existing.handlers || OrochiJIT.handlers,
    addHandler: OrochiJIT.addHandler.bind(OrochiJIT),
    processElement: OrochiJIT.processElement.bind(OrochiJIT),
    processRoot: OrochiJIT.processRoot.bind(OrochiJIT),
    setOptions: OrochiJIT.setOptions.bind(OrochiJIT),
    destroy: OrochiJIT.destroy.bind(OrochiJIT),
    _orochiJitInitialized: true,
  });

  global.OrochiJIT = final;

})(window);
