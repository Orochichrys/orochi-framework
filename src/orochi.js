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

//  Orochi Modal
class OrochiModal {
  constructor() {
    this.modals = [];
    this.init();
  }

  init() {
    // Ouverture modale
    document.querySelectorAll('[data-o-modal-target]').forEach((trigger) => {
      const target = trigger.dataset.orochiModalTarget;
      const modal = document.querySelector(target);

      if (modal) {
        this.modals.push(modal);
        trigger.addEventListener('click', () => this.open(modal));
      }
    });

    // Fermeture
    document.querySelectorAll('[data-o-modal-close]').forEach((btn) => {
      btn.addEventListener('click', () => this.close(btn.closest('.o-modal')));
    });

    // Fermeture externe
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('o-modal')) {
        this.close(e.target);
      }
    });

    // Gestion ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeAll();
    });
  }

  open(modal) {
    this.closeAll();
    modal.setAttribute('aria-hidden', 'false');
    this.trapFocus(modal);
  }

  close(modal) {
    modal.setAttribute('aria-hidden', 'true');
    this.releaseFocus();
  }

  closeAll() {
    this.modals.forEach((modal) => this.close(modal));
  }

  trapFocus(modal) {
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
  }

  releaseFocus() {
    const trigger = document.querySelector(
      '[data-o-modal-target][aria-expanded="true"]'
    );
    if (trigger) trigger.focus();
  }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => new OrochiModal());
