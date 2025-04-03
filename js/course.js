document.addEventListener("DOMContentLoaded", () => {
    const coursesList = document.getElementById("courses-list");
    const clearButton = document.getElementById("clear-list");
    const downloadButton = document.getElementById("download-pdf");
    //recupere depuis les ingredients dans accueil
    function loadCourses() {
        coursesList.innerHTML = "";
        let listeCourses = JSON.parse(localStorage.getItem("listeCourses")) || [];
        console.log("Liste actuelle des courses:", listeCourses);
        
        if (listeCourses.length === 0) {
            coursesList.innerHTML = ' <p class="text-gray-500 text-center italic col-span-4"> Aucun ingrédient dans la liste</p>';
             
            return;
        }
        
        listeCourses.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "flex items-center justify-between bg-[#FFFFFF] px-4 py-2 rounded-full shadow-md w-full text-center";
            div.innerHTML = `
                <span class="flex-1">${item}</span>
                
                <button class="text-red-600 text-xl font-bold ml-2" onclick="removeItem(${index})">✖</button>
            `;
            coursesList.appendChild(div);
        });
    }
//boutton individuel pour chaque ingredients
    window.removeItem = (index) => {
        let listeCourses = JSON.parse(localStorage.getItem("listeCourses")) || [];
        console.log("Suppression de l'élément:", listeCourses[index]);
        listeCourses.splice(index, 1);
        localStorage.setItem("listeCourses", JSON.stringify(listeCourses));
        loadCourses();
    };
// supprime toute la liste
    clearButton.addEventListener("click", () => {
        console.log("Liste vidée");
        localStorage.removeItem("listeCourses");
        loadCourses();
    });

    downloadButton.addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let listeCourses = JSON.parse(localStorage.getItem("listeCourses")) || [];
        
        doc.text("Ma Liste de Courses", 10, 10);
        listeCourses.forEach((item, index) => {
            doc.text(`${index + 1}. ${item}`, 10, 20 + index * 10);
        });
        
        doc.save("liste_de_courses.pdf");
    });

    loadCourses();
});