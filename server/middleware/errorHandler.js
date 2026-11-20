// دالة وسيطة للتعامل مع الأخطاء في التطبيق
module.exports = (err, req, res, next) => {
  console.error(err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message });
}