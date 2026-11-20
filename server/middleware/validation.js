//مطلب مكتبة Joi للتحقق من صحة البيانات
const Joi = require('joi');
// تعريف مخطط التحقق من صحة بيانات تسجيل المستخدم
exports.registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName:  Joi.string().min(2).max(50).required(),
  email:     Joi.string().email().required(),
  password:  Joi.string().min(6).max(100).required(),
  location:    Joi.string().allow('').optional(),
  description: Joi.string().allow('').optional(),
  occupation:  Joi.string().allow('').optional()
});
// تعريف مخطط التحقق من صحة بيانات تسجيل الدخول
exports.loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required()
});
// دالة وسيطة للتحقق من صحة البيانات باستخدام المخطط المحدد
exports.validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  // لو كان في خطأ في التحقق من الصحة، نرجع استجابة بخطأ 400 مع تفاصيل الأخطاء
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(d => d.message)
    });
  }
  // لو كانت البيانات صحيحة، ننتقل إلى الدالة التالية في سلسلة المعالجات
  next();
};