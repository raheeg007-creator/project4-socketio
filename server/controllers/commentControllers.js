// استيراد نموذج التعليق من ملف النماذج
const Comment = require('../models/Comment');

// إضافة تعليق
exports.addComment = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const userId = req.header('x-user-id');
    
    const newComment = await Comment.create({
      photoId: req.params.id,
      userId,
      comment
    });
    // الحصول على مثيل Socket.IO من التطبيق
    const io = req.app.get('io');
    // إرسال التعليق الجديد إلى جميع العملاء في الغرفة الخاصة بالصورة
    io.to(`photo-${req.params.id}`).emit('newComment', populatedComment);

    // بنرجع التعليق مع بيانات صاحب التعليق عشان نعرضه 
    const populatedComment = await Comment.findById(newComment._id).populate('userId', 'firstName');
    res.status(201).json(populatedComment);
  } catch (err) { next(err); }
};

// جلب تعليقات صورة معينة
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ photoId: req.params.id })
      .populate('userId', 'firstName lastName')
      .sort({ dateTime: -1 }); // الأحدث الأول
    res.json(comments);
  } catch (err) { next(err); }
}