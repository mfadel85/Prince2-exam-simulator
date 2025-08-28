const fs=require('fs');
const path=require('path');
const file=path.join(__dirname,'..','src','data','generatedQuestions.ts');
let txt=fs.readFileSync(file,'utf8');
const start=txt.indexOf('export const generatedQuestions');
const openBracket=txt.indexOf('[', start);
const closeBracket=txt.lastIndexOf(']');
const header=txt.slice(0, openBracket+1);
const footer=txt.slice(closeBracket);
const body=txt.slice(openBracket+1, closeBracket);
// Split objects heuristically: look for '\n  {' boundaries
const blocks=body.split(/\n\s*\{/).map((b,i)=> (i===0? b : '{'+b)).map(s=>s.trim()).filter(s=>s.length>0);
const kept=[];
for(const block of blocks){
  if(/explanation:\s*"[^"]+"/.test(block)){
    kept.push('  '+block.replace(/\s+$/,'') );
  }
}
console.log('Original objects:', blocks.length, 'Kept with explanation:', kept.length);
const out=header+'\n'+kept.join('\n')+'\n];\n';
fs.writeFileSync(file,out,'utf8');
