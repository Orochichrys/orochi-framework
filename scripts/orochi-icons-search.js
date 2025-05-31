 document.addEventListener('DOMContentLoaded', function () {
        // Sélection des éléments
        const searchInput = document.querySelector('input[type="search"]');
        const searchForm = document.querySelector('form.orochi-d-flex');
        const iconContainers = document.querySelectorAll('.orochi-row > [class*="orochi-col-"]');

        // Fonction de recherche
        function filterIcons(searchTerm) {
            const term = searchTerm.toLowerCase().trim();
            let found = false;

            // Réinitialiser tous les conteneurs
            iconContainers.forEach(container => {
                container.style.display = 'block';
            });

            // Si le terme est vide, on affiche tout et supprime le message d'erreur
            if (!term) {
                const noResults = document.getElementById('noResults');
                if (noResults) noResults.remove();
                return;
            }

            // Filtrer les icônes
            iconContainers.forEach(container => {
                const iconNameElement = container.querySelector('.orochi-text-sm');

                // Vérifier si l'élément existe avant d'accéder à ses propriétés
                if (iconNameElement) {
                    const iconName = iconNameElement.textContent.toLowerCase();

                    if (iconName.includes(term)) {
                        found = true;
                    } else {
                        container.style.display = 'none';
                    }
                }
            });

            // Afficher un message si aucun résultat trouvé
            const noResults = document.getElementById('noResults');
            if (!found) {
                if (!noResults) {
                    const noResultsDiv = document.createElement('div');
                    noResultsDiv.id = 'noResults';
                    noResultsDiv.className = 'orochi-col-12 orochi-text-center orochi-p-4';
                    noResultsDiv.innerHTML = `
          <div class="orochi-card orochi-p-4">
            <i class="oi oi-search orochi-icon-xl"></i>
            <h3 class="orochi-mt-3">Aucun résultat trouvé</h3>
            <p>Aucune icône ne correspond à votre recherche : "${term}"</p>
          </div>
        `;
                    document.querySelector('.orochi-row').appendChild(noResultsDiv);
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
                e.preventDefault(); // Empêche le rechargement de la page
                filterIcons(searchInput.value);
            });
        }
    });


