import fs from 'fs';
import path from 'path';

// Input CSV expected at scripts/prince2_200_questions.csv
const INPUT = path.join(__dirname, 'prince2_200_questions.csv');
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'csvQuestions.ts');

if (!fs.existsSync(INPUT)) {
  console.error('CSV not found:', INPUT);
  process.exit(1);
}

const raw = fs.readFileSync(INPUT, 'utf8');

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { cur.push(field.trim()); field=''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i+1] === '\n') i++;
        cur.push(field.trim());
        if (cur.some(v=>v.length)) rows.push(cur);
        cur = []; field='';
      } else field += c;
    }
  }
  if (field.length || cur.length) { cur.push(field.trim()); if (cur.some(v=>v.length)) rows.push(cur); }
  return rows;
}

let rows = parseCSV(raw);
// Filter out placeholder truncated lines
rows = rows.filter(r => !(r.length === 1 && r[0].startsWith('...')));
if (!rows.length) { console.error('No rows parsed'); process.exit(1); }
const header = rows[0].map(h=>h.toLowerCase());
let data = rows;
if (header[0].includes('question_number')) data = rows.slice(1);

interface PQ { id:string; question:string; options:string[]; correctAnswer:string; explanation?:string; category?:string; }
const parsed: PQ[] = [];
for (const r of data) {
  if (r.length < 10) continue;
  const [num, category, subCat, questionText, a,b,c,d, correctRaw, explanation] = r;
  if (!questionText) continue;
  const correct = (correctRaw||'').trim().toUpperCase();
  if (!/^[ABCD]$/.test(correct)) continue;
  parsed.push({ id: `csv${num}`, question: questionText, options:[a,b,c,d], correctAnswer:correct, explanation: explanation || undefined, category: category || subCat || undefined });
}

const out = `// AUTO-GENERATED FILE. DO NOT EDIT\nimport type { Question } from './questions';\nexport const csvQuestions: Question[] = ${JSON.stringify(parsed, null, 2)};\n`;
fs.writeFileSync(OUTPUT, out, 'utf8');
console.log(`Wrote ${parsed.length} questions to ${OUTPUT}`);
