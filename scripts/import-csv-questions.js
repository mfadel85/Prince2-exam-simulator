// CSV to TypeScript question importer (plain JS version)
const fs = require('fs');
const path = require('path');
const INPUT = path.join(__dirname, 'prince2_200_questions.csv');
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'csvQuestions.ts');
if (!fs.existsSync(INPUT)) { console.error('CSV not found:', INPUT); process.exit(1); }
const raw = fs.readFileSync(INPUT, 'utf8');
function parseCSV(text){
  const rows=[];let cur=[];let field='';let inQ=false;for(let i=0;i<text.length;i++){const c=text[i];if(inQ){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else inQ=false;}else field+=c;}else{if(c==='"') inQ=true; else if(c===','){cur.push(field.trim());field='';} else if(c==='\n'||c==='\r'){ if(c==='\r'&&text[i+1]==='\n') i++; cur.push(field.trim()); if(cur.some(v=>v.length)) rows.push(cur); cur=[]; field=''; } else field+=c;}}
  if(field.length||cur.length){cur.push(field.trim()); if(cur.some(v=>v.length)) rows.push(cur);} return rows; }
let rows = parseCSV(raw).filter(r=>!(r.length===1 && r[0].startsWith('...')));
if(!rows.length){ console.error('No rows parsed'); process.exit(1); }
const header = rows[0].map(h=>h.toLowerCase());
const hasHeader = header[0] && (header[0].includes('question_number') || header[0].includes('question number'));
let data = hasHeader ? rows.slice(1) : rows;
const hasSubCat = header.includes('sub_category');
const parsed=[]; const seenNums=new Set();
for(const r of data){
  // Accept either 10 columns (with sub category) or 9 columns (without)
  if(r.length < 9) continue;
  let num, category, subCat, q, a, b, c, d, correctRaw, explanation;
  if(hasSubCat && r.length >= 10){
    [num, category, subCat, q, a, b, c, d, correctRaw, explanation] = r;
  } else {
    [num, category, q, a, b, c, d, correctRaw, explanation] = r;
    subCat = '';
  }
  if(!q) continue;
  const nStr=(num||'').trim();
  if(!/^[0-9]+$/.test(nStr)) continue;
  const n=parseInt(nStr,10);
  seenNums.add(n);
  const correct=(correctRaw||'').trim().toUpperCase();
  if(!/^[ABCD]$/.test(correct)) continue;
  parsed.push({
    id:`csv${nStr}`,
    question:q,
    options:[a,b,c,d],
    correctAnswer:correct,
    explanation:explanation||undefined,
    category:category||subCat||undefined
  });
}
parsed.sort((a,b)=>parseInt(a.id.slice(3))-parseInt(b.id.slice(3)));
// Detect gaps up to either declared max (200) or highest present
const maxDetected = Math.max(...[...seenNums]);
const expectedMax = Math.max(200, maxDetected);
const missing=[]; for(let i=1;i<=expectedMax;i++){ if(!seenNums.has(i)) missing.push(i); }
const out = `// AUTO-GENERATED FILE. DO NOT EDIT\n// Parsed ${parsed.length} questions. Missing IDs: ${missing.slice(0,20).join(', ')}${missing.length>20?' ...':''}\nimport type { Question } from './questions';\nexport const csvQuestions: Question[] = ${JSON.stringify(parsed,null,2)};\n`;
fs.writeFileSync(OUTPUT,out,'utf8');
console.log(`Wrote ${parsed.length} questions to ${OUTPUT}`);
if(missing.length){
  console.warn(`WARNING: Missing ${missing.length} question numbers (first 20 shown):`, missing.slice(0,20).join(', '));
} else {
  console.log('All sequential question numbers present.');
}