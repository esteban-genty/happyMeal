// favoris.js
document.addEventListener('DOMContentLoaded', () => {
    const FAVORIS_KEY = 'happyMealFavoris';
    const recettesFavorisContainer = document.getElementById('recettes-favoris');
    const popup = document.getElementById('popup');

    // Fonction pour sauvegarder les favoris dans localStorage
    const sauvegarderFavoris = (favoris) => {
        localStorage.setItem(FAVORIS_KEY, JSON.stringify(favoris));
    };

    // Fonction pour charger les favoris depuis localStorage
    const chargerFavoris = () => {
        const favoris = localStorage.getItem(FAVORIS_KEY);
        return favoris ? JSON.parse(favoris) : [];
    };

    // Fonction pour ajouter/supprimer une recette des favoris
    const toggleFavori = (recette) => {
        const favoris = chargerFavoris();
        const index = favoris.findIndex(f => f.id === recette.id);
        
        if (index === -1) {
            favoris.push(recette);
        } else {
            favoris.splice(index, 1);
            // Afficher le popup de suppression seulement si on est sur favoris.html
            if (popup) {
                popup.classList.remove('hidden');
                popup.classList.add('opacity-100');
                setTimeout(() => {
                    popup.classList.remove('opacity-100');
                    popup.classList.add('opacity-0');
                    setTimeout(() => popup.classList.add('hidden'), 500);
                }, 2000);
            }
        }
        
        sauvegarderFavoris(favoris);
        return index === -1;
    };

    // Fonction pour créer une carte de recette pour la page favoris
    const creerCarteFavori = (recette) => {
        const card = document.createElement('div');
        card.className = 'relative w-[285px] bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105';
        card.innerHTML = `
            <div class="relative h-64 overflow-hidden">
                <img src="${recette.image}" alt="${recette.nom}" class="w-full h-full object-cover">
                <div class="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md">
                    ${recette.nom}
                </div>
                <div class="absolute top-3 right-3 bg-white bg-opacity-80 px-3 py-1 rounded-md">
                    ${recette.categorie}
                </div>
            </div>
            <div class="flex justify-between items-center p-4 bg-gray-100">
                <div class="flex flex-col">
                    <span class="text-xs text-gray-500">Temps :</span>
                    <span class="text-gray-700">${recette.temps_preparation}</span>
                </div>
                <button class="favori-btn bg-red-500 text-white px-4 py-2 rounded-md font-bold hover:bg-red-600 transition-colors" data-id="${recette.id}">
                    ♥ Supprimer
                </button>
            </div>
        `;
        return card;
    };

    // Afficher les recettes favorites
    const afficherFavoris = () => {
        if (!recettesFavorisContainer) return;
        
        const favoris = chargerFavoris();
        recettesFavorisContainer.innerHTML = '';
        
        if (favoris.length === 0) {
            recettesFavorisContainer.innerHTML = `
                <div class="col-span-4 text-center py-10">
                    <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="mt-2 text-lg font-medium">Aucune recette favorite</p>
                    <p class="text-sm text-gray-500">Ajoutez des recettes à vos favoris</p>
                </div>
            `;
            return;
        }
        
        favoris.forEach(recette => {
            recettesFavorisContainer.appendChild(creerCarteFavori(recette));
        });
        
        // Gérer les clics sur les boutons "Supprimer"
        document.querySelectorAll('.favori-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const favoris = chargerFavoris();
                const recette = favoris.find(f => f.id === id);
                if (recette) {
                    toggleFavori(recette);
                    afficherFavoris(); // Rafraîchir l'affichage
                }
            });
        });
    };

    // Initialiser les boutons favoris sur la page recette.html
    const initBoutonsFavoris = () => {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.bg-orange-300') && e.target.closest('.bg-orange-300').textContent.includes('Favori')) {
                const card = e.target.closest('.relative.w-\\[285px\\]');
                if (card) {
                    const nom = card.querySelector('.absolute.bottom-3.left-3').textContent.trim();
                    const categorie = card.querySelector('.absolute.top-3.right-3').textContent.trim();
                    const temps_preparation = card.querySelector('.text-gray-700').textContent.trim();
                    const image = card.querySelector('img').src;
                    
                    // Créer un objet recette simplifié (vous devrez peut-être l'adapter à votre structure de données)
                    const recette = {
                        id: Date.now(), // Utiliser un ID unique (à remplacer par l'ID réel si disponible)
                        nom,
                        categorie,
                        temps_preparation,
                        image
                    };
                    
                    const estAjoute = toggleFavori(recette);
                    const btn = e.target.closest('button');
                    
                    if (estAjoute) {
                        btn.textContent = '♥ Favori';
                        btn.classList.remove('bg-orange-300', 'hover:bg-orange-400');
                        btn.classList.add('bg-red-500', 'hover:bg-red-600');
                    } else {
                        btn.textContent = '♡ Favori';
                        btn.classList.remove('bg-red-500', 'hover:bg-red-600');
                        btn.classList.add('bg-orange-300', 'hover:bg-orange-400');
                    }
                }
            }
        });
    };

    // Initialiser en fonction de la page
    if (window.location.pathname.includes('favoris.html')) {
        afficherFavoris();
    } else {
        initBoutonsFavoris();
    }
});