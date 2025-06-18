let annoncesFiltrees = [];
let indexAffichage = 0;
const chunkSize = 10;

let allAnnonces = []; // on garde toutes les annonces ici (pour filtrer)

async function loadAnnonces() {
  const response = await fetch('data.json');
  const annonces = await response.json();
  allAnnonces = annonces;
  appliquerFiltres(); // pour charger les premiers 10 automatiquement
}


function afficherAnnonces(annonces) {
  const container = document.querySelector('.annonces');
  // PAS de container.innerHTML ici ! sinon ça efface les précédentes

  annonces.forEach((annonce) => {
    const div = document.createElement('div');
    div.className = 'annonce';
    div.innerHTML = `
      <a href="${annonce.url}" target="_blank">
        <img src="${annonce.image}" alt="${annonce.title}" />
        <div class="info">
          <h2>${annonce.title}</h2>
          <p>${annonce.year} · ${annonce.engine} · ${annonce.km}</p>
          <p class="prix">${annonce.price}</p>
        </div>
      </a>
    `;
    container.appendChild(div);
  });
}


// Fonction appelée quand on change un filtre
function appliquerFiltres() {
  const marque = document.getElementById('filtre-marque').value;
  const moteur = document.getElementById('filtre-motorisation').value;
  const tri = document.getElementById('tri').value;

  annoncesFiltrees = allAnnonces.filter((a) => {
    const okMarque = marque === '' || a.title.includes(marque);
    const okMoteur = moteur === '' || a.engine === moteur;
    return okMarque && okMoteur;
  });

  if (tri === 'prix-asc') {
    annoncesFiltrees.sort((a, b) => a.priceValue - b.priceValue);
  } else if (tri === 'prix-desc') {
    annoncesFiltrees.sort((a, b) => b.priceValue - a.priceValue);
  } else if (tri === 'annee-desc') {
    annoncesFiltrees.sort((a, b) => b.year - a.year);
  } else if (tri === 'annee-asc') {
    annoncesFiltrees.sort((a, b) => a.year - b.year);
  }

  indexAffichage = 0;
  document.querySelector('.annonces').innerHTML = ''; // vide tout
  chargerPlus(); // charge les premiers 10
}

function chargerPlus() {
  const prochainChunk = annoncesFiltrees.slice(indexAffichage, indexAffichage + chunkSize);
  afficherAnnonces(prochainChunk);
  indexAffichage += chunkSize;
}


// Nouvelle ligne : pour le tri aussi
document.getElementById('tri').addEventListener('change', appliquerFiltres);

// Quand les filtres changent, on applique
document.getElementById('filtre-marque').addEventListener('change', appliquerFiltres);
document.getElementById('filtre-motorisation').addEventListener('change', appliquerFiltres);

loadAnnonces(); // on lance tout au début

window.addEventListener('scroll', () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  if (nearBottom && indexAffichage < annoncesFiltrees.length) {
    chargerPlus();
  }
});
