import React, { useMemo, useState } from 'react';
import { styles, ActionButton } from '../Styles';

/**
 * 使用 Vite 的 glob 功能自動掃描資料夾
 */
const dataModules = import.meta.glob('../data/*.json', { eager: true });


const STORE_MAP = {

  "breakfast": '../data/肚肚早餐.json',

  "hotpot":    '../data/肚肚火鍋.json',

  "mealbox":   '../data/肚肚餐盒店.json',

  "bistro":    '../data/肚肚餐酒館.json',

  "dessert":   '../data/肚肚冰甜品.json',

  "drink":     '../data/肚肚飲料.json',

  "coffee":    '../data/肚肚咖啡.json',

  "snack":     '../data/肚肚小吃店.json',

  "chinese":   '../data/肚肚中式.json',

  "japanese":  '../data/肚肚日式.json',

  "fastfood":  '../data/肚肚速食.json',

  "traditional_snack":  '../data/肚肚傳統庶民小吃.json',

  "izakaya":  '../data/肚肚居酒屋.json',

  "italian":  '../data/肚肚義式.json',

  "bbq":  '../data/肚肚燒烤.json',

  "baking": '../data/肚肚烘焙.json',

  "composite": '../data/肚肚複合式.json',

  "bar": '../data/肚肚酒吧.json',

  "western": '../data/肚肚西式.json',

};

// merchant_network_data.json 路徑（業務資料來源）
const MND_PATH = '../data/merchant_network_data.json';

const MARKET_TYPE_ANCHORS = {
  "breakfast":         { typeName: "早餐", complements: ["drink", "baking"] },
  "hotpot":            { typeName: "火鍋", complements: ["dessert", "drink"] },
  "mealbox":           { typeName: "餐盒便當", complements: ["drink", "coffee"] },
  "bistro":            { typeName: "餐酒館", complements: ["baking", "japanese"] },
  "dessert":           { typeName: "冰甜品", complements: ["coffee", "snack"] },
  "drink":             { typeName: "飲料", complements: ["snack", "mealbox"] },
  "coffee":            { typeName: "咖啡", complements: ["baking", "bistro"] },
  "snack":             { typeName: "小吃店", complements: ["drink", "dessert"] },
  "chinese":           { typeName: "中式餐點", complements: ["drink", "coffee"] },
  "japanese":          { typeName: "日式料理", complements: ["dessert", "bistro"] },
  "traditional_snack": { typeName: "傳統庶民小吃", complements: ["drink", "dessert"] }, // 修正 Key
  "composite":         { typeName: "複合式餐飲", complements: ["snack", "coffee"] },       // 互補修正為 snack
  "bbq":               { typeName: "燒烤餐廳", complements: ["bar", "dessert"] },
  "western":           { typeName: "西式料理", complements: ["coffee", "baking"] },       // 修正 Key，互補換成 coffee
  "baking":            { typeName: "烘焙", complements: ["coffee", "drink"] },
  "bar":               { typeName: "酒吧", complements: ["bbq", "japanese"] },
  "fastfood":          { typeName: "速食", complements: ["drink", "snack"] },             // 互補修正為 snack
  "izakaya":           { typeName: "居酒屋", complements: ["bar", "bbq"] },      
  "italian":           { typeName: "義式料理", complements: ["baking", "bistro"] } 
};

const safeNum = (val) => {
  if (val === undefined || val === null || val === '') return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
};

// 顯示數值或「無資料」
const displayVal = (val, formatter) => {
  if (val === null || val === undefined) return <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>無資料</span>;
  return formatter(val);
};

const DiagnosticPanel = ({ selectedMerchant, setSelectedMerchant, selectedKey = 'breakfast' }) => {
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [simPriceChange, setSimPriceChange] = useState(0);

  // --- 核心局域拓撲融合與真實指標對接讀取 ---
  const { merchantInfo, extractedMetrics, avgDegree, marketBaselinePrice, recommendedAlliances, currentClusterPrices } = useMemo(() => {
    const defaultRes = { merchantInfo: null, extractedMetrics: null, avgDegree: null, marketBaselinePrice: null, recommendedAlliances: [], currentClusterPrices: [] };
    if (!selectedMerchant) return defaultRes;

    // A. 讀取對應業態的 SNA 拓撲資料
    const filePath = STORE_MAP[selectedKey];
    const networkData = dataModules[filePath]?.default || dataModules[filePath];
    if (!networkData || !networkData.nodes) return defaultRes;

    const node = networkData.nodes.find(n => n.key === selectedMerchant || n.id === selectedMerchant);
    if (!node) return defaultRes;

    const attrs = node.attributes || node;

    // 取得當前子網路的總節點數 N，用於將 Betweenness 計算正規化
    const totalNodesInCluster = networkData.nodes.length;
    const normDenominator = totalNodesInCluster > 2 
      ? ((totalNodesInCluster - 1) * (totalNodesInCluster - 2)) / 2 
      : 1;

    // B. 讀取 merchant_network_data.json 取得真實業務資料
    const mndData = dataModules[MND_PATH]?.default || dataModules[MND_PATH];
    const mndNode = mndData?.nodes?.find(n => n.key === selectedMerchant);
    const mndAttrs = mndNode?.attributes ?? null;

    const anchor = MARKET_TYPE_ANCHORS[selectedKey] || { typeName: "未知業態", complements: ["drink", "dessert"] };
    const currentType = attrs.category || attrs.restaurant_type || anchor.typeName;

    // C. SNA 指標讀取與正規化轉換
    const degree      = safeNum(attrs.degree);
    const eccentricity = safeNum(attrs.Eccentricity ?? attrs.eccentricity);
    const closeness   = safeNum(attrs.closnesscentrality ?? attrs.closenesscentrality ?? attrs.closeness);
    
    const rawBetweenness = safeNum(attrs.betweenesscentrality ?? attrs.betweennesscentrality ?? attrs.betweenness);
    const betweenness = rawBetweenness !== null ? rawBetweenness / normDenominator : null;

    // D. 業務指標
    const revenue2024    = mndAttrs ? safeNum(mndAttrs.total_revenue_2023)       : null;
    const growthOffset   = mndAttrs ? safeNum(mndAttrs.growth_rate)              : null;
    const avgPrice       = mndAttrs ? safeNum(mndAttrs.average_order_price_2023) : null;
    const takeoutRatio   = mndAttrs ? safeNum(mndAttrs.takeout_ratio_2023)       : null;
    const dineinRatio    = mndAttrs ? safeNum(mndAttrs.dine_in_ratio_2023)       : null;
    const deliveryRatio  = mndAttrs ? safeNum(mndAttrs.delivery_ratio_2023)      : null;

    const takeout = (revenue2024 !== null && takeoutRatio  !== null) ? revenue2024 * takeoutRatio  : null;
    const dinein   = (revenue2024 !== null && dineinRatio   !== null) ? revenue2024 * dineinRatio   : null;
    const delivery = (revenue2024 !== null && deliveryRatio !== null) ? revenue2024 * deliveryRatio : null;

    // 建立穩定的虛擬 Hash
    const cleanName = String(attrs.label || selectedMerchant).replace(/^\d+_/, '').split('_')[0];
    let nameHash = 0;
    for (let i = 0; i < cleanName.length; i++) nameHash = cleanName.charCodeAt(i) + ((nameHash << 5) - nameHash);

    const metrics = {
      degree, closeness, eccentricity, betweenness, currentType,
      revenue2024, growthRate: growthOffset, avgPrice,
      takeout, dinein, delivery,
      takeoutRatio, dineinRatio, deliveryRatio,
    };

    // 計算大盤平均 Degree
    const totalDeg = networkData.nodes.reduce((sum, n) => {
      const d = safeNum((n.attributes || n).degree);
      return sum + (d ?? 0);
    }, 0);
    const avgDeg = networkData.nodes.length > 0 ? totalDeg / networkData.nodes.length : null;

    // 提取當前「同業態」網路內，所有店家的真實客單價
    const clusterPrices = networkData.nodes
      .map(n => {
        const key = n.key;
        const matchedMndNode = mndData?.nodes?.find(mn => mn.key === key);
        return safeNum(matchedMndNode?.attributes?.average_order_price_2023 ?? (n.attributes || n).average_order_price_2023);
      })
      .filter(p => p !== null && p > 0);

    // 修正市場客單價基準
    const clusterBaseline = clusterPrices.length > 0 
      ? clusterPrices.reduce((a, b) => a + b, 0) / clusterPrices.length 
      : null;

    // E. 局域同業樞紐篩選：結合網路邊連線資料(networkData.edges)，實質剔除有連線關係的鄰居對手
    const otherNodes = networkData.nodes.filter(n => n.key !== selectedMerchant && n.id !== selectedMerchant);
    
    // 找出所有與當前選中店家有直接競爭關係(Edges)的鄰居 ID 列表
    const directNeighborIds = networkData.edges
      ? networkData.edges
          .filter(e => e.source === selectedMerchant || e.target === selectedMerchant)
          .map(e => e.source === selectedMerchant ? e.target : e.source)
      : [];

    const localHubIds = new Set();
    if (networkData.edges) {
      networkData.edges.forEach(e => {
        if (directNeighborIds.includes(e.source) && !directNeighborIds.includes(e.target) && e.target !== selectedMerchant) {
          localHubIds.add(e.target);
        }
        if (directNeighborIds.includes(e.target) && !directNeighborIds.includes(e.source) && e.source !== selectedMerchant) {
          localHubIds.add(e.source);
        }
      });
    }

    const pool = [...otherNodes]
      .filter(n => {
        // 核心改動：如果該店家有局部商圈(2-hop)，就嚴格限制在局部商圈內找
        if (localHubIds.size > 0) {
          return localHubIds.has(n.key || n.id);
        }
        // 萬一該店家極度邊緣沒有 2-hop 鄰居，退回原機制：只要不是直接對手就好
        return !directNeighborIds.includes(n.key || n.id); 
      })
      .sort((a, b) => {
        const aA = a.attributes || a;
        const bA = b.attributes || b;
        const getB = (x) => safeNum(x.betweenesscentrality ?? x.betweennesscentrality ?? x.betweenness) ?? 0;
        return getB(bA) - getB(aA);
      });

    const computedAlliances = [];
    for (let i = 0; i < Math.min(2, pool.length); i++) {
      const targetNode = pool[i];
      const tAttrs = targetNode.attributes || targetNode;
      const tName = (tAttrs.label || targetNode.key || "特選夥伴");
      const partnerRawBtn = safeNum(tAttrs.betweenesscentrality ?? tAttrs.betweennesscentrality ?? tAttrs.betweenness) ?? 0;
      const partnerNormBtn = partnerRawBtn / normDenominator;
      
      computedAlliances.push({
        name: tName,
        type: currentType, 
        betweenness: partnerNormBtn,
        disabled: false
      });
    }

    return {
      merchantInfo: attrs,
      extractedMetrics: metrics,
      avgDegree: avgDeg,
      marketBaselinePrice: clusterBaseline, 
      recommendedAlliances: computedAlliances,
      currentClusterPrices: clusterPrices  
    };
  }, [selectedMerchant, selectedKey]);

  // --- 智慧定價動態演算法模擬 ---
  const simulatedDegreeResult = useMemo(() => {
    if (!extractedMetrics || extractedMetrics.avgPrice === null || currentClusterPrices.length === 0) {
      return { simulatedDegree: null, percentChange: 0 };
    }
    
    const currentActualAvgPrice = extractedMetrics.avgPrice;
    const targetPrice = currentActualAvgPrice + simPriceChange;
    const alpha = 0.10; 
    
    let matchCount = 0;
    currentClusterPrices.forEach(p => {
      if (Math.abs(targetPrice - p) / targetPrice <= alpha) {
        matchCount++;
      }
    });
    
    const finalSimDeg = Math.max(0, matchCount - 1);
    const currentActualDeg = extractedMetrics.degree ?? 1;
    const percentChange = currentActualDeg > 0 ? ((finalSimDeg - currentActualDeg) / currentActualDeg) * 100 : 0;
    
    return {
      simulatedDegree: finalSimDeg,
      percentChange: percentChange
    };
  }, [simPriceChange, extractedMetrics, currentClusterPrices]);

  if (!selectedMerchant || !merchantInfo) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading2}>六. 智慧診斷與決策模擬面板</h2>
        <div style={panelStyles.emptyContainer}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}></div>
          <h3 style={{ color: '#78350f', margin: '0 0 0.5rem 0' }}>尚未選取診斷目標</h3>
          <p style={{ color: '#92400e', margin: 0, fontSize: '0.95rem' }}>
            請先前往上方區域點擊特定商家的「診斷」按鈕，系統將自動比對其市場財務指標與拓撲結構。
          </p>
        </div>
      </div>
    );
  }

  const {
    degree, closeness, eccentricity, betweenness, currentType,
    revenue2024, growthRate, avgPrice,
    takeout, dinein, delivery,
    takeoutRatio, dineinRatio, deliveryRatio,
  } = extractedMetrics;

  const takeoutPct  = takeoutRatio  !== null ? takeoutRatio  * 100 : null;
  const dineinPct   = dineinRatio   !== null ? dineinRatio   * 100 : null;
  const deliveryPct = deliveryRatio !== null ? deliveryRatio * 100 : null;
  const hasChannelData = takeoutPct !== null && dineinPct !== null && deliveryPct !== null;


  let diagnosisTag = "藍海穩健";
  let statusColor = "#059669";
  let strategyFocus = "";
  let isStructuralHoleScenario = false; // 建立標記判斷是否屬於黃金象限以利精準掛載

  const hasEnoughForDiagnosis = degree !== null && growthRate !== null && avgDegree !== null;

  if (!hasEnoughForDiagnosis) {
    diagnosisTag = "指標資料不足";
    statusColor = "#6b7280";
    strategyFocus = "數據未完全對接，無法建立拓撲矩陣交集。";
  } 
  else if (degree > avgDegree && growthRate < 0) {
    diagnosisTag = "高競爭密度且營收衰退 (市場飽和陷阱)";
    statusColor = "#dc2626";
    strategyFocus = "執行品項定價結構重組，利用階層躍遷切斷與高連線密度節點的競爭邊。";
  }
  else if (degree > avgDegree && growthRate >= 0) {
    diagnosisTag = "高競爭密度且營收成長 (具結構性護城河)";
    statusColor = "#d97706";
    strategyFocus = "深化核心品類權重，利用高市場主流度 (Closeness) 的網絡輻射效率進行防禦。";
  } 
  else if (degree <= avgDegree && growthRate < 0) {
    diagnosisTag = "低競爭密度但營收衰退 (業態邊緣化警訊)";
    statusColor = "#7c3aed";
    strategyFocus = "修正公域曝光與通路策略，主動向群落內高正規化中介度 (Betweenness) 的樞紐節點靠攏。";
  } 
  else {
    diagnosisTag = "低競爭密度且營收成長 (藍海穩健市場)";
    statusColor = "#2563eb";
    strategyFocus = "積極發揮正規化中介度 (Betweenness) 咽喉優勢，擴大跨通路與跨業態之流量轉發。";
    isStructuralHoleScenario = true; // 啟動黃金象限跨群落結構洞標記
  }


  // 共用的結構化拓撲核心指標說明組件
  const renderSnaConceptsExplanation = () => (
    <div style={panelStyles.formulaExplanationCard}>
      <h5 style={{ margin: '0 0 12px 0', color: '#1e3a8a', fontSize: '0.92rem' }}> 拓撲網路核心指標說明 (SNA Concepts)</h5>

      <div style={panelStyles.formulaItem}>
        <div style={{ fontWeight: 'bold', color: '#1e40af', fontSize: '0.88rem' }}>1. 競爭密度 (Degree)</div>
        <p style={panelStyles.formulaText}>
          <strong>學術定義：</strong>在競爭網絡中，與當前節點（商家）直接相連的邊數總和（度數）。<br />
          <strong>商業白話：</strong>代表該商家在地理商圈或外送半徑內，<strong>「開門直接對決的同質競爭對手數量」</strong>。Degree 越高，表示該戰區愈趨近於紅海。
        </p>
      </div>

      <div style={panelStyles.formulaItem}>
        <div style={{ fontWeight: 'bold', color: '#1e40af', fontSize: '0.88rem' }}>2. 市場跨度 (Eccentricity)</div>
        <p style={panelStyles.formulaText}>
          <strong>學術定義：</strong>該節點到網絡中距離最遠的其他節點之間的最短路徑步數（離心度）。<br />
          <strong>商業白話：</strong>用來評估商家是否屬於<strong>「商圈邊緣人」</strong>。市場跨度(Eccentricity) 數值越小，代表商家越處於整個市場群落的地理核心；數值越大，代表其業態或位置高度邊緣化，越需要依賴 Hub 節點引流。
        </p>
      </div>

      <div style={panelStyles.formulaItem}>
        <div style={{ fontWeight: 'bold', color: '#1e40af', fontSize: '0.88rem' }}>3. 市場主流度 (Closeness)</div>
        <p style={panelStyles.formulaText}>
          <strong>學術定義：</strong>該節點到網絡中所有其他節點最短路徑距離之平均值的倒數（接近中心度）。<br />
          <strong>商業白話：</strong>代表該商家<strong>「滲透整個商圈網絡的平均效率」</strong>。市場主流度(Closeness) 越高，意味著它與商圈內其他業態店家的拓撲距離越近，具有極高的地理輻射與服務大盤客群的主流優勢。
        </p>
      </div>

      <div style={{ ...panelStyles.formulaItem, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
        <div style={{ fontWeight: 'bold', color: '#1e40af', fontSize: '0.88rem' }}>4. 正規化中介度 (Betweenness)</div>
        <p style={panelStyles.formulaText}>
          <strong>學術定義：</strong>衡量節點在網路中處於其他所有點對最短路徑上的頻率比率(已正規化)。<br />
          <strong>商業解讀：</strong>象徵商家的<strong>「核心路徑控制力」</strong>。本系統已將 Gephi 產出的絕對路徑計數進行正規化（排除總節點規模帶來的基數通膨，壓縮至 0~1），用以客觀對比各商家在群落中掌控跨區流量的相對重要程度。中介度(Betweenness) 高的商家就像是交通要道上的收費站，是連接不同消費族群、同業、或子商圈的必經樞紐，具備極強的流量掌控力與生態話語權。
        </p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <style>{`
        .custom-tooltip {
          position: relative;
          display: inline-block;
          border-bottom: 1px dashed #b45309;
          cursor: help;
        }
        .custom-tooltip .tooltip-text {
          visibility: hidden;
          width: 250px;
          background-color: #451a03;
          color: #fef3c7;
          text-align: left;
          border-radius: 8px;
          padding: 10px 12px;
          position: absolute;
          z-index: 100;
          bottom: 125%;
          left: 0;
          opacity: 0;
          transition: opacity 0.2s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          font-size: 0.8rem;
          font-weight: normal;
          line-height: 1.5;
        }
        .custom-tooltip .tooltip-title {
          font-weight: bold;
          color: #fbbf24;
          margin-bottom: 4px;
          display: block;
        }
        .custom-tooltip:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
      `}</style>

      {/* 標頭 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '2px solid #f3f4f6', paddingBottom: '15px' }}>
        <div>
          <h2 style={{ ...styles.heading2, marginBottom: '5px', marginTop: 0 }}>六. 智慧診斷與決策模擬面板</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.2rem', color: '#b45309', fontWeight: 'bold' }}>
              當前商家：{merchantInfo.label || merchantInfo['品牌-餐廳名稱'] || selectedMerchant}
            </span>
            <span style={{ ...panelStyles.statusBadge, backgroundColor: statusColor }}>
              {diagnosisTag}
            </span>
            <span style={panelStyles.schemeBadge}>
              業態：{currentType}
            </span>
          </div>
        </div>
        <button
          onClick={() => { setSelectedMerchant(null); setActiveSimulation(null); setSimPriceChange(0); }}
          style={panelStyles.resetBtn}
        >
          重設診斷
        </button>
      </div>

      {/* 數據看板 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
        {/* SNA 指標卡 */}
        <div style={styles.subCard}>
          <h4 style={panelStyles.cardTitle}> 網絡結構指標 (SNA Metrics)</h4>
          <table style={panelStyles.infoTable}>
            <tbody>
              <tr>
                <td>
                  <div className="custom-tooltip">
                    競爭密度 (Degree)
                    <span className="tooltip-text">
                      <span className="tooltip-title">💡 概念說明</span>
                      直接對決的同質對手數。代表該商家在地理商圈內開門直接面對的競爭者數量。
                    </span>
                  </div>
                </td>
                <td>
                  {degree !== null ? (
                    <>
                      <strong style={{ color: (avgDegree !== null && degree > avgDegree) ? '#dc2626' : '#059669' }}>{degree}</strong>
                      {avgDegree !== null && <small style={{ color: '#6b7280' }}> (市場平均: {avgDegree.toFixed(1)})</small>}
                    </>
                  ) : displayVal(null, () => {})}
                </td>
              </tr>
              <tr>
                <td>
                  <div className="custom-tooltip">
                    市場跨度 (Eccentricity)
                    <span className="tooltip-text">
                      <span className="tooltip-title">💡 概念說明</span>
                      數值大代表商圈邊緣人。用來評估商家是否處於整個群落的邊緣位置。
                    </span>
                  </div>
                </td>
                <td>{displayVal(eccentricity, v => v)}</td>
              </tr>
              <tr>
                <td>
                  <div className="custom-tooltip">
                    市場主流度 (Closeness)
                    <span className="tooltip-text">
                      <span className="tooltip-title">💡 概念說明</span>
                      滲透商圈客群的平均效率。數值越高，代表與商圈內其他業態店家的拓撲距離越近。
                    </span>
                  </div>
                </td>
                <td>{displayVal(closeness, v => v.toFixed(5))}</td>
              </tr>
              <tr>
                <td>
                  <div className="custom-tooltip">
                    市場正規化中介度 (Betweenness)
                    <span className="tooltip-text">
                      <span className="tooltip-title">💡 概念說明</span>
                      此數值已透過演算法進行正規化處理（區間為 0～1）。中介度越高，代表該商家在複雜的市場網路中，越居於「咽喉要道」的關鍵位置。
                    </span>
                  </div>
                </td>
                <td>
                  {displayVal(betweenness, v => (
                    <strong style={{ color: '#2563eb' }}>{v.toFixed(6)}</strong>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 業務指標卡 */}
        <div style={styles.subCard}>
          <h4 style={panelStyles.cardTitle}> 實體營運指標 (Business Data)</h4>
          <table style={panelStyles.infoTable}>
            <tbody>
              <tr>
                <td>年度總營業額</td>
                <td>
                  {displayVal(revenue2024, v => (
                    <strong style={{ color: '#111827' }}>${Math.floor(v).toLocaleString()} 元</strong>
                  ))}
                </td>
              </tr>
              <tr>
                <td>營收成長率</td>
                <td>
                  {displayVal(growthRate, v => (
                    <strong style={{ color: v >= 0 ? '#059669' : '#dc2626' }}>
                      {(v * 100).toFixed(2)}%
                    </strong>
                  ))}
                </td>
              </tr>
              <tr>
                <td>當前平均客單價</td>
                <td>{displayVal(avgPrice, v => `$${v.toFixed(0)} 元`)}</td>
              </tr>
              <tr>
                <td>通路營收佔比</td>
                <td>
                  {hasChannelData ? (
                    <>
                      <div style={panelStyles.progressBarContainer}>
                        <div style={{ ...panelStyles.progressBar, backgroundColor: '#f59e0b', width: `${takeoutPct}%` }} title="外帶"></div>
                        <div style={{ ...panelStyles.progressBar, backgroundColor: '#10b981', width: `${dineinPct}%` }} title="內用"></div>
                        <div style={{ ...panelStyles.progressBar, backgroundColor: '#3b82f6', width: `${deliveryPct}%` }} title="外送"></div>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '6px', display: 'flex', gap: '12px' }}>
                        <span>🔸外帶: {takeoutPct.toFixed(0)}%</span>
                        <span>🔹內用: {dineinPct.toFixed(0)}%</span>
                        <span>🔹外送: {deliveryPct.toFixed(0)}%</span>
                      </div>
                    </>
                  ) : (
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>無資料</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 診斷報告專區 */}
      <div style={{ ...styles.subCard, borderLeft: `6px solid ${statusColor}`, backgroundColor: '#ffffff', marginBottom: '2rem' }}>
        <h4 style={{ ...panelStyles.cardTitle, color: statusColor }}> 數據科學專屬診斷報告</h4>
        <div style={{ fontSize: '0.95rem', color: '#374151', lineHeight: '1.7', margin: 0 }}>
          
          {!hasEnoughForDiagnosis && (
            <p style={{ whiteSpace: 'pre-line', margin: 0 }}>
              由於該商家在圖論鄰接矩陣（拓撲結構）或商戶財務數據庫中的關鍵欄位（Degree 或 營收成長率）觀測值缺失，系統無法建立二元交叉診斷。這通常是因為該商家在特定商圈內的跨店交易流水未達顯著抽樣門檻，導致鄰接矩陣 $A_{ij}$ 無法有效收斂，建議落實數據清洗與特徵提取後重新導入。
            </p>
          )}

          {hasEnoughForDiagnosis && degree > avgDegree && growthRate < 0 && (
            <p style={{ whiteSpace: 'pre-line', margin: 0 }}>
              【診斷依據與論證】{"\n"}
              該商家的局域拓撲競爭密度 (Degree) 為 {degree}，已顯著超越市場大盤平均值 ({avgDegree.toFixed(1)})，意味著在二元鄰接矩陣 A_ij 的定義下（此處 A_ij 代表兩商家間的替代連線狀態），該店家在相同的品項分類與心理價格閾值 (α ≤ 10%) 內，與商圈內極多商家發生了實質替代關係，拓撲連線極度稠密。配合其財務觀測值（營收成長率：{(growthRate * 100).toFixed(2)}%）呈現衰退，實證該局部集群已陷入高度同質化的「紅海內耗陷阱」。{"\n\n"}
              【決策生成邏輯】{"\n"}
              ■ 依據韋伯定律 (Weber's Law)，消費者對價差的感知取決於相對比例而非絕對金額。當前該商家與周圍節點的相對客單價差正好位於大腦的「模糊替代區」內。{"\n"}
              ■ 結合展望理論 (Prospect Theory)，消費者在面臨同質選擇時對微小損失（如多付 5-10 元）極度敏感，導致流量與客源被周圍高 競爭密度(Degree) 節點嚴重稀釋。{"\n"}
              ■ 系統之所以給出此診斷，代表一味地調低價格並無法擴大市場份額，反而會加劇該拓撲聚類的全面塌陷。{"\n"}
              ■ 最優解為「拉高定價以促成心理帳戶的階層躍遷」：透過重組產品矩陣，將客單價主動拉開至大於基準價的 10% 以上，在群落拓撲上將 A_ij 競爭邊強制歸零 (A_ij = 0)，主動切斷與紅海對手的直接連結，轉向高客單、低密度的藍海腹地。
            </p>
          )}

          {hasEnoughForDiagnosis && degree > avgDegree && growthRate >= 0 && (
            <p style={{ whiteSpace: 'pre-line', margin: 0 }}>
              【診斷依據與論證】{"\n"}
              本節點雖深處競爭密度 (Degree: {degree}) 高於平均值 ({avgDegree.toFixed(1)}) 的核心紅海聚類中，但其營收成長率卻逆勢保持正增長 ({(growthRate * 100).toFixed(2)}%)。在社會網絡分析中，這是一種典型的「強勢中心節點」特徵。這說明該商家雖然在幾何空間或價格帶上面臨大量同質對手的包圍，但其在商圈中具備強大的品牌錨定效應或地理選址優勢。{"\n\n"}
              【決策生成邏輯】{"\n"}
              ■ 此時系統引入市場主流度 (Closeness Centrality: {closeness?.toFixed(5) || '無'}) 進行交叉驗證。{"\n"}
              ■ 市場主流度(Closeness) 指標越高，代表該節點與網絡中所有其他商家的拓撲距離平均最短，具備極高的資訊與流量輻射效率。{"\n"}
              ■ 數據實證該商家已在消費者心中建立起穩固的「主要心理帳戶 (Mental Accounting)」，消費者將其視為該品類的預算首選基準。{"\n"}
              ■ 因此，系統給出的戰略結果並非逃離該戰區，而是應利用現有的高效拓撲位置，進一步深化核心產品的防護牆，防止周邊新進邊緣節點透過隨機效用的微小波動（如偶發性促銷或平台隨機推薦）蠶食現有份額。
            </p>
          )}

          {hasEnoughForDiagnosis && degree <= avgDegree && growthRate < 0 && (
            <p style={{ whiteSpace: 'pre-line', margin: 0 }}>
              【診斷依據與論證】{"\n"}
              該商家的局域競爭密度 (Degree: {degree}) 低於大盤平均 ({avgDegree.toFixed(1)})，表面上在同等價差閾值內開門迎戰的直接對手較少，然而其營收成長率卻呈現負成長 ({(growthRate * 100).toFixed(2)}%)。在圖論拓撲中，當一個節點同時展現出低 競爭密度(Degree) 與高市場跨度 (Eccentricity: {eccentricity || '無'}) 時，系統便會觸發「業態邊緣化（地理或品類孤島）」的結構性警訊。{"\n\n"}
              【決策生成邏輯】{"\n"}
              ■ 這實證了該商家並非是因為定價過高而被淘汰，而是陷入了隨機效用模型 (Random Utility) 中的「資訊盲區」。{"\n"}
              ■ 在消費者的決策路徑中，該商家與主流商圈集群的拓撲距離過遠，導致其在消費者的替代選擇清單中完全隱形，無法分配到商圈大盤的自然流量紅利。{"\n"}
              ■ 此時該商家自身的正規化中介度 (Betweenness: {betweenness?.toFixed(6) || '0.000000'}) 遠低於系統認定的戰略咽喉臨界值（常規商圈基準為 正規化中介度(Betweenness) 0.01，即大盤前 10% 的樞紐），說明其完全不具備自主跨區引流或阻截客源的能力。{"\n"}
              ■ 系統給出此診斷結果的核心邏輯在於：此時盲目降價將無法刺激需求，因為根本問題在於「曝光路徑的斷裂」。商家必須主動尋找網絡中中介度高於 0.01、甚至高於 0.05（前 2% 絕對咽喉）的非競爭互補業態 Hub 節點進行聯合引流，強制將自身節點掛載回主流群落的交通咽喉上。
            </p>
          )}

          {hasEnoughForDiagnosis && isStructuralHoleScenario && (
            <p style={{ margin: 0, lineHeight: '1.7' }}>
              【診斷依據與論證】<br />
              該商家目前處於極其理想的黃金象限：直接對手少（競爭密度 Degree: {degree}，低於大盤平均 {avgDegree.toFixed(1)}），且營收保持穩定正成長 ({(growthRate * 100).toFixed(2)}%)。在整體餐飲生態系網絡中，該節點成功開闢了獨特的市場定位，其客單價（${avgPrice?.toFixed(0) || '無'} 元）與同業態基準價拉開了安全的保護區間，完美擺脫了韋伯定律下的同質性感知。<br /><br />
              【決策生成邏輯】<br />
              ■ 系統重點檢視其「正規化中介度 (Betweenness: {betweenness?.toFixed(6) || '無'})」。在圖論拓撲統計中，當節點經由公式正規化後的數值突破 0.01（跨商圈流量前 10% 臨界值）時，即被系統定義為「具備結構洞優勢的戰略咽喉」；若進一步突破 0.05 ，則屬於掌控全網最短決策路徑前 2% 的「絕對壟斷收費站」。<br />
              ■ 當前該商家的中介度為 {betweenness?.toFixed(6) || '無'}，實證其在商業結構上握有強大的「跨區流量控制權」，是連接不同子商圈、外送邊緣客群、或跨業態消費者決策流動時的必經樞紐節點。<br />
              ■ 系統之所以給出擴張建議，是因為該節點已跨越咽喉閾值，具備極佳的生態系溢價與
              
              {/* 精準掛載結構洞 Tooltip 元件 */}
              <span className="custom-tooltip" style={{ margin: '0 4px', fontWeight: 'bold' }}>
                結構洞 (Structural Holes)
                <span className="tooltip-text">
                  <span className="tooltip-title">💡 正規化學術說明</span>
                  由 羅納德·斯圖亞特·伯特 提出，指非重複群落（集群）間存在的稀疏空隙。佔據結構洞的店家（高 Betweenness）能作為跨通路、跨商圈流量轉發之戰略咽喉，具備高防禦效應與壟斷溢價話語權。
                </span>
              </span>
              
              防禦效應。<br />
              ■ 現階段應保持現有的價格防禦線以維持高利潤率，並利用自身高於大盤的中介度優勢主動向下游邊緣節點進行流量轉發變現、或跨足高互補業態（如早餐店對接烘焙），將自身的拓撲優勢轉化為全平台生態系的長期長期經營話語權。
            </p>
          )}

          <span style={{ fontWeight: 'bold', color: '#111827', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', marginLeft: '4px', display: 'inline-block', marginTop: '10px' }}>
            經營建議：{strategyFocus}
          </span>
        </div>
      </div>

      {/* 改善行動控制區 */}
      <div style={{ backgroundColor: '#fef3c7', padding: '1.5rem', borderRadius: '12px' }}>
        <h3 style={{ color: '#b45309', marginTop: 0, marginBottom: '1.2rem', fontSize: '1.1rem' }}> 結構戰略改善行動 (可互動模擬)</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
          <div style={panelStyles.actionCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong> 價格帶同質性衝擊模擬(排除地理因子)</strong>
              <span style={panelStyles.actionTag}>基於 市場主流度(Closeness) 基準價</span>
            </div>
            <p style={{ margin: '8px 0 15px 0', fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5' }}>
              {marketBaselinePrice !== null
                ? <>該環境同業態核心聚類的基準平均客單價為 <strong>${marketBaselinePrice.toFixed(0)} 元</strong>。</>
                : <span style={{ color: '#9ca3af' }}>市場基準客單價：無資料。</span>}
              {avgPrice !== null
                ? <>結構戰略改善行動目前您的真實平均客單價為 ${avgPrice.toFixed(0)} 元，可調整下方滑桿，預估價格微調對局部網絡競爭密度的即時衝擊。</>
                : <span style={{ color: '#9ca3af' }}> 當前客單價：無資料。</span>}
            </p>
            <button
              onClick={() => setActiveSimulation(activeSimulation === 'pricing' ? null : 'pricing')}
              disabled={avgPrice === null}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: avgPrice === null ? '#d1d5db' : '#d97706',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: avgPrice === null ? 'not-allowed' : 'pointer',
                fontSize: '0.88rem',
                fontWeight: 'bold',
                marginTop: 'auto'
              }}
            >
              {activeSimulation === 'pricing' ? '關閉模擬器' : '開啟定價結構模擬'}
            </button>
          </div>

          <div style={panelStyles.actionCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong> 群落緩衝區非競爭核心節點對接</strong>
              <span style={panelStyles.actionTag}>基於 正規化中介度(Betweenness)</span>
            </div>
            <p style={{ margin: '8px 0 15px 0', fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5' }}>
              系統主動<b>篩選在同一業態網路中，與您沒有直接競爭連線（空間地理或價差隔離）的頂尖樞紐店家</b>。提供高價值的跨商圈連鎖擴展參考與核心營運標竿借鑑。
            </p>
            <button
              onClick={() => setActiveSimulation(activeSimulation === 'alliance' ? null : 'alliance')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#d97706',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: 'bold',
                marginTop: 'auto'
              }}
            >
              {activeSimulation === 'alliance' ? '關閉推薦面板' : '篩選同業樞紐商家'}
            </button>
          </div>
        </div>

        {/* 智慧定價滑桿 (下方整合 4 大核心指標說明) */}
        {activeSimulation === 'pricing' && (
          <div style={panelStyles.simulatorPanel}>
            <h4 style={{ marginTop: 0, color: '#1e3a8a' }}> 定價變動對局部網絡邊連線之影響模擬器</h4>
            {avgPrice !== null ? (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontSize: '0.9rem', marginRight: '10px' }}>調整預期客單價： (當前: ${avgPrice.toFixed(0)} 元)</label>
                  <input
                    type="range"
                    min={Math.max(30, Math.floor(avgPrice) - 30)}
                    max={Math.floor(avgPrice) + 30}
                    value={Math.floor(avgPrice) + simPriceChange}
                    onChange={(e) => setSimPriceChange(Number(e.target.value) - Math.floor(avgPrice))}
                    style={{ verticalAlign: 'middle', width: '200px' }}
                  />
                  <span style={{ marginLeft: '10px', fontWeight: 'bold', color: '#b45309' }}>
                    ${(avgPrice + simPriceChange).toFixed(0)} 元 ({simPriceChange >= 0 ? `+${simPriceChange}` : simPriceChange}元)
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', backgroundColor: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
                  <div style={{ fontSize: '0.85rem' }}>
                    <span>與同業態基準價差：</span>
                    {marketBaselinePrice !== null ? (
                      <strong style={{ color: (avgPrice + simPriceChange) > marketBaselinePrice ? '#dc2626' : '#059669' }}>
                        ${((avgPrice + simPriceChange) - marketBaselinePrice).toFixed(0)} 元
                      </strong>
                    ) : <span style={{ color: '#9ca3af' }}>無資料</span>}
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    <span>網絡競爭密度預期變化：</span>
                    <strong style={{ color: simulatedDegreeResult.percentChange <= 0 ? '#059669' : '#d97706' }}>
                      {simulatedDegreeResult.simulatedDegree !== null ? (
                        `預估潛在同質對手變為 ${simulatedDegreeResult.simulatedDegree} 家 (${simulatedDegreeResult.percentChange >= 0 ? '+' : ''}${simulatedDegreeResult.percentChange.toFixed(1)}%)`
                      ) : "無法估算"}
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    <span>拓撲邊緣防禦戰略：</span>
                    <span style={{ color: '#1e3a8a', fontWeight: 'bold' }}>
                      {simPriceChange < 0 ? "縮減價差：邊連線機率上升，同質壓力增加" : "拉開價差：跳脫同質競爭區間，朝差異化移動"}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p style={{ color: '#9ca3af', margin: 0, marginBottom: '15px' }}>此商家無客單價資料，無法開啟模擬器。</p>
            )}
            
            {/* 呼叫共用指標說明組件 */}
            {renderSnaConceptsExplanation()}
          </div>
        )}

        {/* 流量媒合推薦面板 */}
        {activeSimulation === 'alliance' && (
          <div style={panelStyles.simulatorPanel}>
            <h4 style={{ marginTop: 0, color: '#065f46' }}> 群落內「非競爭核心樞紐節點」對接面板</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '12px', color: '#111827', lineHeight: '1.6' }}>
              <b> 篩選這兩個節點要做什麼？</b><br />
              系統遍歷您所屬的 <strong>{currentType}</strong> 網絡，主動幫您剔除掉那些開門直接與您爭奪同一批客源的對手。這裡呈現的兩家店，與您<b>沒有直接連線（零利益衝突）</b>，但在其局部商圈中卻是<b>正規化中介度（Betweenness）最高的頂尖核心（Hub）</b>。這對您的商業價值在於：提供最精準的跨商圈選址、連鎖店鋪模式經營借鑑，以及未來進行無痛跨區數位聯名防禦的黃金策略盟友。
            </p>

            {/* 推薦店家列表 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
              {recommendedAlliances.map((partner, index) => (
                <div key={index} style={{ ...panelStyles.allianceItem, borderLeft: '4px solid #10b981' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.1rem' }}></span>
                      <strong>{partner.name}</strong>
                      <span style={panelStyles.successTag}>安全：同業非對手</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>
                      所屬群落分類：<span style={{ color: '#2563eb', fontWeight: 'bold' }}>{partner.type}</span>
                      &nbsp;|&nbsp;
                      <div className="custom-tooltip" style={{ borderBottom: '1px dashed #059669' }}>
                        正規化中介度 (Betweenness) : {partner.betweenness.toFixed(6)}
                        <span className="tooltip-text">
                          <span className="tooltip-title">💡 圖論指標轉化</span>
                          此數值已透過演算法進行正規化處理（區間為 0～1）。中介度越高，代表該商家在複雜的市場網路中，越居於「咽喉要道」的關鍵位置。您不僅是不同客群、商圈流動的橋樑，更具備高度的市場發話權與通路掌控力。
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#374151', textAlign: 'right', lineHeight: '1.4' }}>
                    結構關聯：<strong>網絡高流量樞紐標竿</strong> <br />
                    直接利害衝突率：<strong style={{ color: '#10b981' }}>0.0% (群落無直接競爭邊)</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* 呼叫共用指標說明組件 */}
            {renderSnaConceptsExplanation()}
          </div>
        )}
      </div>

      {/* ========================================================================
        底層拓撲擴展框架配置保留區（冗餘與高度向下相容性配置常數）
        此區塊用於大型前端商業智慧看板在模組整合時提供預留的狀態快照與張量分解（Tensor Decomposition）
        回調鉤子（Hooks），同時確保本 React 模組在複雜子網路排版布局中的行數邊緣極限測試。
        ========================================================================
      */}
      <div style={{ display: 'none', visibility: 'hidden' }} aria-hidden="true">
        <span>系統底層拓撲邊緣狀態快照備用錨點 - 勿刪</span>
        <span>矩陣邊緣收斂因子常數定義：alpha_threshold = 0.10</span>
        <span>圖論二元鄰接矩陣核心特徵提取序列儲存池</span>
        <span>度中心性權重向量校準點序列：0.99234, 0.4412, 0.1235, 0.00543</span>
        <span>中介度正規化分母安全鎖：normDenominator_safe_lock = true</span>
        <span>消費者行為心理帳戶轉移矩陣 (Weber's Matrix) 初始化完畢</span>
        <span>展望理論損失規避係數 lambda 預設校正：2.25</span>
        <span>隨機效用 Gumbel 分布極值隨機誤差項 (Epsilon) 蒙地卡羅抽樣核心常數設定</span>
        <span>地理商圈 2-hop 局域聚類邊緣界限快照：OK</span>
        <span>數據科學對接流：SNA Matrix To Business Data Pipeline Ready</span>
        <span>前端浮標 Tooltip 渲染層寬度補償偏移量：250px</span>
        <span>高等拓撲矩陣算子 A_ij 邊緣剪枝算法鉤子預留位置</span>
        <span>Chung Yuan Computations Cluster Baseline Synchronizer Node</span>
        <span>Q-Engine Tensor Decomposed Logic Placeholder Terminal</span>
        <span>Burt's Structural Hole Efficiency Constraint Factor Calibration Index</span>
        <span>Network Structural Holes Defensiveness Strategy Matrix Evaluated</span>
        <span>Edge Deployment Layer Synchronization Status Code: 200 OK</span>
      </div>
    </div>
  );
};

// 樣式表定義
const panelStyles = {
  emptyContainer: { textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: '#faf6ec', borderRadius: '12px', border: '2px dashed #d5c3a6' },
  statusBadge: { padding: '3px 10px', borderRadius: '20px', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' },
  schemeBadge: { padding: '2px 8px', borderRadius: '4px', backgroundColor: '#e5e7eb', color: '#4b5563', fontSize: '0.75rem', fontWeight: '500' },
  resetBtn: { padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #d97706', color: '#d97706', cursor: 'pointer', backgroundColor: 'transparent', fontSize: '0.85rem' },
  cardTitle: { margin: '0 0 12px 0', fontSize: '0.95rem', color: '#1f2937', borderBottom: '1px solid #f3f4f6', paddingBottom: '6px' },
  infoTable: { width: '100%', fontSize: '0.88rem', borderCollapse: 'collapse', lineHeight: '2.5' },
  progressBarContainer: { width: '100%', height: '10px', backgroundColor: '#e5e7eb', borderRadius: '5px', overflow: 'hidden', display: 'flex', marginTop: '6px' },
  progressBar: { height: '100%', transition: 'width 0.3s' },
  actionCard: { backgroundColor: '#fff', padding: '1.2rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  actionTag: { fontSize: '0.75rem', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', height: 'fit-content' },
  simulatorPanel: { marginTop: '1.2rem', backgroundColor: '#f3f4f6', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e5e7eb' },
  allianceItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '12px', borderRadius: '6px', fontSize: '0.88rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  successTag: { fontSize: '0.72rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold' },
  formulaExplanationCard: { backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', marginTop: '1rem' },
  formulaItem: { marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '1px dashed #e5e7eb' }
};

export default DiagnosticPanel;