document.addEventListener('DOMContentLoaded', () => {
  const toggler = document.querySelector('.o-burger');
  const togglerIcon = document.querySelector('.o-burger-icon');

  // Icône initiale
  if (togglerIcon) {
    togglerIcon.innerHTML = '<i class="oi oi-menu"></i>';
  }

  // Dropdown arrows
  document.querySelectorAll('.o-dropdown > .o-nav-link').forEach((link) => {
    if (!link.textContent.includes('▾') && !link.textContent.includes('▴')) {
      link.textContent += ' ▾';
    }

    const toggleArrow = () => {
      link.textContent = link.textContent.includes('▾')
        ? link.textContent.replace('▾', '▴')
        : link.textContent.replace('▴', '▾');
    };

    ['click', 'mouseover', 'mouseout'].forEach((evt) =>
      link.addEventListener(evt, toggleArrow)
    );
  });

  // Menu mobile toggle
  if (toggler) {
    toggler.addEventListener('click', () => {
      const navWrapper = document.querySelector('.o-menu');
      if (!navWrapper || !togglerIcon) return;

      const isActive = navWrapper.classList.contains(
        'o-menu-active'
      );
      navWrapper.classList.toggle('o-menu-active');

      togglerIcon.innerHTML = isActive
        ? '<i class="oi oi-menu"></i>'
        : '<i class="oi oi-close"></i>';
    });
  }
});

// Configuration de l'Intersection Observer
const observerOptions = {
  threshold: 0.1, // 10% de l'élément visible
  rootMargin: '0px 0px -50px 0px', // Déclenche 50px avant la visibilité
};

// Callback de l'observer
const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Ajouter la classe visible pour déclencher l'animation
      entry.target.classList.add('o-visible');

      // Optionnel : arrêter d'observer une fois animé
      observer.unobserve(entry.target);
    }
  });
};

// Créer l'observer
const observer = new IntersectionObserver(observerCallback, observerOptions);

// Liste de toutes les classes d'animation
const animationClasses = [
  '.o-card-scroll-animate',
  '.o-fade-animate',
  '.o-slide-left',
  '.o-slide-right',
  '.o-slide-down',
  '.o-zoom-animate',
  '.o-zoom-out-animate',
  '.o-rotate-animate',
  '.o-rotate-left',
  '.o-rotate-right',
  '.o-flip-x',
  '.o-flip-y',
  '.o-bounce-animate',
  '.o-swing-animate',
  '.o-unfold-animate',
  '.o-slide-diagonal-tl',
  '.o-slide-diagonal-tr',
  '.o-slide-diagonal-bl',
  '.o-slide-diagonal-br',
];

// Observer tous les éléments avec des classes d'animation
document.querySelectorAll(animationClasses.join(', ')).forEach((element) => {
  observer.observe(element);
});

// Fonction utilitaire pour réinitialiser les animations (optionnel)
function resetAnimations() {
  document.querySelectorAll(animationClasses.join(', ')).forEach((element) => {
    element.classList.remove('o-visible');
    observer.observe(element);
  });
}

// Fonction pour déclencher manuellement une animation (optionnel)
function triggerAnimation(element) {
  if (element && !element.classList.contains('o-visible')) {
    element.classList.add('o-visible');
  }
}

// Orochi Modal System – Fichier 100% JS complet

class OrochiModal {
  constructor() {
    this.modals = [];
    this.activeModal = null;
    this.previousActiveElement = null;
    this.init();
  }

  init() {
    // Initialiser toutes les modales existantes
    document.querySelectorAll('.o-modal').forEach(modal => {
      this.modals.push(modal);
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      if (!modal.id) {
        modal.id = `modal-${Math.random().toString(36).substr(2, 9)}`;
      }
    });

    // Triggers d'ouverture
    document.querySelectorAll('[data-o-modal-target]').forEach(trigger => {
      const selector = trigger.dataset.oModalTarget;
      const modal = document.querySelector(selector);
      if (!modal) {
        console.warn(`Modal target "${selector}" not found for:`, trigger);
        return;
      }
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-controls', modal.id);
      trigger.addEventListener('click', e => {
        e.preventDefault();
        this.open(modal, trigger);
      });
    });

    // Boutons de fermeture
    document.querySelectorAll('[data-o-modal-close]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const m = btn.closest('.o-modal');
        if (m) this.close(m);
      });
    });

    // Clic sur overlay
    document.addEventListener('click', e => {
      if (e.target.classList.contains('o-modal')) {
        this.close(e.target);
      }
    });

    // Échap pour fermer
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close(this.activeModal);
      }
    });
  }

  open(modal, trigger = null) {
    // Ferme toutes les modales avant d’en rouvrir une
    this.closeAll();

    // Sauvegarde et attributs
    this.previousActiveElement = trigger || document.activeElement;
    this.activeModal = modal;
    modal.setAttribute('aria-hidden', 'false');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');

    // Bloquer le scroll
    document.body.classList.add('o-modal-open');

    // Focus trap
    setTimeout(() => this.trapFocus(modal), 100);

    // Événement custom
    modal.dispatchEvent(new CustomEvent('modalOpen', {
      detail: { modal, trigger }
    }));
  }

  close(modal) {
    if (!modal || modal.getAttribute('aria-hidden') === 'true') return;

    modal.setAttribute('aria-hidden', 'true');

    // Rétablir scroll
    document.body.classList.remove('o-modal-open');

    // Reset aria-expanded sur tous les triggers liés
    document.querySelectorAll('[data-o-modal-target]').forEach(trigger => {
      if (document.querySelector(trigger.dataset.oModalTarget) === modal) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Rendre le focus
    this.releaseFocus();

    // Clear active
    if (this.activeModal === modal) this.activeModal = null;

    // Événement custom
    modal.dispatchEvent(new CustomEvent('modalClose', {
      detail: { modal }
    }));
  }

  closeAll() {
    this.modals.forEach(m => {
      if (m.getAttribute('aria-hidden') === 'false') {
        this.close(m);
      }
    });
  }

  trapFocus(modal) {
    const focusables = modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details, summary'
    );
    const first = focusables[0];
    const last  = focusables[focusables.length - 1];
    first?.focus();

    const handler = e => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first?.focus();
      }
    };

    if (modal._tabListener) {
      modal.removeEventListener('keydown', modal._tabListener);
    }
    modal._tabListener = handler;
    modal.addEventListener('keydown', handler);
  }

  releaseFocus() {
    if (this.previousActiveElement?.focus) {
      try { this.previousActiveElement.focus(); } catch {}
    }
    this.previousActiveElement = null;
  }

  // API publique
  isOpen(modal) { return modal.getAttribute('aria-hidden') === 'false'; }
  getActiveModal() { return this.activeModal; }

  openById(id) {
    const m = document.getElementById(id);
    if (m) this.open(m);
    else console.warn(`Modal with ID "${id}" not found`);
  }

  closeById(id) {
    const m = document.getElementById(id);
    if (m) this.close(m);
  }

  destroy() {
    this.closeAll();
    document.body.classList.remove('o-modal-open');
    this.modals.forEach(m => {
      if (m._tabListener) m.removeEventListener('keydown', m._tabListener);
    });
  }
}

// Initialisation automatique
let orochiModalInstance = null;
document.addEventListener('DOMContentLoaded', () => {
  orochiModalInstance = new OrochiModal();
});

// Fonctions globales simples
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return console.warn(`Modal "${modalId}" introuvable`);
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('o-modal-open');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return console.warn(`Modal "${modalId}" introuvable`);
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('o-modal-open');
}

// Exports globaux
window.OrochiModal = OrochiModal;
window.orochiModal  = () => orochiModalInstance;
window.openModal    = openModal;
window.closeModal   = closeModal;
