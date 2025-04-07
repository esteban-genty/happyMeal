function afficherRecette() {
    // Container recettes
    const container = document.getElementById('recettes-container');

    // Container pagination
    const buttonRetour = document.getElementById('prev-button');
    const buttonSuivant = document.getElementById('next-button');
    const pageNumbers = document.getElementById('page-numbers');

    // Pagination paramètres
    const recettesParPage = 8;
    let pageActuelle = 1;
    let recettes = [];

    // Chargement des recettes depuis le fichier JSON
    fetch('../data/data.json')
        .then(response => response.json())
        .then(data => {
            recettes = data.recettes;
            afficherPage();
        })
        .catch(error => console.error('Erreur de chargement:', error));

    function barreRecherche() {
    const barreRecherche = document.getElementById('barre-recherche');
    const suggestionsContainer = document.getElementById('suggestions');
    const container = document.getElementById('recettes-container');

    barreRecherche.addEventListener('keyup', function () {
        const recette = barreRecherche.value.trim(); // Supprime les espaces inutiles

        const resultat = recettes.filter(item => 
            item.nom.toLowerCase().includes(recette.toLowerCase())
        );

        let suggestion = '';

        if (recette.length > 0) {
            resultat.slice(0, 3).forEach(resultatItem => {
                suggestion += `
                    <span class="p-2 border-b border-gray-200 cursor-pointer block" data-nom="${resultatItem.nom}">
                        ${resultatItem.nom}
                    </span>
                `;
            });
        }

        suggestionsContainer.innerHTML = suggestion;
    });

    // Quand on clique sur une suggestion
    suggestionsContainer.addEventListener('click', function (event) {
        if (event.target.tagName === 'SPAN') {
            const selectedRecette = event.target.getAttribute('data-nom');
            suggestionsContainer.innerHTML = '';
            barreRecherche.value = '';

            // Recherche la recette sélectionnée dans les données
            const recetteSelectionnee = recettes.find(item => item.nom === selectedRecette);

            if (recetteSelectionnee) {
                const container = document.getElementById('recettes-container');
                container.innerHTML = ''; 
            
                const resultatDiv = document.createElement('div');
                resultatDiv.classList.add('recette');
                
                resultatDiv.innerHTML = `
                    <div class="relative h-64 overflow-hidden">
                        <img src="${recetteSelectionnee.image}" alt="${recetteSelectionnee.nom}" class="w-full h-full object-cover">
                        <div class="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md">
                            ${recetteSelectionnee.nom}
                        </div>
                        <div class="absolute top-3 right-3 bg-white bg-opacity-80 px-3 py-1 rounded-md">
                            ${recetteSelectionnee.categorie}
                        </div>
                    </div>
                    <div class="flex justify-between items-center p-4 bg-gray-100">
                        <div class="flex flex-col">
                            <span class="text-xs text-gray-500 pt-2">Temps :</span>
                            <span class="text-gray-700">${recetteSelectionnee.temps_preparation}</span>
                        </div>
                        <button type="button" class="favoris-btn bg-orange-300 text-white px-4 py-2 rounded-md font-bold hover:bg-orange-400 transition-colors">
                            Enregistrer
                        </button>
                    </div>
                `;
            
                container.appendChild(resultatDiv);
            
                resultatDiv.querySelector('.favoris-btn').addEventListener('click', function() {
                    ajouterAuxFavoris(recetteSelectionnee);
                });
            }
            
        }
    });
}

        

    // Fonction pour afficher les recettes
    function afficherPage() {
        container.innerHTML = '';

        // Calculer le début et la fin des recettes à afficher
        let debut = (pageActuelle - 1) * recettesParPage;
        let fin = debut + recettesParPage;
        let recettesAffichees = recettes.slice(debut, fin);

        recettesAffichees.forEach((recette, index) => {
            const recetteDiv = document.createElement('div');
            recetteDiv.classList.add('recette');
            recetteDiv.setAttribute('recette-index', debut + index);
            recetteDiv.innerHTML = `
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
                        <span class="text-xs text-gray-500 pt-2">Temps :</span>
                        <span class="text-gray-700">${recette.temps_preparation}</span>
                    </div>
                    <button type="button" class="favoris-btn bg-orange-300 text-white px-4 py-2 rounded-md font-bold hover:bg-orange-400 transition-colors" data-index="${debut + index}">Enregistrer</button>
                </div>
            `;
            container.appendChild(recetteDiv);
        });

        pageNumbers.textContent = pageActuelle;
        buttonRetour.disabled = pageActuelle === 1;
        buttonSuivant.disabled = pageActuelle * recettesParPage >= recettes.length;

        ajouterFavoris();
        afficherRecettes();
        barreRecherche();
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
    

    function ajouterFavoris() {
        document.querySelectorAll('.favoris-btn').forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation();
    
                const dataIndex = this.getAttribute('data-index');
                const recetteToFavoris = recettes[dataIndex];
    
                let recettesFavoris = JSON.parse(localStorage.getItem('recettes')) || [];
                if (!recettesFavoris.some(r => r.nom === recetteToFavoris.nom)) {
                    recettesFavoris.push(recetteToFavoris);
                    localStorage.setItem('recettes', JSON.stringify(recettesFavoris));
                    afficherPopup();
                } else {
                    alert("Recette déjà dans les favoris");
                }
            });
        });
    }
    

    function afficherRecettes() {
        document.querySelectorAll('.recette').forEach(recette => {
            recette.addEventListener('click', function() {
                const recetteIndex = this.getAttribute('recette-index');
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
    

    buttonRetour.addEventListener('click', () => {
        if (pageActuelle > 1) {
            pageActuelle--;
            afficherPage();
        }
    });

    buttonSuivant.addEventListener('click', () => {
        if (pageActuelle * recettesParPage < recettes.length) {
            pageActuelle++;
            afficherPage();
        }
    });
}

afficherRecette();