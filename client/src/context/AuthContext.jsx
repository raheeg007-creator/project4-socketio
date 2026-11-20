// استيراد createContext و useState و useEffect من مكتبة React، واستيراد axios للتعامل مع الطلبات HTTP
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
// إنشاء سياق المصادقة
export const AuthContext = createContext();
// تعريف مزود سياق المصادقة
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

// عند تحميل المكون، نحاول جلب بيانات المستخدم من localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
// دالة لتسجيل الدخول، تقوم بتحديث حالة المستخدم وتخزين بياناته في localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
// دالة لتسجيل الخروج، تقوم بإزالة بيانات المستخدم من الحالة وlocalStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
// توفير القيم للمكونات الفرعية من خلال سياق المصادقة
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};