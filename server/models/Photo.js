//لتعريف نموذج الصور في قاعدة البيانات باستخدام Mongoose
const mongoose = require('mongoose');
// تعريف مخطط الصور باستخدام Mongoose
const photoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  fileName: { type: String, required: true },
  dateTime: { type: Date, default: Date.now }
});
// تصدير الموديل لاستخدامه في أماكن أخرى
module.exports = mongoose.model('Photo', photoSchema);