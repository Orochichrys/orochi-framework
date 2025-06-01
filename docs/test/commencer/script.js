 document.addEventListener("DOMContentLoaded", () => {
        const toggler = document.querySelector(".sidebar-toggler");
        const sidebar = document.getElementById("sidebar");
        toggler.addEventListener("click", () => {
          sidebar.classList.toggle("active");
        });
      });

  sidebar.innerHTML = `
    <nav class="orochi-d-flex orochi-flex-column orochi-gap-3">
            <!-- Section : Commencer -->
            <div class="orochi-mb-3">
              <h4 class="orochi-text-primary orochi-mb-2 orochi-text-bold orochi-text-uppercase">
                📚 Commencer
              </h4>
              <div class="orochi-ms-3 orochi-d-flex orochi-flex-column orochi-gap-2">
                <a href="introduction.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-chevron-right orochi-me-2"></i>Introduction
                </a>
                <a href="installation.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-chevron-right orochi-me-2"></i>Installation
                </a>
              </div>
            </div>

            <!-- Section : Mise en page -->
            <div class="orochi-mb-3">
              <h4 class="orochi-text-dark orochi-mb-2 orochi-text-bold orochi-text-uppercase">
                🧱 Mise en page
              </h4>
              <div class="orochi-ms-3 orochi-d-flex orochi-flex-column orochi-gap-2">
                <a href="breakpoints.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-mobile-alt orochi-me-2"></i>Points d'arrêt
                </a>
                <a href="containers.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-box orochi-me-2"></i>Conteneurs
                </a>

                <a href="spacing.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-space-bar orochi-me-2"></i>Espacement
                </a>
                <a href="grid.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-grid orochi-me-2"></i>Système de grille
                </a>
              </div>
            </div>

            <!-- Section : Composants -->
            <div class="orochi-mb-3">
              <h4 class="orochi-text-dark orochi-mb-2 orochi-text-bold orochi-text-uppercase">
                🧩 Composants
              </h4>
              <div class="orochi-ms-3 orochi-d-flex orochi-flex-column orochi-gap-2">
                <a href="buttons.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-square-rounded orochi-me-2"></i>Boutons
                </a>
                <a href="cards.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-layer orochi-me-2"></i>Cartes
                </a>
                <a href="alerts.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-message-alt-error orochi-me-2"></i>Alertes
                </a>

                <!-- Composants de navigation -->
                <a href="navbar.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-menu orochi-me-2"></i>Navigation
                </a>
                <a href="breadcrumbs.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-chevron-right orochi-me-2"></i>Fil d'Ariane
                </a>
                <a href="modals.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-window-open orochi-me-2"></i>Modales
                </a>
                <a href="tabs.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-tab orochi-me-2"></i>Onglets
                </a>
                <a href="accordions.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-list-plus orochi-me-2"></i>Accordéons
                </a>
                <a href="progress.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-loader-circle orochi-me-2"></i>Barres de progression
                </a>
              </div>
            </div>

            <!-- Section : Formulaires -->
            <div class="orochi-mb-3">
              <h4 class="orochi-text-dark orochi-mb-2 orochi-text-bold orochi-text-uppercase">
                📝 Formulaires
              </h4>
              <div class="orochi-ms-3 orochi-d-flex orochi-flex-column orochi-gap-2">
                <a href="inputs.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-input orochi-me-2"></i>Champs de saisie
                </a>
                <a href="checkboxes.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-checkbox orochi-me-2"></i>Cases à cocher
                </a>
                <a href="selects.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-list-ul orochi-me-2"></i>Listes déroulantes
                </a>
              </div>
            </div>

            <!-- Section : Utilitaires -->
            <div>
              <h4 class="orochi-text-dark orochi-mb-2 orochi-text-bold orochi-text-uppercase">
                ⚙️ Utilitaires
              </h4>
              <div class="orochi-ms-3 orochi-d-flex orochi-flex-column orochi-gap-2">
                <a href="spacing.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-space-bar orochi-me-2"></i>Espacement
                </a>

                <a href="flexbox.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-layout orochi-me-2"></i>Flexbox
                </a>

                <a href="grid.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-grid-alt orochi-me-2"></i>Grille CSS
                </a>

                <a href="position.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-move orochi-me-2"></i>Positionnement
                </a>

                <a href="visibility.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-show orochi-me-2"></i>Visibilité
                </a>

                <a href="shadows.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-shadow orochi-me-2"></i>Ombres
                </a>

                <a href="borders.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-border-all orochi-me-2"></i>Bordures
                </a>

                <a href="interactivity.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-pointer orochi-me-2"></i>Interactions
                </a>

                <a href="typography.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-text orochi-me-2"></i>Typographie
                </a>

                <a href="opacity.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-low-vision orochi-me-2"></i>Opacité
                </a>

                <a href="overflow.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-collapse orochi-me-2"></i>Overflow
                </a>

                <a href="z-index.html"
                  class="orochi-text-dark orochi-text-decoration-none orochi-hover-text-primary orochi-d-block orochi-ps-3 orochi-py-1 orochi-hover-bg-light orochi-rounded">
                  <i class="bx bx-layer orochi-me-2"></i>Z-index
                </a>
              </div>
            </div>
          </nav>
  `;

// Code copy functionality
document.querySelectorAll('.orochi-code-block').forEach(block => {
  const copyBtn = document.createElement('button');
  copyBtn.className = 'orochi-code-copy';
  copyBtn.innerHTML = '<i class="oi oi-copy"></i>';
  
  copyBtn.addEventListener('click', () => {
    const code = block.querySelector('code').innerText;
    navigator.clipboard.writeText(code);
    copyBtn.innerHTML = '<i class="oi oi-check"></i>';
    setTimeout(() => copyBtn.innerHTML = '<i class="oi oi-copy"></i>', 2000);
  });
  
  block.appendChild(copyBtn);
});

