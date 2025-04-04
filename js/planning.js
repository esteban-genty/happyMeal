const planningContainer = document.getElementById("planning");
const exportPDFButton = document.getElementById("exportPDF");

function getPlanning() {
    return JSON.parse(localStorage.getItem("planning")) || {};
}

function savePlanning(planning) {
    localStorage.setItem("planning", JSON.stringify(planning));
}

function addToPlanning(mealId, selectElement) {
    let day = selectElement.value; 

    if (!day) return;
    day = day.toLowerCase(); 

    let planning = getPlanning();
    if (!planning[day]) {
        planning[day] = [];
    }

    if (!planning[day].includes(mealId)) {
        planning[day].push(mealId);
    }

    savePlanning(planning);
    alert(`Recette ajoutée au planning du ${day}`);
    loadPlanning();
}

async function loadPlanning() {
    try {
        let res = await fetch("recettes.json");
        let data = await res.json();
        let allMeals = data.recettes.map((meal, index) => ({ ...meal, id: index + 1 }));

        let planning = getPlanning();

        for (let day in planning) {
            let formattedDay = day.charAt(0).toUpperCase() + day.slice(1); 
            
            let dayContainer = document.querySelector(`.day[data-day="${formattedDay}"] ul`);
            if (!dayContainer) continue;

            dayContainer.innerHTML = planning[day].map(id => {
                let meal = allMeals.find(m => m.id === id);
                return meal ? `<li>${meal.nom} <button onclick="removeFromPlanning('${day}', ${id})">❌</button></li>` : "";
            }).join('');
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}

function removeFromPlanning(day, mealId) {
    let planning = getPlanning();
    planning[day] = planning[day].filter(id => id !== mealId);
    
    if (planning[day].length === 0) {
        delete planning[day]; 
    }

    savePlanning(planning);
    loadPlanning(); 

    let dayContainer = document.querySelector(`.day[data-day="${day.charAt(0).toUpperCase() + day.slice(1)}"] ul`);
    if (dayContainer && (!planning[day] || planning[day].length === 0)) {
        dayContainer.innerHTML = ""; 
    }
}


loadPlanning();



async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let planning = getPlanning();
    
    if (Object.keys(planning).length === 0) {
        alert("Le planning est vide. Ajoutez des repas avant d'exporter.");
        return;
    }

    try {
        let res = await fetch("recettes.json");
        let data = await res.json();
        let allMeals = data.recettes.map((meal, index) => ({ ...meal, id: index + 1 }));

        doc.setFont("helvetica", "bold");
        doc.text("Planning des repas", 20, 20);
        doc.setFont("helvetica", "normal");

        let y = 30;

        for (let day in planning) {
            doc.setFontSize(14);
            doc.text(day, 20, y);
            y += 8;

            planning[day].forEach(mealId => {
                let meal = allMeals.find(m => m.id === mealId);
                let mealName = meal ? meal.nom : "Recette inconnue"; 

                doc.setFontSize(12);
                doc.text(`- ${mealName}`, 25, y);
                y += 6;
            });

            y += 5; 
        }

        doc.save("planning_repas.pdf"); 
    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors de l'exportation du PDF.");
    }
}

exportPDFButton.addEventListener("click", exportToPDF);

