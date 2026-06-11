import React from 'react';
import { styles, Term, ActionButton } from '../Styles';

const Home = ({ scrollToSection }) => {
  return (
    <div style={styles.container}>
      
      {/* 章節裝飾背景編號 */}
      <span style={styles.sectionNumber}>01</span>

      {/* 核心英雄區塊 */}
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem', 
        background: 'linear-gradient(145deg, #fffcf0 0%, #fef3c7 100%)', 
        borderRadius: '35px', 
        marginBottom: '3rem',
        border: '1px solid rgba(251, 191, 36, 0.2)',
        boxShadow: '0 20px 40px rgba(180, 83, 9, 0.05)',
        position: 'relative',
        zIndex: 1
      }}>
        
        <h2 style={{ 
          fontSize: '2.4rem', 
          color: '#854d0e', 
          margin: '0 0 1.2rem 0', 
          letterSpacing: '0.5px',
          fontWeight: '900'
        }}>
          「用大數據複雜網絡，診斷紅海市場的生存關鍵因素」
        </h2>

        {/* ✅ 修正：p → div（避免 Term 裡的 div 錯誤） */}
        <div style={{ 
          color: '#92400e', 
          maxWidth: '850px', 
          margin: '0 auto 2.5rem auto', 
          lineHeight: '1.9',
          fontSize: '1.15rem',
          fontWeight: '500'
        }}>
          嵌入式動態模擬系統：全台餐飲生態系，網路架構分析
          <Term title="描述市場節點如何相互連接與分布的空間架構">宏觀網絡拓撲</Term>
          數據模型已載入。
          <br />
          <span style={{ backgroundColor: '#fefce8', padding: '2px 8px', borderRadius: '6px' }}>
            🖱️ 滑鼠移至下方數據即可調用即時節點關聯資料
          </span>
        </div>

        {/* 快速導航 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <ActionButton onClick={() => scrollToSection('microDashboard')}>
             進入數據診斷區
          </ActionButton>

          <button 
            onClick={() => scrollToSection('about')} 
            style={secondaryButtonStyle}
          >
             觀看專案技術報告
          </button>
        </div>
      </div>

      {/* 核心價值提煉 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
        <h3 style={{ ...styles.heading3, marginTop: 0 }}>核心價值提煉</h3>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #fde68a, transparent)' }} />
      </div>

      <div style={styles.cardGrid}>
        
        <div style={styles.subCard}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
          <strong style={{ color: '#854d0e', fontSize: '1.2rem', fontWeight: '800' }}>痛點診斷</strong>
          <p style={{ fontSize: '1rem', lineHeight: '1.7', margin: '0.8rem 0 0 0', color: '#57534e' }}>
            我們從全台灣市場 <Term title="指肚肚 POS 平台上目前收錄的 19 種餐飲分類">19 種餐飲業態</Term> 的交織網絡出發，觀察潛在的結構性風險。
          </p>
        </div>

        <div style={styles.subCard}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <strong style={{ color: '#854d0e', fontSize: '1.2rem', fontWeight: '800' }}>風險預警</strong>
          <p style={{ fontSize: '1rem', lineHeight: '1.7', margin: '0.8rem 0 0 0', color: '#57534e' }}>
            透過 <Term title="節點擁有的直接連線數，代表市場競爭熱度">Degree</Term> 網絡核心度與營收指標交叉驗證，精準識別市場風險。
          </p>
        </div>

        <div style={styles.subCard}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤝</div>
          <strong style={{ color: '#854d0e', fontSize: '1.2rem', fontWeight: '800' }}>平台策略</strong>
          <p style={{ fontSize: '1rem', lineHeight: '1.7', margin: '0.8rem 0 0 0', color: '#57534e' }}>
            為 <b>肚肚 (Dudoo POS)</b> 導入餐飲業大數據，優化商戶策略與定價模型。
          </p>
        </div>

      </div>

      {/* 數據摘要 */}
      <div style={styles.metricDepthCard}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
          
          <div style={summaryItemStyle}>
            <span>已收錄 <strong>19</strong> 種餐飲業態</span>
          </div>

          <div style={dividerStyle} />

          <div style={summaryItemStyle}>
            <span>上千家餐廳樣本</span>
          </div>

          <div style={dividerStyle} />

          <div style={summaryItemStyle}>
            <span>偵測達 <strong>16</strong> 層競爭跨度</span>
          </div>

        </div>
      </div>

    </div>
  );
};

// 次要按鈕
const secondaryButtonStyle = {
  padding: '0.8rem 1.8rem',
  backgroundColor: '#fdfcf0',
  color: '#854d0e',
  border: '2px solid #fde68a',
  borderRadius: '100px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
  fontFamily: 'inherit',
  boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
};

const summaryItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#451a03',
  fontSize: '1.05rem',
  fontWeight: '500'
};

const summaryIconStyle = {
  backgroundColor: '#fef3c7',
  padding: '8px',
  borderRadius: '12px',
  fontSize: '1.2rem'
};

const dividerStyle = {
  width: '1px',
  height: '30px',
  backgroundColor: '#fde68a'
};

export default Home;