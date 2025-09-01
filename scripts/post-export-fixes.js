// Ensure key top‑level pages work as both /page and /page/ on static hosts.
// Also append simple redirects file if a platform (e.g. Netlify) uses it.
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');

// Pages we want directory aliases for
const aliasPages = ['review', 'analytics'];

try {
  aliasPages.forEach(page => {
    const htmlPath = path.join(outDir, `${page}.html`);
    const dirPath = path.join(outDir, page);
    if (fs.existsSync(htmlPath)) {
      if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
      const indexPath = path.join(dirPath, 'index.html');
      if (!fs.existsSync(indexPath)) {
        fs.copyFileSync(htmlPath, indexPath);
        console.log(`Created ${page}/index.html for folder access`);
      }
    }
  });

  // Create simple _redirects if absent; include entries for each alias page
  const redirectsFile = path.join(outDir, '_redirects');
  if (!fs.existsSync(redirectsFile)) {
    const lines = aliasPages.map(p => `/${p} /${p}.html 200`).join('\n') + '\n';
    fs.writeFileSync(redirectsFile, lines);
    console.log('Added _redirects mapping for alias pages');
  } else {
    const current = fs.readFileSync(redirectsFile, 'utf8');
    let appended = false;
    aliasPages.forEach(p => {
      if (!new RegExp(`/` + p + ` /` + p + `\.html`).test(current)) {
        fs.appendFileSync(redirectsFile, `\n/${p} /${p}.html 200`);
        appended = true;
      }
    });
    if (appended) console.log('Appended missing alias redirects');
  }
} catch (e) {
  console.error('post-export-fixes error', e);
}
