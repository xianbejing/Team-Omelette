import React, { useEffect, useRef } from "react";
import Graph from "graphology";
import Sigma from "sigma";

/**
 * GephiSigmaNetwork 組件
 * @param {Object} data - 從父組件傳入的全量 JSON 數據 (包含 nodes 和 edges)
 * @param {Function} onNodeClick - 點擊節點時的回呼函式，用於通知父組件捲動列表
 */
const GephiSigmaNetwork = ({ data, onNodeClick }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    // 確保容器存在且有數據才開始渲染
    if (!containerRef.current || !data || !data.nodes) return;

    // 1. 初始化 Graphology 實例
    const graph = new Graph();

    // =========================
    // 2. 處理節點 (Nodes)
    // =========================
    data.nodes.forEach((node) => {
      const a = node.attributes || {};
      
      // 避免重複添加節點
      if (graph.hasNode(node.key)) return;

      graph.addNode(node.key, {
        label: a.label || node.key,
        // Gephi 座標轉換：Y 軸通常需要取負值以符合瀏覽器座標系
        x: a.x || 0,
        y: -(a.y || 0),
        // 大小與顏色處理
        size: Math.max(2, a.size || 5),
        color: a.color ? a.color.slice(0, 7) : "#999999",
      });
    });

    // =========================
    // 3. 處理連線 (Edges)
    // =========================
    if (data.edges) {
      data.edges.forEach((edge, i) => {
        // 確保來源與目標節點都存在於圖中
        if (!graph.hasNode(edge.source) || !graph.hasNode(edge.target)) return;

        const sourceAttr = graph.getNodeAttributes(edge.source);
        const w = edge.attributes?.Weight || 1;

        graph.addEdgeWithKey(`e${i}`, edge.source, edge.target, {
          // 模擬 Gephi 的線條粗細感
          size: Math.max(0.3, Math.sqrt(w) * 0.6),
          // 線條顏色預設使用來源節點的顏色
          color: sourceAttr.color || "#cccccc",
        });
      });
    }

    // =========================
    // 4. 初始化 Sigma 渲染器
    // =========================
    const renderer = new Sigma(graph, containerRef.current, {
      renderLabels: true,
      renderEdgeLabels: false,
      defaultNodeType: "circle",
      defaultEdgeType: "line",
      labelFont: "Arial",
      labelSize: 12,
      labelDensity: 0.08,
      labelRenderedSizeThreshold: 6,
      minCameraRatio: 0.02,
      maxCameraRatio: 20,
      zIndex: true,
      itemSizesReference: "positions", // 使用座標系作為大小參考基準
    });

    rendererRef.current = renderer;

    // =========================
    // 5. 事件監聽：點擊節點 (聯動右側列表)
    // =========================
    renderer.on("clickNode", ({ node }) => {
      if (onNodeClick) {
        onNodeClick(node);
      }
    });

    // =========================
    // 6. 事件監聽：Hover 高亮鄰居
    // =========================
    renderer.on("enterNode", ({ node }) => {
      // 獲取所有鄰居節點
      const neighbors = new Set(graph.neighbors(node));
      neighbors.add(node);

      // 隱藏非鄰居節點
      graph.forEachNode((n) => {
        graph.setNodeAttribute(n, "hidden", !neighbors.has(n));
      });

      // 隱藏非相關連線
      graph.forEachEdge((e, a, s, t) => {
        graph.setEdgeAttribute(e, "hidden", !(neighbors.has(s) && neighbors.has(t)));
      });
    });

    renderer.on("leaveNode", () => {
      // 取消隱藏狀態
      graph.forEachNode((n) => graph.removeNodeAttribute(n, "hidden"));
      graph.forEachEdge((e) => graph.removeEdgeAttribute(e, "hidden"));
    });

    // =========================
    // 7. 清理機制 (Cleanup)
    // =========================
    return () => {
      if (rendererRef.current) {
        rendererRef.current.kill(); // 徹底銷毀實例，釋放 WebGL 資源
        rendererRef.current = null;
      }
    };
  }, [data, onNodeClick]); // 當數據源切換或回呼函式改變時重新渲染

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        background: "#ffffff",
      }}
    />
  );
};

export default GephiSigmaNetwork;