// استيراد نموذج الصورة ونموذج التعليق، ومكتبة الملفات والمكتبة الخاصة بالمسارات
const Photo = require('../models/Photo');
const Comment = require('../models/Comment'); // استدعاء موديل التعليقات
const fs = require('fs'); // مكتبة الملفات
const path = require('path'); // مكتبة المسارات

// 1. رفع صورة جديدة
exports.createPhoto = async (req, res, next) => {
    // التأكد من وجود ملف مرفوع
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a file' });

    const { title, description } = req.body;
    const userId = req.header('x-user-id');

    const photo = await Photo.create({
      userId,
      title,
      description,
      fileName: req.file.filename
    });

    res.status(201).json(photo);
  } catch (err) { next(err); }
};

// 2. برجع كل الصور
exports.getAllPhotos = async (req, res, next) => {
  try {
    const photos = await Photo.find().populate('userId', 'firstName lastName');
    res.json(photos);
  } catch (err) { next(err); }
};

// 3. برجع صورة واحدة بالتفاصيل
exports.getPhotoById = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id).populate('userId', 'firstName lastName');
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    res.json(photo);
  } catch (err) { next(err); }
};

// 4. حذف صورة
exports.deletePhoto = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    // التأكد إن اللبيحذف هو صاحب الصورة
    const userId = req.header('x-user-id');
    if (!userId || photo.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this photo' });
    }

    // مسح ملف الصورة من فولدر uploads
    const filePath = path.join(__dirname, '../uploads', photo.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // مسح كل تعليقات الصورة دي
    await Comment.deleteMany({ photoId: photo._id });

    // مسح الصورة من الداتابيز
    await photo.deleteOne();

    res.json({ message: 'Photo deleted successfully' });
  } catch (err) { next(err); }
};