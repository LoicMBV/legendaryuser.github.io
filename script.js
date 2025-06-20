let annoncesFiltrees = [];
let indexAffichage = 0;
const chunkSize = 12;

let allAnnonces = []; // on garde toutes les annonces ici (pour filtrer)

async function loadAnnonces() {
  const response = await fetch('data.json');
  const annonces = await response.json();
  allAnnonces = annonces;
  appliquerFiltres(); // pour charger les premiers 10 automatiquement
}


function afficherAnnonces(annonces) {
  const container = document.querySelector('.annonces');

  annonces.forEach((annonce) => {
    const div = document.createElement('div');
    div.className = 'annonce';
    div.innerHTML = `
      <a href="${annonce.url}" target="_blank">
        <img src="${annonce.image}" alt="${annonce.title}" />
        <div class="info">
          <h2>${annonce.title}</h2>
          <p>${annonce.energy} · ${annonce.engine} · ${annonce.power}</p>
          <p>${annonce.category} · ${annonce.gearbox} · ${annonce.drivetrain}</p>
          <p>Moteur : ${annonce.enginePosition}</p>
          <p>Malus : ${annonce.malus}</p>
          <p class="prix">${annonce.price}</p>
        </div>
      </a>
    `;
    container.appendChild(div);
  });
}



function appliquerFiltres() {
  const marque = document.getElementById('filtre-marque').value;
  const moteur = document.getElementById('filtre-motorisation').value;
  const energie = document.getElementById('filtre-energie').value;
  const categorie = document.getElementById('filtre-categorie').value;
  const boite = document.getElementById('filtre-boite').value;
  const transmission = document.getElementById('filtre-transmission').value;
  const position = document.getElementById('filtre-position').value;
  const tri = document.getElementById('tri').value;

  annoncesFiltrees = allAnnonces.filter((a) => {
    const okMarque = marque === '' || a.title.toLowerCase().includes(marque.toLowerCase());
    const okMoteur = moteur === '' || a.engine === moteur;
    const okEnergie = energie === '' || a.energy === energie;
    const okCategorie = categorie === '' || a.category === categorie;
    const okBoite = boite === '' || a.gearbox === boite;
    const okTransmission = transmission === '' || a.drivetrain === transmission;
    const okPosition = position === '' || a.enginePosition === position;

    return okMarque && okMoteur && okEnergie && okCategorie && okBoite && okTransmission && okPosition;
  });

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

document.getElementById('filtre-energie').addEventListener('change', appliquerFiltres);
document.getElementById('filtre-categorie').addEventListener('change', appliquerFiltres);
document.getElementById('filtre-boite').addEventListener('change', appliquerFiltres);
document.getElementById('filtre-transmission').addEventListener('change', appliquerFiltres);
document.getElementById('filtre-position').addEventListener('change', appliquerFiltres);
document.getElementById('tri').addEventListener('change', appliquerFiltres);
document.getElementById('filtre-marque').addEventListener('change', appliquerFiltres);
document.getElementById('filtre-motorisation').addEventListener('change', appliquerFiltres);

loadAnnonces(); // on lance tout au début

window.addEventListener('scroll', () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  if (nearBottom && indexAffichage < annoncesFiltrees.length) {
    chargerPlus();
  }
});
