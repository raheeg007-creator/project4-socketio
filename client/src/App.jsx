// استيراد React و BrowserRouter و Routes و Route من مكتبة react-router-dom
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// استيراد AuthProvider لتوفير سياق المصادقة لجميع المكونات
import { AuthProvider } from './context/AuthContext';
// استيراد مكون Navbar لعرض شريط التنقل في جميع الصفحات
import Navbar from './components/Navbar';
// استيراد مكونات الصفحات المختلفة
import Home from './pages/Home';
// استيراد مكون Gallery لصفحة معرض الصور
import Gallery from './pages/Gallery';
// استيراد مكون LoginRegister لصفحة تسجيل الدخول والتسجيل
import LoginRegister from './pages/LoginRegister';
// استيراد مكون AddPhoto لصفحة إضافة الصور
import AddPhoto from './pages/AddPhoto';
// استيراد مكون PhotoDetail لعرض تفاصيل الصورة
import PhotoDetail from './pages/PhotoDetail';

// تعريف مكون App الذي يحتوي على جميع المكونات والصفحات
function App() {
  // تغليف التطبيق بمزود المصادقة وتهيئة التوجيه باستخدام BrowserRouter
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/add-photo" element={<AddPhoto />} />
          <Route path="/photos/:id" element={<PhotoDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
// تصدير مكون App ليتم استخدامه في ملف main.jsx
export default App;