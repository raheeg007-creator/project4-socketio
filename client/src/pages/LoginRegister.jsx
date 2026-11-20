// استيراد useState و useContext و useEffect من مكتبة React، واستيراد useNavigate من react-router-dom للتنقل بين الصفحات
import { useState, useContext ,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// استيراد axios للتعامل مع الطلبات HTTP
import axios from 'axios';
// استيراد AuthContext للوصول إلى بيانات المستخدم ودوال تسجيل الدخول والخروج
import { AuthContext } from '../context/AuthContext';
//
export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
// استخدام useContext للوصول إلى دالة تسجيل الدخول من AuthContext، واستخدام useNavigate للتنقل بين الصفحات
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

// حالة لتخزين آخر وقت تسجيل دخول المستخدم
  const [lastLogin, setLastLogin] = useState('');
// عند تحميل المكون، نقوم بقراءة الكوكي "lastLogin" إذا كان موجودًا وتخزينه في الحالة
useEffect(() => {
  // قراءة الكوكي
  const cookies = document.cookie.split('; ');
  const lastLoginCookie = cookies.find(row => row.startsWith('lastLogin='));
  // إذا كان الكوكي موجودًا، نقوم بتحديث الحالة lastLogin
  if (lastLoginCookie) {
    setLastLogin(lastLoginCookie.split('=')[1]);
  }
}, []);
// دالة لتحديث حالة formData عند تغيير أي حقل في النموذج
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
// دالة لمعالجة إرسال النموذج، تقوم بإرسال البيانات إلى الخادم إما لتسجيل الدخول أو للتسجيل، وتحديث حالة المستخدم عند النجاح
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
// تحديد نقطة النهاية والبيانات المرسلة بناءً على حالة isLogin
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;
// إرسال الطلب إلى الخادم باستخدام axios
      const res = await axios.post(endpoint, payload);
      // حفظ آخر وقت تسجيل دخول المستخدم في الكوكي "lastLogin" لمدة 7 أيام
      document.cookie = `lastLogin=${new Date().toISOString()}; max-age=${7 * 24 * 60 * 60}; path=/`;
      login(res.data); // حفظ بيانات المستخدم
      navigate('/gallery'); // توجيهه للمعرض بعد النجاح
    } catch (err) {
      // إذا حدث خطأ، نقوم بتحديث حالة الخطأ لعرض رسالة للمستخدم
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      // بعد الانتهاء من العملية، نوقف حالة التحميل
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Login' : 'Create an Account'}</h2>
      {lastLogin && isLogin && (
     <p style={{ textAlign: 'center', color: 'gray', fontSize: '12px' }}>
      Last login: {new Date(lastLogin).toLocaleString()}
    </p>
    )}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLogin && (
          <>
            <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required style={{ padding: '10px' }} />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required style={{ padding: '10px' }} />
          </>
        )}
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={{ padding: '10px' }} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ padding: '10px' }} />
        
        <button type="submit" disabled={loading} style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: 'blue' }} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Register here" : "Already have an account? Login here"}
      </p>
    </div>
  );
}