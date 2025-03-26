document.addEventListener('DOMContentLoaded', () => {
    const recipesPerPage = 8;
    let currentPage = 1;
    let totalRecipes = [];

    const container = document.getElementById('recettes-container');
    const paginationContainer = document.getElementById('pagination-container');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const pageNumbersContainer = document.getElementById('page-numbers');

    // Function to get a placeholder image based on category
    const getPlaceholderImage = (categorie) => {
        const placeholders = {
            'Plat principal': 'https://via.placeholder.com/400x300?text=Plat+Principal',
            'Entrée': 'https://via.placeholder.com/400x300?text=Entrée',
            'Dessert': 'https://via.placeholder.com/400x300?text=Dessert',
            'default': 'https://via.placeholder.com/400x300?text=Recette'
        };
        return placeholders[categorie] || placeholders['default'];
    };

    // Create recipe card
    const createRecipeCard = (recette) => {
        const recetteDiv = document.createElement('div');
        recetteDiv.classList.add('relative', 'w-[285px]', 'bg-white', 'rounded-lg', 'overflow-hidden', 'shadow-lg', 'transform', 'transition-transform', 'hover:scale-105');
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
            <button class="bg-orange-300 text-white px-4 py-2 rounded-md font-bold hover:bg-orange-600 transition-colors">
                Enregistrer
            </button>
        </div>
        `;
        return recetteDiv;
    };

    // Render recipes for current page
    const renderRecipes = () => {
        // Clear previous recipes
        container.innerHTML = '';

        // Calculate start and end indices for current page
        const startIndex = (currentPage - 1) * recipesPerPage;
        const endIndex = startIndex + recipesPerPage;
        const pageRecipes = totalRecipes.slice(startIndex, endIndex);

        // Render recipes for current page
        pageRecipes.forEach(recette => {
            container.appendChild(createRecipeCard(recette));
        });

        // Update pagination buttons and page numbers
        updatePagination();
    };

    // Update pagination controls
    const updatePagination = () => {
        const totalPages = Math.ceil(totalRecipes.length / recipesPerPage);

        // Update page numbers
        pageNumbersContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageSpan = document.createElement('span');
            pageSpan.textContent = i;
            pageSpan.classList.add('px-4', 'py-2', 'cursor-pointer', 'hover:bg-gray-200');
            
            if (i === currentPage) {
                pageSpan.classList.add('bg-black', 'text-white');
            }

            pageSpan.addEventListener('click', () => {
                currentPage = i;
                renderRecipes();
            });

            pageNumbersContainer.appendChild(pageSpan);
        }

        // Update prev/next button states
        prevButton.disabled = currentPage === 1;
        prevButton.classList.toggle('text-gray-300', currentPage === 1);
        prevButton.classList.toggle('cursor-not-allowed', currentPage === 1);

        nextButton.disabled = currentPage === totalPages;
        nextButton.classList.toggle('text-gray-300', currentPage === totalPages);
        nextButton.classList.toggle('cursor-not-allowed', currentPage === totalPages);
    };

    // Fetch and prepare recipes
    fetch('../data/data.json')
    .then(response => response.json())
    .then(data => {
        // Remove duplicates by creating a Set of recipe names
        totalRecipes = Array.from(new Set(data.recettes.map(r => r.nom)))
            .map(nom => data.recettes.find(r => r.nom === nom));

        // Initial render
        renderRecipes();

        // Set up prev/next button events
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderRecipes();
            }
        });

        nextButton.addEventListener('click', () => {
            const totalPages = Math.ceil(totalRecipes.length / recipesPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderRecipes();
            }
        });
    })
    .catch(error => console.error('Erreur de chargement:', error));
});