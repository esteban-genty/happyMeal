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

            //  recherche
            const searchBar = document.getElementById("search-bar");
            searchBar.addEventListener("input", updateSuggestions);
            searchBar.addEventListener("focus", updateSuggestions);
        })
        .catch(error => console.error("Erreur de chargement du fichier JSON :", error));

    function getRandomRecipes() {
        return [...allRecipes].sort(() => 0.5 - Math.random()).slice(0, 3);
    }

    function displayRecipes(recipes) {
        const container = document.getElementById("recipes-container");
        container.innerHTML = ""; 

        recipes.forEach((recipe) => {
            const card = document.createElement("div");
            card.className = "recipe-card p-6 rounded-lg w-64 relative opacity-0 translate-y-4 transition-all duration-500 w-[500px] cursor-pointer";
            card.setAttribute("data-title", recipe.nom);
            card.setAttribute("data-ingredients", formatIngredients(recipe.ingredients));
            card.setAttribute("data-instructions", formatSteps(recipe.etapes));
            card.setAttribute("data-time", recipe.temps_preparation);

            card.innerHTML = `
                <div class="relative h-64 overflow-hidden">
                    <img src="${recipe.image}" alt="${recipe.nom}" class="w-full h-full object-cover">
                    <div class="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md">${recipe.nom}</div>
                    <div class="absolute top-3 right-3 bg-white bg-opacity-80 px-3 py-1 rounded-md">${recipe.categorie}</div>
                </div>
                <div class="flex justify-between items-center shadow-lg p-4 bg-gray-100">
                    <div class="flex flex-col">
                        <span class="text-xs text-gray-500">Temps :</span>
                        <span class="text-gray-700">${recipe.temps_preparation}</span>
                    </div>
                    <button class="bg-orange-300 text-white px-4 py-2 rounded-md font-bold hover:bg-orange-600 transition-colors open-modal"
                        data-title="${recipe.nom}"
                        data-ingredients="${formatIngredients(recipe.ingredients)}"
                        data-instructions="${formatSteps(recipe.etapes)}"
                        data-time="${recipe.temps_preparation}">
                        Voir plus
                    </button>
                </div>
            `;

            container.appendChild(card);
            setTimeout(() => card.classList.remove("opacity-0", "translate-y-4"), 100);
        });

   
        document.querySelectorAll(".recipe-card, .open-modal").forEach(element => {
            element.addEventListener("click", (event) => {
                const target = event.currentTarget;
                const title = target.getAttribute("data-title");
                const ingredients = target.getAttribute("data-ingredients");
                const instructions = target.getAttribute("data-instructions");
                const time = target.getAttribute("data-time");
                openModal(title, ingredients, instructions, time);
            });
        });
    }

    function formatIngredients(ingredients) {
        return ingredients.map(ing => `${ing.nom} (${ing.quantite})`).join(", ");
    }

    function formatSteps(etapes) {
        return etapes.join(" ");
    }

    function openModal(title, ingredients, instructions, time) {
        document.getElementById("modal-title").innerText = title;
        document.getElementById("modal-time").innerText = time;
        document.getElementById("modal-prep").innerText = instructions;

        const ingredientsContainer = document.getElementById("modal-ingredients");
        ingredientsContainer.innerHTML = "";
        

        ingredients.split(", ").forEach(ing => {
            const btn = document.createElement("button");
            btn.className = "bg-[#A35D52] text-white px-4 py-2 rounded-lg m-1 ";
            btn.innerText = ing;
            ingredientsContainer.appendChild(btn);
        });

        document.getElementById("modal").classList.remove("hidden");
    }

    function closeModal() {
        document.getElementById("modal").classList.add("hidden");
    }


    document.getElementById("close-modal").addEventListener("click", closeModal);

    document.getElementById("modal").addEventListener("click", (event) => {
        if (event.target.id === "modal") {
            closeModal();
        }
    });

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

        suggestionsContainer.classList.toggle("hidden", filteredRecipes.length === 0);
    }


});



