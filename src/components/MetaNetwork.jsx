import React, { useEffect, useState } from 'react';
import { styles } from '../Styles';
import duduData from '../data/dudu-all.json';

import barNetwork from '../data/肚肚酒吧.json';
import fastFoodNetwork from '../data/肚肚速食.json';
import drinkNetwork from '../data/肚肚飲料.json';
import traditionalSnackNetwork from '../data/肚肚傳統庶民小吃.json';
import italianNetwork from '../data/肚肚義式.json';
import fusionNetwork from '../data/肚肚複合式.json';
import bbqNetwork from '../data/肚肚燒烤.json';
import bistroNetwork from '../data/肚肚餐酒館.json';
import lunchBoxNetwork from '../data/肚肚餐盒店.json';
import snackNetwork from '../data/肚肚小吃店.json';
import chineseNetwork from '../data/肚肚中式.json';
import japaneseNetwork from '../data/肚肚日式.json';
import hotpotNetwork from '../data/肚肚火鍋.json';
import dessertNetwork from '../data/肚肚冰甜品.json';
import breakfastNetwork from '../data/肚肚早餐.json';
import westernNetwork from '../data/肚肚西式.json';
import coffeeNetwork from '../data/肚肚咖啡.json';
import izakayaNetwork from '../data/肚肚居酒屋.json';
import bakeryNetwork from '../data/肚肚烘焙.json';

const getNodeCount = network => {
  if (!network || !Array.isArray(network.nodes)) return 0;
  return network.nodes.length;
};

const CATEGORY_ALIASES = {
  飲料: '飲料店',
  飲料店: '飲料店',

  早餐: '早餐及早午餐',
  早餐及早午餐: '早餐及早午餐',

  咖啡: '咖啡簡餐',
  咖啡簡餐: '咖啡簡餐',

  小吃: '小吃店',
  小吃店: '小吃店',

  日式: '日式餐廳',
  日式餐廳: '日式餐廳',

  中式: '中式餐廳',
  中式餐廳: '中式餐廳',

  火鍋: '火鍋店',
  火鍋店: '火鍋店',

  餐盒: '餐盒店',
  餐盒店: '餐盒店',
  便當餐盒店: '餐盒店',

  冰甜品: '冰品甜點',
  冰甜品店: '冰品甜點',
  冰品甜點: '冰品甜點',

  傳統庶民小吃: '傳統/庶民小吃',
  '傳統/庶民小吃': '傳統/庶民小吃',

  餐酒館: '餐酒館',

  居酒屋: '居酒屋',

  烘焙: '麵包/烘焙',
  麵包烘焙: '麵包/烘焙',
  '麵包/烘焙': '麵包/烘焙',

  義式: '義式餐廳',
  義式餐廳: '義式餐廳',

  速食: '速食店',
  速食店: '速食店',

  燒烤: '燒烤店',
  燒烤店: '燒烤店',

  複合式: '複合式餐廳',
  複合式餐廳: '複合式餐廳',

  西式: '西式餐廳',
  西式餐廳: '西式餐廳',

  酒吧: '酒吧'
};

const CATEGORY_NETWORKS = {
  飲料店: drinkNetwork,
  早餐及早午餐: breakfastNetwork,
  咖啡簡餐: coffeeNetwork,
  小吃店: snackNetwork,
  日式餐廳: japaneseNetwork,
  中式餐廳: chineseNetwork,
  火鍋店: hotpotNetwork,
  餐盒店: lunchBoxNetwork,
  冰品甜點: dessertNetwork,
  '傳統/庶民小吃': traditionalSnackNetwork,
  餐酒館: bistroNetwork,
  居酒屋: izakayaNetwork,
  '麵包/烘焙': bakeryNetwork,
  義式餐廳: italianNetwork,
  速食店: fastFoodNetwork,
  燒烤店: bbqNetwork,
  複合式餐廳: fusionNetwork,
  西式餐廳: westernNetwork,
  酒吧: barNetwork
};

const NETWORK_SCALE = Object.fromEntries(
  Object.entries(CATEGORY_NETWORKS).map(([category, network]) => [
    category,
    getNodeCount(network)
  ])
);

const normalizeCategory = value => {
  const raw = String(value || '').trim();
  return CATEGORY_ALIASES[raw] || raw;
};

const toNumber = value => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
};

const MetaNetwork = () => {
  const [matrixData, setMatrixData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buildMatrix = () => {
      try {
        setLoading(true);

        const rawData = Array.isArray(duduData) ? duduData : [];

        const filteredData = rawData.filter(item => {
        const category = normalizeCategory(item.category);
        const orders2023 = toNumber(item.orders2023);
        const revenue2023 = toNumber(item.revenue2023);

        return (
         orders2023 > 0 &&
         revenue2023 > 0 &&
         category in NETWORK_SCALE
        );
     });

        const categoryAggregates = {};

        filteredData.forEach(item => {
          const category = normalizeCategory(item.category);

          if (!categoryAggregates[category]) {
            categoryAggregates[category] = {
              name: category,
              revenue: 0,
              takeout: 0,
              dinein: 0,
              delivery: 0,
              orders: 0,
              aovSum: 0,
              aovCount: 0,
              count: 0
            };
          }

          const agg = categoryAggregates[category];
          const aov = toNumber(item.aov2023);

          agg.revenue += toNumber(item.revenue2023);
          agg.takeout += toNumber(item.takeout2023);
          agg.dinein += toNumber(item.dinein2023);
          agg.delivery += toNumber(item.delivery2023);
          agg.orders += toNumber(item.orders2023);
          agg.count += 1;

          if (aov > 0) {
            agg.aovSum += aov;
            agg.aovCount += 1;
          }
        });

        const categories = Object.values(categoryAggregates)
          .map(category => {
            const totalChannelRevenue =
              category.takeout + category.dinein + category.delivery ||
              category.revenue ||
              1;

            const avgAov =
              category.aovCount > 0
                ? Math.round(category.aovSum / category.aovCount)
                : 0;

            return {
              name: category.name,
              dataCount: category.count,
              networkScale: NETWORK_SCALE[category.name] || category.count,
              avgAov,
              revenue: category.revenue,
              pipeVector: [
                category.takeout / totalChannelRevenue,
                category.dinein / totalChannelRevenue,
                category.delivery / totalChannelRevenue
              ]
            };
          })
          .filter(category => category.networkScale > 0);

        if (categories.length === 0) {
          setMatrixData([]);
          return;
        }

        const maxAov = Math.max(...categories.map(category => category.avgAov));
        const minAov = Math.min(...categories.map(category => category.avgAov));
        const maxRev = Math.max(...categories.map(category => category.revenue));
        const minRev = Math.min(...categories.map(category => category.revenue));

        categories.forEach(category => {
          category.normAov =
            (category.avgAov - minAov) / (maxAov - minAov || 1);

          category.normRev =
            (category.revenue - minRev) / (maxRev - minRev || 1);

          category.final5DVector = [
            ...category.pipeVector,
            category.normAov,
            category.normRev
          ];
        });

        const calculatedMatrix = categories.map(source => {
          const relations = categories
            .filter(target => target.name !== source.name)
            .map(target => {
              const euclideanDistance = Math.sqrt(
                source.final5DVector.reduce(
                  (sum, value, index) =>
                    sum + Math.pow(value - target.final5DVector[index], 2),
                  0
                )
              );

              const overlap = Math.max(
                0,
                Math.min(
                  100,
                  Math.round((1 - euclideanDistance / 1.6) * 100)
                )
              );

              return {
                name: target.name,
                overlap
              };
            })
            .sort((a, b) => b.overlap - a.overlap);

          const [takeoutRate, dineinRate, deliveryRate] = source.pipeVector;

          let featureTag = '多通路均衡';
          if (takeoutRate > 0.5) featureTag = '外帶主導';
          if (dineinRate > 0.5) featureTag = '內用體驗主導';
          if (deliveryRate > 0.35) featureTag = '外送依存較高';

          const topRelation = relations[0];

          return {
            label: source.name,
            weight: `${source.networkScale} 家`,
            scaleValue: source.networkScale,
            revenueText: `${(source.revenue / 100000000).toFixed(1)} 億`,
            feature: `${featureTag}｜AOV $${source.avgAov}`,
            relation:
              relations
                .slice(0, 2)
                .map(item => `${item.name} (${item.overlap}%)`)
                .join('、') || '暫無明顯重疊',
            topOverlap: topRelation?.overlap || 0,
            topRelation: topRelation?.name || '—',
            rawRelations: relations
          };
        });

        calculatedMatrix.sort((a, b) => b.scaleValue - a.scaleValue);

        setMatrixData(calculatedMatrix);
      } catch (error) {
        console.error('MetaNetwork 計算失敗:', error);
        setMatrixData([]);
      } finally {
        setLoading(false);
      }
    };

    buildMatrix();
  }, []);

  const summary = {
    totalTypes: matrixData.length,
    totalScale: matrixData.reduce((sum, item) => sum + item.scaleValue, 0),
    largest: matrixData[0],
    strongest: [...matrixData].sort(
      (a, b) => b.topOverlap - a.topOverlap
    )[0]
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading2}>四、市場業態巨觀網絡報告</h2>
        <p style={introStyle}>資料分析中，正在建立餐飲業態關係矩陣...</p>
      </div>
    );
  }

  if (matrixData.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading2}>四、市場業態巨觀網絡報告</h2>
        <p style={introStyle}>目前沒有可呈現的餐飲業態資料。</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading2}>四、市場業態巨觀網絡報告</h2>

      <p style={introStyle}>
        本頁聚焦 19 種主要餐飲業態，將營收通路、客單價與市場量體轉換為巨觀網絡指標，
        呈現不同餐飲類型之間的市場位置與重疊關係。
      </p>

      <div style={summaryGridStyle}>
        <SummaryCard
          title="分析業態"
          value={`${summary.totalTypes} 類`}
          note="主要餐飲網絡類別"
        />
        <SummaryCard
          title="網絡規模"
          value={`${summary.totalScale.toLocaleString()} 家`}
          note="19 份餐飲網絡節點"
        />
        <SummaryCard
          title="最大業態"
          value={summary.largest?.label || '—'}
          note={summary.largest?.weight || '—'}
        />
        <SummaryCard
          title="最高重疊"
          value={`${summary.strongest?.topOverlap || 0}%`}
          note={`${summary.strongest?.label || '—'} ↔ ${summary.strongest?.topRelation || '—'}`}
        />
      </div>

      <div style={cleanInfoGridStyle}>
        <section style={cleanInfoCardStyle}>
          <strong style={cleanTitleStyle}> 觀察重點</strong>
          <p style={cleanTextStyle}>
            競爭關係不只由店家數決定，而是由消費管道、價格帶與市場量體共同形成。
            系統會找出各業態最接近的市場鄰居，協助判斷紅海競爭與潛在合作情境。
          </p>
        </section>

        <section style={cleanInfoCardStyle}>
          <strong style={cleanTitleStyle}> 五維特徵空間</strong>
          <p style={cleanTextStyle}>
            每個業態以外帶比例、內用比例、外送比例、標準化 AOV、標準化營收組成 5D 向量；
            向量距離越近，代表市場定位越接近。
          </p>
        </section>

        <section style={cleanInfoCardStyle}>
          <strong style={cleanTitleStyle}> 商業解讀</strong>
          <p style={cleanTextStyle}>
            高重疊代表消費者容易在相似情境中替代選擇；低重疊則表示消費情境分流，
            較適合做分眾推播或跨業態合作。
          </p>
        </section>
      </div>

      <div style={tablePanelStyle}>
        <div style={tableTitleBarStyle}>
          <strong style={{ color: '#b45309' }}>📋 2023 餐飲業態關係矩陣</strong>
          <span style={{ fontSize: '0.78rem', color: '#78350f' }}>
            依網絡規模排序
          </span>
        </div>

        <div style={tableScrollStyle}>
          <table
            style={{
              width: '100%',
              fontSize: '0.85rem',
              borderCollapse: 'collapse'
            }}
          >
            <thead
              style={{
                position: 'sticky',
                top: 0,
                backgroundColor: '#faf6ec',
                zIndex: 1
              }}
            >
              <tr
                style={{
                  borderBottom: '1px solid #d5c3a6',
                  color: '#78350f'
                }}
              >
                <th style={tableHeaderStyle}>業態核心節點</th>
                <th style={tableHeaderStyle}>網絡規模</th>
                <th style={tableHeaderStyle}>2023 營收</th>
                <th style={tableHeaderStyle}>市場特徵</th>
                <th style={tableHeaderStyle}>最強重疊群</th>
              </tr>
            </thead>
            <tbody>
              {matrixData.map(row => (
                <TableRow key={row.label} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, note }) => (
  <div style={summaryCardStyle}>
    <div style={summaryTitleStyle}>{title}</div>
    <div style={summaryValueStyle}>{value}</div>
    <div style={summaryNoteStyle}>{note}</div>
  </div>
);

const TableRow = ({ row }) => (
  <tr style={{ borderBottom: '1px solid #eaddc5' }}>
    <td style={tableCellStrongStyle}>{row.label}</td>
    <td style={tableCellStyle}>{row.weight}</td>
    <td style={tableCellStyle}>{row.revenueText}</td>
    <td style={tableCellStyle}>
      <span style={badgeStyle}>{row.feature}</span>
    </td>
    <td style={tableCellRelationStyle}>{row.relation}</td>
  </tr>
);

const introStyle = {
  marginBottom: '1.4rem',
  color: '#574835',
  lineHeight: '1.8',
  fontSize: '0.95rem'
};

const summaryGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
  gap: '0.9rem',
  marginBottom: '1.2rem'
};

const summaryCardStyle = {
  padding: '1rem',
  borderRadius: '10px',
  backgroundColor: '#fff8ef',
  border: '1px solid #fed7aa',
  boxShadow: '0 4px 12px rgba(120, 53, 15, 0.05)'
};

const summaryTitleStyle = {
  color: '#9a4b0b',
  fontSize: '0.78rem',
  fontWeight: '700',
  marginBottom: '0.45rem'
};

const summaryValueStyle = {
  color: '#433422',
  fontSize: '1.35rem',
  fontWeight: '800',
  marginBottom: '0.25rem'
};

const summaryNoteStyle = {
  color: '#7c6a54',
  fontSize: '0.78rem'
};

const cleanInfoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
  gap: '0.9rem',
  marginBottom: '1.2rem'
};

const cleanInfoCardStyle = {
  padding: '1rem',
  borderRadius: '10px',
  backgroundColor: '#fffdf7',
  border: '1px solid #f3e5c8'
};

const cleanTitleStyle = {
  display: 'block',
  color: '#b45309',
  fontSize: '0.95rem',
  marginBottom: '0.55rem'
};

const cleanTextStyle = {
  margin: 0,
  color: '#574835',
  lineHeight: '1.7',
  fontSize: '0.86rem'
};

const tablePanelStyle = {
  backgroundColor: '#faf6ec',
  padding: '1rem',
  borderRadius: '10px',
  border: '1px solid #eaddc5'
};

const tableTitleBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.75rem',
  gap: '1rem'
};

const tableScrollStyle = {
  maxHeight: '500px',
  overflowY: 'auto',
  overflowX: 'auto',
  borderRadius: '8px',
  border: '1px solid #ead7b8',
  backgroundColor: '#fffdf8'
};

const tableHeaderStyle = {
  padding: '0.7rem 0.55rem',
  textAlign: 'left',
  whiteSpace: 'nowrap'
};

const tableCellStyle = {
  padding: '0.7rem 0.55rem',
  color: '#574835',
  whiteSpace: 'nowrap'
};

const tableCellStrongStyle = {
  padding: '0.7rem 0.55rem',
  fontWeight: '700',
  color: '#433422',
  whiteSpace: 'nowrap'
};

const tableCellRelationStyle = {
  padding: '0.7rem 0.55rem',
  color: '#9a4b0b',
  lineHeight: '1.45',
  minWidth: '190px'
};

const badgeStyle = {
  backgroundColor: '#f5e6cc',
  color: '#78350f',
  padding: '0.25rem 0.5rem',
  borderRadius: '5px',
  fontSize: '0.76rem',
  fontWeight: '600',
  display: 'inline-block'
};

export default MetaNetwork;