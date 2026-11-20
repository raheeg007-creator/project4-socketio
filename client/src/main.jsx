// استيراد ملف CSS الرئيسي لتطبيق React
import React from 'react'
// استيراد ReactDOM لإنشاء الجذر الذي سيتم فيه عرض التطبيق
import ReactDOM from 'react-dom/client'
// استيراد مكون App الذي يحتوي على جميع المكونات والصفحات
import App from './App.jsx'
// استيراد ملف CSS الرئيسي لتطبيق React
ReactDOM.createRoot(document.getElementById('root')).render(
    // استخدام StrictMode لمساعدة  على اكتشاف المشكلات في التطبيق
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)