// Gestion complète des favoris
document.addEventListener('DOMContentLoaded', () => {
    // Charge les favoris au démarrage
    afficherFavoris();
    
    // Gère les clics sur les boutons Supprimer
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('supprimer-btn')) {
            const nomRecette = e.target.getAttribute('data-nom');
            supprimerFavori(nomRecette);
        }
    });
});

// Affiche les recettes favorites
function afficherFavoris() {
    const container = document.getElementById('recettes-favoris');
    const favoris = getFavoris();

    container.innerHTML = '';

    if (favoris.length === 0) {
        container.innerHTML = `
            <div class="col-span-4 text-center py-10">
                <p class="text-lg font-medium">Aucune recette favorite</p>
                <p class="text-sm text-gray-500">Ajoutez des recettes depuis la page "Toutes les recettes"</p>
            </div>
        `;
        return;
    }

    favoris.forEach(recette => {
        const card = `
            <div class="relative w-[285px] bg-white rounded-lg overflow-hidden shadow-lg">
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
                    <div>
                        <span class="text-xs text-gray-500">Temps :</span>
                        <span class="text-gray-700">${recette.temps_preparation}</span>
                    </div>
                    <button class="supprimer-btn bg-red-500 text-white px-4 py-2 rounded-md font-bold hover:bg-red-600 transition-colors"
                            data-nom="${recette.nom}">
                        Supprimer
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', card);
    });
}

// Récupère les favoris depuis le localStorage
function getFavoris() {
    return JSON.parse(localStorage.getItem('favoris')) || [];
}

// Supprime une recette des favoris
function supprimerFavori(nomRecette) {
    let favoris = getFavoris();
    favoris = favoris.filter(recette => recette.nom !== nomRecette);
    localStorage.setItem('favoris', JSON.stringify(favoris));
    
    // Affiche la notification
    showNotification('Recette supprimée des favoris !');
    
    // Rafraîchit l'affichage
    afficherFavoris();
}

// Affiche une notification
function showNotification(message) {
    const popup = document.getElementById('popup');
    popup.textContent = message;
    popup.classList.remove('hidden', 'opacity-0');
    popup.classList.add('opacity-100');
    
    setTimeout(() => {
        popup.classList.remove('opacity-100');
        popup.classList.add('opacity-0');
        setTimeout(() => popup.classList.add('hidden'), 500);
    }, 1500);
}