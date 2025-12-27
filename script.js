const allAnnonces = Array.from(document.querySelectorAll('.annonce'));
let annoncesFiltrees = [];
let indexAffichage = 0;
const chunkSize = 10;

// Utilitaire pour récupérer les cases cochées
function getCheckedValues(id) {
  return Array.from(
    document.querySelectorAll(`#${id} input[type="checkbox"]:checked`)
  ).map(el => el.value);
}

// Convertir une valeur string en nombre sûr pour le tri
function toNumber(value) {
  if (!value) return 0;
  // supprimer espaces, €, /, etc.
  const num = value.replace(/[^\d.-]/g, '');
  return parseFloat(num) || 0;
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

  // Filtrage
  annoncesFiltrees = allAnnonces.filter(a => {
    const okMarque =
      marques.length === 0 ||
      marques.some(m => a.dataset.marque.toLowerCase().includes(m.toLowerCase()));

    const okMoteur =
      moteurs.length === 0 || moteurs.includes(a.dataset.engine);

    const okEnergie =
      energies.length === 0 || energies.includes(a.dataset.energy);

    const okCategorie =
      categories.length === 0 ||
      categories.some(cat => a.dataset.category.toLowerCase().includes(cat.toLowerCase()));

    const okBoite =
      boites.length === 0 ||
      boites.some(b => a.dataset.gearbox.toLowerCase().includes(b.toLowerCase()));

    const okTransmission =
      transmissions.length === 0 ||
      transmissions.includes(a.dataset.drivetrain);

    const okPosition =
      positions.length === 0 ||
      positions.includes(a.dataset.enginePosition);

    return okMarque && okMoteur && okEnergie && okCategorie && okBoite && okTransmission && okPosition;
  });

  // Tri
  annoncesFiltrees.sort((a, b) => {
    let valA, valB;
    switch(tri) {
      case 'prix-asc':
        valA = toNumber(a.dataset.price);
        valB = toNumber(b.dataset.price);
        return valA - valB;
      case 'prix-desc':
        valA = toNumber(a.dataset.price);
        valB = toNumber(b.dataset.price);
        return valB - valA;
      case 'puissance-asc':
        valA = toNumber(a.dataset.power);
        valB = toNumber(b.dataset.power);
        return valA - valB;
      case 'puissance-desc':
        valA = toNumber(a.dataset.power);
        valB = toNumber(b.dataset.power);
        return valB - valA;
      case 'malus-asc':
        valA = toNumber(a.dataset.malus);
        valB = toNumber(b.dataset.malus);
        return valA - valB;
      case 'malus-desc':
        valA = toNumber(a.dataset.malus);
        valB = toNumber(b.dataset.malus);
        return valB - valA;
      default:
        return 0;
    }
  });

  // Reset affichage
  indexAffichage = 0;
  allAnnonces.forEach(a => (a.style.display = 'none'));
  chargerPlus();
}

// Afficher un chunk
function chargerPlus() {
  const chunk = annoncesFiltrees.slice(indexAffichage, indexAffichage + chunkSize);
  chunk.forEach(a => (a.style.display = 'block'));
  indexAffichage += chunkSize;
}

// Écouteurs filtres
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

document.getElementById('tri').addEventListener('change', appliquerFiltres);

// Initialisation
appliquerFiltres();

// Infinite scroll
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    indexAffichage < annoncesFiltrees.length
  ) {
    chargerPlus();
  }
});
