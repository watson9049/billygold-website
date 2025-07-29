import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

console.log('main.jsx 開始載入')

// 添加錯誤處理
window.addEventListener('error', (event) => {
  console.error('JavaScript 錯誤:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('未處理的 Promise 拒絕:', event.reason)
})

try {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  console.log('React root 已建立')
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
  
  console.log('React 應用程式已渲染')
} catch (error) {
  console.error('React 渲染錯誤:', error)
  
  // 顯示錯誤訊息在頁面上
  const rootElement = document.getElementById('root')
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h1 style="color: red;">應用程式載入失敗</h1>
        <p style="color: #666;">錯誤訊息: ${error.message}</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
          重新載入
        </button>
      </div>
    `
  }
} 