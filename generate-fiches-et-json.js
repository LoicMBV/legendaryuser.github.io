const fs = require('fs');
const path = require('path');

const inputPath = './data/data.json';
const outputPath = './data/data-with-links.json';
const template = fs.readFileSync('./template.html', 'utf8');
const outputDir = './fiches';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const rawData = fs.readFileSync(inputPath, 'utf8');
const data = JSON.parse(rawData);

const newData = data.map(car => {
  const slug = car.title.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');

  const filename = `${slug}.html`;
  const filepath = path.join(outputDir, filename);

  // Génère la fiche uniquement si elle n'existe pas encore
  if (!fs.existsSync(filepath)) {
    const html = template
      .replace(/{{titre}}/g, car.title)
      .replace(/{{description}}/g, `Fiche technique ${car.title}`)
      .replace(/{{marque}}/g, car.title.split(' ')[0] || 'Non précisé')
      .replace(/{{modele}}/g, car.title.split(' ').slice(1).join(' ') || 'Non précisé')
      .replace(/{{prix}}/g, car.price || 'Non précisé')
      .replace(/{{puissance}}/g, car.power || 'Non précisé')
      .replace(/{{boite}}/g, car.gearbox || 'Non précisé')
      .replace(/{{image}}/g, car.image || '')
      .replace(/{{urlConstructeur}}/g, car.url || '#');

    fs.writeFileSync(filepath, html);
    console.log(`✅ Fiche créée : ${filename}`);
  } else {
    console.log(`ℹ️ Fiche déjà existante : ${filename}`);
  }

  return {
    ...car,
    ficheUrl: `/fiches/${filename}`
  };
});

fs.writeFileSync(outputPath, JSON.stringify(newData, null, 2));
console.log(`✅ Nouveau JSON sauvegardé dans : ${outputPath}`);
