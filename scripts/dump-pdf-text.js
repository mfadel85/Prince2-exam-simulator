// Plain JS version for raw PDF text extraction (no OCR)
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const EXAMS_DIR = path.join(process.cwd(), 'src', 'exams');
const OUT_DIR = path.join(process.cwd(), 'scripts', 'pdf-text');

async function extractOne(file) {
  const full = path.join(EXAMS_DIR, file);
  const buffer = fs.readFileSync(full);
  const data = await pdf(buffer);
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, file.replace(/\.pdf$/i, '.txt'));
  fs.writeFileSync(outPath, data.text, 'utf8');
  console.log(`Wrote: ${path.relative(process.cwd(), outPath)} (${data.text.length} chars)`);
}

(async function main() {
  if (!fs.existsSync(EXAMS_DIR)) {
    console.error('Missing exams dir:', EXAMS_DIR);
    process.exit(1);
  }
  const pdfs = fs.readdirSync(EXAMS_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
  if (pdfs.length === 0) {
    console.warn('No PDFs found');
    return;
  }
  for (const f of pdfs) {
    console.log('Processing', f);
    try {
      await extractOne(f);
    } catch (e) {
      console.warn('Failed to extract', f, e);
    }
  }
  console.log('Done.');
})();
