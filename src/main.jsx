import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// 這裡我們先把 index.css 拿掉，用最純粹的內聯樣式（Inline Styles）來寫，確保 100% 不會被 CSS 檔案卡住
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);