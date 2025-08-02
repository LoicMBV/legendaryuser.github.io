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
      .replace(/{{energy}}/g, car.energy)
      .replace(/{{engine}}/g, car.engine)
      .replace(/{{price}}/g, car.price)
      .replace(/{{malus}}/g, car.malus)
      .replace(/{{category}}/g, car.category)
      .replace(/{{power}}/g, car.power)
      .replace(/{{drivetrain}}/g, car.drivetrain)
      .replace(/{{gearbox}}/g, car.gearbox)
      .replace(/{{enginePosition}}/g, car.enginePosition)
      .replace(/{{image}}/g, car.image)
      .replace(/{{url}}/g, car.url);
    

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
