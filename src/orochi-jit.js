/* OrochiPulse / OrochiJIT — v1.0.0 */
(function (global) {
  if (!global) return;

  if (global.OrochiJIT && global.OrochiJIT._orochiJitInitialized) {
    return;
  }

  /* ---------- Config / Helpers (local scope) ---------- */

  const SAFE_VALUE_RE = /^[0-9a-zA-Z\s\-\_\#\.\%\(\)\[\]\{\}\:;\/\+\>\<\=\'\",@]+$/i;
  const ARB_CLASS_RE = /(^|\s)([a-zA-Z0-9\-\_:]+)\[([^\]]+)\]/g;

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
    // keep everything as-is here: prefix resolution will be done by parseAndApply
    return s;
  }

  function escapeClassNameForCss(name) {
    // Simple escape for CSS class names (replace unsafe chars)
    return String(name).replace(/[^a-zA-Z0-9\-_]/g, '-');
  }

  /* ---------- Dynamic stylesheet for pseudo rules ---------- */

  const STYLE_ID = 'oro-jit-dynamic-style';
  let _styleEl = document.getElementById(STYLE_ID);
  if (!_styleEl) {
    _styleEl = document.createElement('style');
    _styleEl.id = STYLE_ID;
    document.head.appendChild(_styleEl);
  }
  const _styleSheet = _styleEl.sheet;
  const _pseudoRuleMap = {}; // key -> generatedClassName
  let _pseudoCounter = 0;

  function addPseudoRule(propMap, pseudo, value) {
    // propMap can be {property: 'color', value: '#f00'} or { 'background-color': '#f00', ...}
    // We'll build CSS declaration string
    const decls = [];
    if (propMap.property && propMap.value !== undefined) {
      decls.push(`${propMap.property}: ${propMap.value};`);
    } else {
      Object.entries(propMap).forEach(([p, v]) => decls.push(`${p}: ${v};`));
    }
    const declStr = decls.join(' ');

    const key = `${pseudo}|${declStr}`;
    if (_pseudoRuleMap[key]) return _pseudoRuleMap[key];

    _pseudoCounter += 1;
    const cls = `orojit-${_pseudoCounter}-${Math.random().toString(36).slice(2, 7)}`;
    const safeCls = escapeClassNameForCss(cls);

    // support both pseudo classes and pseudo elements (e.g., before/after)
    // pseudo may be like 'hover' or 'before' or 'hover:before' etc.
    const selector = `.${safeCls}:${pseudo}`;
    try {
      _styleSheet.insertRule(`${selector} { ${declStr} }`, _styleSheet.cssRules.length);
    } catch (e) {
      // fallback: try attribute selector (rare)
      try {
        _styleSheet.insertRule(`[data-orojit~="${safeCls}"]:${pseudo} { ${declStr} }`, _styleSheet.cssRules.length);
      } catch (err) {
        // give up quietly
        console.warn('OrochiJIT: failed to insert pseudo rule', err);
      }
    }
    _pseudoRuleMap[key] = safeCls;
    return safeCls;
  }

  /* ---------- base_MAP : map short prefixes to property appliers ---------- */

  const base_MAP = {
    // colors / backgrounds
    'bg': (v) => ({ property: 'background', value: v }),
    'bg-color': (v) => ({ property: 'background-color', value: v }),
    'bg-image': (v) => ({ property: 'background-image', value: v }),
    'bg-size': (v) => ({ property: 'background-size', value: v }),
    'bg-repeat': (v) => ({ property: 'background-repeat', value: v }),

    'text': (v) => ({ property: 'color', value: v }),
    'color': (v) => ({ property: 'color', value: v }),

    // box
    'w': (v) => ({ property: 'width', value: v }),
    'h': (v) => ({ property: 'height', value: v }),
    'min-w': (v) => ({ property: 'min-width', value: v }),
    'max-w': (v) => ({ property: 'max-width', value: v }),
    'min-h': (v) => ({ property: 'min-height', value: v }),
    'max-h': (v) => ({ property: 'max-height', value: v }),

    // spacing
    'p': (v) => ({ property: 'padding', value: v }),
    'pt': (v) => ({ property: 'padding-top', value: v }),
    'pr': (v) => ({ property: 'padding-right', value: v }),
    'pb': (v) => ({ property: 'padding-bottom', value: v }),
    'pl': (v) => ({ property: 'padding-left', value: v }),
    'm': (v) => ({ property: 'margin', value: v }),
    'mt': (v) => ({ property: 'margin-top', value: v }),
    'mr': (v) => ({ property: 'margin-right', value: v }),
    'mb': (v) => ({ property: 'margin-bottom', value: v }),
    'ml': (v) => ({ property: 'margin-left', value: v }),

    // border / radius / shadow
    'radius': (v) => ({ property: 'border-radius', value: v }),
    'border': (v) => ({ property: 'border', value: v }),
    'border-color': (v) => ({ property: 'border-color', value: v }),
    'border-width': (v) => ({ property: 'border-width', value: v }),
    'shadow': (v) => ({ property: 'box-shadow', value: v }),
    'outline': (v) => ({ property: 'outline', value: v }),

    // display / layout / flex / grid
    'd': (v) => ({ property: 'display', value: v }),
    'flex': (v) => ({ property: 'flex', value: v }),
    'flex-dir': (v) => ({ property: 'flex-direction', value: v }),
    'flex-wrap': (v) => ({ property: 'flex-wrap', value: v }),
    'order': (v) => ({ property: 'order', value: v }),
    'gap': (v) => ({ property: 'gap', value: v }),
    'row-gap': (v) => ({ property: 'row-gap', value: v }),
    'col-gap': (v) => ({ property: 'column-gap', value: v }),
    'align': (v) => ({ property: 'align-items', value: v }),
    'justify': (v) => ({ property: 'justify-content', value: v }),
    'place-items': (v) => ({ property: 'place-items', value: v }),
    'grid-cols': (v) => ({ property: 'grid-template-columns', value: v }),
    'grid-rows': (v) => ({ property: 'grid-template-rows', value: v }),

    // position / z / top/right/...
    'pos': (v) => ({ property: 'position', value: v }),
    'top': (v) => ({ property: 'top', value: v }),
    'right': (v) => ({ property: 'right', value: v }),
    'bottom': (v) => ({ property: 'bottom', value: v }),
    'left': (v) => ({ property: 'left', value: v }),
    'z': (v) => ({ property: 'z-index', value: v }),

    // transform / transition / animation
    'transform': (v) => ({ property: 'transform', value: v }),
    'translate': (v) => ({ property: 'transform', value: `translate(${v})` }),
    'rotate': (v) => ({ property: 'transform', value: `rotate(${v})` }),
    'scale': (v) => ({ property: 'transform', value: `scale(${v})` }),
    'opacity': (v) => ({ property: 'opacity', value: v }),

    'transition': (v) => ({ property: 'transition', value: v }),
    'transition-duration': (v) => ({ property: 'transition-duration', value: v }),
    'transition-delay': (v) => ({ property: 'transition-delay', value: v }),
    'transition-timing': (v) => ({ property: 'transition-timing-function', value: v }),

    // typography
    'fs': (v) => ({ property: 'font-size', value: v }),
    'fw': (v) => ({ property: 'font-weight', value: v }),
    'lh': (v) => ({ property: 'line-height', value: v }),
    'ls': (v) => ({ property: 'letter-spacing', value: v }),
    'ta': (v) => ({ property: 'text-align', value: v }),
    'decoration': (v) => ({ property: 'text-decoration', value: v }),

    // misc
    'cursor': (v) => ({ property: 'cursor', value: v }),
    'overflow': (v) => ({ property: 'overflow', value: v }),
    'overflow-x': (v) => ({ property: 'overflow-x', value: v }),
    'overflow-y': (v) => ({ property: 'overflow-y', value: v }),
    'visibility': (v) => ({ property: 'visibility', value: v }),
    'white-space': (v) => ({ property: 'white-space', value: v }),
    'box-sizing': (v) => ({ property: 'box-sizing', value: v }),
    'object-fit': (v) => ({ property: 'object-fit', value: v }),
    'object-position': (v) => ({ property: 'object-position', value: v }),
    'filter': (v) => ({ property: 'filter', value: v }),
    'backdrop-filter': (v) => ({ property: 'backdrop-filter', value: v }),
    'pointer-events': (v) => ({ property: 'pointer-events', value: v }),
    'user-select': (v) => ({ property: 'user-select', value: v }),
    'resize': (v) => ({ property: 'resize', value: v }),
    'vertical-align': (v) => ({ property: 'vertical-align', value: v }),
    'list-style': (v) => ({ property: 'list-style', value: v }),

    // custom shorthands used before
    'bg-': (v) => ({ property: 'background', value: v }),
    'radius-': (v) => ({ property: 'border-radius', value: v }),
  };

  /* ---------- Core parser & applier (with pseudo support) ---------- */

  function parseAndApply(el, jit) {
    if (!el || !el.className) return;
    const classAttr = el.className;
    let m;
    ARB_CLASS_RE.lastIndex = 0;
    while ((m = ARB_CLASS_RE.exec(classAttr)) !== null) {
      const rawPrefix = m[2]; // might contain pseudo parts (e.g., "hover:bg")
      const rawVal = m[3];
      const value = safeValue(rawVal);
      if (!value) continue;

      // split pseudo parts if present (pseudo:prefix or pseudo1:pseudo2:prefix)
      let pseudo = null;
      let prefixPart = rawPrefix;
      if (rawPrefix.indexOf(':') !== -1) {
        const parts = rawPrefix.split(':');
        pseudo = parts.slice(0, parts.length - 1).join(':'); // e.g., "hover" or "hover:before"
        prefixPart = parts[parts.length - 1];
      }

      const prefix = normalizePrefix(prefixPart);
      const handler = jit.handlers[prefix];

      try {
        const result = handler ? handler(value, el) : null;
        if (pseudo) {
          // For pseudo, we must create a CSS rule and add the generated class to the element
          let propMap;
          if (result && result.property) {
            propMap = { property: result.property, value: result.value };
          } else if (result && typeof result === 'object') {
            // object of prop: val
            propMap = result;
          } else {
            // fallback: treat prefix as property name
            const fallbackProp = prefix.replace(/[:_]/g, '-');
            propMap = { [fallbackProp]: value };
          }

          // convert pseudo tokens like "hover" to valid CSS pseudo (keep as-is)
          // allow pseudo like "hover" or "hover:before" — already formatted
          const generatedClass = addPseudoRule(propMap, pseudo, value);
          if (generatedClass) {
            // add created class to element
            try { el.classList.add(generatedClass); } catch (e) {
              // fallback: set data attribute
              const cur = el.getAttribute('data-orojit') || '';
              const tokens = cur ? cur.split(/\s+/) : [];
              if (tokens.indexOf(generatedClass) === -1) tokens.push(generatedClass);
              el.setAttribute('data-orojit', tokens.join(' '));
            }
          }
        } else {
          // inline style application (existing behavior)
          if (result && result.property) {
            el.style.setProperty(result.property, result.value);
          } else if (typeof result === 'object' && result !== null) {
            if (result.property && result.value) {
              el.style.setProperty(result.property, result.value);
            } else {
              Object.entries(result).forEach(([prop, val]) => {
                el.style.setProperty(prop, val);
              });
            }
          } else {
            // fallback: set property directly from prefix name
            const fallbackProp = prefix.replace(/[:_]/g, '-');
            el.style.setProperty(fallbackProp, value);
          }
        }
      } catch (err) {
        console.warn('OrochiJIT handler error', err);
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
    handlers: Object.assign({}, base_MAP),
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
      } catch (e) { }
      this._orochiJitInitialized = false;
    },

    _orochiJitInitialized: true,
    _internal: {
      // expose for debugging if needed
      _styleEl,
      _pseudoRuleMap,
    }
  };

  // aliases tolerant
  if (!OrochiJIT.handlers['bg-']) OrochiJIT.addHandler('bg-', base_MAP['bg']);
  if (!OrochiJIT.handlers['radius-']) OrochiJIT.addHandler('radius-', base_MAP['radius']);

  /* ---------- MutationObserver (internal unique name) ---------- */

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

  const _oroJitObserver = new MutationObserver(_mutationCallback);

  /* ---------- Initialization ---------- */

  function _init() {
    try {
      OrochiJIT.processRoot(document);
    } catch (e) {
      console.warn('OrochiJIT initial scan failed', e);
    }

    try {
      _oroJitObserver.observe(OrochiJIT.options.observeRoot, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: OrochiJIT.options.attributeFilter,
      });
    } catch (e) {
      console.warn('OrochiJIT observer failed to start', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init, { once: true });
  } else {
    _init();
  }

  /* ---------- Expose globally (safe) ---------- */
  const existing = global.OrochiJIT || {};
  Object.keys(OrochiJIT.handlers || {}).forEach(k => {
    if (!existing.handlers) existing.handlers = {};
    if (!existing.handlers[k]) existing.handlers[k] = OrochiJIT.handlers[k];
  });

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
