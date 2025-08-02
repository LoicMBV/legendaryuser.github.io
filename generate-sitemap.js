const fs = require('fs');
const path = require('path');

const fichesDir = path.join(__dirname, 'fiches');
const baseURL = 'https://legendaryautosport.com/fiches/';

const files = fs.readdirSync(fichesDir).filter(f => f.endsWith('.html'));

const today = new Date().toISOString().split('T')[0];

const urlsXML = files.map(file => `
  <url>
    <loc>${baseURL}${file}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
  </url>
`).join('');

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXML}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapContent);

console.log(`Sitemap généré avec ${files.length} fiches.`);
