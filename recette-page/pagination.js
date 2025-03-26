// Sample recipe data (you would typically fetch this from a backend or JSON file)
const recipes = [
    {
        title: "Poulet rôti aux herbes",
        category: "Plat Principal",
        time: "1 heure",
        image: "path/to/poulet-roti.jpg"
    },
    {
        title: "Salade de quinoa aux légumes grillés",
        category: "Entrée",
        time: "30 minutes",
        image: "path/to/salade-quinoa.jpg"
    },
    {
        title: "Tarte aux pommes",
        category: "Dessert",
        time: "1 heure",
        image: "path/to/tarte-pommes.jpg"
    },
    {
        title: "Soupe de lentilles",
        category: "Plat Principal",
        time: "1 heure",
        image: "path/to/soupe-lentilles.jpg"
    },
    {
        title: "Pâtes Carbonara",
        category: "Plat Principal",
        time: "30 minutes",
        image: "path/to/pates-carbonara.jpg"
    },
    {
        title: "Risotto aux champignons",
        category: "Plat Principal",
        time: "45 minutes",
        image: "path/to/risotto-champignons.jpg"
    },
    {
        title: "Salade de fruits",
        category: "Dessert",
        time: "15 minutes",
        image: "path/to/salade-fruits.jpg"
    },
    {
        title: "Ratatouille",
        category: "Plat Principal",
        time: "1 heure",
        image: "path/to/ratatouille.jpg"
    }
];

// Pagination variables
const recipesPerPage = 4;
let currentPage = 1;

// Function to create recipe card HTML
function createRecipeCard(recipe) {
    return `
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-48 object-cover">
            <div class="p-4">
                <span class="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm mb-2 inline-block">
                    ${recipe.category}
                </span>
                <h3 class="font-bold text-lg mb-2">${recipe.title}</h3>
                <div class="flex items-center text-gray-600">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>${recipe.time}</span>
                </div>
                <button class="mt-4 w-full bg-[#B9625D] text-white py-2 rounded hover:bg-[#a55b57] transition">
                    Enregistrer
                </button>
            </div>
        </div>
    `;
}

// Function to render recipes for current page
function renderRecipes() {
    const recipeContainer = document.getElementById('recettes-container');
    const paginationContainer = document.getElementById('pagination');
    
    // Clear previous recipes
    recipeContainer.innerHTML = '';
    
    // Calculate start and end indices for current page
    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    
    // Get recipes for current page
    const pageRecipes = recipes.slice(startIndex, endIndex);
    
    // Render recipes
    pageRecipes.forEach(recipe => {
        recipeContainer.innerHTML += createRecipeCard(recipe);
    });
    
    // Update pagination buttons
    const totalPages = Math.ceil(recipes.length / recipesPerPage);
    paginationContainer.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add(
            'pagination-btn', 
            'bg-gray-300', 
            'px-4', 
            'py-2', 
            'rounded',
            currentPage === i ? 'bg-[#B9625D] text-white' : ''
        );
        pageButton.dataset.page = i;
        
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderRecipes();
        });
        
        paginationContainer.appendChild(pageButton);
    }
}

// Initial render when page loads
document.addEventListener('DOMContentLoaded', renderRecipes);