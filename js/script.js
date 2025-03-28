document.addEventListener('DOMContentLoaded', () => {
    const RECIPES_PER_PAGE = 8;
    let currentPage = 1;
    let allRecipes = [];
    let filteredRecipes = [];
    let currentCategory = 'all';

    // DOM Elements
    const elements = {
        container: document.getElementById('recettes-container'),
        prevBtn: document.getElementById('prev-button'),
        nextBtn: document.getElementById('next-button'),
        pagination: document.getElementById('page-numbers'),
        searchInput: document.getElementById('searchInput'),
        suggestionsContainer: document.getElementById('searchSuggestions'),
        categoryBtns: {
            all: document.getElementById('btn-all'),
            main: document.getElementById('btn-main'),
            starter: document.getElementById('btn-starter'),
            dessert: document.getElementById('btn-dessert')
        }
    };

    // Normalize string for better search
    const normalizeString = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    // Create recipe card
    const createRecipeCard = (recipe) => {
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
    };

    // Show search suggestions
    const showSearchSuggestions = (searchTerm) => {
        elements.suggestionsContainer.innerHTML = '';
        
        if (searchTerm.length < 2) {
            elements.suggestionsContainer.classList.add('hidden');
            return;
        }

        const term = normalizeString(searchTerm);
        
        // Recipe name matches
        const recipeMatches = allRecipes.filter(recipe => 
            normalizeString(recipe.nom).includes(term)
        ).slice(0, 3);

        // Ingredient matches
        const ingredientMatches = [];
        allRecipes.forEach(recipe => {
            recipe.ingredients.forEach(ing => {
                if (normalizeString(ing.nom).includes(term)) {
                    if (!ingredientMatches.some(i => i.nom === ing.nom)) {
                        ingredientMatches.push(ing);
                    }
                }
            });
        });

        // Show suggestions
        if (recipeMatches.length === 0 && ingredientMatches.length === 0) {
            elements.suggestionsContainer.classList.add('hidden');
            return;
        }

        elements.suggestionsContainer.classList.remove('hidden');
        
        recipeMatches.forEach(recipe => {
            const suggestion = document.createElement('div');
            suggestion.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center';
            suggestion.innerHTML = `
                <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span class="font-semibold">${recipe.nom}</span>
                <span class="text-xs text-gray-500 ml-2">${recipe.categorie}</span>
            `;
            suggestion.addEventListener('click', () => {
                elements.searchInput.value = recipe.nom;
                filterRecipes();
                elements.suggestionsContainer.classList.add('hidden');
            });
            elements.suggestionsContainer.appendChild(suggestion);
        });

        ingredientMatches.slice(0, 3).forEach(ing => {
            const suggestion = document.createElement('div');
            suggestion.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center';
            suggestion.innerHTML = `
                <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span class="font-semibold">${ing.nom}</span>
                <span class="text-xs text-gray-500 ml-2">Ingrédient</span>
            `;
            suggestion.addEventListener('click', () => {
                elements.searchInput.value = ing.nom;
                filterRecipes();
                elements.suggestionsContainer.classList.add('hidden');
            });
            elements.suggestionsContainer.appendChild(suggestion);
        });
    };

    // Filter recipes
    const filterRecipes = () => {
        const searchTerm = normalizeString(elements.searchInput.value);
        
        filteredRecipes = allRecipes.filter(recipe => {
            // Category filter
            const categoryMatch = currentCategory === 'all' || recipe.categorie === currentCategory;
            
            // If no search term, return category matches
            if (!searchTerm) return categoryMatch;
            
            // Search filter
            const nameMatch = normalizeString(recipe.nom).includes(searchTerm);
            const ingredientMatch = recipe.ingredients.some(ing => 
                normalizeString(ing.nom).includes(searchTerm)
            );
            
            return categoryMatch && (nameMatch || ingredientMatch);
        });
        
        currentPage = 1;
        renderRecipes();
    };

    // Render recipes (8 per page)
    const renderRecipes = () => {
        elements.container.innerHTML = '';
        
        const start = (currentPage - 1) * RECIPES_PER_PAGE;
        const end = start + RECIPES_PER_PAGE;
        const paginatedRecipes = filteredRecipes.slice(start, end);
        
        if (paginatedRecipes.length === 0) {
            elements.container.innerHTML = `
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
            elements.container.appendChild(createRecipeCard(recipe));
        });
        
        updatePagination();
    };

    // Update pagination
    const updatePagination = () => {
        const totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);
        
        elements.pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('span');
            pageBtn.textContent = i;
            pageBtn.className = `px-4 py-2 cursor-pointer ${currentPage === i ? 'bg-black text-white' : 'hover:bg-gray-200'}`;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderRecipes();
            });
            elements.pagination.appendChild(pageBtn);
        }
        
        elements.prevBtn.disabled = currentPage === 1;
        elements.nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    };

    // Setup category buttons
    const setupCategoryButtons = () => {
        const setActiveCategory = (category, btn) => {
            currentCategory = category;
            
            // Reset all buttons
            Object.values(elements.categoryBtns).forEach(b => {
                b.classList.remove('bg-[#B9625D]', 'text-white');
                b.classList.add('bg-white', 'text-gray-700');
            });
            
            // Activate selected button
            btn.classList.add('bg-[#B9625D]', 'text-white');
            btn.classList.remove('bg-white', 'text-gray-700');
            
            filterRecipes();
        };
        
        elements.categoryBtns.all.addEventListener('click', () => 
            setActiveCategory('all', elements.categoryBtns.all));
        elements.categoryBtns.main.addEventListener('click', () => 
            setActiveCategory('Plat principal', elements.categoryBtns.main));
        elements.categoryBtns.starter.addEventListener('click', () => 
            setActiveCategory('Entrée', elements.categoryBtns.starter));
        elements.categoryBtns.dessert.addEventListener('click', () => 
            setActiveCategory('Dessert', elements.categoryBtns.dessert));
    };

    // Setup search functionality
    const setupSearch = () => {
        elements.searchInput.addEventListener('input', () => {
            showSearchSuggestions(elements.searchInput.value);
            filterRecipes();
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!elements.searchInput.contains(e.target) && !elements.suggestionsContainer.contains(e.target)) {
                elements.suggestionsContainer.classList.add('hidden');
            }
        });

        // Keyboard navigation for suggestions
        elements.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                elements.suggestionsContainer.classList.add('hidden');
            }
        });
    };

    // Setup pagination buttons
    const setupPaginationButtons = () => {
        elements.prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderRecipes();
            }
        });
        
        elements.nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);
            if (currentPage < totalPages) {
                currentPage++;
                renderRecipes();
            }
        });
    };

    // Initialize the app
    const init = async () => {
        try {
            const response = await fetch('../data/data.json');
            const data = await response.json();
            allRecipes = data.recettes;
            filteredRecipes = [...allRecipes];
            
            setupCategoryButtons();
            setupSearch();
            setupPaginationButtons();
            
            renderRecipes();
            
            // Activate "All" by default
            elements.categoryBtns.all.classList.add('bg-[#B9625D]', 'text-white');
            
        } catch (error) {
            console.error('Erreur de chargement:', error);
            elements.container.innerHTML = `
                <div class="col-span-4 text-center py-10">
                    <svg class="w-12 h-12 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="mt-2 text-lg font-medium text-red-500">Erreur de chargement</p>
                    <p class="text-sm text-gray-500">Impossible de charger les recettes</p>
                </div>
            `;
        }
    };

    init();
});