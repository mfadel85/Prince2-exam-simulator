const fs=require('fs');
const txt=fs.readFileSync('./src/data/generatedQuestions.ts','utf8');
const count=(txt.match(/id: "/g)||[]).length;
console.log('Approx generated question entries:',count);
