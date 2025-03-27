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
                        <span class="text-xs text-gray-500">Temps :</span>
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
    }

    function showPopup() {
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
            button.addEventListener('click', function() {
                const recetteIndex = this.getAttribute('data-index');
                const recetteToFavoris = recettes[recetteIndex];

                let recettesFavoris = JSON.parse(localStorage.getItem('recettes')) || [];
                if (!recettesFavoris.some(r => r.nom === recetteToFavoris.nom)) {
                    recettesFavoris.push(recetteToFavoris);
                    localStorage.setItem('recettes', JSON.stringify(recettesFavoris));
                    showPopup();
                }
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