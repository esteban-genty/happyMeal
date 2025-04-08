const planningContainer = document.getElementById("planning");
const exportPDFButton = document.getElementById("exportPDF");

function getPlanning() {
    return JSON.parse(localStorage.getItem("planning")) || {};
}

function savePlanning(planning) {
    localStorage.setItem("planning", JSON.stringify(planning));
}


async function loadPlanning() {
    try {
        let planning = getPlanning();  

        document.querySelectorAll('.day').forEach(dayDiv => {
            const ul = dayDiv.querySelector("ul");
            ul.innerHTML = ""; 
        });

        for (let day in planning) {
            let formattedDay = day.charAt(0).toUpperCase() + day.slice(1); 
            let dayContainer = document.querySelector(`.day[data-day="${formattedDay}"] ul`);
            if (!dayContainer) continue;

            let recettes = JSON.parse(localStorage.getItem('recettes')) || [];
            
            dayContainer.innerHTML = planning[day].map(nom => {
                let recette = recettes.find(r => r.nom === nom);
                return recette ? `<li>${recette.nom} <button onclick="removeFromPlanning('${day}', '${recette.nom}')">❌</button></li>` : '';
            }).join('');
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}

function removeFromPlanning(day, recipeName) {
    let planning = getPlanning();
    planning[day] = planning[day].filter(nom => nom !== recipeName);

    if (planning[day].length === 0) {
        delete planning[day];
    }

    savePlanning(planning);

    setTimeout(() => {
        loadPlanning();
    }, 100);
}


function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const planning = getPlanning();

    if (Object.keys(planning).length === 0) {
        alert("Le planning est vide. Ajoutez des repas avant d'exporter.");
        return;
    }

    doc.setFont("helvetica", "bold");
    doc.text("Planning des repas", 20, 20);
    doc.setFont("helvetica", "normal");

    let y = 30;

    for (let day in planning) {
        doc.setFontSize(14);
        doc.text(day.charAt(0).toUpperCase() + day.slice(1), 20, y);
        y += 8;

        planning[day].forEach(mealName => {
            doc.setFontSize(12);
            doc.text(`- ${mealName}`, 25, y);
            y += 6;
        });

        y += 5;
    }

    doc.save("planning_repas.pdf");
}

exportPDFButton.addEventListener("click", exportToPDF);
loadPlanning();
