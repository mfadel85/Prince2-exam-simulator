/*
 * PDF Question Extraction Script (heuristic)
 * Scans ./src/exams/*.pdf, extracts text, parses multiple-choice questions.
 * Writes ./src/data/generatedQuestions.ts
 */

import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';

interface ExtractedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  category?: string;
}

const EXAMS_DIR = path.join(process.cwd(), 'src', 'exams');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'generatedQuestions.ts');

async function readPdf(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

// Improved heuristic parser with broader patterns and debug capability.
function parseQuestions(raw: string, fileTag: string): ExtractedQuestion[] {
  const lines = raw.split(/\r?\n/).map(l => l.replace(/\s+/g, ' ').trim());
  // Remove empty lines but keep relative order
  const cleaned = lines.filter(Boolean);

  // Join with newline to simplify multi-line regex
  const joined = cleaned.join('\n');

  // Split on a question start: line beginning with digits followed by . or ) then space
  const blocks = joined.split(/\n(?=\d+[).]\s)/g);
  const questions: ExtractedQuestion[] = [];

  for (const block of blocks) {
    const idMatch = block.match(/^(\d+)[).]\s/);
    if (!idMatch) continue;
    const num = idMatch[1];

    // Extract question text up to first option marker (A/B/C/D)
    const qSplit = block.split(/\n(?=A[).:\-]\s)/);
    if (qSplit.length < 2) continue;
    const questionText = qSplit[0].replace(/^(\d+)[).]\s*/, '').trim();

    // Collect options: accept A) A. A- A:
    const optionRegex = /\n([ABCD])[).:\-]\s([^\n]+)/g;
    const options: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = optionRegex.exec(block)) !== null) {
      options[ 'ABCD'.indexOf(m[1]) ] = m[2].trim();
    }
    if (options.filter(Boolean).length !== 4) continue;

    // Answer detection anywhere in block or trailing lines
    let correct = 'A';
    const answerMatch = block.match(/Correct Answer[:\s]+([ABCD])/i) || block.match(/Answer[:\s]+([ABCD])/i);
    if (answerMatch) correct = answerMatch[1].toUpperCase();

    questions.push({
      id: `${fileTag}_${num}`,
      question: questionText,
      options: options as string[],
      correctAnswer: correct,
    });
  }
  return questions;
}

async function main() {
  if (!fs.existsSync(EXAMS_DIR)) {
    console.error('Exams directory not found:', EXAMS_DIR);
    process.exit(1);
  }
  const files = fs.readdirSync(EXAMS_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
  const all: ExtractedQuestion[] = [];

  for (const f of files) {
    try {
      const full = path.join(EXAMS_DIR, f);
  const text = await readPdf(full);
  // Write debug text for manual inspection
  const debugDir = path.join(process.cwd(), 'scripts', 'debug');
  if (!fs.existsSync(debugDir)) fs.mkdirSync(debugDir, { recursive: true });
  fs.writeFileSync(path.join(debugDir, f.replace(/\.pdf$/i, '.txt')), text, 'utf8');
      const tag = path.basename(f).replace(/[^a-zA-Z0-9]+/g,'_').replace(/_pdf$/i,'');
      const qs = parseQuestions(text, tag);
      console.log(`Parsed ${qs.length} from ${f}`);
      all.push(...qs);
    } catch (e) {
      console.warn('Failed parsing', f, e);
    }
  }

  // Write output TS module
  const out = `import type { Question } from './questions';\n\nexport const generatedQuestions: Question[] = ${JSON.stringify(all, null, 2)};\n`;
  fs.writeFileSync(OUTPUT_FILE, out, 'utf8');
  console.log(`Wrote ${all.length} questions to generatedQuestions.ts`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
