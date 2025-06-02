let toggler = document.querySelector('.o-nav-toggler');
let togglerIcon = document.querySelector('.o-nav-toggler-icon');

// Icône initiale
togglerIcon.innerHTML = '<i class="oi oi-menu"></i>';

// Dropdown arrows
document.querySelectorAll('.o-dropdown > .o-nav-link').forEach((link) => {
  link.textContent += ' ▾';
  const toggleArrow = () => {
    link.textContent = link.textContent.includes('▾')
      ? link.textContent.replace('▾', '▴')
      : link.textContent.replace('▴', '▾');
  };
  ['click', 'mouseover', 'mouseout'].forEach((evt) =>
    link.addEventListener(evt, toggleArrow)
  );
});

// Toggle mobile menu corrigé
toggler.addEventListener('click', () => {
  let navWrapper = document.querySelector('.o-nav-wrapper');

  if (navWrapper.classList.contains('o-nav-wrapper-active')) {
    navWrapper.classList.remove('o-nav-wrapper-active');
    togglerIcon.innerHTML = '<i class="oi oi-menu"></i>';
  } else {
    navWrapper.classList.add('o-nav-wrapper-active');
    togglerIcon.innerHTML = '<i class="oi oi-close"></i>';
  }
});


// Animation au scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('o-visible');
        }
    });
});

document.querySelectorAll('.o-card-scroll-animate')
    .forEach(card => observer.observe(card));


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

// Initialisation
document.addEventListener('DOMContentLoaded', () => new OrochiModal());
