import React, { useEffect, useRef, useState, useCallback } from 'react';
import { styles, Term, ActionButton } from '../Styles';

const FUTURE_TASKS = [
  {
    title: 'GNN 生存風險預測',
    desc: '引入圖神經網絡（GNN）深度學習模型，精準預測特定商戶在未來一季的生存機率與陣亡影響。'
  },
  {
    title: '時序動態網絡拓撲分析',
    desc: '將靜態邊升級為隨時間變化的動態網絡結構，捕捉餐飲市場波動。'
  },
  {
    title: '多層複合網絡建構',
    desc: '整合 POS / 外送 / 評論情感三層數據進行全市場診斷與關聯分析。'
  },
  {
    title: '實時 POS 行動端對接',
    desc: '將即時競爭分析與預警模型推送至行動端 POS 系統。'
  },
  {
    title: 'LLM 智慧經營助理整合',
    desc: '結合大型語言模型，生成商家策略建議與行銷內容。'
  },
];

/* =========================
   Timeline Component
========================= */
const MemberCard = ({ tasks = [] }) => {
  const ref = useRef(null);
  const [visibleItems, setVisibleItems] = useState([]);
  const playedRef = useRef(false);
  const timeoutsRef = useRef([]);

  const startAnimation = useCallback(() => {
    if (playedRef.current) return;
    playedRef.current = true;
    tasks.forEach((_, i) => {
      const id = setTimeout(() => {
        setVisibleItems((prev) => [...new Set([...prev, i])]);
      }, i * 300);
      timeoutsRef.current.push(id);
    });
  }, [tasks]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { startAnimation(); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); timeoutsRef.current.forEach(clearTimeout); };
  }, [startAnimation]);

  return (
    <div ref={ref} style={{ position: 'relative', paddingLeft: '10px' }}>
      <div style={{ position: 'absolute', left: '18px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, #d97706, rgba(217,119,6,0.1))' }} />
      {tasks.map((task, i) => {
        const show = visibleItems.includes(i);
        return (
          <div key={i} style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(10px)', transition: 'all 0.5s ease' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', marginTop: '10px', background: show ? '#d97706' : '#e5e7eb', boxShadow: show ? '0 0 10px #f59e0b' : 'none', zIndex: 2 }} />
            <div style={{ flex: 1, backgroundColor: show ? '#ffffff' : '#fcfcfc', padding: '1.2rem', borderRadius: '20px', border: '1px solid #f3f4f6', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ fontWeight: 800, color: '#854d0e', marginBottom: '0.4rem' }}>{task.title}</div>
              <div style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.7' }}>{task.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* =========================
   TeamOutlook Main Page
========================= */
const TeamOutlook = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading2}>七. 未來展望</h2>

      <div style={{ backgroundColor: '#fefcf6', padding: '2.5rem', borderRadius: '30px', border: '1px solid #f9f1e0' }}>
        <h3 style={{ ...styles.heading3, marginTop: 0, marginBottom: '2rem' }}>技術迭代路線圖</h3>
        <MemberCard tasks={FUTURE_TASKS} />

      </div>
    </div>
  );
};

export default TeamOutlook;