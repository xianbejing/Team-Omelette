import React, { useState, useEffect, useRef } from 'react';
import { styles, NavButton, ScrollProgress } from './Styles'; // 引入進度條
import Home from './components/Home'; 
import About from './components/About';
import Methodology from './components/Methodology';
import MetaNetwork from './components/MetaNetwork';
import MicroDashboard from './components/MicroDashboard';
import DiagnosticPanel from './components/DiagnosticPanel';
import TeamOutlook from './components/TeamOutlook'; 

function App() {

  // --- 全域狀態管理 ---
  const [activeSection, setActiveSection] = useState('home');
  
  // 1. 管理被選中的商家 ID
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  
  // 2. 🔥 關鍵：管理當前選中的場景 (JSON 檔案鍵值)
  // 將此狀態提升到父組件，確保 MicroDashboard 與 DiagnosticPanel 同步
  const [selectedKey, setSelectedKey] = useState('breakfast'); 

  // 3. 🔥 管理當前選中的業態類別 (Category)
  const [selectedCategory, setSelectedCategory] = useState('');

  // --- 平滑滾動函式 ---
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- 自動偵測捲動位置 ---
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'methodology', 'metaNetwork', 'microDashboard', 'diagnosticPanel', 'team'];
      const scrollPosition = window.scrollY + 150; 

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={styles.wrapper}>
      {/* 頂部動態滾動進度條 */}
      <ScrollProgress />

      {/* 頁首標題區 */}
      <header id="home" style={styles.header}>
        <h1 style={{ 
          fontSize: '2.4rem', 
          marginBottom: '0.8rem', 
          color: '#451a03', 
          fontWeight: '800',
          letterSpacing: '-0.5px'
        }}>
          基於社會網絡分析 (SNA) 之餐飲生態系數據診斷與智慧定價轉型系統
        </h1>
        <p style={{ color: '#a16207', fontSize: '1.1rem', fontWeight: '500' }}>
          以肚肚 POS 平台大數據為例 — Designed by <strong>Team Omelette</strong>
        </p>
      </header>

      {/* 固定式導覽列 */}
      <nav style={styles.navBar}>
        <NavButton active={activeSection === 'home'} onClick={() => scrollToSection('home')}>1. 首頁</NavButton>
        <NavButton active={activeSection === 'about'} onClick={() => scrollToSection('about')}>2. 背景</NavButton>
        <NavButton active={activeSection === 'methodology'} onClick={() => scrollToSection('methodology')}>3. 技術</NavButton>
        <NavButton active={activeSection === 'metaNetwork'} onClick={() => scrollToSection('metaNetwork')}>4. 巨觀</NavButton>
        <NavButton active={activeSection === 'microDashboard'} onClick={() => scrollToSection('microDashboard')}>5. 微觀</NavButton>
        <NavButton active={activeSection === 'diagnosticPanel'} onClick={() => scrollToSection('diagnosticPanel')}>6. 診斷</NavButton>
        <NavButton active={activeSection === 'team'} onClick={() => scrollToSection('team')}>7. 未來展望</NavButton>
      </nav>

      {/* 一頁式內容主體 */}
      <main style={{ marginTop: '3rem' }}>
        
        <section id="home">
          <Home scrollToSection={scrollToSection} />
        </section>
        
        <hr style={dividerStyle} />

        <section id="about" style={{ scrollMarginTop: '120px' }}>
          <About />
        </section>

        <hr style={dividerStyle} />

        <section id="methodology" style={{ scrollMarginTop: '120px' }}>
          <Methodology />
        </section>

        <hr style={dividerStyle} />

        <section id="metaNetwork" style={{ scrollMarginTop: '120px' }}>
          <MetaNetwork />
        </section>

        <hr style={dividerStyle} />

        <section id="microDashboard" style={{ scrollMarginTop: '120px' }}>
          {/* 傳入同步狀態：selectedKey 與 selectedCategory */}
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

        <section id="diagnosticPanel" style={{ scrollMarginTop: '120px' }}>
          {/* 🔥 關鍵：DiagnosticPanel 現在接收 selectedKey，
              這樣它才能在正確的 JSON 檔案中找到對應的商家數據 */}
          <DiagnosticPanel 
            selectedKey={selectedKey}
            selectedMerchant={selectedMerchant} 
            setSelectedMerchant={setSelectedMerchant} 
          />
        </section>

        <hr style={dividerStyle} />

        <section id="team" style={{ scrollMarginTop: '120px' }}>
          <TeamOutlook />
        </section>

      </main>

      {/* 頁尾 */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '5rem 0', 
        color: '#854d0e', 
        fontSize: '0.95rem',
        fontWeight: '600',
        letterSpacing: '0.05em'
      }}>
        © 2026 CYCU Big Data and Intelligent Computing - Team Omelette
      </footer>
    </div>
  );
}

// 圓潤莫蘭迪風格的分隔線
const dividerStyle = {
  border: 'none',
  borderTop: '3px dashed #fde68a',
  margin: '6rem 0',
  width: '60%',
  marginLeft: '20%',
  opacity: 0.5
};

export default App;