//يتم استيراد نموذج المستخدم (User) من ملف النماذج (models/User.js) لاستخدامه في عمليات تسجيل الدخول والتسجيل. كما يتم استيراد مكتبة bcrypt لتشفير كلمات المرور والتحقق منها.
const User = require('../models/User');
const bcrypt = require('bcryptjs');
//هها الدالة تتعامل مع تسجيل المستخدمين الجدد. تستقبل البيانات من جسم الطلب
//  (req.body) وتتحقق مما إذا كان البريد الإلكتروني موجودًا بالفعل في قاعدة البيانات. إذا كان البريد الإلكتروني موجودًا، يتم إرجاع رسالة خطأ
// . إذا لم يكن موجودًا، يتم تشفير كلمة المرور باستخدام bcrypt ثم إنشاء مستخدم جديد في قاعدة البيانات وإرجاع بيانات المستخدم الجديد.
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, location, description, occupation } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }
// `bcrypt.hash` لتشفير كلمة المرور قبل تخزينها في قاعدة البيانات. الرقم 10 يمثل عدد جولات التشفير (salt rounds) التي تحدد مدى قوة التشفير.
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName, lastName, email,
      password: hash,
      location, description, occupation
    });
    
// بعد إنشاء المستخدم، يتم إرجاع استجابة تحتوي على بيانات المستخدم الجديد، مع استبعاد كلمة المرور من الاستجابة لأسباب أمنية.
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  } catch (err) {
    next(err);
  }
};
//حتى هنا، الدالة `register` مسؤولة عن معالجة طلبات تسجيل المستخدمين الجدد، بينما الدالة `login` مسؤولة عن معالجة طلبات تسجيل الدخول للمستخدمين الحاليين. كلا الدالتين تتعاملان مع قاعدة البيانات باستخدام Mongoose وتستخدمان bcrypt لتأمين كلمات المرور.
// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    // استرجاع البريد الإلكتروني وكلمة المرور من جسم الطلب (req.body) للتحقق من صحة بيانات تسجيل الدخول.
    const { email, password } = req.body;

// البحث عن المستخدم في قاعدة البيانات باستخدام البريد الإلكتروني. يتم استخدام `select('+password')` لاسترجاع كلمة المرور المشفرة، حيث أن الحقل `password` عادةً ما يكون مخفيًا في نموذج المستخدم لأسباب أمنية.
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
// استخدام `bcrypt.compare` لمقارنة كلمة المرور المدخلة مع كلمة المرور المشفرة المخزنة في قاعدة البيانات. إذا لم تتطابق، يتم إرجاع رسالة خطأ تفيد بأن البريد الإلكتروني أو كلمة المرور غير صحيحة.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.cookie('lastLogin', new Date().toISOString(), { httpOnly: false, maxAge: 24 * 60 * 60 * 1000 }); // تعيين كوكي لتخزين آخر تسجيل دخول
// إذا كانت بيانات تسجيل الدخول صحيحة، يتم إرجاع استجابة تحتوي على بيانات المستخدم، مع استبعاد كلمة المرور من الاستجابة لأسباب أمنية.
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
      description: user.description,
      occupation: user.occupation
    });
  } catch (err) {
    next(err);
  }
}
