let orochiMenuToggler = document.querySelector('.orochi-menu-toggler');
let orochiMenuLinkAllIcon = document.querySelectorAll('.orochi-dropdown .orochi-menu-link');

// let orochiMenuOverlay = document.querySelector('.orochi-menu-overlay');

let orochiMenuTogglerIcon = document.querySelector('.orochi-menu-toggler-icon');
orochiMenuTogglerIcon.textContent = '☰';

orochiMenuLinkAllIcon.forEach(orochiDropdownItem => {
    orochiDropdownItem.textContent = orochiDropdownItem.textContent + '▾';
    
    const toggleIcon = () => {
        orochiDropdownItem.textContent = orochiDropdownItem.textContent.includes('▾') ? 
        orochiDropdownItem.textContent.replace('▾', '▴') : 
        orochiDropdownItem.textContent.replace('▴', '▾');
    };

    orochiDropdownItem.addEventListener('click', toggleIcon);
    orochiDropdownItem.addEventListener('mouseover', toggleIcon);
    orochiDropdownItem.addEventListener('mouseout', toggleIcon);
});

orochiMenuToggler.addEventListener('click', () => {
    let orochiMenu = document.querySelector('.orochi-menu');
    if (orochiMenu.classList.contains('orochi-menu-active')){
        orochiMenu.classList.remove('orochi-menu-active');
        orochiMenuTogglerIcon.textContent = '☰';
    }
    else{
        orochiMenu.classList.add('orochi-menu-active'); 
        orochiMenuTogglerIcon.textContent = '✖';
    }
});

// document.addEventListener("DOMContentLoaded", function () {
//     document.querySelectorAll(".orochi-dropdown > .orochi-menu-link").forEach(link => {
//       link.addEventListener("click", function (e) {
//         e.preventDefault();
//         let dropdownMenu = this.nextElementSibling;
//         dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
//       });
//     });
//   });
  
