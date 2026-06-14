import React, { useState, useEffect } from 'react';
import { styles, NavButton, ScrollProgress } from './Styles';

import Home from './components/Home';
import About from './components/About';
import Methodology from './components/Methodology';
import MetaNetwork from './components/MetaNetwork';
import MicroDashboard from './components/MicroDashboard';
import DiagnosticPanel from './components/DiagnosticPanel';
import TeamOutlook from './components/TeamOutlook';

import OpeningOmelette from './components/OpeningOmelette';
import CreditsRoll from './components/CreditsRoll'; // 🎬 引入電影謝幕彩蛋元件
// 🍳 引入煎蛋圖片
import omeletteImg from './components/omelette.png'; 

function App() {

  // =========================
  // 🎬 開場與淡入控制
  // =========================
  const [entered, setEntered] = useState(false);
  const [fadeIn, setFadeIn] = useState(false); 
  const [showCredits, setShowCredits] = useState(false); // 🎬 控制電影謝幕彩蛋顯示

  // =========================
  // 📊 全域狀態
  // =========================
  const [activeSection, setActiveSection] = useState('home');

  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [selectedKey, setSelectedKey] = useState('breakfast');
  const [selectedCategory, setSelectedCategory] = useState('');

  // =========================
  // 🎬 ENTER EFFECT（修正動畫銜接）
  // =========================
  useEffect(() => {
    if (entered) {
      document.body.style.background = "#fff7ed";
      document.body.style.transition = "all 0.8s ease";
      
      // 確保主系統組件掛載後，延遲觸發主系統的淡入
      const t = setTimeout(() => {
        setFadeIn(true);
      }, 50); 
      
      return () => clearTimeout(t);
    }
  }, [entered]);

  // =========================
  // 📍 平滑滾動
  // =========================
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // =========================
  // 👁 Scroll Spy（只在進入後啟動）
  // =========================
  useEffect(() => {
    if (!entered) return;

    const handleScroll = () => {
      const sections = [
        'home',
        'about',
        'methodology',
        'metaNetwork',
        'microDashboard',
        'diagnosticPanel',
        'team'
      ];

      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const el = document.getElementById(section);

        if (
          el &&
          el.offsetTop <= scrollPosition &&
          el.offsetTop + el.offsetHeight > scrollPosition
        ) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [entered]);

  // =========================
  // 🧠 雙圖層無縫轉場架構
  // =========================
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      
      {/* ✨ 注入關鍵 CSS 動畫：控制導覽列煎蛋的微幅呼吸感 */}
      <style>{`
        @keyframes navEggFloating {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
      
      {/* 🥚 開場圖層（傳入 entered 狀態，讓開場煎蛋在抵達終點時完美把棒子交給 Navbar） */}
      <OpeningOmelette onEnter={() => setEntered(true)} entered={entered} />

      {/* 🎬 電影謝幕全螢幕彩蛋（當開啟時壓在最上層，蓋住主系統） */}
      {showCredits && <CreditsRoll onClose={() => setShowCredits(false)} />}

      {/* 📊 主系統 UI */}
      {entered && (
        <div
          style={{
            ...styles.wrapper,
            opacity: fadeIn ? 1 : 0,        
            transform: fadeIn ? 'scale(1)' : 'scale(0.98)', 
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            zIndex: 1 
          }}
        >

          {/* 📈 Scroll Progress */}
          <ScrollProgress />

          {/* 🧠 Header */}
          <header id="home" style={styles.header}>
            <h1 style={{
              fontSize: '2.4rem',
              marginBottom: '0.8rem',
              color: '#451a03',
              fontWeight: '800',
              letterSpacing: '-0.5px'
            }}>
              基於社群網路分析 (SNA) 之餐飲生態系數據診斷與智慧定價轉型系統
            </h1>

            <p style={{
              color: '#a16207',
              fontSize: '1.1rem',
              fontWeight: '500'
            }}>
              以肚肚平台大數據為基礎 — Designed by <strong>Team Omelette</strong>
            </p>
          </header>

          {/* 🧭 Nav */}
          <nav style={{ 
            ...styles.navBar, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: styles.navBar?.justifyContent || 'center'
          }}>
            
            {/* 🥚 導覽列常駐待命煎蛋（放大尺寸 + 判定電影謝幕觸發） */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '16px', // 從 12px 放大到 16px，預留呼吸空間
              animation: 'navEggFloating 4s ease-in-out infinite',
              cursor: 'pointer'
            }} onClick={() => {
              // 🔑 核心彩蛋邏輯：如果目前滑到最後一章（team），點擊立刻跳入電影謝幕，否則正常滾回首頁
              if (activeSection === 'team') {
                setShowCredits(true);
              } else {
                scrollToSection('home');
              }
            }}>
              <img 
                src={omeletteImg} 
                alt="Nav Omelette Logo" 
                style={{
                  width: '80px', 
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 6px 12px rgba(15, 23, 42, 0.12))' // 同步增強立體漂浮陰影
                }}
              />
            </div>

            <NavButton active={activeSection === 'home'} onClick={() => scrollToSection('home')}>1. 首頁</NavButton>
            <NavButton active={activeSection === 'about'} onClick={() => scrollToSection('about')}>2. 背景</NavButton>
            <NavButton active={activeSection === 'methodology'} onClick={() => scrollToSection('methodology')}>3. 技術</NavButton>
            <NavButton active={activeSection === 'metaNetwork'} onClick={() => scrollToSection('metaNetwork')}>4. 巨觀</NavButton>
            <NavButton active={activeSection === 'microDashboard'} onClick={() => scrollToSection('microDashboard')}>5. 微觀</NavButton>
            <NavButton active={activeSection === 'diagnosticPanel'} onClick={() => scrollToSection('diagnosticPanel')}>6. 診斷</NavButton>
            <NavButton active={activeSection === 'team'} onClick={() => scrollToSection('team')}>7. 未來展望</NavButton>
          </nav>

          {/* 📄 Content */}
          <main style={{ marginTop: '3rem' }}>

            <section id="home">
              <Home scrollToSection={scrollToSection} />
            </section>

            <hr style={dividerStyle} />

            <section id="about"><About /></section>

            <hr style={dividerStyle} />

            <section id="methodology"><Methodology /></section>

            <hr style={dividerStyle} />

            <section id="metaNetwork"><MetaNetwork /></section>

            <hr style={dividerStyle} />

            <section id="microDashboard">
              <MicroDashboard
                selectedKey={selectedKey}
                setSelectedKey={setSelectedKey}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setSelectedMerchant={setSelectedMerchant}
                scrollToDiagnostic={() => scrollToSection('diagnosticPanel')}
              />
            </section>

            <hr style={dividerStyle} />

            <section id="diagnosticPanel">
              <DiagnosticPanel
                selectedKey={selectedKey}
                selectedMerchant={selectedMerchant}
                setSelectedMerchant={setSelectedMerchant}
              />
            </section>

            <hr style={dividerStyle} />

            <section id="team"><TeamOutlook /></section>

          </main>

          {/* 🦶 Footer */}
          <footer style={{
            textAlign: 'center',
            padding: '5rem 0',
            color: '#854d0e',
            fontSize: '0.95rem',
            fontWeight: '600',
            letterSpacing: '0.05em'
          }}>
            © 2026 中原大學 智慧運算與大數據學士班 - Team Omelette
          </footer>

        </div>
      )}
      
    </div>
  );
}

const dividerStyle = {
  border: 'none',
  borderTop: '3px dashed #fde68a',
  margin: '6rem 0',
  width: '60%',
  marginLeft: '20%',
  opacity: 0.5
};

export default App;