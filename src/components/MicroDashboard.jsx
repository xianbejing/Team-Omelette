import React, { useState, useMemo, useRef, useEffect } from 'react';
import { styles, MicroTabButton } from '../Styles';
import GephiSigmaNetwork from "./GephiSigmaNetwork";

/** * 1. 使用 Vite 的 glob 功能自動掃描資料夾
 */
const dataModules = import.meta.glob('../data/*.json', { eager: true });

// 定義場景清單
const STORE_MAP = {

  "breakfast": {
    label: "早餐店",
    path: "../data/肚肚早餐.json"
  },

  "hotpot": {
    label: "火鍋店",
    path: "../data/肚肚火鍋.json"
  },

  "mealbox": {
    label: "餐盒便當店",
    path: "../data/肚肚餐盒店.json"
  },

  "bistro": {
    label: "餐酒館",
    path: "../data/肚肚餐酒館.json"
  },

  "dessert": {
    label: "冰甜品店",
    path: "../data/肚肚冰甜品.json"
  },

  "drink": {
    label: "飲料店",
    path: "../data/肚肚飲料.json"
  },

  "coffee": {
    label: "咖啡廳",
    path: "../data/肚肚咖啡.json"
  },

  "snack": {
    label: "小吃店",
    path: "../data/肚肚小吃店.json"
  },

  "chinese": {
    label: "中式餐廳",
    path: "../data/肚肚中式.json"
  },

  "japanese": {
    label: "日式料理店",
    path: "../data/肚肚日式.json"
  },

  "fastfood": {
    label: "速食店",
    path: "../data/肚肚速食.json"
  },

  "traditional_snack": {
    label: "傳統庶民小吃",
    path: "../data/肚肚傳統庶民小吃.json"
  },

  "izakaya": {
    label: "居酒屋",
    path: "../data/肚肚居酒屋.json"
  },

  "italian": {
    label: "義式料理店",
    path: "../data/肚肚義式.json"
  },

  "bbq": {
    label: "燒烤餐廳",
    path: "../data/肚肚燒烤.json"
  },

  "baking": {
    label: "烘焙麵包店",
    path: "../data/肚肚烘焙.json"
  },

  "composite": {
    label: "複合式餐飲",
    path: "../data/肚肚複合式.json"
  },

  "bar": {
    label: "酒吧",
    path: "../data/肚肚酒吧.json"
  },

  "western": {
    label: "西式餐廳",
    path: "../data/肚肚西式.json"
  }
};
const MicroDashboard = ({ 
  selectedKey,          // 🔥 來自 App.jsx
  setSelectedKey,       // 🔥 來自 App.jsx
  selectedCategory,     // 🔥 來自 App.jsx
  setSelectedCategory,  // 🔥 來自 App.jsx
  setSelectedMerchant, 
  scrollToDiagnostic 
}) => {
  // --- 內部 UI 狀態 ---
  const [microTab, setMicroTab] = useState('tab1');
  const [highlightedId, setHighlightedId] = useState(null); 

  // --- Refs ---
  const listContainerRef = useRef(null);
  const rowRefs = useRef({});

  // --- 2. 取得當前「全量數據」 ---
  const currentNetworkData = useMemo(() => {
    const config = STORE_MAP[selectedKey];
    if (!config) return { nodes: [], edges: [] };
    const raw = dataModules[config.path]?.default || dataModules[config.path];
    return raw || { nodes: [], edges: [] };
  }, [selectedKey]);

  // --- 3. 數據計算與過濾邏輯 ---
  const { filteredMerchants, stats, categoryList } = useMemo(() => {
    if (!currentNetworkData?.nodes || currentNetworkData.nodes.length === 0) {
        return { filteredMerchants: [], stats: { count: 0, avgDeg: "0.0", avgEcc: "0.00" }, categoryList: [] };
    }

    // 取得該 JSON 內所有的類別
    const allCats = [...new Set(currentNetworkData.nodes.map(n => 
      n.attributes.category || n.attributes.restaurant_type || "未定義"
    ))];

    // 🔥 自動修正：如果當前 selectedCategory 不在 allCats 裡，自動選第一個
    let activeCat = selectedCategory;
    if (!allCats.includes(selectedCategory)) {
        activeCat = allCats[0];
        // 這裡不直接 setState 以免觸發重新渲染警告，讓 useEffect 處理
    }

    const nodesInCat = currentNetworkData.nodes.filter(n => 
      (n.attributes.category || n.attributes.restaurant_type || "未定義") === activeCat
    );

    if (nodesInCat.length === 0) {
      return { filteredMerchants: [], stats: { count: 0, avgDeg: "0.0", avgEcc: "0.00" }, categoryList: allCats };
    }

    const avgDeg = nodesInCat.reduce((sum, n) => sum + (n.attributes.degree || 0), 0) / nodesInCat.length;
    const avgEcc = nodesInCat.reduce((sum, n) => sum + (n.attributes.Eccentricity || 0), 0) / nodesInCat.length;

    const merchants = nodesInCat.map(n => {
      const attr = n.attributes;
      let status = "";
      let color = "#6b7280"; 
      if (attr.degree >= avgDeg && attr.Eccentricity >= avgEcc) { status = "🟢 核心領先"; color = "#059669"; }
      else if (attr.degree < avgDeg && attr.Eccentricity >= avgEcc) { status = "🔵 結構利基"; color = "#3b82f6"; }
      else if (attr.degree >= avgDeg && attr.Eccentricity < avgEcc) { status = "🔴 高壓競爭"; color = "#dc2626"; }
      else { status = "⚪ 邊緣溫和"; color = "#9ca3af"; }

      return { id: n.key, label: attr.label, status, color, degree: attr.degree, ecc: attr.Eccentricity };
    });

    return { 
      filteredMerchants: merchants, 
      categoryList: allCats,
      stats: { count: nodesInCat.length, avgDeg: avgDeg.toFixed(1), avgEcc: avgEcc.toFixed(2) }
    };
  }, [selectedKey, selectedCategory, currentNetworkData]);

  // 🔥 當場景切換導致類別不匹配時，修正父組件的類別狀態
  useEffect(() => {
    if (categoryList.length > 0 && !categoryList.includes(selectedCategory)) {
        setSelectedCategory(categoryList[0]);
    }
  }, [categoryList, selectedCategory, setSelectedCategory]);

  // --- 4. 點擊處理 ---
  const handleGraphNodeClick = (nodeId) => {
    setHighlightedId(nodeId);
    const targetRow = rowRefs.current[nodeId];
    if (targetRow && listContainerRef.current) {
      targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading2}>五. 業態微觀探索與診斷模型</h2>
      
      <div style={filterBarStyle}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <label style={labelStyle}> 選擇餐飲類別 </label>
            <select 
              value={selectedKey} 
              onChange={(e) => {
                setSelectedKey(e.target.value); // 觸發父組件同步
                setHighlightedId(null);
              }} 
              style={selectStyle}
            >
              {Object.keys(STORE_MAP).map(k => (
                <option key={k} value={k}>{STORE_MAP[k].label}</option>
              ))}
            </select>
          </div>
          <div>
            
          </div>
        </div>
        <div style={{ borderLeft: '2px solid #d5c3a6', paddingLeft: '20px', marginLeft: '20px' }}>
            <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem' }}>當前樣本：<b>{stats.count}</b> 家</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#b45309' }}>平均競爭度：{stats.avgDeg}</p>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '2px solid #eaddc5', marginBottom: '20px' }}>
        <MicroTabButton active={microTab === 'tab1'} onClick={() => setMicroTab('tab1')}>市場指標</MicroTabButton>
        <MicroTabButton active={microTab === 'tab2'} onClick={() => setMicroTab('tab2')}>市場網路定位</MicroTabButton>
        <MicroTabButton active={microTab === 'tab3'} onClick={() => setMicroTab('tab3')}>SNA 拓撲圖</MicroTabButton>
      </div>

      {microTab === 'tab1' && (
        <div style={styles.cardGrid}>
          <MetricCard title="競爭密度" value={stats.avgDeg} unit="Deg" desc="該業態平均連結數" />
          <MetricCard title="市場跨度" value={stats.avgEcc} unit="Ecc" desc="平均離心率(越遠越獨特)" />
          <MetricCard title="樣本規模" value={stats.count} unit="家" desc="當前業態總量" />
        </div>
      )}

      {microTab === 'tab2' && (
        <div style={quadrantGrid}>
          <QuadrantBox 
           color="#3b82f6" 
           title="結構利基區" 
           count={filteredMerchants.filter(m => m.status.includes('利基')).length} 
           desc="具備獨特的市場定位與孤立優勢，競爭壓力較低，適合深化品牌特色與護城河。"
          />
          <QuadrantBox 
           color="#059669" 
           title="核心領先區" 
           count={filteredMerchants.filter(m => m.status.includes('領先')).length} 
           desc="市場中的指標性品牌，擁有高聯結度與市佔率，為該業態的風向球與核心驅動力。"
          />
          <QuadrantBox 
           color="#dc2626" 
           title="高壓競爭區" 
           count={filteredMerchants.filter(m => m.status.includes('競爭')).length} 
           desc="群聚效應極高且同質性強，商家面臨激烈的客源爭奪，需積極尋求差異化突圍。"
         />
         <QuadrantBox 
          color="#9ca3af" 
           title="邊緣溫和區" 
           count={filteredMerchants.filter(m => m.status.includes('溫和')).length} 
           desc="遠離核心戰場，互動與競爭密度較低，經營型態較為自主、步調相對溫和。"
         />
      </div>
      )}

      {microTab === 'tab3' && (
        <div style={{ display: 'flex', gap: '20px', height: '600px' }}>
          <div style={{ flex: 1.5, border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff' }}>
            <GephiSigmaNetwork 
              data={currentNetworkData} 
              onNodeClick={handleGraphNodeClick} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#b45309' }}>商家清單 (點擊圖表自動捲動)</h4>
            <div 
              ref={listContainerRef} 
              style={{ ...styles.scrollBox, height: '540px', overflowY: 'auto', position: 'relative', border: '1px solid #eaddc5' }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                 <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fdf8ec', zIndex: 1 }}>
                  <tr>
                    <th style={thStyle}>商家名稱</th>
                    <th style={thStyle}>狀態</th>
                    <th style={thStyle}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMerchants.map(m => (
                    <tr 
                      key={m.id} 
                      ref={el => rowRefs.current[m.id] = el} 
                      style={{ 
                        borderBottom: '1px solid #eee',
                        backgroundColor: highlightedId === m.id ? '#fffbeb' : 'transparent',
                        transition: 'background-color 0.3s'
                      }}
                    >
                      <td style={{ padding: '12px 8px', fontSize: '0.85rem' }}>{m.label}</td>
                      <td style={{ color: m.color, fontSize: '0.75rem', fontWeight: 'bold' }}>{m.status}</td>
                      <td>
                        <button 
                          onClick={() => { setSelectedMerchant(m.id); scrollToDiagnostic(); }}
                          style={miniButtonStyle}
                        >診斷</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 子組件與樣式保持不變
const MetricCard = ({ title, value, unit, desc }) => (
  <div style={styles.subCard}>
    <div style={{ color: '#b45309', fontWeight: 'bold', fontSize: '0.8rem' }}>{title}</div>
    <div style={{ fontSize: '1.5rem', margin: '5px 0' }}>{value} <small style={{ fontSize: '0.8rem' }}>{unit}</small></div>
    <div style={{ fontSize: '0.7rem', color: '#92400e' }}>{desc}</div>
  </div>
);

const QuadrantBox = ({ color, title, count, desc }) => {
  return (
    <div style={{
      border: `2px solid ${color}`,
      borderRadius: '24px', // 對齊圖片中的圓角樣式
      padding: '24px',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '140px' // 給予足夠高度容納說明文字
    }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0', color: color, fontSize: '1.1rem', fontWeight: 'bold' }}>
          {title}
        </h4>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          {count} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#6b7280' }}>商家</span>
        </div>
      </div>
      {/* 子說明文字區塊 */}
      <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280', lineHeight: '1.4' }}>
        {desc}
      </p>
    </div>
  );
};

const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#92400e', marginBottom: '5px' };
const filterBarStyle = { display: 'flex', alignItems: 'center', backgroundColor: '#fef3c7', padding: '15px', borderRadius: '12px', marginBottom: '20px' };
const selectStyle = { padding: '8px', borderRadius: '6px', border: '1px solid #b45309', minWidth: '160px', fontWeight: 'bold' };
const quadrantGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' };
const miniButtonStyle = { padding: '4px 10px', background: '#b45309', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' };
const thStyle = { textAlign: 'left', padding: '10px 8px', fontSize: '0.7rem', color: '#92400e', borderBottom: '2px solid #eaddc5' };

export default MicroDashboard;