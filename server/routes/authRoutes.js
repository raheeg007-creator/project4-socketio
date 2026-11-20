// تعريف مسارات المصادقة مع التحقق من صحة البيانات
const express=require('express');
const router=express.Router();
const {register,login}=require('../controllers/authController');
const {validate,registerSchema,loginSchema}=require('../middleware/validation');
// تعريف مسارات المصادقة مع التحقق من صحة البيانات
router.post('/register',validate(registerSchema),register);
router.post('/login',validate(loginSchema),login);
module.exports=router;