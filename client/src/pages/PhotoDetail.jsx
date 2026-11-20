
// استيراد React وبعض الأدوات من مكتبة react-router-dom
import { useState, useEffect, useContext } from 'react';
// استيراد useParams للحصول على معرّف الصورة من الرابط، وLink للتنقل بين الصفحات، وuseNavigate لإعادة التوجيه بعد الحذف
import { useParams, Link, useNavigate } from 'react-router-dom';
// استيراد io من مكتبة socket.io-client لإنشاء اتصال WebSocket
import {io} from 'socket.io-client';
// استيراد axios لإجراء طلبات HTTP
import axios from 'axios';
// استيراد AuthContext للوصول إلى بيانات المستخدم
import { AuthContext } from '../context/AuthContext';
// تعريف مكون PhotoDetail لعرض تفاصيل الصورة والتعليقات
export default function PhotoDetail() {
  const { id } = useParams(); 
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // حالة لتخزين بيانات الصورة، التعليقات، والتعليق الجديد
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
// عند تحميل المكون أو تغيير معرّف الصورة، نقوم بجلب بيانات الصورة والتعليقات من الخادم
  useEffect(() => {
    axios.get(`/api/photos/${id}`).then(res => setPhoto(res.data)).catch(console.error);
    axios.get(`/api/photos/${id}/comments`).then(res => setComments(res.data)).catch(console.error);
  }, [id]);

// عند تحميل المكون، نقوم بإنشاء اتصال Socket.IO والانضمام إلى غرفة التعليقات الخاصة بالصورة
useEffect(() => {
  const socket = io('http://localhost:5000');
  socket.emit('joinPhoto', id);

  socket.on('newComment', (comment) => {
    setComments(prev =>
      prev.some(c => c._id === comment._id) ? prev : [comment, ...prev]
    );
  });

  return () => {
    socket.emit('leavePhoto', id);
    socket.disconnect();
  };
}, [id]);  

// دالة لمعالجة إرسال التعليق الجديد، تقوم بإرسال التعليق إلى الخادم وتحديث قائمة التعليقات عند النجاح
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to comment');
    // إرسال التعليق إلى الخادم باستخدام axios
    try {
      const res = await axios.post(`/api/photos/${id}/comments`,
        { comment: newComment },
        { headers: { 'x-user-id': user._id } }
      );
      // تحديث قائمة التعليقات بإضافة التعليق الجديد في البداية
      setNewComment(''); 
      // إعادة جلب التعليقات من الخادم للتأكد من التحديث
    } catch (err) {
      console.error(err);
      alert('Error adding comment');
    }
  };
// دالة لمعالجة حذف الصورة، تقوم بإرسال طلب الحذف إلى الخادم وإعادة التوجيه إلى معرض الصور عند النجاح
  const handleDelete = async () => {
    // تأكيد الحذف مع المستخدم قبل الإرسال
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        // إرسال طلب الحذف إلى الخادم باستخدام axios، مع تمرير معرف المستخدم في الهيدر
        await axios.delete(`/api/photos/${id}`, {
          headers: { 'x-user-id': user._id }
        });
        // عرض رسالة نجاح وإعادة التوجيه إلى معرض الصور
        alert('Photo deleted successfully!');
        navigate('/gallery'); 
        // إعادة جلب قائمة الصور من الخادم بعد الحذف
      } catch (err) {
        // إذا حدث خطأ، عرض رسالة الخطأ للمستخدم
        console.error(err);
        alert(err.response?.data?.message || 'Error deleting photo');
      }
    }
  };

  if (!photo) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading...</h2>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* زر الرجوع */}
      <Link to="/gallery" style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        color: '#0056b3', 
        textDecoration: 'none', 
        backgroundColor: '#e6f2ff',
        padding: '8px 16px', 
        borderRadius: '20px', 
        fontWeight: 'bold',
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        ← Back to Gallery
      </Link>

      {/* رأس الصفحة: العنوان وزر الحذف */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '32px', color: '#222' }}>{photo.title}</h1>
          <p style={{ color: '#666', fontSize: '15px', margin: 0 }}>
            Uploaded by <strong>{photo.userId?.firstName} {photo.userId?.lastName}</strong>
          </p>
        </div>

        {user && photo.userId && user._id === photo.userId._id && (
          <button 
            onClick={handleDelete} 
            style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
          >
            Delete Photo
          </button>
        )}
      </div>

      {/* حاوية الصورة: لون رمادي فاتح عشان الصورة تبرز */}
      <div style={{ 
        backgroundColor: '#f0f2f5', 
        padding: '20px', 
        borderRadius: '12px', 
        marginTop: '20px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        border: '1px solid #ddd'
      }}>
        <img 
          src={`/uploads/${photo.fileName}`} 
          alt={photo.title} 
          style={{ 
            maxWidth: '100%', 
            maxHeight: '75vh', /* تاخد 75% من طول الشاشة عشان تبان كبيرة */
            objectFit: 'contain', 
            borderRadius: '8px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)' // ظل للصورة عشان تبان كأنها لوحة
          }} 
        />
      </div>
      <p style={{ fontSize: '18px', marginTop: '25px', lineHeight: '1.6', color: '#444' }}>
        {photo.description}
      </p>
      
      <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ddd' }} />
      
      <h3 style={{ fontSize: '22px' }}>Comments ({comments.length})</h3>
      
      {user ? (
        <form onSubmit={handleCommentSubmit} style={{ marginBottom: '25px', display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Write a comment..." 
            value={newComment} 
            onChange={e => setNewComment(e.target.value)} 
            required 
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '15px' }}
          />
          <button type="submit" style={{ padding: '10px 25px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Post
          </button>
        </form>
      ) : (
        <p style={{ color: '#666' }}><Link to="/login" style={{ color: '#007bff' }}>Login</Link> to add a comment.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {comments.map(c => (
          <div key={c._id} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong style={{ color: '#333', fontSize: '15px' }}>{c.userId?.firstName}</strong> 
              <span style={{ fontSize: '12px', color: '#888' }}>
                {new Date(c.dateTime).toLocaleString()}
              </span>
            </div>
            <p style={{ margin: 0, color: '#444' }}>{c.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}