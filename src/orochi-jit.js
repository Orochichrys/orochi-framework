/*
 Orochi JIT Utilities v1.1 — Robust prefix normalization + perf tweak
 - Normalise les préfixes (supprime tirets finaux, underscore, trims)
 - Ne scan que les éléments ayant '[' dans leur class (perf)
 - Maintient les handlers et fallback en kebab-case
 - Expose OrochiJIT API
*/

/* ---------- Config / Helpers ---------- */

// whitelist simple pour valeurs autorisées (sécurité)
const SAFE_VALUE_RE = /^[0-9a-zA-Z\s\-\_\#\.\%\(\)\[\]\{\}\:;\/\+\>\<\=\'\",@]+$/i;

// RegEx patterns -> handler key and value inside []
const ARB_CLASS_RE = /(^|\s)([a-zA-Z0-9\-\_:]+)\[([^\]]+)\]/g;

// short utilities mapping: classPrefix -> cssProperty OR special handler
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
  // example special: shadow[...] translates to box-shadow
  'shadow': (v, el) => ({ property: 'box-shadow', value: v }),
};

/* ---------- Sanitisation ---------- */
function safeValue(val){
  if(val === undefined || val === null) return null;
  // trim
  const s = String(val).trim();
  if(!s) return null;
  // simple check (allow balanced brackets/parens) - basic
  if(!SAFE_VALUE_RE.test(s)) return null;
  const lowered = s.toLowerCase();
  if(lowered.includes('expression(') || lowered.includes('javascript:')) return null;
  return s;
}

/* ---------- Prefix normalization ---------- */
function normalizePrefix(raw){
  if(!raw) return raw;
  let s = String(raw).trim();
  // remove leading/trailing punctuation commonly accidental
  s = s.replace(/^[\-\_]+/, '');   // remove starting - or _
  s = s.replace(/[\-\_]+$/, '');   // remove trailing - or _
  // collapse multiple dashes/underscores to single dash
  s = s.replace(/[_]+/g, '-').replace(/-+/g, '-');
  // if contains colon modifiers like "hover:bg" -> keep full (we may support later)
  // For now, normalize to keep only the last segment after possible modifiers:
  // ex: "hover:bg" -> "bg", "md:hover:bg" -> "bg"
  if(s.includes(':')) {
    const parts = s.split(':');
    s = parts[parts.length - 1];
  }
  return s;
}

/* ---------- Parser & Applier ---------- */
function parseAndApply(el){
  if(!el || !el.className) return;

  const classAttr = el.className;
  let m;
  // iterate through matches
  while((m = ARB_CLASS_RE.exec(classAttr)) !== null){
    const rawPrefix = m[2]; // ex: bg or radius or w (may contain trailing -)
    const rawVal = m[3]; // value inside []
    const value = safeValue(rawVal);
    if(!value) continue; // skip unsafe

    const prefix = normalizePrefix(rawPrefix);

    // if a handler exists in OrochiJIT.handlers, call it
    const handler = OrochiJIT.handlers[prefix];
    if(handler){
      try {
        const result = handler(value, el);
        if(result && result.property){
          el.style.setProperty(result.property, result.value);
        } else if(typeof result === 'object'){
          // support returning multiple props or a map
          // if object shape is { property: 'x', value: 'y' } it's handled above,
          // else treat as map of prop->val
          if(result.property && result.value) {
            el.style.setProperty(result.property, result.value);
          } else {
            Object.entries(result).forEach(([prop, val]) => el.style.setProperty(prop, val));
          }
        }
      } catch(e){
        console.warn('OrochiJIT handler error', e);
      }
    } else {
      // fallback: treat prefix as CSS property kebab-case (normalize underscores -> hyphens)
      const fallbackProp = prefix.replace(/[:_]/g,'-');
      el.style.setProperty(fallbackProp, value);
    }
  }
}

// for classes without brackets like "text-white" we still want to support some tokens
function applyTokenClasses(el){
  if(!el || !el.classList) return;
  if(el.classList.contains('text-white')) el.style.setProperty('color', '#fff');
  if(el.classList.contains('text-black')) el.style.setProperty('color', '#000');
  // add more small tokens here if needed
}

/* ---------- Public API & Handlers registration ---------- */
const OrochiJIT = {
  handlers: {},
  addHandler(name, fn){
    if(!name || typeof fn !== 'function') throw new Error('Invalid handler');
    this.handlers[name] = fn;
  },
  processElement(el){
    // perf: only process elements that have '[' in className OR match token classes
    if(!el || !el.className) return;
    const c = el.className;
    if(c.indexOf('[') === -1 && !el.classList.contains('text-white') && !el.classList.contains('text-black')) return;
    parseAndApply(el);
    applyTokenClasses(el);
  },
  processRoot(root = document){
    // process existing elements that include '[' for perf
    // also process root itself if it has classes and '['
    const selector = '[class*="["]';
    if(root instanceof Element) {
      if(root.className && root.className.indexOf('[') !== -1) this.processElement(root);
      root.querySelectorAll && root.querySelectorAll(selector).forEach(el => this.processElement(el));
    } else {
      // root may be document
      document.querySelectorAll && document.querySelectorAll(selector).forEach(el => this.processElement(el));
    }
  }
};

// register default handlers
Object.entries(DEFAULT_MAP).forEach(([k,fn]) => OrochiJIT.addHandler(k, fn));

// Add small aliases to be extra tolerant (bg- -> bg etc.)
OrochiJIT.addHandler('bg-', DEFAULT_MAP['bg']);
OrochiJIT.addHandler('radius-', DEFAULT_MAP['radius']);

/* ---------- MutationObserver (auto apply to new nodes) ---------- */
const observer = new MutationObserver(muts => {
  for(const mut of muts){
    if(mut.type === 'attributes' && mut.attributeName === 'class' && mut.target){
      OrochiJIT.processElement(mut.target);
    }
    if(mut.addedNodes && mut.addedNodes.length){
      mut.addedNodes.forEach(node => {
        if(node.nodeType !== 1) return;
        // perf: only walk nodes that have class attr containing '['
        if(node.className && node.className.indexOf('[') !== -1) {
          OrochiJIT.processElement(node);
        }
        node.querySelectorAll && node.querySelectorAll('[class*="["]').forEach(el => OrochiJIT.processElement(el));
      });
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  OrochiJIT.processRoot(document);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });
});

// expose globally for devs
window.OrochiJIT = OrochiJIT;