function afficherRecette() {
    const container = document.getElementById('recettes-container');

    fetch('../data/data.json')
        .then(response => response.json())
        .then(data => {
            data.recettes.forEach((recette, index) => {
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
        <div class="flex justify-between items-center p-4 bg-gray-100">
            <div class="flex flex-col">
                <span class="text-xs text-gray-500">Temps :</span>
                <span class="text-gray-700">${recette.temps_preparation}</span>
            </div>
            <button type="button" class="favoris-btn bg-orange-300 text-white px-4 py-2 rounded-md font-bold hover:bg-orange-400 transition-colors" id="${index}">Enregistrer</button>  
        </div>
                `;

            container.appendChild(recetteDiv);
        });


            document.querySelectorAll('.favoris-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const recetteIndex = this.getAttribute('id');
                    const recetteTofavoris = data.recettes[recetteIndex];

                    console.log('Recette enregistrée :', recetteTofavoris);

                    let recettesFavoris = JSON.parse(localStorage.getItem('recettes')) || [];


                    if (!recettesFavoris.some(r => r.nom === recetteTofavoris.nom)) {
                        recettesFavoris.push(recetteTofavoris);
                        localStorage.setItem('recettes', JSON.stringify(recettesFavoris));
                        alert('Recette ajoutée aux favoris.');
                    }
                });
            });
        })
        .catch(error => console.error('Erreur de chargement:', error));
}



afficherRecette();