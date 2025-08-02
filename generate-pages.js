const fs = require('fs');
const path = require('path');

const data = require('./data/data.json'); // Ton fichier JSON
const template = fs.readFileSync('./template.html', 'utf8');

const outputDir = './fiches';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

data.forEach(car => {
  const sanitizedTitle = car.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  const filename = `${sanitizedTitle}.html`;

  const html = template
    .replace(/{{titre}}/g, car.title || 'Titre inconnu')
    .replace(/{{description}}/g, `Fiche technique ${car.title}`)
    .replace(/{{energie}}/g, car.energy || 'Non précisé')
    .replace(/{{moteur}}/g, car.engine || 'Non précisé')
    .replace(/{{puissance}}/g, car.power || 'Non précisé')
    .replace(/{{prix}}/g, car.price || 'Non précisé')
    .replace(/{{malus}}/g, car.malus || 'Non précisé')
    .replace(/{{categorie}}/g, car.category || 'Non précisé')
    .replace(/{{transmission}}/g, car.drivetrain || 'Non précisé')
    .replace(/{{boite}}/g, car.gearbox || 'Non précisé')
    .replace(/{{positionMoteur}}/g, car.enginePosition || 'Non précisé')
    .replace(/{{image}}/g, car.image || '')
    .replace(/{{urlConstructeur}}/g, car.url || '#');

  fs.writeFileSync(path.join(outputDir, filename), html);
});

console.log('✅ Pages générées dans le dossier /fiches');
