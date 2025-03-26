function afficherRecette() {
    const container = document.getElementById('recettes-container');

    fetch('../data/data.json')
        .then(response => response.json())
        .then(data => {
            data.recettes.forEach((recette, index) => {
                const recetteDiv = document.createElement('div');
                recetteDiv.classList.add('recette');
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
           <button type="button" class="favoris-btn bg-orange-300 text-white px-4 py-2 rounded-md font-bold hover:bg-orange-400 transition-colors" id="${index}">Enregistrer</button>  
        </div>
                `;

                container.appendChild(recetteDiv);
            });


            document.querySelectorAll('.favoris-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const recetteIndex = this.getAttribute('id');
                    const recetteTofavoris = data.recettes[recetteIndex];

                    console.log('Recette enregistrée :', recetteTofavoris);

                    let recettesFavoris = JSON.parse(localStorage.getItem('recettes')) || [];


                    if (!recettesFavoris.some(r => r.nom === recetteTofavoris.nom)) {
                        recettesFavoris.push(recetteTofavoris);
                        localStorage.setItem('recettes', JSON.stringify(recettesFavoris));
                        alert('Recette ajoutée aux favoris.');
                    }
                });
            });
        })
        .catch(error => console.error('Erreur de chargement:', error));
}

/*

<div>
    <nav class="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
    <a href="#" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
        <span class="sr-only">Previous</span>
        <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
        <path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
        </svg>
    </a>
    <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->
    <a href="#" aria-current="page" class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">1</a>
    <a href="#" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0">2</a>
    <a href="#" class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">3</a>
    <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0">...</span>
    <a href="#" class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">8</a>
    <a href="#" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0">9</a>
    <a href="#" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0">10</a>
    <a href="#" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
        <span class="sr-only">Next</span>
        <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
        <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
        </svg>
    </a>
    </nav>
</div>

*/

function pagination() {
    const pagination = document.getElementById('pagination');

    fetch('../data/data.json')
        .then(response => response.json())
        .then(data => {
            const total = data.recettes.length;
            const recetteParPage = 4;
            const url = new URLSearchParams(location.search);
            let pageDefaut = parseInt(url.get('page')) || 1;

            const nmbrePage = Math.ceil(total / recetteParPage);

            console.log('Nombre de pages :', nmbrePage);
            console.log('Total de recettes :', total);

            pagination.innerHTML = `
                <a href="?page=${pageDefaut - 1}" 
                   class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${pageDefaut === 1 ? 'cursor-not-allowed text-gray-300' : ''}">
                    <span class="sr-only">Previous</span>
                    <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                        <path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
                    </svg>
                </a>
                
                <a href="?page=${pageDefaut + 1}" 
                   class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${pageDefaut === nmbrePage ? 'cursor-not-allowed text-gray-300' : ''}">
                    <span class="sr-only">Next</span>
                    <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                        <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>
                </a>
            `;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}



afficherRecette();
pagination();
