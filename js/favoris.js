function afficherFavoris() {
    const container = document.getElementById('recettes-favoris');
    let recettesFavoris = JSON.parse(localStorage.getItem('recettes')) || [];

    //console.log('Recettes enregistrées :', recettesFavoris);


    container.innerHTML = '';

    if (recettesFavoris.length === 0) {
        container.innerHTML = '<p class="text-center w-full pt-4">Aucune recette enregistrée.</p>';
        return;
    }else{
        recettesFavoris.forEach(recette => {
            const recetteDiv = document.createElement('div');
            recetteDiv.classList.add('recette');
            recetteDiv.innerHTML = `
            <div class="relative h-64 overflow-hidden">
                <img 
                    src="${recette.image}" 
                    alt="${recette.nom}" 
                    class="w-full h-full object-cover"
                >
            <div class="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md">
                ${recette.nom}
            </div>
            <div class="absolute top-3 right-3 bg-white bg-opacity-80 px-3 py-1 rounded-md">
                ${recette.categorie}
            </div>
        </div>
        <div class="recette-footer flex justify-between items-center p-4 bg-gray-100"">
            <div class="flex flex-col">
                <span class="text-xs text-gray-500">Temps :</span>
                <span class="text-gray-700">${recette.temps_preparation}</span>
            </div>
            <button type="button" class="favoris-btn bg-orange-300 text-white px-4 py-2 rounded-md font-bold hover:bg-orange-400 transition-colors" data-nom="${recette.nom}">Supprimer</button> 
        </div>
            `;

            container.appendChild(recetteDiv);
        });
    }
}

function supprimerFavoris(){

    document.querySelectorAll('.recette-footer button').forEach(button => {
        button.addEventListener('click', function() {
            const recetteNom = this.getAttribute('data-nom');
            let recettesFavoris = JSON.parse(localStorage.getItem('recettes')) || [];

            recettesFavoris = recettesFavoris.filter(recette => recette.nom !== recetteNom)
            alert('Recette supprimée des favoris');

            localStorage.setItem('recettes', JSON.stringify(recettesFavoris));

            afficherFavoris();
            supprimerFavoris();
        });
    });
}


afficherFavoris();
supprimerFavoris();