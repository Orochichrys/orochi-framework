const iconNames = [
  'menu',
  'close',
  'download',
  'arrow-up',
  'arrow-left',
  'arrow-right',
  'arrow-down',
  'arrow-circle-up',
  'arrow-circle-left',
  'arrow-circle-right',
  'arrow-circle-down',
  'search',
  'user',
  'user-fill',
  'user-plus',
  'user-plus-fill',
  'user-minus',
  'user-close',
  'user-check',
  'users',
  'lock',
  'lock-fill',
  'mail',
  'mail-fill',
  'bell',
  'camera',
  'settings',
  'settings-fill',
  'calendar',
  'edit',
  'trash',
  'trash-2',
  'share',
  'share-2',
  'home',
  'heart',
  'star',
  'plus',
  'check',
  'info',
  'alert-circle',
  'external-link',
  'phone',
  'message-square',
  'message-circle',
  'video',
  'image',
  'music',
  'folder',
  'hash',
  'shopping-cart',
  'bookmark',
  'map',
  'cloud',
  'upload',
  'refresh-cw',
  'refresh-ccw',
  'rotate-cw',
  'rotate-ccw',
  'printer',
  'filter',
  'eye',
  'clock',
  'copy',
  'spark',
  'inbox',
  'plus-circle',
  'compass',
];

// let numberOfIcons = iconNames.length;
// let iconsDisponibles = document.getElementById("iconsDisponibles");
// if (iconsDisponibles) {
//     iconsDisponibles.innerHTML = `<h2>Nombre d'icônes disponibles : ${numberOfIcons}</h2>`;
// }

const container = document.querySelector('.o-row');

iconNames.forEach((name) => {
  const col = document.createElement('div');
  col.className = 'o-col-12 o-col-xs-4 o-col-sm-4 o-col-md-4 o-col-lg-3';

  col.innerHTML = `
            <div class="o-card o-p-4 o-center-content">
                <i class="oi oi-${name}"></i>
            </div>
            <div class="o-text-sm o-text-center o-mt-2">${name}</div>
        `;

  container.appendChild(col);
});
