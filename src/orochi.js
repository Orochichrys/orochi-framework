document.addEventListener('DOMContentLoaded', () => {
  const toggler = document.querySelector('.o-navbar-toggler');
  const togglerIcon = document.querySelector('.o-navbar-toggler-icon');

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
      const navWrapper = document.querySelector('.o-navbar-nav-wrapper');
      if (!navWrapper || !togglerIcon) return;

      const isActive = navWrapper.classList.contains(
        'o-navbar-nav-wrapper-active'
      );
      navWrapper.classList.toggle('o-navbar-nav-wrapper-active');

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

// Orochi Modal System
class OrochiModal {
  constructor() {
    this.modals = [];
    this.activeModal = null;
    this.previousActiveElement = null;
    this.init();
  }

  init() {
    // Initialiser toutes les modales
    document.querySelectorAll('.o-modal').forEach(modal => {
      this.modals.push(modal);
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      
      // Ajouter un ID si manquant
      if (!modal.id) {
        modal.id = `modal-${Math.random().toString(36).substr(2, 9)}`;
      }
    });

    // Gestionnaires d'ouverture
    document.querySelectorAll('[data-o-modal-target]').forEach(trigger => {
      const targetSelector = trigger.dataset.oModalTarget;
      const modal = document.querySelector(targetSelector);

      if (modal) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          this.open(modal, trigger);
        });
        
        // Ajouter les attributs d'accessibilité
        trigger.setAttribute('aria-haspopup', 'dialog');
        trigger.setAttribute('aria-controls', modal.id);
      } else {
        console.warn(`Modal target "${targetSelector}" not found for trigger:`, trigger);
      }
    });

    // Gestionnaires de fermeture
    document.querySelectorAll('[data-o-modal-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = btn.closest('.o-modal');
        if (modal) {
          this.close(modal);
        }
      });
    });

    // Fermeture par clic sur l'overlay
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('o-modal')) {
        this.close(e.target);
      }
    });

    // Gestion de la touche Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close(this.activeModal);
      }
    });
  }

  open(modal, trigger = null) {
    // Fermer toute modal active
    this.closeAll();

    // Stocker l'élément actif pour y revenir
    this.previousActiveElement = trigger || document.activeElement;

    // Ouvrir la modal
    this.activeModal = modal;
    modal.setAttribute('aria-hidden', 'false');
    
    // Mettre à jour l'attribut du trigger
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'true');
    }

    // Bloquer le scroll du body
    document.body.style.overflow = 'hidden';

    // Gérer le focus
    setTimeout(() => {
      this.trapFocus(modal);
    }, 100);

    // Événement personnalisé
    modal.dispatchEvent(new CustomEvent('modalOpen', {
      detail: { modal, trigger }
    }));
  }

  close(modal) {
    if (!modal || modal.getAttribute('aria-hidden') === 'true') {
      return;
    }

    modal.setAttribute('aria-hidden', 'true');
    
    // Restaurer le scroll du body
    document.body.style.overflow = '';

    // Réinitialiser les attributs des triggers
    document.querySelectorAll('[data-o-modal-target]').forEach(trigger => {
      const targetSelector = trigger.dataset.oModalTarget;
      if (document.querySelector(targetSelector) === modal) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Restaurer le focus
    this.releaseFocus();

    // Réinitialiser la modal active
    if (this.activeModal === modal) {
      this.activeModal = null;
    }

    // Événement personnalisé
    modal.dispatchEvent(new CustomEvent('modalClose', {
      detail: { modal }
    }));
  }

  closeAll() {
    this.modals.forEach(modal => {
      if (modal.getAttribute('aria-hidden') === 'false') {
        this.close(modal);
      }
    });
  }

  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details, summary'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Gérer la navigation par Tab
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    // Supprimer l'ancien listener s'il existe
    if (modal._tabListener) {
      modal.removeEventListener('keydown', modal._tabListener);
    }

    // Ajouter le nouveau listener
    modal._tabListener = handleTabKey;
    modal.addEventListener('keydown', handleTabKey);
  }

  releaseFocus() {
    // Restaurer le focus sur l'élément précédent
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      try {
        this.previousActiveElement.focus();
      } catch (e) {
        // Ignorer les erreurs de focus
      }
    }
    this.previousActiveElement = null;
  }

  // Méthodes utilitaires publiques
  isOpen(modal) {
    return modal.getAttribute('aria-hidden') === 'false';
  }

  getActiveModal() {
    return this.activeModal;
  }

  openById(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      this.open(modal);
    } else {
      console.warn(`Modal with ID "${modalId}" not found`);
    }
  }

  closeById(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      this.close(modal);
    }
  }

  destroy() {
    // Nettoyer tous les event listeners
    this.closeAll();
    document.body.style.overflow = '';
    
    // Supprimer les event listeners des modales
    this.modals.forEach(modal => {
      if (modal._tabListener) {
        modal.removeEventListener('keydown', modal._tabListener);
      }
    });
  }
}

// Initialisation automatique
let orochiModalInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  orochiModalInstance = new OrochiModal();
});

// Exporter pour utilisation globale
window.OrochiModal = OrochiModal;
window.orochiModal = () => orochiModalInstance;