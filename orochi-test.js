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