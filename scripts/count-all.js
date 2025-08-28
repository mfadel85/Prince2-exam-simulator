const fs=require('fs');
const gen=fs.readFileSync('./src/data/generatedQuestions.ts','utf8');
const base=fs.readFileSync('./src/data/questions.ts','utf8');
const genCount=(gen.match(/id: "/g)||[]).length;
const baseMatch=base.match(/const baseQuestions:[\s\S]*?\[(.*)\];/);
// Simple reliable count of base by regex over id: "q
const baseCount=(base.match(/id: "q\d+"/g)||[]).length;
console.log(JSON.stringify({ baseCount, genCount, total: baseCount+genCount }, null, 2));
