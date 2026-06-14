import React, { useEffect, useState } from "react";
import "./OpeningOmelette.css";

// 引入上傳的超可愛煎蛋圖片
import omeletteImg from "./omelette.png"; 

// ✨ 修改點 1：解構接收從 App.jsx 傳下來的 entered 狀態
export default function OpeningOmelette({ onEnter, entered }) {
  const [phase, setPhase] = useState(0);
  const [collapse, setCollapse] = useState(false);
  const [isEntered, setIsEntered] = useState(false); // 控制點擊 Enter 後的飛行狀態

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);   
    const t2 = setTimeout(() => setCollapse(true), 1500); 
    const t3 = setTimeout(() => setPhase(3), 2700);  
    const t4 = setTimeout(() => setPhase(4), 4000);  

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // 🎬 處理點擊 Enter 按鈕的精緻動態轉場
  const handleEnterClick = () => {
    setIsEntered(true); // 讓煎蛋圖片吃到 .aside 樣式，咻地飛向導覽列對齊位置！
    
    // 延遲 1.2 秒（完美配合 CSS 的 1.2s 飛行轉場時間）再正式掛載主系統
    setTimeout(() => {
      if (onEnter) onEnter();
    }, 1200);
  };

  return (
    /* 🔑 最外層：當 isEntered 為 true 時加上 "exit"，配合 CSS 釋放畫布背景並允許點擊穿透 */
    <div className={`scene ${isEntered ? "exit" : ""}`}>
      
      {/* 🌫️ Noise（資料噪聲） */}
      <div className={`noise ${phase >= 1 ? "show" : ""}`} />

      {/* 🌐 SNA GRAPH */}
      <div className={`graph ${collapse ? "collapse" : ""} ${phase >= 1 ? "show" : ""}`}>
        {/* 模擬 nodes */}
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="node"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
          />
        ))}

        {/* 模擬 edges */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`e${i}`}
            className="edge"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              width: `${Math.random() * 120 + 60}px`,
              transform: `rotate(${Math.random() * 180}deg)`
            }}
          />
        ))}
      </div>

      {/* 🥚 Omelette 吉祥物 
          ✨ 修改點 2：動態字串尾端補上 ${entered ? "handoff" : ""}
          當 App.jsx 的主系統掛載完成，這顆 fixed 的煎蛋就會功成身退、秒速隱形，由 Navbar 的煎蛋無縫接管！ */}
      <img 
        src={omeletteImg} 
        className={`omelette ${phase >= 3 ? "show" : ""} ${phase >= 4 ? "shift-up" : ""} ${isEntered ? "aside" : ""} ${entered ? "handoff" : ""}`} 
        alt="Team Omelette Mascot"
      />

      {/* 🎬 Center UI（點擊後加上 "exit" 讓中央文字大氣地向上淡出） */}
      <div className={`center ${isEntered ? "exit" : ""}`}>
        
        <div className={`title ${phase >= 4 ? "show" : ""}`} style={{ maxWidth: '850px', margin: '0 auto' }}>
          {/* 🛠️ 關鍵調整：縮小主標題字級，從原本可能過大的預設值縮減至極具質感的 1.75rem */}
          <h1 style={{
            fontSize: '1.75rem', 
            letterSpacing: '2px',
            lineHeight: '1.5',
            fontWeight: '800',
            color: '#451a03',
            marginBottom: '0.8rem',
            padding: '0 20px'
          }}>
            基於社群網路分析 (SNA) 之餐飲生態系數據診斷與智慧定價轉型系統
          </h1>
          
          {/* 🛠️ 副標題字級同步微調，維持完美的黃金視覺比例 */}
          <p style={{
            fontSize: '0.95rem',
            letterSpacing: '1px',
            color: '#a16207',
            fontWeight: '500',
            opacity: 0.85
          }}>
            中原大學 智慧運算與大數據學士班 - Team Omelette
          </p>
        </div>

        {/* 🚪 ENTER BUTTON */}
        {phase >= 4 && (
          <button className="enter" onClick={handleEnterClick} style={{ marginTop: '2rem' }}>
            ENTER SYSTEM
          </button>
        )}
        
      </div>
      
    </div>
  );
}