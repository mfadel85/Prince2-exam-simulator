"use client";
import React from 'react';

export interface StoredAttemptItem {
  id: string; q: string; selected: string | null; correct: string; explanation: string | null;
  options?: string[]; selectedText?: string | null; correctText?: string | null; category?: string | null; isCorrect?: boolean;
}
export interface StoredAttempt { date: string; items: StoredAttemptItem[]; categoryStats?: Record<string,{correct:number;incorrect:number;total:number}> }

const STORAGE_KEY = 'prince2_incorrect_history_v1';

export function useReviewHistory() {
  const [attempts,setAttempts] = React.useState<StoredAttempt[]>([]);
  React.useEffect(()=>{
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return;
      let parsed:any = JSON.parse(raw);
      if(Array.isArray(parsed) && parsed.length && !parsed[0].items && (parsed[0].q || parsed[0].question)) {
        parsed = [{ date: new Date().toISOString(), items: parsed }];
      }
      if(!Array.isArray(parsed)) return;
      const normalized: StoredAttempt[] = parsed.map((att:any)=>{
        const itemsArr = Array.isArray(att.items)?att.items:[];
        const items: StoredAttemptItem[] = itemsArr.map((it:any,idx:number)=>{
          const id = String(it.id ?? idx);
          const q = String(it.q ?? it.question ?? ''); if(!q) return null;
          const rawCorrect = typeof it.correct==='string'?it.correct:(typeof it.correctAnswer==='string'?it.correctAnswer:'A');
          const correct = /^[A-D]$/.test(rawCorrect)?rawCorrect:'A';
          const rawSelected = typeof it.selected==='string'?it.selected:(typeof it.selectedLetter==='string'?it.selectedLetter:null);
          const selected = rawSelected && /^[A-D]$/.test(rawSelected)?rawSelected:null;
          const options = Array.isArray(it.options)?it.options.slice(0,4).map((o:any)=>String(o)):undefined;
          const isCorrect = it.isCorrect ?? (selected!==null && selected===correct);
          return { id,q,selected,correct,explanation: it.explanation?String(it.explanation):null,options,selectedText:it.selectedText??null,correctText:it.correctText??null,category:it.category??null,isCorrect } as StoredAttemptItem;
        }).filter(Boolean) as StoredAttemptItem[];
        let categoryStats = att.categoryStats;
        if(!categoryStats || typeof categoryStats!=='object') {
          categoryStats = {} as Record<string,{correct:number;incorrect:number;total:number}>;
          items.forEach(it=>{ const cat = it.category || 'Uncategorized'; if(!categoryStats[cat]) categoryStats[cat]={correct:0,incorrect:0,total:0}; categoryStats[cat].total++; if(it.isCorrect) categoryStats[cat].correct++; else categoryStats[cat].incorrect++; });
        }
        return { date: att.date || new Date().toISOString(), items, categoryStats };
      });
      setAttempts(normalized.filter(a=>a.items.length));
    } catch(e){ console.error('load history failed', e); }
  },[]);
  const clearAll = React.useCallback(()=>{ if(!confirm('Delete all saved incorrect answer history?')) return; localStorage.removeItem(STORAGE_KEY); setAttempts([]); },[]);
  const exportJson = React.useCallback((attemptsToExport=attempts)=>{ const blob = new Blob([JSON.stringify(attemptsToExport,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='incorrect-review-history.json'; a.click(); URL.revokeObjectURL(url); },[attempts]);
  return { attempts, clearAll, exportJson };
}
