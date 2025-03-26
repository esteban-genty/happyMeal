document.addEventListener("DOMContentLoaded", () => {
    let allRecipes = [];

    fetch("../data/recettes.json") 
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur HTTP : " + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (!data.recettes || !Array.isArray(data.recettes)) {
                throw new Error("Le fichier JSON ne contient pas de tableau 'recettes'.");
            }
            
            allRecipes = data.recettes; 
            displayRecipes(getRandomRecipes());

            //  barre de recherche
            const searchBar = document.getElementById("search-bar");
            searchBar.addEventListener("input", updateSuggestions);
            searchBar.addEventListener("focus", updateSuggestions);
        })
        .catch(error => console.error("Erreur de chargement du fichier JSON :", error));

 

 
        function getRandomRecipes() {
            return [...allRecipes].sort(() => 0.5 - Math.random()).slice(0, 3);
        }
           //  recettes
           function displayRecipes(recipes) {
            const container = document.getElementById("recipes-container");
            container.innerHTML = ""; 
        
            recipes.forEach((recipe, index) => {
                const card = document.createElement("div");
                card.className = "recipe-card bg-[#4D3B39] p-6 rounded-xl shadow-lg w-64 relative opacity-0 translate-y-4 transition-all duration-500  w-[500px] ";
                
        
                const previewIngredients = formatIngredients(recipe.ingredients, 2);
                const previewSteps = formatSteps(recipe.etapes, 1);
        
        
        
        
        
                //pour afficher du html        
                card.innerHTML = `
                <div class="w-full max-w-lg  rounded-xl shadow-lg overflow-hidden">
                    <h1 class="text-white text-xl font-bold p-4">${recipe.categorie}</h1> 
                    <h2 class="text-lg font-semibold text-white px-4">${recipe.nom}</h2>
                    <hr class="border-t-2 border-black my-4 mx-4">
                    <img src="${recipe.image}" class="w-full h-48 object-cover"> 
                    
                    <div class="bg-white p-4 rounded-b-xl shadow-inner flex justify-between items-center">
                        <div>
                            <p class="text-black font-bold text-sm">Temps :</p>
                            <p class="text-black text-sm">${recipe.temps_preparation}</p>
                        </div>
                        <button 
                            class="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-4 py-2 rounded-lg shadow-md open-modal hover:bg-[B9625D] "
                            data-title="${recipe.nom}"
                            data-ingredients="${formatIngredients(recipe.ingredients)}"
                            data-instructions="${formatSteps(recipe.etapes)}"
                            data-time="${recipe.temps_preparation || 'Non spécifié'}">
                            Voir plus
                        </button>
                    </div>
                </div>
            `;
            
        
                container.appendChild(card);
                
              
                setTimeout(() => card.classList.remove("opacity-0", "translate-y-4"), 100);
            });
        }
        function formatIngredients(ingredients, limit = null) {
            if (limit) {
                return ingredients.slice(0, limit).map(ing => `${ing.nom} (${ing.quantite})`).join(", ");
            }
            return ingredients.map(ing => `${ing.nom} (${ing.quantite})`).join(", ");
        }
        
        function formatSteps(etapes, limit = null) {
            if (limit) {
                return etapes.slice(0, limit).join(" "); 
            }
            return etapes.join(" ");
        }
  

    function openModal(title, ingredients, instructions, time) {
        document.getElementById("modal-title").innerText = title;
        document.getElementById("modal-time").innerText =  time;
        document.getElementById("modal-prep").innerText = instructions;
    
        const ingredientsContainer = document.getElementById("modal-ingredients");
        ingredientsContainer.innerHTML = "";
    
        ingredients.split(", ").forEach(ing => {
            const btn = document.createElement("button");
            btn.className = "bg-[#A35D52] text-white px-4 py-2 rounded-lg m-1";
            btn.innerText = ing;
            ingredientsContainer.appendChild(btn);
        });

        document.getElementById("modal").classList.remove("hidden");
    }

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("open-modal")) {
            const title = event.target.getAttribute("data-title");
            const ingredients = event.target.getAttribute("data-ingredients");
            const instructions = event.target.getAttribute("data-instructions");
            const time = event.target.getAttribute("data-time");
            openModal(title, ingredients, instructions, time);
        }
    });

    function closeModal() {
        document.getElementById("modal").classList.add("hidden");
    }

    document.getElementById("modal").addEventListener("click", (event) => {
        if (event.target.id === "modal") {
            closeModal();
        }
    });

    
    //document.getElementById("close-modal").addEventListener("click", closeModal);

    function updateSuggestions() {
        const query = document.getElementById("search-bar").value.toLowerCase();
        const suggestionsContainer = document.getElementById("suggestions");

        if (query.length === 0) {
            suggestionsContainer.innerHTML = "";
            suggestionsContainer.classList.add("hidden");
            return;
        }

        const filteredRecipes = allRecipes.filter(recipe =>
            recipe.nom.toLowerCase().includes(query) ||
            recipe.ingredients.some(ing => ing.nom.toLowerCase().includes(query))
        );

        suggestionsContainer.innerHTML = "";
        filteredRecipes.forEach(recipe => {
            const li = document.createElement("li");
            li.className = "px-4 py-2 hover:bg-gray-200 cursor-pointer";
            li.innerText = recipe.nom;
            li.addEventListener("click", () => {
                document.getElementById("search-bar").value = recipe.nom;
                suggestionsContainer.innerHTML = "";
                suggestionsContainer.classList.add("hidden");
                displayRecipes([recipe]); 
            });
            suggestionsContainer.appendChild(li);
        });

        if (filteredRecipes.length > 0) {
            suggestionsContainer.classList.remove("hidden");
        } else {
            suggestionsContainer.classList.add("hidden");
        }
    }
});
