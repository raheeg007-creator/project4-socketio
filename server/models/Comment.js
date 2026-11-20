//لتعريف نموذج التعليقات في قاعدة البيانات باستخدام Mongoose
const mongoose = require('mongoose');
// تعريف مخطط التعليقات باستخدام Mongoose
const commentSchema = new mongoose.Schema({
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  dateTime: { type: Date, default: Date.now }
});
// تصدير الموديل لاستخدامه في أماكن أخرى
module.exports = mongoose.model('Comment', commentSchema);