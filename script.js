const allAnnonces = Array.from(document.querySelectorAll('.annonce'));
let annoncesFiltrees = [];
let indexAffichage = 0;
const chunkSize = 10;

// utilitaire
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

  annoncesFiltrees = allAnnonces.filter(a => {
    const okMarque =
      marques.length === 0 ||
      marques.some(m => a.dataset.marque.toLowerCase().includes(m.toLowerCase()));

    const okMoteur =
      moteurs.length === 0 ||
      moteurs.includes(a.dataset.engine);

    const okEnergie =
      energies.length === 0 ||
      energies.includes(a.dataset.energy);

    const okCategorie =
      categories.length === 0 ||
      a.dataset.category.toLowerCase().includes(categories[0].toLowerCase());

    const okBoite =
      boites.length === 0 ||
      a.dataset.gearbox.toLowerCase().includes(boites[0].toLowerCase());

    const okTransmission =
      transmissions.length === 0 ||
      transmissions.includes(a.dataset.drivetrain);

    const okPosition =
      positions.length === 0 ||
      positions.includes(a.dataset.enginePosition);

    return (
      okMarque &&
      okMoteur &&
      okEnergie &&
      okCategorie &&
      okBoite &&
      okTransmission &&
      okPosition
    );
  });

  // TRI
  if (tri === 'prix-asc') {
    annoncesFiltrees.sort((a, b) => a.dataset.price - b.dataset.price);
  } else if (tri === 'prix-desc') {
    annoncesFiltrees.sort((a, b) => b.dataset.price - a.dataset.price);
  } else if (tri === 'puissance-asc') {
    annoncesFiltrees.sort((a, b) => a.dataset.power - b.dataset.power);
  } else if (tri === 'puissance-desc') {
    annoncesFiltrees.sort((a, b) => b.dataset.power - a.dataset.power);
  } else if (tri === 'malus-asc') {
    annoncesFiltrees.sort((a, b) => a.dataset.malus - b.dataset.malus);
  } else if (tri === 'malus-desc') {
    annoncesFiltrees.sort((a, b) => b.dataset.malus - a.dataset.malus);
  }

  indexAffichage = 0;
  allAnnonces.forEach(a => (a.style.display = 'none'));
  chargerPlus();
}

function chargerPlus() {
  const chunk = annoncesFiltrees.slice(indexAffichage, indexAffichage + chunkSize);
  chunk.forEach(a => (a.style.display = 'block'));
  indexAffichage += chunkSize;
}

// écouteurs
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

// init
appliquerFiltres();

window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    indexAffichage < annoncesFiltrees.length
  ) {
    chargerPlus();
  }
});
