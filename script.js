const container = document.querySelector('.annonces');
const allAnnonces = Array.from(document.querySelectorAll('.annonce'));
let annoncesFiltrees = [];
let indexAffichage = 0;
const chunkSize = 10;

// récupère les valeurs cochées d'un filtre
function getCheckedValues(id) {
  return Array.from(
    document.querySelectorAll(`#${id} input[type="checkbox"]:checked`)
  ).map(el => el.value);
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

  // filtrage
  annoncesFiltrees = allAnnonces.filter(a => {
    const okMarque = marques.length === 0 || marques.includes(a.dataset.marque);
    const okMoteur = moteurs.length === 0 || moteurs.includes(a.dataset.engine);
    const okEnergie = energies.length === 0 || energies.includes(a.dataset.energy);
    const okCategorie = categories.length === 0 || categories.includes(a.dataset.category);
    const okBoite = boites.length === 0 || boites.includes(a.dataset.gearbox);
    const okTransmission = transmissions.length === 0 || transmissions.includes(a.dataset.drivetrain);
    const okPosition = positions.length === 0 || positions.includes(a.dataset.enginePosition);
    return okMarque && okMoteur && okEnergie && okCategorie && okBoite && okTransmission && okPosition;
  });

  // tri
  annoncesFiltrees.sort((a, b) => {
    switch(tri) {
      case 'prix-asc': return Number(a.dataset.price) - Number(b.dataset.price);
      case 'prix-desc': return Number(b.dataset.price) - Number(a.dataset.price);
      case 'puissance-asc': return Number(a.dataset.power) - Number(b.dataset.power);
      case 'puissance-desc': return Number(b.dataset.power) - Number(a.dataset.power);
      case 'malus-asc': return Number(a.dataset.malus) - Number(b.dataset.malus);
      case 'malus-desc': return Number(b.dataset.malus) - Number(a.dataset.malus);
      default: return 0;
    }
  });

  indexAffichage = 0;
  container.innerHTML = ''; // on vide le conteneur
  chargerPlus();            // on affiche le premier chunk
}

function chargerPlus() {
  const chunk = annoncesFiltrees.slice(indexAffichage, indexAffichage + chunkSize);
  chunk.forEach(a => container.appendChild(a)); // insertion dans le DOM
  indexAffichage += chunkSize;
}

// écouteurs filtres
[
  'filtre-marque',
  'filtre-motorisation',
  'filtre-energie',
  'filtre-categorie',
  'filtre-boite',
  'filtre-transmission',
  'filtre-position'
].forEach(id => {
  document.getElementById(id).addEventListener('change', appliquerFiltres);
});

// écouteur tri
document.getElementById('tri').addEventListener('change', appliquerFiltres);

// initialisation
appliquerFiltres();

// scroll infini
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      indexAffichage < annoncesFiltrees.length) {
    chargerPlus();
  }
});
