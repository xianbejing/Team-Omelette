import React, { useEffect } from "react";

// 正確的寫法
import omeletteImg from "./omelette.png";

export default function CreditsRoll({ onClose }) {
  
  // 按下 ESC 鍵可以中途退出電影謝幕
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div style={movieStyles.overlay}>
      
      {/* ⚠️ 頂級注入網頁級 Animation */}
      <style>{`
        @keyframes creditsScrolling {
          0% { transform: translateY(100vh); }
          100% { transform: translateY(calc(-100% - 100vh)); } /* 利用動態計算，確保不論多長都能完全滑完 */
        }
        @keyframes cinemaFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* 右上角優雅的關閉按鈕 */}
      <button onClick={onClose} style={movieStyles.closeBtn}>
        ✕ CLOSE MOVIE MODE (ESC)
      </button>

      {/* 🎬 謝幕滾動本體 */}
      <div style={movieStyles.scrollContainer}>
        
        {/* 吉祥物大煎蛋引導開場 */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <img src={omeletteImg} alt="Mascot" style={movieStyles.giantEgg} />
          <h1 style={movieStyles.mainTitle}>TEAM OMELETTE</h1>
          <p style={movieStyles.subTitle}>PRODUCTION CREDITS</p>
        </div>

        {/* 📋 職群與名單 */}
        <div style={movieStyles.creditsGroup}>
          <div style={movieStyles.row}><span style={movieStyles.role}>指導教授 / Advisor</span><span style={movieStyles.name}>胡筱薇 教授</span></div>
          <div style={movieStyles.row}><span style={movieStyles.role}>出品單位 / Presenter</span><span style={movieStyles.name}>Team Omelette</span></div>
          <div style={movieStyles.row}><span style={movieStyles.role}>學術專門 / Major</span><span style={movieStyles.name}>中原大學 智慧運算與大數據學士班</span></div>
        </div>

        <div style={movieStyles.divider}></div>

        <div style={movieStyles.creditsGroup}>
          <div style={movieStyles.row}><span style={movieStyles.role}>專案架構師 / System Architect</span><span style={movieStyles.name}>方立、陳薇帆</span></div>
          <div style={movieStyles.row}><span style={movieStyles.role}>資料工程師 / Data Engineer</span><span style={movieStyles.name}>施震禾、呂慧思、王識堯</span></div>   
          <div style={movieStyles.row}><span style={movieStyles.role}>演算法研發 / Algorithm R&D</span><span style={movieStyles.name}>王識堯、施震禾、陳薇帆</span></div>
          <div style={movieStyles.row}><span style={movieStyles.role}>前端工藝師 / UIUX Frontend</span><span style={movieStyles.name}>方立、呂慧思</span></div>
        </div>

        <div style={movieStyles.divider}></div>

        <div style={movieStyles.creditsGroup}>
          <div style={movieStyles.row}><span style={movieStyles.role}>大數據平台提供 / Data Source</span><span style={movieStyles.name}>肚肚智慧餐飲平台</span></div>
          <div style={movieStyles.row}><span style={movieStyles.role}>技術支援 / Core Stack</span><span style={movieStyles.name}>胡筱薇 教授</span></div>
          <div style={movieStyles.row}><span style={movieStyles.role}>動畫美學 / Motion Design</span><span style={movieStyles.name}>方立</span></div>
        </div>

        {/* ======================================================== */}
        {/* 📚 學術文獻區塊 */}
        {/* ======================================================== */}
        <div style={movieStyles.divider}></div>
        
        <div style={{ textAlign: 'center', margin: '40px 0 20px 0' }}>
          <h3 style={{ color: '#f59e0b', fontSize: '1.2rem', letterSpacing: '4px', fontWeight: '700' }}>
            參考文獻 / REFERENCES
          </h3>
        </div>

        <div style={movieStyles.referenceBlock}>
          <div style={movieStyles.refItem}>
            <span style={movieStyles.refIndex}>[1]</span>
            <p style={movieStyles.refText}>
              Monroe, K. B. (1973). Buyers' subjective perceptions of price. 
              <span style={movieStyles.refJournal}> Journal of Marketing Research</span>, 10(1), 70–80.
            </p>
          </div>

          <div style={movieStyles.refItem}>
            <span style={movieStyles.refIndex}>[2]</span>
            <p style={movieStyles.refText}>
              Kahneman, D., & Tversky, A. (1979). Prospect theory: An analysis of decision under risk. 
              <span style={movieStyles.refJournal}> Econometrica</span>, 47(2), 263–291.
            </p>
          </div>

          <div style={movieStyles.refItem}>
            <span style={movieStyles.refIndex}>[3]</span>
            <p style={movieStyles.refText}>
              Thaler, R. H. (1999). Mental accounting matters. 
              <span style={movieStyles.refJournal}> Journal of Behavioral Decision Making</span>, 12(3), 183–206.
            </p>
          </div>

          <div style={movieStyles.refItem}>
            <span style={movieStyles.refIndex}>[4]</span>
            <p style={movieStyles.refText}>
              Train, K. E. (2009). <span style={movieStyles.refJournal}>Discrete choice methods with simulation</span> (2nd ed.). Cambridge University Press.
            </p>
          </div>

          {/* ⚛️ ✨ 新增：React 19 官方官方官方文獻 */}
          <div style={movieStyles.refItem}>
            <span style={movieStyles.refIndex}>[5]</span>
            <p style={movieStyles.refText}>
              Meta Platforms. (2026). <span style={movieStyles.refJournal}>React</span> (Version 19.0.0) [Computer software]. React.dev.
            </p>
          </div>
        </div>

        {/* 結尾感謝致敬 */}
        <div style={{ textAlign: 'center', marginTop: '15px', paddingBottom: '150px' }}>
          <div style={movieStyles.divider}></div>
          <h2 style={{ color: '#f59e0b', fontSize: '1.8rem', letterSpacing: '4px', fontWeight: '800', marginTop: '80px' }}>THANK YOU FOR WATCHING</h2>
          <p style={{ color: '#64748b', marginTop: '15px', fontSize: '0.9rem', letterSpacing: '2px' }}>© 2026 CYCU Team Omelette. ALL RIGHTS RESERVED.</p>
        </div>

      </div>
    </div>
  );
}

// 🎬 電影院美學專屬樣式
const movieStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#000000',
    zIndex: 99999,
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    animation: 'cinemaFadeIn 1.5s ease forwards'
  },
  closeBtn: {
    position: 'absolute',
    top: '30px',
    right: '30px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#94a3b8',
    padding: '10px 24px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    letterSpacing: '1px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    zIndex: 100000
  },
  scrollContainer: {
    width: '100%',
    maxWidth: '750px',
    display: 'flex',
    flexDirection: 'column',
    animation: 'creditsScrolling 50s linear forwards', // 💡 拉長到 50 秒，完美消化 5 篇文獻的長度
  },
  giantEgg: {
    width: '120px',
    height: 'auto',
    objectFit: 'contain',
    filter: 'drop-shadow(0 0 30px rgba(245, 158, 11, 0.3))',
    marginBottom: '20px'
  },
  mainTitle: {
    color: '#ffffff',
    fontSize: '3rem',
    letterSpacing: '12px',
    fontWeight: '900',
    margin: 0
  },
  subTitle: {
    color: '#f59e0b',
    fontSize: '1rem',
    letterSpacing: '6px',
    fontWeight: '700',
    marginTop: '10px'
  },
  creditsGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    margin: '30px 0'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    fontSize: '1.15rem',
    letterSpacing: '1px'
  },
  role: {
    color: '#64748b',
    textAlign: 'right',
    width: '45%',
    paddingRight: '30px',
    fontWeight: '500'
  },
  name: {
    color: '#e2e8f0',
    textAlign: 'left',
    width: '55%',
    paddingLeft: '30px',
    fontWeight: '600'
  },
  divider: {
    width: '80px',
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
    margin: '40px auto'
  },
  referenceBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '0 40px',
    textAlign: 'left'
  },
  refItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#94a3b8'
  },
  refIndex: {
    color: '#f59e0b',
    fontWeight: '700',
    fontFamily: 'monospace'
  },
  refText: {
    margin: 0,
    flex: 1
  },
  refJournal: {
    color: '#e2e8f0',
    fontStyle: 'italic'
  }
};