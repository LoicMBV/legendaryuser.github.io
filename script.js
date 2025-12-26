let annoncesFiltrees = [];
let indexAffichage = 0;
const chunkSize = 10;

let allAnnonces = [];

async function loadAnnonces() {
  const response = await fetch('data.json');
  const annonces = await response.json();
  allAnnonces = annonces;
  appliquerFiltres();
}

function afficherAnnonces(annonces) {
  const container = document.querySelector('.annonces');

  annonces.forEach((annonce) => {
    const div = document.createElement('div');
    div.className = 'annonce';
    div.innerHTML = `
      <a href="${annonce.url}">
        <img src="${annonce.image}" alt="${annonce.title}" />
        <div class="info">
          <h2>${annonce.title}</h2>
          <p>${annonce.category} · ${annonce.gearbox} · ${annonce.drivetrain}</p>
          <p>Moteur : ${annonce.engine} · ${annonce.enginePosition} · ${annonce.energy} · ${annonce.power}</p>
          <p>Malus : ${annonce.malus}</p>
          <p class="prix">Prix : ${annonce.price}</p>
        </div>
        </a>
    `;
    container.appendChild(div);
  });
}

// 🧠 Fonction utilitaire pour récupérer les cases cochées d'un groupe
function getCheckedValues(id) {
  return Array.from(document.querySelectorAll(`#${id} input[type="checkbox"]:checked`)).map(el => el.value);
}

function appliquerFiltres() {
  const marques = getCheckedValues('filtre-marque');
  const moteurs = getCheckedValues('filtre-motorisation');
  const energies = getCheckedValues('filtre-energie');
  const categories = getCheckedValues('filtre-categorie');
  const boites = getCheckedValues('filtre-boite');
  const transmissions = getCheckedValues('filtre-transmission');
  const positions = getCheckedValues('filtre-position');
  const tri = document.getElementById('tri').value;

  annoncesFiltrees = allAnnonces.filter((a) => {
    const okMarque = marques.length === 0 || marques.some(m => a.title.toLowerCase().includes(m.toLowerCase()));
    const okMoteur = moteurs.length === 0 || moteurs.includes(a.engine);
    const okEnergie = energies.length === 0 || energies.includes(a.energy);
    const okCategorie = categories.length === 0 || categories.some(cat => a.category.toLowerCase().includes(cat.toLowerCase()));
    const okBoite = boites.length === 0 || boites.some(b => a.gearbox.toLowerCase().includes(b.toLowerCase()));
    const okTransmission = transmissions.length === 0 || transmissions.includes(a.drivetrain);
    const okPosition = positions.length === 0 || positions.includes(a.enginePosition);

    return okMarque && okMoteur && okEnergie && okCategorie && okBoite && okTransmission && okPosition;
  });

  // Tri
  if (tri === 'prix-asc') {
    annoncesFiltrees.sort((a, b) => a.priceValue - b.priceValue);
  } else if (tri === 'prix-desc') {
    annoncesFiltrees.sort((a, b) => b.priceValue - a.priceValue);
  } else if (tri === 'puissance-asc') {
    annoncesFiltrees.sort((a, b) => a.powerValue - b.powerValue);
  } else if (tri === 'puissance-desc') {
    annoncesFiltrees.sort((a, b) => b.powerValue - a.powerValue);
  } else if (tri === 'malus-asc') {
    annoncesFiltrees.sort((a, b) => a.malusValue - b.malusValue);
  } else if (tri === 'malus-desc') {
    annoncesFiltrees.sort((a, b) => b.malusValue - a.malusValue);
  }

  indexAffichage = 0;
  document.querySelector('.annonces').innerHTML = '';
  chargerPlus();
}

function chargerPlus() {
  const prochainChunk = annoncesFiltrees.slice(indexAffichage, indexAffichage + chunkSize);
  afficherAnnonces(prochainChunk);
  indexAffichage += chunkSize;
}

// ✅ Ajout de tous les écouteurs de filtres multiples dynamiquement
['filtre-marque', 'filtre-motorisation', 'filtre-energie', 'filtre-categorie', 'filtre-boite', 'filtre-transmission', 'filtre-position']
  .forEach(id => {
    document.getElementById(id).addEventListener('change', appliquerFiltres);
  });

document.getElementById('tri').addEventListener('change', appliquerFiltres);

loadAnnonces();

window.addEventListener('scroll', () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  if (nearBottom && indexAffichage < annoncesFiltrees.length) {
    chargerPlus();
  }
});
