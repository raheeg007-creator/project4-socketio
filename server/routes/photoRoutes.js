// تعريف مسارات الصور والتعليقات باستخدام Express.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
// استيراد الدوال من وحدة التحكم الخاصة بالصور والتعليقات
const { createPhoto, getAllPhotos, deletePhoto, getPhotoById } = require('../controllers/photoController');
const { addComment, getComments } = require('../controllers/commentControllers');
// تعريف مسارات الصور والتعليقات
router.get('/', getAllPhotos);
router.post('/', upload.single('image'), createPhoto);
// تعريف مسار GET لجلب صورة واحدة بالتفاصيل
router.get('/:id', getPhotoById);
router.delete('/:id', deletePhoto);
// تعريف مسارات التعليقات
router.get('/:id/comments', getComments);
router.post('/:id/comments', addComment);
// تصدير الراوتر ليتم استخدامه في التطبيق الرئيسي
module.exports = router;