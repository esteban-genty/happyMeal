<<<<<<< HEAD
=======
document.addEventListener('DOMContentLoaded', () => {
    // Configuration de base
    const RECIPES_PER_PAGE = 8;
    let currentPage = 1;
    let allRecipes = [];
    let filteredRecipes = [];
    let currentCategory = 'all';

    // Éléments du DOM
    const container = document.getElementById('recettes-container');
    const prevBtn = document.getElementById('prev-button');
    const nextBtn = document.getElementById('next-button');
    const pagination = document.getElementById('page-numbers');
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    // Boutons de catégorie
    const categoryBtns = {
        all: document.getElementById('btn-all'),
        main: document.getElementById('btn-main'),
        starter: document.getElementById('btn-starter'),
        dessert: document.getElementById('btn-dessert')
    };

    // Normalisation du texte pour la recherche
    function normalizeText(text) {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    // Création d'une carte de recette
    function createRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'relative w-[285px] bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105';
        card.innerHTML = `
            <div class="relative h-64 overflow-hidden">
                <img src="${recipe.image}" alt="${recipe.nom}" class="w-full h-full object-cover">
                <div class="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md">
                    ${recipe.nom}
                </div>
                <div class="absolute top-3 right-3 bg-white bg-opacity-80 px-3 py-1 rounded-md">
                    ${recipe.categorie}
                </div>
            </div>
            <div class="flex justify-between items-center p-4 bg-gray-100">
                <div class="flex flex-col">
                    <span class="text-xs text-gray-500">Temps :</span>
                    <span class="text-gray-700">${recipe.temps_preparation}</span>
                </div>
                <button class="bg-orange-300 text-white px-4 py-2 rounded-md font-bold hover:bg-orange-400 transition-colors">
                    ♡ Favori
                </button>
            </div>
        `;
        return card;
    }

    // Affichage des suggestions de recherche
    function showSearchSuggestions(searchTerm) {
        suggestionsContainer.innerHTML = '';
        
        if (searchTerm.length < 2) {
            suggestionsContainer.classList.add('hidden');
            return;
        }

        const term = normalizeText(searchTerm);
        const suggestions = new Set();

        // Recherche dans les noms de recettes
        allRecipes.forEach(recipe => {
            if (normalizeText(recipe.nom).includes(term)) {
                suggestions.add(JSON.stringify({
                    type: 'recette',
                    name: recipe.nom,
                    category: recipe.categorie
                }));
            }
        });

        // Recherche dans les ingrédients
        allRecipes.forEach(recipe => {
            recipe.ingredients.forEach(ing => {
                if (normalizeText(ing.nom).includes(term)) {
                    suggestions.add(JSON.stringify({
                        type: 'ingrédient',
                        name: ing.nom
                    }));
                }
            });
        });

        // Affichage des suggestions
        if (suggestions.size === 0) {
            suggestionsContainer.classList.add('hidden');
            return;
        }

        suggestionsContainer.classList.remove('hidden');
        
        Array.from(suggestions)
            .slice(0, 5) // Limite à 5 suggestions
            .map(s => JSON.parse(s))
            .forEach(suggestion => {
                const div = document.createElement('div');
                div.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center';
                
                div.innerHTML = `
                    <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    <span class="font-semibold">${suggestion.name}</span>
                    ${suggestion.category 
                        ? `<span class="text-xs text-gray-500 ml-2">${suggestion.category}</span>`
                        : '<span class="text-xs text-gray-500 ml-2">Ingrédient</span>'}
                `;
                
                div.addEventListener('click', () => {
                    searchInput.value = suggestion.name;
                    filterRecipes();
                    suggestionsContainer.classList.add('hidden');
                });
                
                suggestionsContainer.appendChild(div);
            });
    }

    // Filtrage des recettes
    function filterRecipes() {
        const searchTerm = normalizeText(searchInput.value);
        
        filteredRecipes = allRecipes.filter(recipe => {
            // Filtre par catégorie
            const categoryMatch = currentCategory === 'all' || recipe.categorie === currentCategory;
            
            // Si pas de terme de recherche, retourne les correspondances de catégorie
            if (!searchTerm) return categoryMatch;
            
            // Filtre par recherche
            const nameMatch = normalizeText(recipe.nom).includes(searchTerm);
            const ingredientMatch = recipe.ingredients.some(ing => 
                normalizeText(ing.nom).includes(searchTerm)
            );
            
            return categoryMatch && (nameMatch || ingredientMatch);
        });
        
        currentPage = 1;
        renderRecipes();
    }

    // Affichage des recettes
    function renderRecipes() {
        container.innerHTML = '';
        
        const start = (currentPage - 1) * RECIPES_PER_PAGE;
        const end = start + RECIPES_PER_PAGE;
        const paginatedRecipes = filteredRecipes.slice(start, end);
        
        if (paginatedRecipes.length === 0) {
            container.innerHTML = `
                <div class="col-span-4 text-center py-10">
                    <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="mt-2 text-lg font-medium">Aucune recette trouvée</p>
                    <p class="text-sm text-gray-500">Essayez avec d'autres termes de recherche</p>
                </div>
            `;
            return;
        }
        
        paginatedRecipes.forEach(recipe => {
            container.appendChild(createRecipeCard(recipe));
        });
        
        updatePagination();
    }

    // Mise à jour de la pagination
    function updatePagination() {
        const totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);
        
        pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('span');
            pageBtn.textContent = i;
            pageBtn.className = `px-4 py-2 cursor-pointer ${currentPage === i ? 'bg-black text-white' : 'hover:bg-gray-200'}`;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderRecipes();
            });
            pagination.appendChild(pageBtn);
        }
        
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Configuration des boutons de catégorie
    function setupCategoryButtons() {
        function setActiveCategory(category, btn) {
            currentCategory = category;
            
            // Réinitialisation des boutons
            Object.values(categoryBtns).forEach(b => {
                b.classList.remove('bg-[#B9625D]', 'text-white');
                b.classList.add('bg-white', 'text-gray-700');
            });
            
            // Activation du bouton sélectionné
            btn.classList.add('bg-[#B9625D]', 'text-white');
            btn.classList.remove('bg-white', 'text-gray-700');
            
            filterRecipes();
        }
        
        categoryBtns.all.addEventListener('click', () => setActiveCategory('all', categoryBtns.all));
        categoryBtns.main.addEventListener('click', () => setActiveCategory('Plat principal', categoryBtns.main));
        categoryBtns.starter.addEventListener('click', () => setActiveCategory('Entrée', categoryBtns.starter));
        categoryBtns.dessert.addEventListener('click', () => setActiveCategory('Dessert', categoryBtns.dessert));
    }

    // Configuration de la recherche
    function setupSearch() {
        searchInput.addEventListener('input', () => {
            showSearchSuggestions(searchInput.value);
            filterRecipes();
        });

        // Masquage des suggestions quand on clique ailleurs
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.classList.add('hidden');
            }
        });

        // Masquage avec la touche Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                suggestionsContainer.classList.add('hidden');
            }
        });
    }

    

    // Initialisation de l'application
    async function init() {
        try {
            const response = await fetch('../data/data.json');
            const data = await response.json();
            allRecipes = data.recettes;
            filteredRecipes = [...allRecipes];
            
            setupCategoryButtons();
            setupSearch();
            
            renderRecipes();
            
            // Activation de "Tous" par défaut
            categoryBtns.all.classList.add('bg-[#B9625D]', 'text-white');
            
        } catch (error) {
            console.error('Erreur de chargement:', error);
            container.innerHTML = `
                <div class="col-span-4 text-center py-10">
                    <svg class="w-12 h-12 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="mt-2 text-lg font-medium text-red-500">Erreur de chargement</p>
                    <p class="text-sm text-gray-500">Impossible de charger les recettes</p>
                </div>
            `;
        }
    }
    

    init();
});
>>>>>>> e37865089e2b4a91a0f9dd391dbf7bc19e605917
