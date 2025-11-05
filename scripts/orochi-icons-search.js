document.addEventListener('DOMContentLoaded', function () {
  // Sélection des éléments
  const searchInput = document.querySelector('input[type="search"]');
  const searchForm = document.querySelector('form.o-d-flex');
  const iconbox = document.querySelectorAll(
    '.o-row > [class*="o-col-"]'
  );

  // Fonction de recherche
  function filterIcons(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    let found = false;

    // Réinitialiser tous les box
    iconbox.forEach((box) => {
      box.style.display = 'block';
    });

    // Si le terme est vide, on affiche tout et supprime le message d'erreur
    if (!term) {
      const noResults = document.getElementById('noResults');
      if (noResults) noResults.remove();
      return;
    }

    // Filtrer les icônes
    iconbox.forEach((box) => {
      const iconNameElement = box.querySelector('.o-text-phone');

      // Vérifier si l'élément existe avant d'accéder à ses propriétés
      if (iconNameElement) {
        const iconName = iconNameElement.textContent.toLowerCase();

        if (iconName.includes(term)) {
          found = true;
        } else {
          box.style.display = 'none';
        }
      }
    });

    // Afficher un message si aucun résultat trouvé
    const noResults = document.getElementById('noResults');
    if (!found) {
      if (!noResults) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.id = 'noResults';
        noResultsDiv.className = 'o-col-12 o-text-center o-p-4';
        noResultsDiv.innerHTML = `
          <div class="o-card o-p-4">
            <i class="oi oi-search o-icon-desktop"></i>
            <h3 class="o-mt-3">Aucun résultat trouvé</h3>
            <p>Aucune icône ne correspond à votre recherche : "${term}"</p>
          </div>
        `;
        document.querySelector('.o-row').appendChild(noResultsDiv);
      }
    } else if (noResults) {
      noResults.remove();
    }
  }

  // Écouteurs d'événements
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      filterIcons(this.value);
    });
  }

  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventbase(); // Empêche le rechargement de la page
      filterIcons(searchInput.value);
    });
  }
});
