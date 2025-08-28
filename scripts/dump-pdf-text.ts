/*
 * Dump raw text (no OCR) from each PDF in src/exams to scripts/pdf-text/<basename>.txt
 */
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';

const EXAMS_DIR = path.join(process.cwd(), 'src', 'exams');
const OUT_DIR = path.join(process.cwd(), 'scripts', 'pdf-text');

async function extractOne(file: string) {
  const full = path.join(EXAMS_DIR, file);
  const buffer = fs.readFileSync(full);
  const data = await pdf(buffer);
  const outPath = path.join(OUT_DIR, file.replace(/\.pdf$/i, '.txt'));
  fs.writeFileSync(outPath, data.text, 'utf8');
  console.log(`Wrote: ${path.relative(process.cwd(), outPath)} (${data.text.length} chars)`);
}

async function main() {
  if (!fs.existsSync(EXAMS_DIR)) {
    console.error('Missing exams dir:', EXAMS_DIR);
    process.exit(1);
  }
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const pdfs = fs.readdirSync(EXAMS_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
  if (pdfs.length === 0) {
    console.warn('No PDF files found in', EXAMS_DIR);
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
}

main().catch(e => { console.error(e); process.exit(1); });
