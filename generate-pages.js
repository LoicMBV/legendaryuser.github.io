const fs = require('fs');
const path = require('path');

const data = require('./data/data.json'); // Ton fichier JSON
const template = fs.readFileSync('./template.html', 'utf8');

const outputDir = './fiches';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

data.forEach(car => {
  const filename = `${car.marque}-${car.modele}`.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '.html';
  const html = template
    .replace(/{{titre}}/g, `${car.marque} ${car.modele}`)
    .replace(/{{description}}/g, `Fiche technique ${car.marque} ${car.modele}`)
    .replace(/{{marque}}/g, car.marque)
    .replace(/{{modele}}/g, car.modele)
    .replace(/{{prix}}/g, car.prix || 'Non précisé')
    .replace(/{{puissance}}/g, car.puissance || 'Non précisé')
    .replace(/{{boite}}/g, car.boite || 'Non précisé')
    .replace(/{{image}}/g, car.image || '')
    .replace(/{{urlConstructeur}}/g, car.url || '#');

  fs.writeFileSync(path.join(outputDir, filename), html);
});

console.log('✅ Pages générées dans le dossier /fiches');
