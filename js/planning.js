const planningContainer = document.getElementById("planning");
const exportPDFButton = document.getElementById("exportPDF");

function getPlanning() {
    return JSON.parse(localStorage.getItem("planning")) || {};
}

function savePlanning(planning) {
    localStorage.setItem("planning", JSON.stringify(planning));
}

function addToPlanning(recipeName, selectElement) {
    let day = selectElement.value;
    if (!day) return;
    day = day.toLowerCase();

    let planning = getPlanning();
    if (!planning[day]) {
        planning[day] = [];
    }

    if (!planning[day].includes(recipeName)) {
        planning[day].push(recipeName);
    }

    savePlanning(planning);
    alert(`Recette ajoutée au planning du ${day}`);
    loadPlanning();
}

async function loadPlanning() {
    try {
        let res = await fetch("../data/recettes.json");
        let data = await res.json();
        let allMeals = data.recettes;

        document.querySelectorAll('.day').forEach(dayDiv => {
            const ul = dayDiv.querySelector("ul");
            ul.innerHTML = ""; 
        });

        let planning = getPlanning();

        for (let day in planning) {
            let formattedDay = day.charAt(0).toUpperCase() + day.slice(1); 
            let dayContainer = document.querySelector(`.day[data-day="${formattedDay}"] ul`);
            if (!dayContainer) continue;

            dayContainer.innerHTML = planning[day].map(nom => {
                return `<li>${nom} <button onclick="removeFromPlanning('${day}', '${nom}')">❌</button></li>`;
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
