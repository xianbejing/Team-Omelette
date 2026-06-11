import React from 'react';
import { styles, Term } from '../Styles';

const About = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading2}>二、 研究動機 (Research Motivation)</h2>
      
      {/* 1. 市場現況與痛點 */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={styles.heading3}> 市場極端競爭與資訊不對稱</h3>
        <p style={{ lineHeight: '1.8', textAlign: 'justify' }}>
          隨著外送平台與數位點餐系統快速發展，台灣餐飲市場呈現極端的
          <Term title="競爭極其激烈、產品高度同質化，導致利潤微薄的市場狀態">紅海化</Term>
          與<Term title="市場由無數個「極小且孤立」的獨立店家組成，彼此資訊不相通、缺乏主導，導致整體數據散落。">高度碎片化</Term>特徵。
          多數中小微型餐飲業者受限於資源，缺乏對整體市場的視角，
          其經營決策多依賴經驗或盲從競爭對手，商戶極易陷入
          <Term title="產品、服務與行銷手段高度相似，導致只能進行價格戰的現象">同質化競爭</Term>
          與高陣亡率的生存困境。
        </p>
      </div>

      {/* 2. 數據契機 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={styles.subCard}>
          <h4 style={{ color: '#b45309', marginTop: 0 }}> 數據資產</h4>
          <p style={{ fontSize: '0.95rem', margin: 0 }}>
            <b>肚肚 (Dudoo)</b> 累積了龐大的跨店交易數據
            包含即時訂單量、平均客單價 (Average Order Value,AOV) 及營收成長率。
            如何運用此類高維度的數據，將具備預測性與戰略價值的網絡拓撲，是推動平台數據資產化的核心關鍵。
          </p>
        </div>
        <div style={styles.subCard}>
          <h4 style={{ color: '#b45309', marginTop: 0 }}> 智慧診斷</h4>
          <p style={{ fontSize: '0.95rem', margin: 0 }}>
            目前市場缺乏一套能從整個市場解析餐飲
            <Term title="由餐廳節點與競爭連線構成的複雜網絡架構">生態系競爭拓撲</Term>
            的動態分析系統，這導致平台方無法評估商家的解約風險及為商家提供精準的營運診斷與轉型輔導。因此，
            我們開發一套融合複雜網絡理論與商務指標的系統，提升平台留客率，給出調整建議。
          </p>
        </div>
      </div>

      {/* 3. 解決方案 */}
      <div style={{ 
        backgroundColor: '#fef3c7', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        borderLeft: '5px solid #d97706' 
      }}>
        <h3 style={{ ...styles.heading3, marginTop: 0 }}> 轉型與策略價值</h3>
        <p style={{ margin: 0, lineHeight: '1.7' }}>
          本研究以肚肚平台數據為基礎，透過 
          <Term title="分析個體間關係與網絡結構的技術">社會網絡分析 (SNA)</Term> 
          與圖論方法，將分散的商家資料轉化為可視化的結構。
          透過偵測高風險商家與市場結構性失衡現象，提出具體的<b>商業轉型與定價策略</b>，
          以強化平台的長期商業價值、降低商戶流失率，並優化市場整體的營運效率。
        </p>
      </div>
    </div>
  );
};

export default About;