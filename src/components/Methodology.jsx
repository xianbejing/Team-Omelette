import React from 'react';
import { styles, Term } from '../Styles';

const Methodology = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading2}>三、 研究方法與理論模型</h2>

      {/* --- 實作路徑 --- */}
      <h3 style={styles.heading3}>技術實作路徑</h3>
      <div style={flowContainerStyle}>
        <FlowStep title="數據前處理與特徵工程" desc="數據清洗，建構商戶之 UniqueID 唯一編碼體系；進行特徵提取，量化核心營運指標。" />
        <FlowStep title="雙重門檻過濾" desc="導入品類一致性與消費者心理價格門檻之雙重過濾機制，刪除異常交易與雜訊，提升拓撲結構的信任度。" />
        <FlowStep title="鄰接矩陣構建" desc="依據競爭關係與空間距離，轉化為二元拓撲網絡，建構全台餐飲的鄰接矩陣。" />
        <FlowStep title="指標解耦計算" desc="將複雜網絡指標與商務財務指標進行計算，消除變數共線性。" />
      </div>

      <div style={styles.cardGrid}>
        <div style={styles.subCard}>
          <h4 style={subHeaderStyle}>數據來源與節點定義</h4>
          <p style={pStyle}>
            本研究以肚肚之合作店家交易數據為基礎，為精準識別餐飲中的個體行為，定義 <b>UniqueID = 流水號 + 品牌名稱</b> 作為矩陣索引，
            每個節點代表一家餐飲商家，其特徵包含平均客單價與營收成長率。
          </p>
        </div>
        <div style={styles.subCard}>
          <h4 style={subHeaderStyle}>雙重門檻過濾與連線定義</h4>
          <p style={pStyle}>
            Edge用以表示商家間的競爭關係，兩節點要競爭必須同時滿足「品類完全相同」與「相對價差在門檻內」。
            除了核心理論邊界 <Term title="相對價差比率 α ≤ 10% 視為實質競爭">α ≤ 10%</Term> (用以捕捉市場中最直接、最激烈的核心替代競爭)。
          </p>
        </div>
      </div>

      {/* --- 核心數學定義 (已美化排版) --- */}
      <div style={matrixBoxStyle}>
        <h4 style={{ color: '#fef3c7', marginTop: 0, borderBottom: '1px solid rgba(254,243,199,0.2)', paddingBottom: '10px' }}>
          鄰接矩陣與無向圖定義
        </h4>
        
        <div style={formulaWrapperStyle}>
          {/* 左側變數 */}
          <span style={{ marginRight: '12px' }}>A<sub>ij</sub> =</span>
          
          {/* 大括號 */}
          <span style={bracketStyle}>{'{'}</span>
          
          {/* 條件內容 */}
          <div style={{ textAlign: 'left', lineHeight: '2.8' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '15px', fontWeight: 'bold' }}>1,</span>
              <span style={formulaTextStyle}>
                if Category<sub>i</sub> = Category<sub>j</sub> and 
              </span>
              
              {/* 分數線 */}
              <div style={fractionStyle}>
                <span style={{ borderBottom: '1px solid #fffdf9', padding: '0 8px' }}>|AOV<sub>i</sub> - AOV<sub>j</sub>|</span>
                <span>AOV<sub>i</sub></span>
              </div>
              
              <span style={{ marginLeft: '8px' }}>≤ α</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '15px', fontWeight: 'bold' }}>0,</span>
              <span style={formulaTextStyle}>otherwise</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.95rem', color: '#eaddc5', lineHeight: '1.6', textAlign: 'center', margin: '0 auto', maxWidth: '800px' }}>
          將市場競爭轉化為二元鄰接矩陣。當兩家店的相對價差小於門檻時，它們具備互相替代的競爭關係，此結構消除了金額高低的干擾，凸顯市場的連接性。
        </p>
      </div>

      {/* --- 理論支持 --- */}
      <h3 style={styles.heading3}>理論支持：價格閾值與心理感知</h3>
      <div style={styles.cardGrid}>
        <div style={theoryCardStyle}>
          <strong style={theoryTitleStyle}>韋伯定律 (Weber's Law)</strong>
          <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
            消費者對於變化的感知並非取決於絕對數值，而是取決於改變量與強度的相對比例：
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '15px 0', fontFamily: 'serif' }}>
              <div style={fractionStyle}>
                <span style={{ borderBottom: '1px solid #433422', padding: '0 5px' }}>ΔI</span>
                <span>I</span>
              </div>
              <span style={{ marginLeft: '8px' }}>= K</span>
            </div>
            其中 I 為初始刺激強度（平均客單價) ， ΔI 為刺激變動量（價差），K 為韋伯常數
          </div>
        </div>
        
        <div style={theoryCardStyle}>
          <strong style={theoryTitleStyle}>康納曼展望理論 (Prospect Theory)</strong>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
            在消費者決策模型中，市場用價格或消費者心理價被視為價格參考點，
            在參考點附近的微小波動，在缺乏損失感或獲得感的心理干擾下，產生的損失感微弱，不足以扭轉消費偏好。
          </p>
        </div>
        
        <div style={theoryCardStyle}>
          <strong style={theoryTitleStyle}>心理帳戶 (Mental Accounting)</strong>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
            在進行消費決策時，傾向將預算分配至不同的虛擬帳戶中。10% 內兩者會被歸於同一個心理帳戶，形成預算替代關係。反之，將發生階層躍遷，不再具備直接替代性。
          </p>
        </div>
        
        <div style={theoryCardStyle}>
          <strong style={theoryTitleStyle}>隨機效用理論與隨機決策 (Random Utility)</strong>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
            消費者對商家的總體效用可拆解為確定性效用與非觀測的隨機項，當價格效用趨近於零，抉擇機率取決於當下排隊時間或平台推薦等隨機項的擾動。
          </p>
        </div>
      </div>

      {/* --- 結論區塊 --- */}
      <div style={conclusionBoxStyle}>
        <strong>從行政分類轉化為實質替代網絡</strong>
        <p style={{ margin: '0.8rem 0 0 0', fontSize: '1rem', lineHeight: '1.7' }}>
          透過同品類搭配 10% 價格閾值，成功將純幾何的模型轉化為符合消費者心理感知的拓撲架構，
          消除了原始數據的結構盲區，使網絡指標在解讀市場波動傳導時具備預測科學基礎。
        </p>
      </div>
    </div>
  );
};

// --- 組件與樣式設定 ---
const FlowStep = ({ title, desc }) => (
  <div style={{
    flex: 1, minWidth: '220px', textAlign: 'center', padding: '1.8rem',
    backgroundColor: '#faf6ec', borderRadius: '12px', border: '1px solid #eaddc5',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  }}>
    <div style={{ fontWeight: 'bold', margin: '0 0 0.6rem 0', color: '#433422', fontSize: '1.05rem' }}>{title}</div>
    <div style={{ fontSize: '0.85rem', color: '#78350f', lineHeight: '1.6' }}>{desc}</div>
  </div>
);

// 樣式變數
const flowContainerStyle = { display: 'flex', justifyContent: 'space-between', gap: '1.2rem', marginBottom: '3rem', flexWrap: 'wrap' };
const subHeaderStyle = { color: '#b45309', marginTop: 0, marginBottom: '0.8rem' };
const pStyle = { fontSize: '0.95rem', lineHeight: '1.7', margin: 0 };
const matrixBoxStyle = { marginTop: '1.5rem', backgroundColor: '#433422', color: '#fffdf9', padding: '2.5rem', borderRadius: '16px', marginBottom: '3rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' };
const theoryCardStyle = { backgroundColor: '#fffdf9', padding: '1.8rem', borderRadius: '12px', border: '1px solid #f1e7d4', borderTop: '5px solid #d97706', display: 'flex', flexDirection: 'column' };
const theoryTitleStyle = { display: 'block', color: '#b45309', marginBottom: '1rem', fontSize: '1.1rem', letterSpacing: '0.5px' };
const conclusionBoxStyle = { marginTop: '3rem', padding: '1.8rem', backgroundColor: '#fef3c7', borderRadius: '12px', borderLeft: '6px solid #d97706', color: '#78350f' };

// 公式專用樣式
const formulaWrapperStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2.5rem 0', fontFamily: 'serif', fontSize: '1.5rem', color: '#fffdf9' };
const bracketStyle = { fontSize: '4.5rem', fontWeight: '100', marginRight: '8px', marginTop: '-8px', userSelect: 'none' };
const formulaTextStyle = { fontSize: '0.95rem', color: '#eaddc5', fontStyle: 'italic', fontFamily: 'sans-serif' };
const fractionStyle = { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '0 12px', fontSize: '0.9rem' };

export default Methodology;