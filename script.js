let allAnnonces = []; // on garde toutes les annonces ici (pour filtrer)

async function loadAnnonces() {
  const response = await fetch('data.json');
  const annonces = await response.json();
  allAnnonces = annonces; // on garde les données globalement

  afficherAnnonces(annonces); // première fois : on affiche tout
}

function afficherAnnonces(annonces) {
  const container = document.querySelector('.annonces');
  container.innerHTML = ''; // on vide les anciennes cartes

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

  let filtrées = allAnnonces.filter((a) => {
    const okMarque = marque === '' || a.title.includes(marque);
    const okMoteur = moteur === '' || a.engine === moteur;
    return okMarque && okMoteur;
  });

  // Tri
  if (tri === 'prix-asc') {
    filtrées.sort((a, b) => a.priceValue - b.priceValue);
  } else if (tri === 'prix-desc') {
    filtrées.sort((a, b) => b.priceValue - a.priceValue);
  } else if (tri === 'annee-desc') {
    filtrées.sort((a, b) => b.year - a.year);
  } else if (tri === 'annee-asc') {
    filtrées.sort((a, b) => a.year - b.year);
  }

  afficherAnnonces(filtrées);
}

// Nouvelle ligne : pour le tri aussi
document.getElementById('tri').addEventListener('change', appliquerFiltres);

// Quand les filtres changent, on applique
document.getElementById('filtre-marque').addEventListener('change', appliquerFiltres);
document.getElementById('filtre-motorisation').addEventListener('change', appliquerFiltres);

loadAnnonces(); // on lance tout au début
