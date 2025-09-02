document.addEventListener('DOMContentLoaded', () => {
  const toggler = document.querySelector('.sidebar-toggler');
  const sidebar = document.getElementById('sidebar');
  toggler.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
});

sidebar.innerHTML = `
    <nav class="o-d-flex o-flex-column o-gap-3">
            <!-- Section : Commencer -->
            <div class="o-mb-3">
              <h4 class="o-text-primary o-mb-2 o-text-bold o-text-uppercase">
                📚 Commencer
              </h4>
              <div class="o-ms-3 o-d-flex o-flex-column o-gap-2">
                <a href="introduction.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-chevron-right o-me-2"></i>Introduction
                </a>
                <a href="installation.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-chevron-right o-me-2"></i>Installation
                </a>
              </div>
            </div>

            <!-- Section : Mise en page -->
            <div class="o-mb-3">
              <h4 class="o-text-dark o-mb-2 o-text-bold o-text-uppercase">
                🧱 Mise en page
              </h4>
              <div class="o-ms-3 o-d-flex o-flex-column o-gap-2">
                <a href="breakpoints.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-mobile-alt o-me-2"></i>Points d'arrêt
                </a>
                <a href="boxs.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-box o-me-2"></i>Conteneurs
                </a>

                <a href="spacing.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-space-bar o-me-2"></i>Espacement
                </a>
                <a href="grid.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-grid o-me-2"></i>Système de grille
                </a>
              </div>
            </div>

            <!-- Section : Composants -->
            <div class="o-mb-3">
              <h4 class="o-text-dark o-mb-2 o-text-bold o-text-uppercase">
                🧩 Composants
              </h4>
              <div class="o-ms-3 o-d-flex o-flex-column o-gap-2">
                <a href="buttons.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-square-rounded o-me-2"></i>Boutons
                </a>
                <a href="cards.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-layer o-me-2"></i>Cartes
                </a>
                <a href="alerts.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-message-alt-error o-me-2"></i>Alertes
                </a>

                <!-- Composants de navigation -->
                <a href="navbar.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-menu o-me-2"></i>Navigation
                </a>
                <a href="breadcrumbs.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-chevron-right o-me-2"></i>Fil d'Ariane
                </a>
                <a href="modals.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-window-open o-me-2"></i>Modales
                </a>
                <a href="tabs.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-tab o-me-2"></i>Onglets
                </a>
                <a href="accordions.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-list-plus o-me-2"></i>Accordéons
                </a>
                <a href="progress.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-loader-circle o-me-2"></i>Barres de progression
                </a>
              </div>
            </div>

            <!-- Section : Formulaires -->
            <div class="o-mb-3">
              <h4 class="o-text-dark o-mb-2 o-text-bold o-text-uppercase">
                📝 Formulaires
              </h4>
              <div class="o-ms-3 o-d-flex o-flex-column o-gap-2">
                <a href="inputs.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-input o-me-2"></i>Champs de saisie
                </a>
                <a href="checkboxes.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-checkbox o-me-2"></i>Cases à cocher
                </a>
                <a href="selects.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-list-ul o-me-2"></i>Listes déroulantes
                </a>
              </div>
            </div>

            <!-- Section : Utilitaires -->
            <div>
              <h4 class="o-text-dark o-mb-2 o-text-bold o-text-uppercase">
                ⚙️ Utilitaires
              </h4>
              <div class="o-ms-3 o-d-flex o-flex-column o-gap-2">
                <a href="spacing.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-space-bar o-me-2"></i>Espacement
                </a>

                <a href="flexbox.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-layout o-me-2"></i>Flexbox
                </a>

                <a href="grid.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-grid-alt o-me-2"></i>Grille CSS
                </a>

                <a href="position.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-move o-me-2"></i>Positionnement
                </a>

                <a href="visibility.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-show o-me-2"></i>Visibilité
                </a>

                <a href="shadows.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-shadow o-me-2"></i>Ombres
                </a>

                <a href="borders.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-border-all o-me-2"></i>Bordures
                </a>

                <a href="interactivity.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-pointer o-me-2"></i>Interactions
                </a>

                <a href="typography.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-text o-me-2"></i>Typographie
                </a>

                <a href="opacity.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-low-vision o-me-2"></i>Opacité
                </a>

                <a href="overflow.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-collapse o-me-2"></i>Overflow
                </a>

                <a href="z-index.html"
                  class="o-text-dark o-text-decoration-none o-hover-text-primary o-d-block o-ps-3 o-py-1 o-hover-bg-light o-rounded">
                  <i class="bx bx-layer o-me-2"></i>Z-index
                </a>
              </div>
            </div>
          </nav>
  `;

// Code copy functionality
document.querySelectorAll('.o-code-block').forEach((block) => {
  const copyBtn = document.createElement('button');
  copyBtn.className = 'o-code-copy';
  copyBtn.innerHTML = '<i class="oi oi-copy"></i>';

  copyBtn.addEventListener('click', () => {
    const code = block.querySelector('code').innerText;
    navigator.clipboard.writeText(code);
    copyBtn.innerHTML = '<i class="oi oi-check"></i>';
    setTimeout(() => (copyBtn.innerHTML = '<i class="oi oi-copy"></i>'), 2000);
  });

  block.appendChild(copyBtn);
});


//message alert

let alertMessage = document.getElementById('alert-message');
if (alertMessage) {
  alertMessage.innerHTML = `
    Cette page est en cours de construction. Merci de votre patience ! <a href="../../../soutenir.html" class="o-alert-link">Soutenir Orochi</a>
  `;
}
