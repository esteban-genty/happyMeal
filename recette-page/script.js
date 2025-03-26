document.addEventListener("DOMContentLoaded", function () {
    let recettes = [];
    let currentPage = 1;
    const recettesParPage = 8;

    // Charger les recettes depuis data/data.json
    fetch("data/data.json")
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data.recettes)) {
                recettes = data.recettes;
                afficherRecettes();
            } else {
                console.error("Erreur: 'recettes' n'est pas un tableau.");
            }
        })
        .catch(error => console.error("Erreur de chargement des recettes :", error));

    function afficherRecettes() {
        const container = document.getElementById("recettes-container");
        container.innerHTML = ""; // Nettoyer les anciennes recettes

        const debut = (currentPage - 1) * recettesParPage;
        const fin = debut + recettesParPage;
        const recettesAffichees = recettes.slice(debut, fin); // Sélection des recettes pour la page actuelle

        if (recettesAffichees.length === 0) {
            container.innerHTML = "<p class='text-center text-red-500'>Aucune recette à afficher.</p>";
            return;
        }

        // Créer une grille de 4 colonnes, 2 rangées
        container.className = "w-full lg:w-3/4 p-4 grid grid-cols-4 grid-rows-2 gap-4";

        // Affichage des recettes avec une boucle forEach
        recettesAffichees.forEach(recette => {
            const card = document.createElement("div");
            card.className = "bg-[#574848] rounded-lg p-4 text-white";

            // Formatter les ingrédients
            const ingredients = Array.isArray(recette.ingredients) 
                ? recette.ingredients.map(ing => typeof ing === 'object' ? ing.nom : ing).slice(0, 3).join(", ") 
                : recette.ingredients;

            card.innerHTML = `
                <h2 class="text-lg font-bold mb-2">${recette.nom}</h2>
                <div class="mb-2"><strong>Catégorie:</strong> ${recette.categorie}</div>
                <div class="mb-2 truncate"><strong>Ingrédients:</strong> ${ingredients}${ingredients.length > 30 ? '...' : ''}</div>
                <div class="flex justify-between items-center mt-auto">
                    <span>Temps: ${recette.temps_preparation}</span>
                    <button class="bg-yellow-400 text-black px-3 py-1 rounded">Enregistrer</button>
                </div>
            `;

            container.appendChild(card);
        });

        // Mettre à jour le numéro de page
        document.getElementById("pageNumber").innerText = currentPage;
        
        // Mettre à jour l'état des boutons de pagination
        mettreAJourBoutons();
    }

    function mettreAJourBoutons() {
        const prevButton = document.getElementById("prevPage");
        const nextButton = document.getElementById("nextPage");

        // Calculer le nombre total de pages
        const totalPages = Math.ceil(recettes.length / recettesParPage);

        // Désactiver le bouton Previous si on est sur la première page
        prevButton.disabled = currentPage === 1;
        prevButton.classList.toggle("opacity-50", currentPage === 1);
        prevButton.classList.toggle("cursor-not-allowed", currentPage === 1);

        // Désactiver le bouton Next si on est sur la dernière page
        nextButton.disabled = currentPage === totalPages;
        nextButton.classList.toggle("opacity-50", currentPage === totalPages);
        nextButton.classList.toggle("cursor-not-allowed", currentPage === totalPages);
    }

    // Gestionnaires d'événements pour la pagination
    document.getElementById("prevPage").addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            afficherRecettes();
        }
    });

    document.getElementById("nextPage").addEventListener("click", function () {
        const totalPages = Math.ceil(recettes.length / recettesParPage);
        if (currentPage < totalPages) {
            currentPage++;
            afficherRecettes();
        }
    });
});