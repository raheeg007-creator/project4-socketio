
//اعداد المتغيرات البيئية من ملف .env
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
// استيراد وحدة http و Socket.IO
const http = require('http');
const { Server } = require('socket.io');
// استيراد مسارات المصادقة ووحدة معالجة الأخطاء
const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');
const errorHandler = require('./middleware/errorHandler');
// إنشاء تطبيق Express وتكوين الوسطاء (middlewares)
const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

// إنشاء خادم http
const server = http.createServer(app);
// إنشاء مثيل Socket.IO
// السماح بالوصول من أي أصل (origin
const io = new Server(server, { cors: { origin: '*' } });
app.set('io',io);

// إعداد Socket.IO للتعامل مع الأحداث
io.on('connection', (socket) => {
socket.on('joinPhotoRoom', (photoId) => {
  console.log('joined room:photo-'+photoId);
  socket.join(`photo-${photoId}`);
});
// عند مغادرة العميل لغرفة التعليقات الخاصة بالصورة، نقوم بإخراجه من الغرفة
socket.on('leavePhotoRoom', (photoId) => {
  console.log('left room:photo-'+photoId);
  socket.leave(`photo-${photoId}`);
});
});

// مسار اختبار سريع
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Alzikrayat API is running' });
});
// استخدام مسارات المصادقة ووحدة معالجة الأخطاء
app.use('/api/auth', authRoutes);  
app.use('/api/photos', photoRoutes);
app.use(errorHandler);
// بدء الخادم بعد الاتصال بقاعدة البيانات
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB connected');
    server.listen(PORT, () => console.log(` Server on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err.message);
    process.exit(1);
  });
