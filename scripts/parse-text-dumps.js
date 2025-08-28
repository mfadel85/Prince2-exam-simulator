/**
 * Parse raw text dumps in scripts/pdf-text into structured Question objects and
 * regenerate src/data/generatedQuestions.ts
 *
 * Handles multiple source formats:
 * 1) "Question 1: ... A) option B) option C) option D) option" (possibly wrapped)
 * 2) "Q1. question text" followed by 4 lines starting with A./B./C./D.
 * 3) Lines with numeric prefix and lowercase a) b) c) d) (answers file - ignored for stems, but used for keys)
 * 4) Separate ANSWERS section mapping like "Answer 1: B - explanation" or "Q1: B · explanation" or
 *    "Q1: Correct Answer = B".
 */

const fs = require('fs');
const path = require('path');

const dumpsDir = path.join(__dirname, 'pdf-text');
const outputFile = path.join(__dirname, '..', 'src', 'data', 'generatedQuestions.ts');

/** Basic slug for ID from source + number */
function makeId(source, n) {
  return `${source}_${n}`.replace(/[^a-z0-9_]/gi, '_');
}

/**
 * Normalize whitespace: collapse internal multiple spaces and trim lines.
 */
function normalize(text) {
  return text.replace(/\r/g, '').replace(/\t/g, ' ').replace(/ +/g, ' ').trim();
}

// Collect all raw texts
const files = fs.readdirSync(dumpsDir).filter(f => f.endsWith('.txt'));

// Separate answer-key style files heuristically
function isAnswerKeyFile(name, content) {
  // Treat as pure answer key only if file name suggests 'Answers' and it contains answer patterns
  if (/answers?/i.test(name) && /Answer Key|Answer\s+\d+:|Q1: Correct Answer/i.test(content)) return true;
  return false;
}

const sources = [];
let answerKeyBlobs = [];
for (const file of files) {
  const full = path.join(dumpsDir, file);
  const raw = fs.readFileSync(full, 'utf8');
  if (isAnswerKeyFile(file, raw)) {
    answerKeyBlobs.push(raw);
  } else {
    sources.push({ name: file, content: raw });
  }
}

// Parse answer mappings from any answer key format encountered
const answerMap = new Map(); // key: numeric index -> letter
const explanationsMap = new Map();

function harvestAnswers(blob) {
  const lines = blob.split(/\n+/);
  for (const line of lines) {
    // Patterns:
    // Answer 12: C - explanation
    // Q12: C · explanation
    // Q12: Correct Answer = B
    const m = line.match(/^(?:Answer\s+|Q)(\d+):?\s*(?:Correct Answer\s*=\s*)?([ABCD])\b[\s\-·:]*([^]*)$/i);
    if (m) {
      const idx = parseInt(m[1], 10);
      const letter = m[2].toUpperCase();
      const expl = m[3] ? m[3].trim() : '';
      if (!answerMap.has(idx)) answerMap.set(idx, letter);
      if (expl && !explanationsMap.has(idx)) explanationsMap.set(idx, expl);
      continue;
    }
    // Pattern like "Q1: B · explanation" captured above.
    // Pattern like "Q1: Correct Answer = B" captured above.
  }
}
answerKeyBlobs.forEach(harvestAnswers);

// Also attempt to parse embedded ANSWERS AND EXPLANATIONS sections inside source dumps
function extractEmbeddedAnswers(text) {
  const split = text.split(/ANSWERS? AND EXPLANATIONS?/i);
  if (split.length > 1) {
    harvestAnswers(split[1]);
  } else if (/Answer Key/i.test(text)) {
    const keyPart = text.split(/Answer Key/i)[1];
    if (keyPart) harvestAnswers(keyPart);
  }
}

// Question extraction per source
const generated = [];

for (const { name, content } of sources) {
  extractEmbeddedAnswers(content);
  const sourceTag = path.basename(name).replace(/\.txt$/, '').replace(/\s+/g, '_').toLowerCase();

  // Strategy 1: Q# block format
  const qBlockRegex = /(Q(\d{1,3})\.)([\s\S]*?)(?=\nQ\d+\.|\nAnswer Key|$)/g;
  let match;
  const localQuestions = [];
  while ((match = qBlockRegex.exec(content)) !== null) {
    const num = parseInt(match[2], 10);
    let body = match[3];
    // Split lines and extract options lines starting with A./B./C./D.
    const lines = body.split(/\n/).map(l => l.trim()).filter(Boolean);
    let stemLines = [];
    const options = [];
    for (const line of lines) {
      const opt = line.match(/^[ABCD][).]\s*(.*)$/);
      if (opt) {
        options.push(normalize(opt[1]));
      } else {
        stemLines.push(line);
      }
    }
    if (options.length === 4) {
      const stem = normalize(stemLines.join(' ')).replace(/\(Choose the correct answer\)/i, '').trim();
      localQuestions.push({ num, stem, options });
    }
  }

  // Strategy 2: Inline Question #: pattern (used in practice exam sets) capturing until next Question n:
  // Eg: Question 1: text ... A) ... B) ... C) ... D) ...
  const inlineRegex = /(Question\s+(\d{1,3}):)([\s\S]*?)(?=Question\s+\d+:|ANSWERS? AND EXPLANATIONS|Answer\s+\d+:|$)/gi;
  while ((match = inlineRegex.exec(content)) !== null) {
    const num = parseInt(match[2], 10);
    let segment = match[3];
    // Merge newlines to single spaces for easier option extraction
    const flat = segment.replace(/\n+/g, ' ');
    // Extract options A) ... B) ... C) ... D) ...
    const optPattern = /A\)\s*([^]*?)B\)\s*([^]*?)C\)\s*([^]*?)D\)\s*([^]*?)(?:$|Question\s+\d+:|ANSWERS? AND EXPLANATIONS|Answer\s+\d+:)/i;
    const om = flat.match(optPattern);
    if (om) {
      const stemRaw = flat.split(/A\)/)[0];
      const stem = normalize(stemRaw);
      const options = [om[1], om[2], om[3], om[4]].map(o => normalize(o.replace(/Question\s+\d+:.*$/i, '')));
      if (options.every(o => o.length > 0)) {
        localQuestions.push({ num, stem, options });
      }
    }
  }

  // Merge duplicates preferring first occurrence
  const byNum = new Map();
  for (const q of localQuestions) {
    if (!byNum.has(q.num)) byNum.set(q.num, q);
  }

  if (byNum.size === 0) {
    console.warn('No questions parsed from', name);
  }

  for (const [num, q] of byNum) {
    const correctLetter = answerMap.get(num) || 'A'; // default A if unknown
    const explanation = explanationsMap.get(num);
    generated.push({
      id: makeId(sourceTag, num),
      question: q.stem,
      options: q.options,
      correctAnswer: correctLetter,
      explanation: explanation,
      category: undefined
    });
  }
}

// Sort generated by id for stable output
generated.sort((a, b) => a.id.localeCompare(b.id));

// Emit TypeScript file
const header = `import type { Question } from './questions';\n\n// AUTO-GENERATED FILE - do not edit manually.\n// Run: npm run parse:questions\n\nexport const generatedQuestions: Question[] = [\n`;
const body = generated.map(q => {
  const esc = s => s.replace(/`/g, '\\`').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `  {\n    id: "${q.id}",\n    question: "${esc(q.question)}",\n    options: [\n      "${esc(q.options[0])}",\n      "${esc(q.options[1])}",\n      "${esc(q.options[2])}",\n      "${esc(q.options[3])}"\n    ],\n    correctAnswer: "${q.correctAnswer}",${q.explanation ? `\n    explanation: "${esc(q.explanation)}",` : ''}\n  },`;
}).join('\n');
const footer = `\n];\n`;

fs.writeFileSync(outputFile, header + body + footer, 'utf8');

console.log(`Parsed and generated ${generated.length} questions from ${sources.length} source file(s) -> ${path.relative(process.cwd(), outputFile)}`);
console.log('Answer coverage available:', `${Array.from(answerMap.keys()).length} answers mapped.`);
