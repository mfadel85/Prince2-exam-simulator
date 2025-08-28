const fs = require('fs');
const path = require('path');

function parseQuestionsTs() {
  const file = path.join(__dirname, '..', 'src', 'data', 'questions.ts');
  const txt = fs.readFileSync(file, 'utf8');
  // Extract baseQuestions block
  const baseBlockMatch = txt.match(/const baseQuestions:[\s\S]*?= \[([\s\S]*?)\n\];/);
  let baseCount = 0; let baseIssues = [];
  if (baseBlockMatch) {
    const block = baseBlockMatch[1];
    const objects = block.split(/\n\s*{\s*\n/).filter(o => /id:\s*"q\d+"/.test(o));
    baseCount = objects.length;
    objects.forEach((obj, idx) => {
      const idMatch = obj.match(/id:\s*"(q\d+)"/);
      const id = idMatch ? idMatch[1] : `index_${idx}`;
      if (!/correctAnswer:\s*"[ABCD]"/.test(obj)) baseIssues.push(`${id}: missing/invalid correctAnswer`);
      // Validate option presence
      const options = (obj.match(/"[^"]+"/g) || []).length; // rough
    });
  }
  return { baseCount, baseIssues };
}

function parseGenerated() {
  const file = path.join(__dirname, '..', 'src', 'data', 'generatedQuestions.ts');
  const txt = fs.readFileSync(file, 'utf8');
  const bodyMatch = txt.match(/export const generatedQuestions:[\s\S]*?= \[([\s\S]*?)\n\];/);
  let genCount = 0; let genIssues = []; let missingExplanation = 0; let explanationCount = 0;
  if (bodyMatch) {
    const body = bodyMatch[1];
    const objs = body.split(/\n\s*{\s*\n/).filter(o => /id:\s*"/.test(o));
    genCount = objs.length;
    objs.forEach((obj, idx) => {
      const idMatch = obj.match(/id:\s*"([^"]+)"/);
      const id = idMatch ? idMatch[1] : `g_${idx}`;
      if (!/correctAnswer:\s*"[ABCD]"/.test(obj)) genIssues.push(`${id}: missing/invalid correctAnswer`);
      if (!/explanation:\s*"[^"]+"/.test(obj)) missingExplanation++;
      else explanationCount++;
      // Ensure 4 options
      const optionLines = (obj.match(/\n\s*"[^"]+"/g) || []).filter(l => !/id:|question:|correctAnswer:|explanation:/.test(l));
      // Rough filter: count inside options array markers
      const optionsSectionMatch = obj.match(/options:\s*\[([\s\S]*?)\]/);
      if (optionsSectionMatch) {
        const opts = optionsSectionMatch[1].split(/\n/).filter(l => /".*"/.test(l));
        const clean = opts.map(l => l.trim()).filter(l => /^".*"[,]?$/.test(l));
        if (clean.length !== 4) genIssues.push(`${id}: expected 4 options got ${clean.length}`);
      }
    });
  }
  return { genCount, genIssues, missingExplanation, explanationCount };
}

const base = parseQuestionsTs();
const gen = parseGenerated();

const total = base.baseCount + gen.genCount;
const allIssues = [...base.baseIssues, ...gen.genIssues];

const summary = {
  baseQuestions: base.baseCount,
  generatedQuestions: gen.genCount,
  totalQuestions: total,
  issues: allIssues.length,
  missingExplanationInGenerated: gen.missingExplanation,
  generatedWithExplanation: gen.explanationCount,
  issueSamples: allIssues.slice(0, 20)
};

console.log(JSON.stringify(summary, null, 2));

if (allIssues.length > 0) {
  process.exitCode = 1; // non-zero to highlight verification problems
}