document.addEventListener('DOMContentLoaded', function() {
    // Données des recettes (normalement chargées depuis le JSON)
    const recettesData = {
        "recettes": [
            {
                "nom": "Poulet rôti aux herbes",
                "categorie": "Plat principal",
                "temps_preparation": "1 heure",
                "ingredients": [
                    { "nom": "Poulet", "quantite": "1" },
                    { "nom": "Herbes fraîches", "quantite": "1" },
                    { "nom": "Sel et poivre", "quantite": "10g" },
                    { "nom": "Huile d'olive", "quantite": "10g" }
                ],
                "etapes": [
                    "Préchauffez le four à 200°C.",
                    "Nettoyez le poulet et assaisonnez-le généreusement avec du sel, du poivre et les herbes.",
                    "Badigeonnez le poulet d'huile d'olive.",
                    "Placez le poulet dans un plat allant au four et enfournez-le pendant environ 1 heure ou jusqu'à ce qu'il soit bien doré et cuit à cœur.",
                    "Laissez reposer quelques minutes avant de découper et de servir."
                ]
            },
            // Les autres recettes seraient ici (j'ai omis pour raccourcir)
        ]
    };

    const recipesGrid = document.querySelector('.recipes-grid');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    // Fonction pour créer une carte de recette
    function createRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        
        // Déterminer l'étiquette de catégorie
        let tagLabel = 'Plat';
        if (recipe.categorie === 'Entrée') tagLabel = 'Entrée';
        else if (recipe.categorie === 'Dessert') tagLabel = 'Dessert';
        
        card.innerHTML = `
            <div class="tag">${tagLabel}</div>
            <div class="recipe-content">
                <div class="recipe-ingredients">
                    <h3>Ingrédients :</h3>
                    <ul>
                        ${recipe.ingredients.map(ing => {
                            if (typeof ing === 'object') {
                                return `<li>${ing.nom}${ing.quantite ? ` (${ing.quantite})` : ''}</li>`;
                            } else {
                                return `<li>${ing}</li>`;
                            }
                        }).join('')}
                    </ul>
                </div>
                <div class="recipe-preparation">
                    <h3>Préparation :</h3>
                    <ol>
                        ${recipe.etapes.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                <div class="recipe-time">
                    <span>Temps :</span>
                    <span>${recipe.temps_preparation}</span>
                    <button class="save-btn">Enregistrer</button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Fonction pour charger les recettes (filtrer par catégorie si spécifié)
    function loadRecipes(category = null) {
        // Effacer les recettes existantes
        recipesGrid.innerHTML = '';
        
        // Filtrer et afficher les recettes
        const filteredRecipes = category ? 
            recettesData.recettes.filter(r => r.categorie === category) : 
            recettesData.recettes;
        
        // Limiter à 8 recettes par page
        const recipesToShow = filteredRecipes.slice(0, 8);
        
        // Ajouter les cartes de recettes
        recipesToShow.forEach(recipe => {
            const card = createRecipeCard(recipe);
            recipesGrid.appendChild(card);
        });
    }
    
    // Ajouter des écouteurs d'événements aux boutons de catégorie
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Supprimer la classe accent de tous les boutons
            categoryButtons.forEach(btn => btn.classList.remove('accent'));
            // Ajouter la classe accent au bouton cliqué
            this.classList.add('accent');
            
            // Obtenir la catégorie du bouton
            const categoryText = this.textContent.trim();
            let category = null;
            
            if (categoryText.includes('Principal')) {
                category = 'Plat principal';
            } else if (categoryText.includes('Entrée')) {
                category = 'Entrée';
            } else if (categoryText.includes('Dessert')) {
                category = 'Dessert';
            }
            
            // Charger les recettes filtrées
            loadRecipes(category);
        });
    });
    
    // Charger toutes les recettes au démarrage
    loadRecipes();
});