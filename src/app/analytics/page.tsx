"use client";
import React from 'react';
import { useReviewHistory } from '@/hooks/useReviewHistory';

function buildCombined(attempts: ReturnType<typeof useReviewHistory>['attempts']) {
  const agg: Record<string,{correct:number;incorrect:number;total:number}> = {};
  attempts.forEach(a=>{
    if(!a.categoryStats) return;
    Object.entries(a.categoryStats).forEach(([cat,stats])=>{
      if(!agg[cat]) agg[cat]={correct:0,incorrect:0,total:0};
      agg[cat].correct+=stats.correct; agg[cat].incorrect+=stats.incorrect; agg[cat].total+=stats.total;
    });
  });
  return agg;
}

export default function AnalyticsPage(){
  const { attempts, clearAll, exportJson } = useReviewHistory();
  const combined = React.useMemo(()=>buildCombined(attempts),[attempts]);
  const pieData = React.useMemo(()=>{
    const cats = Object.entries(combined).sort((a,b)=>a[0].localeCompare(b[0]));
    const total = cats.reduce((s,[,v])=>s+v.total,0)||1;
    const palette = ['#2563eb','#16a34a','#dc2626','#7c3aed','#ea580c','#0891b2','#d97706','#db2777','#059669','#4f46e5'];
    return cats.map(([name,v],i)=>({label:name,value:v.total/total,color:palette[i%palette.length]}));
  },[combined]);
  const pieSvg = React.useMemo(()=>{
    if(!pieData.length) return null; let cum=0; const r=70,cx=r,cy=r;
    return <svg width={r*2} height={r*2} role="img" aria-label="Overall Category Distribution">{pieData.map((d,i)=>{const sa=cum*2*Math.PI; cum+=d.value; const ea=cum*2*Math.PI; const x1=cx+r*Math.sin(sa); const y1=cy-r*Math.cos(sa); const x2=cx+r*Math.sin(ea); const y2=cy-r*Math.cos(ea); const large= ea-sa>Math.PI?1:0; const dPath=`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`; return <path key={i} d={dPath} fill={d.color} />;})}</svg>;
  },[pieData]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-6">
          <h1 className="text-2xl font-bold">Performance Analytics</h1>
          <div className="flex gap-2 flex-wrap text-sm">
            <a href="/" className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Home</a>
            <a href="/review" className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50">Detailed Review</a>
            <button onClick={()=>exportJson()} className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50">Export JSON</button>
            <button onClick={clearAll} className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50">Clear All</button>
          </div>
        </div>
        {attempts.length===0 && <p className="text-gray-600">No saved attempts yet. Finish an exam and save results to view analytics.</p>}
        {attempts.length>0 && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="font-semibold mb-3 flex items-center gap-3">Overall Category Distribution {pieSvg && <span>{pieSvg}</span>}</h2>
              <div className="space-y-3">
                {Object.entries(combined).sort((a,b)=>a[0].localeCompare(b[0])).map(([cat,stats])=>{ const pct = stats.total? (stats.correct/stats.total)*100:0; return (
                  <div key={cat} className="text-xs">
                    <div className="flex justify-between mb-1"><span className="font-medium text-gray-700">{cat}</span><span className="text-gray-500">{stats.correct}/{stats.total} ({pct.toFixed(1)}%)</span></div>
                    <div className="h-3 w-full rounded bg-gray-200 overflow-hidden"><div className="h-full bg-green-500" style={{width:pct+'%'}}></div></div>
                  </div>
                );})}
                {pieData.length>0 && <div className="flex flex-wrap gap-2 pt-2">{pieData.map(p=>(<span key={p.label} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded border border-gray-200"><span className="w-3 h-3 rounded-sm" style={{background:p.color}}></span>{p.label}</span>))}</div>}
              </div>
            </div>
            <div>
              <h2 className="font-semibold mb-3">Attempts</h2>
              <ul className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
                {attempts.map((a,i)=>{ const total=a.items.length; const correct=a.items.filter(it=>it.isCorrect).length; const pct = total? (correct/total)*100:0; return (
                  <li key={i} className="p-3 rounded border bg-gray-50">
                    <div className="flex justify-between mb-1"><span className="font-medium">{new Date(a.date).toLocaleString()}</span><span className="text-gray-500">{correct}/{total} ({pct.toFixed(1)}%)</span></div>
                    <div className="h-2 w-full rounded bg-gray-200 overflow-hidden mb-1"><div className="h-full bg-indigo-500" style={{width:pct+'%'}}></div></div>
                    <a className="text-blue-600 underline" href={`/review?attempt=${i}`}>Open Detailed Review</a>
                  </li>
                );})}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
