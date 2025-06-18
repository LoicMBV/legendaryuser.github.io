// script.js

// Fonction pour charger les données et générer les annonces
async function loadAnnonces() {
  const response = await fetch('data.json');
  const annonces = await response.json();

  const container = document.querySelector('.annonces');

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

// Appel de la fonction
loadAnnonces();
