let toggler = document.querySelector('.orochi-menu-toggler');
let togglerIcon = document.createElement('span');
togglerIcon.className = 'orochi-menu-toggler-icon';
// Icône initiale
togglerIcon.textContent = '☰';
toggler.appendChild(togglerIcon);

// Dropdown arrows
document.querySelectorAll('.orochi-dropdown > .orochi-menu-link').forEach(link => {
  link.textContent += ' ▾';
  const toggleArrow = () => {
    link.textContent = link.textContent.includes('▾') ?
      link.textContent.replace('▾','▴') : link.textContent.replace('▴','▾');
  };
  ['click','mouseover','mouseout'].forEach(evt =>
    link.addEventListener(evt, toggleArrow)
  );
});

// Toggle mobile menu
toggler.addEventListener('click', () => {
  let menu = document.querySelector('.orochi-menu');
  if(menu.classList.contains('orochi-menu-active')){
    menu.classList.remove('orochi-menu-active');
    togglerIcon.textContent = '☰';
  } else {
    menu.classList.add('orochi-menu-active');
    togglerIcon.textContent = '✖';
  }
});

//  Orochi Modal
class OrochiModal {
  constructor() {
    this.modals = [];
    this.init();
  }

  init() {
    // Ouverture modale
    document.querySelectorAll('[data-orochi-modal-target]').forEach(trigger => {
      const target = trigger.dataset.orochiModalTarget;
      const modal = document.querySelector(target);
      
      if(modal) {
        this.modals.push(modal);
        trigger.addEventListener('click', () => this.open(modal));
      }
    });

    // Fermeture
    document.querySelectorAll('[data-orochi-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => this.close(btn.closest('.orochi-modal')));
    });

    // Fermeture externe
    document.addEventListener('click', e => {
      if(e.target.classList.contains('orochi-modal')) {
        this.close(e.target);
      }
    });

    // Gestion ESC
    document.addEventListener('keydown', e => {
      if(e.key === 'Escape') this.closeAll();
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
    this.modals.forEach(modal => this.close(modal));
  }

  trapFocus(modal) {
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if(focusable.length) focusable[0].focus();
  }

  releaseFocus() {
    const trigger = document.querySelector('[data-orochi-modal-target][aria-expanded="true"]');
    if(trigger) trigger.focus();
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => new OrochiModal());