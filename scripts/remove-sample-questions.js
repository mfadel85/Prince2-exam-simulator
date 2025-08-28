const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'data', 'generatedQuestions.ts');
let txt = fs.readFileSync(file, 'utf8');

// Match each question object. We assume objects start with two spaces then { and end with },
// followed by an optional comma.
const objectRegex = /(\s{2}\{[\s\S]*?\n\s{2}\},?)/g;
const objects = txt.match(objectRegex) || [];
let removed = 0;
const kept = objects.filter(block => {
  if (/question:\s*"Sample PRINCE2 Foundation question/i.test(block)) {
    removed++;
    return false;
  }
  return true;
});

if (removed === 0) {
  console.log('No sample placeholder questions found.');
  process.exit(0);
}

// Rebuild file: replace the portion between the array brackets.
txt = txt.replace(/export const generatedQuestions:[\s\S]*?= \[[\s\S]*?\n\];/, match => {
  return 'export const generatedQuestions: Question[] = [\n' + kept.join('\n') + '\n];';
});

fs.writeFileSync(file, txt, 'utf8');
console.log(`Removed ${removed} sample placeholder question(s). Remaining: ${kept.length}`);