//للرفع الملفات، بنستخدم مكتبة multer
const multer = require('multer');
// path مكتبة مدمجة في Node.js للتعامل مع المسارات
const path = require('path');

// تحديد مكان الحفظ واسم الملف
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // هيروح لمجلد uploads اللي عملناه في server
  },
  filename: (req, file, cb) => {
    // اسم الملف هيكون التاريخ الحالي + امتداد الملف الأصلي
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
// إنشاء دالة multer مع إعدادات التخزين المحددة
const upload = multer({ storage });
module.exports = upload;