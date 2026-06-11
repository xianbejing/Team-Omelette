import React, { useState, useEffect } from 'react';


// 1. 全域 CSS 物件 - 圓潤、莫蘭迪色系設計
export const styles = {
  wrapper: { 
    // 漸層背景，讓色彩不單調
    background: 'linear-gradient(135deg, #fdfbf7 0%, #f5f0e6 100%)', 
    minHeight: '100vh', 
    color: '#3d342d', 
    padding: '2rem 1rem', 
    // 選用較為圓潤的字體組合
    fontFamily: '"Quicksand", "Nunito", "Noto Sans TC", sans-serif',
    lineHeight: '1.7',
    position: 'relative'
  },
  container: { 
    maxWidth: '1200px', 
    margin: '0 auto', 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    padding: '3rem', 
    borderRadius: '35px', // 更圓潤的邊角
    boxShadow: '0 15px 45px rgba(180, 83, 9, 0.05)', 
    border: '1px solid rgba(255, 255, 255, 0.8)', 
    marginBottom: '3rem',
    position: 'relative',
    backdropFilter: 'blur(10px)' // 容器微磨砂效果
  },
  sectionNumber: {
    position: 'absolute',
    left: '20px',
    top: '-10px',
    fontSize: '7rem',
    fontWeight: '900',
    color: 'rgba(217, 119, 6, 0.06)', 
    zIndex: 0,
    userSelect: 'none',
    fontFamily: '"Arial Rounded MT Bold", sans-serif'
  },
  header: { 
    textAlign: 'center', 
    marginBottom: '3.5rem', 
    paddingBottom: '2.5rem',
    borderBottom: '2px dashed rgba(180, 83, 9, 0.1)'
  },
  navBar: { 
    display: 'flex', 
    justifyContent: 'center', 
    flexWrap: 'wrap', 
    gap: '1rem', 
    marginBottom: '3.5rem',
    position: 'sticky',
    top: '20px',
    zIndex: 1000,
    padding: '12px',
    backgroundColor: 'rgba(255, 250, 240, 0.85)',
    backdropFilter: 'blur(15px)', 
    borderRadius: '100px', // 完全圓形導覽列
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.5)'
  },
  heading2: { 
    fontSize: '2rem',
    fontWeight: '800',
    color: '#854d0e', // 莫蘭迪深琥珀
    letterSpacing: '0.02em',
    marginBottom: '1.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    zIndex: 1
  },
  heading3: { 
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#a16207', 
    marginTop: '2rem', 
    marginBottom: '1rem' 
  },
  cardGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
    gap: '2.5rem' 
  },
  subCard: { 
    backgroundColor: '#ffffff', 
    padding: '2.5rem', 
    borderRadius: '30px', // 圓潤卡片
    border: '1px solid rgba(243, 244, 246, 0.8)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.02)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    ':hover': { 
      transform: 'translateY(-12px)',
      boxShadow: '0 25px 40px rgba(180, 83, 9, 0.08)',
      backgroundColor: '#fffdfa'
    } 
  },
  metricDepthCard: {
    backgroundColor: '#fefcf6',
    boxShadow: 'inset 3px 3px 8px rgba(180, 83, 9, 0.03), inset -3px -3px 8px rgba(255,255,255,1)',
    borderRadius: '25px',
    padding: '1.8rem',
    border: '1px solid rgba(180, 83, 9, 0.05)',
    textAlign: 'center'
  },
  scrollBox: { 
    maxHeight: '400px', 
    overflowY: 'auto', 
    backgroundColor: '#fdfaf2', 
    borderRadius: '20px', 
    border: '1px solid #f9f1e0', 
    padding: '1.5rem' 
  },
  badge: { 
    backgroundColor: '#fef3c7', 
    color: '#92400e', 
    padding: '0.5rem 1.2rem', 
    borderRadius: '100px', 
    fontSize: '0.85rem', 
    fontWeight: '700',
    border: '1px solid #fde68a',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  }
};

// 2. 捲動進度條 - 漸層配色
export const ScrollProgress = () => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setWidth((scrollY / height) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, height: '6px',
      background: 'linear-gradient(90deg, #fbbf24, #d97706, #92400e)',
      width: `${width}%`, zIndex: 2001, transition: 'width 0.15s ease-out'
    }} />
  );
};

// 3. 導覽列按鈕 - 圓潤藥丸型
export const NavButton = ({ active, onClick, children }) => (
  <button 
    onClick={onClick} 
    style={{
      padding: '0.8rem 1.8rem',
      backgroundColor: active ? '#854d0e' : 'transparent',
      color: active ? '#ffffff' : '#713f12',
      border: 'none',
      borderRadius: '100px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '700',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      boxShadow: active ? '0 8px 20px rgba(133, 77, 14, 0.2)' : 'none'
    }}
  >
    {children}
  </button>
);

// 4. 子分頁按鈕 - 柔和底線
export const MicroTabButton = ({ active, onClick, children }) => (
  <button 
    onClick={onClick} 
    style={{
      padding: '0.8rem 1.5rem',
      backgroundColor: 'transparent',
      color: active ? '#854d0e' : '#a16207',
      border: 'none',
      borderBottom: active ? '4px solid #854d0e' : '4px solid transparent',
      cursor: 'pointer',
      fontSize: '1.05rem',
      fontWeight: '700',
      marginRight: '1.2rem',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit',
      borderRadius: '4px'
    }}
  >
    {children}
  </button>
);

// 5. 診斷動作按鈕 - 圓潤、漸層、高設計感
export const ActionButton = ({ onClick, children }) => (
  <button 
    onClick={onClick} 
    style={{
      padding: '0.8rem 1.5rem',
      background: 'linear-gradient(135deg, #d97706 0%, #854d0e 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '100px', // 圓潤化
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '700',
      boxShadow: '0 10px 20px rgba(180, 83, 9, 0.2)',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 15px 25px rgba(180, 83, 9, 0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 10px 20px rgba(180, 83, 9, 0.2)';
    }}
  >
    {children}
  </button>
);

// 6. 專有名詞提示 - 改為圓潤的小氣泡
export const Term = ({ title, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        color: '#854d0e',
        borderBottom: '2px dotted #ca8a04',
        cursor: 'help',
        fontWeight: '800',
        padding: '0 4px',
        position: 'relative',
        display: 'inline'
      }}
    >
      {children}

      {/* ✅ 改成 span（避免 div 破壞 p 結構） */}
      <span
        style={{
          visibility: isHovered ? 'visible' : 'hidden',
          opacity: isHovered ? 1 : 0,
          backgroundColor: '#451a03',
          color: '#fef3c7',
          borderRadius: '20px',
          padding: '15px 20px',
          position: 'absolute',
          zIndex: 100,
          bottom: '150%',
          left: '50%',
          transform: isHovered
            ? 'translateX(-50%) scale(1)'
            : 'translateX(-50%) scale(0.9)',
          width: '260px',
          fontSize: '0.9rem',
          fontWeight: '400',
          lineHeight: '1.6',
          boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          pointerEvents: 'none',
          display: 'block'
        }}
      >
        <span style={{ fontWeight: 800, marginBottom: '6px', color: '#fbbf24', fontSize: '1rem', display: 'block' }}>
          💡 概念說明
        </span>

        {title}

        <span
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            marginLeft: '-8px',
            borderWidth: '8px',
            borderStyle: 'solid',
            borderColor: '#451a03 transparent transparent transparent'
          }}
        />
      </span>
    </span>
  );
};