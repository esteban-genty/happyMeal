function afficherFavoris() {
    const container = document.getElementById('recettes-favoris');
    let recettesFavoris = JSON.parse(localStorage.getItem('recettes')) || [];

    container.innerHTML = '';

    if (recettesFavoris.length === 0) {
        container.innerHTML = '<p class="text-center w-full pt-4">Aucune recette enregistrée.</p>';
        return;
    } else {
        recettesFavoris.forEach((recette, index) => {
            const recetteDiv = document.createElement('div');
            recetteDiv.classList.add('recette');
            recetteDiv.setAttribute('data-index', index);
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
        <div class="planning bg-gray-100 pb-4">
            <select id="planning-select" name="jours" class="mb-4 w-full p-2 border border-gray-300 rounded-md">
                <option value="jour">Sélectionner un jour</option>
                <option value="lundi">Lundi</option>
                <option value="mardi">Mardi</option>
                <option value="mercredi">Mercredi</option>
                <option value="jeudi">Jeudi</option>
                <option value="vendredi">Vendredi</option>
                <option value="samedi">Samedi</option>
                <option value="dimanche">Dimanche</option>
            </select>
                <button type="button" class="planning-btn w-full bg-blue-400 text-white px-4 py-2 rounded-md font-bold hover:bg-blue-500 transition-colors" planning="${recette.nom}">+ Planning</button> 
            </div>
            `;

            container.appendChild(recetteDiv);
        });
        planning();
        afficherRecettes();
    }
}

function planning() {
    const planningBtn = document.querySelectorAll('.planning-btn');
    const selectPlanning = document.getElementById('planning-select');

    planningBtn.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            
            if(selectPlanning.value === 'jour') {
                alert("Veuillez sélectionner un jour.");
                return;
            }else{
                const recetteNom = this.getAttribute('planning');
                let planningRecettes = JSON.parse(localStorage.getItem('planning')) || {};

                if (!planningRecettes[selectPlanning.value]) {
                    planningRecettes[selectPlanning.value] = [];
                }

                planningRecettes[selectPlanning.value].push(recetteNom);
                localStorage.setItem('planning', JSON.stringify(planningRecettes));

                alert(`Recette "${recetteNom}" ajoutée au ${selectPlanning.value}`);
                selectPlanning.value = 'jour';
            }

        });
    });

    selectPlanning.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    afficherRecettes();
}


function afficherRecettes() {
    document.querySelectorAll('.recette').forEach(recette => {
        recette.addEventListener('click', function() {
            const recetteIndex = this.getAttribute('data-index'); 
            let recettes = JSON.parse(localStorage.getItem('recettes')) || [];
            const recetteAffichee = recettes[recetteIndex];

            const informationsRecette = document.getElementById("informations-recette");
            const titre = document.getElementById("titre-recette");
            const temps = document.getElementById("temps-recette");
            const preparation = document.getElementById("preparation-recette");
            const ingredients = document.getElementById("ingredients-recette");

            // Affichage des informations
            titre.textContent = recetteAffichee.nom;
            temps.textContent = `${recetteAffichee.temps_preparation}`;
            preparation.innerHTML = recetteAffichee.etapes
                .map(etape => `<li class="py-2">${etape}</li>`)
                .join("");

            ingredients.innerHTML = '<ul class="flex flex-row gap-4 pt-5">' + recetteAffichee.ingredients
                .map(ingredient => `<li class="bg-red-400 p-2 rounded-lg text-brown-600">${ingredient.nom} (${ingredient.quantite})</li>`)
                .join("") + "</ul>";

            informationsRecette.classList.remove("hidden");

            console.log("Recette cliquée : " + recetteAffichee.nom);
        });
    });

    document.querySelectorAll("#fermer-informations, #fermer-informations-croix")
        .forEach(element => {
            element.addEventListener("click", () => {
                document.getElementById("informations-recette").classList.add("hidden");
            });
        });
}


function afficherPopup() {
    const popup = document.getElementById("popup");

    popup.classList.remove("hidden"); 
    popup.classList.add("opacity-100");

    setTimeout(() => {
        popup.classList.add("opacity-0");
        popup.classList.remove("opacity-100");

        setTimeout(() => {
            popup.classList.add("hidden");
        }, 500);
    }, 1500);
}

function supprimerFavoris(){

    document.querySelectorAll('.recette-footer button').forEach(button => {
        button.addEventListener('click', function() {
            event.stopPropagation();
            const recetteNom = this.getAttribute('data-nom');
            let recettesFavoris = JSON.parse(localStorage.getItem('recettes')) || [];

            recettesFavoris = recettesFavoris.filter(recette => recette.nom !== recetteNom)

            localStorage.setItem('recettes', JSON.stringify(recettesFavoris));

            afficherPopup();
            afficherFavoris();
            supprimerFavoris();
        });
    });
}


afficherFavoris();
supprimerFavoris();
planning();